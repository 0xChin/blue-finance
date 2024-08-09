// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {AaveV3ERC4626, ERC20, IPool, IRewardsController} from "./external/AaveV3ERC4626.sol";

import {PercentageMath} from "aave/core-v3/protocol/libraries/math/PercentageMath.sol";
import {WadRayMath} from "aave/core-v3/protocol/libraries/math/WadRayMath.sol";

import {console} from "forge-std/console.sol";
import {ISwapRouter} from "uniswap/v3-periphery/interfaces/ISwapRouter.sol";
import {TransferHelper} from "uniswap/v3-periphery/libraries/TransferHelper.sol";

import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract Vault is AaveV3ERC4626 {
  using WadRayMath for uint256;
  using PercentageMath for uint256;

  event log(string, uint256);
  event log(string, int64);

  ERC20 public immutable borrowedAsset;
  uint256 public MIN_HEALTH_FACTOR;
  uint256 public TARGET_HEALTH_FACTOR;
  uint256 public MAX_HEALTH_FACTOR;
  uint24 public constant poolFee = 3000;
  ISwapRouter public immutable uniswapRouter;

  constructor(
    ERC20 asset_,
    ERC20 borrowedAsset_,
    ERC20 aToken_,
    IPool lendingPool_,
    address rewardRecipient_,
    IRewardsController rewardsController_,
    uint256 minHealthFactor_,
    uint256 maxHealthFactor_,
    ISwapRouter uniswapRouter_,
    IPyth pyth_,
    bytes32 pythPriceFeed_
  ) AaveV3ERC4626(asset_, aToken_, lendingPool_, rewardRecipient_, rewardsController_, pyth_, pythPriceFeed_) {
    MIN_HEALTH_FACTOR = minHealthFactor_;
    MAX_HEALTH_FACTOR = maxHealthFactor_;
    TARGET_HEALTH_FACTOR = (minHealthFactor_ + maxHealthFactor_) / 2;
    borrowedAsset = borrowedAsset_;
    uniswapRouter = uniswapRouter_;

    TransferHelper.safeApprove(address(asset), address(uniswapRouter), type(uint256).max);

    TransferHelper.safeApprove(address(borrowedAsset), address(uniswapRouter), type(uint256).max);
  }

  function updateHealthFactors(uint256 minHealthFactor_, uint256 maxHealthFactor_) public {
    MIN_HEALTH_FACTOR = minHealthFactor_;
    MAX_HEALTH_FACTOR = maxHealthFactor_;
    TARGET_HEALTH_FACTOR = (minHealthFactor_ + maxHealthFactor_) / 2;
  }

  function deposit(uint256 assets, address receiver) public override returns (uint256 shares) {
    shares = super.deposit(assets, receiver);

    // Calculate and adjust the position to maintain desired health factor
    rebalance();
  }

  function mint(uint256 shares, address receiver) public override returns (uint256 assets) {
    assets = super.mint(shares, receiver);

    // Calculate and adjust the position to maintain desired health factor
    rebalance();
  }

  function emitLogs() public {
    (
      uint256 totalCollateralUSD,
      uint256 totalDebtUSD,
      uint256 availableBorrowsUSD,
      uint256 liquidationThreshold,
      ,
      uint256 currentHealthFactor
    ) = lendingPool.getUserAccountData(address(this));

    emit log("totalCollateralUSD", totalCollateralUSD / 10e7);
    emit log("totalDebtUSD", totalDebtUSD / 10e7);
    emit log("liquidationThreshold", liquidationThreshold);
    emit log("availableBorrowsUSD", availableBorrowsUSD / 10e7);
    emit log("TARGET_HEALTH_FACTOR", TARGET_HEALTH_FACTOR);
    emit log("currentHealthFactor", currentHealthFactor);
  }

  function rebalance() public {
    (uint256 totalCollateralUSD, uint256 totalDebtUSD,, uint256 liquidationThreshold,, uint256 currentHealthFactor) =
      lendingPool.getUserAccountData(address(this));

    if (currentHealthFactor > MAX_HEALTH_FACTOR) {
      // based on the health factor formula: https://github.com/aave/aave-v3-core/blob/c8722965501b182f6ab380db23e52983eb87e406/contracts/protocol/libraries/logic/GenericLogic.sol#L183-L187
      uint256 debtToTake = (
        totalCollateralUSD.percentMul(liquidationThreshold).wadDiv(TARGET_HEALTH_FACTOR) - totalDebtUSD
      ) * (10 ** (borrowedAsset.decimals() - 8));

      lendingPool.borrow(address(borrowedAsset), debtToTake, 2, 0, address(this));

      ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
        tokenIn: address(borrowedAsset),
        tokenOut: address(asset),
        fee: poolFee,
        recipient: address(this),
        deadline: block.timestamp,
        amountIn: debtToTake,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      });

      // The call to `exactInputSingle` executes the swap.
      uint256 amountOut = uniswapRouter.exactInputSingle(params);

      asset.approve(address(lendingPool), amountOut);

      lendingPool.supply(address(asset), amountOut, address(this), 0);

      rebalance();
    } else if (currentHealthFactor < MIN_HEALTH_FACTOR) {
      // Step 1: Calculate the target debt level to achieve the target health factor
      uint256 targetDebtUSD = totalCollateralUSD.percentMul(liquidationThreshold).wadDiv(TARGET_HEALTH_FACTOR);

      // Calculate the debt to repay in USD
      uint256 debtToRepayUSD = (totalDebtUSD - targetDebtUSD) * 10e7;

      // Step 2: Fetch the price of the borrowed asset from the price oracle
      PythStructs.Price memory price = pyth.getPriceUnsafe(pythPriceFeed);

      // The price should be scaled to match the decimals used in your asset, adjust as necessary
      uint256 assetPriceInUSD = uint256(int256(price.price));

      // Step 3: Calculate the amount of aTokens to repay
      uint256 amountToRepay = debtToRepayUSD.wadDiv(assetPriceInUSD) / 10e7;

      // Log the calculated values for debugging
      emit log("targetDebtUSD", targetDebtUSD / 10e7);
      emit log("debtToRepayUSD", debtToRepayUSD / 10e7 / 10e7);
      emit log("amountToRepay", amountToRepay);
      emit log("assetPriceInUSD", assetPriceInUSD / 10e7);

      emit log("aTokenBalance", aToken.balanceOf(address(this)));
      lendingPool.withdraw(address(asset), amountToRepay, address(this));

      ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
        tokenIn: address(asset),
        tokenOut: address(borrowedAsset),
        fee: poolFee,
        recipient: address(this),
        deadline: block.timestamp,
        amountIn: amountToRepay,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      });

      // The call to `exactInputSingle` executes the swap.
      uint256 amountOut = uniswapRouter.exactInputSingle(params);

      emit log("amountOut", amountOut / 10 ** borrowedAsset.decimals());

      borrowedAsset.approve(address(lendingPool), amountOut);

      lendingPool.repay(address(borrowedAsset), amountOut, 2, address(this));

      rebalance();
    }
  }

  function repay() internal {}

  function withdraw(uint256 assets, address receiver, address owner_) public override returns (uint256 shares) {
    repay();

    shares = super.withdraw(assets, receiver, owner_);

    // Rebalance after withdrawal
    rebalance();
  }

  function redeem(uint256 shares, address receiver, address owner_) public override returns (uint256 assets) {
    repay();

    assets = super.redeem(shares, receiver, owner_);

    // Rebalance after redemption
    rebalance();
  }
}
