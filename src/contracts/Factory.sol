// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.26;

import {ERC4626} from "solmate/mixins/ERC4626.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";

import {Vault} from "./Vault.sol";
import {IPool} from "aave/core-v3/interfaces/IPool.sol";
import {DataTypes} from "aave/core-v3/protocol/libraries/types/DataTypes.sol";

import {ISuperformFactory} from "./external/ISuperformFactory.sol";
import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import {ISwapRouter} from "uniswap/v3-periphery/interfaces/ISwapRouter.sol";
import {IRewardsController} from "yield-daddy/aave-v3/external/IRewardsController.sol";
import {ERC4626Factory} from "yield-daddy/base/ERC4626Factory.sol";

/// @title AaveV3ERC4626Factory
/// @author zefram.eth
/// @notice Factory for creating AaveV3ERC4626 contracts
contract Factory {
  /// -----------------------------------------------------------------------
  /// Events
  /// -----------------------------------------------------------------------

  event VaultCreated(address vault);

  /// -----------------------------------------------------------------------
  /// Errors
  /// -----------------------------------------------------------------------

  /// @notice Thrown when trying to deploy an AaveV3ERC4626 vault using an asset without an aToken
  error AaveV3ERC4626Factory__ATokenNonexistent();

  /// -----------------------------------------------------------------------
  /// Immutable params
  /// -----------------------------------------------------------------------

  /// @notice The Aave Pool contract
  IPool public immutable lendingPool;

  /// @notice The address that will receive the liquidity mining rewards (if any)
  address public immutable rewardRecipient;

  /// @notice The Aave RewardsController contract
  IRewardsController public immutable rewardsController;

  /// @notice The Uniswap Router contract
  ISwapRouter public immutable uniswapRouter;

  /// @notice The Pyth contract
  IPyth public immutable pyth;

  /// @notice The Pyth Price Feed mapping to id
  mapping(uint256 => bytes32) public pythPriceFeedIds;

  /// @notice The Superform Factory contract
  ISuperformFactory public immutable superformFactory;

  constructor(
    IPool lendingPool_,
    IRewardsController rewardsController_,
    ISwapRouter uniswapRouter_,
    IPyth pyth_,
    ISuperformFactory superformFactory_
  ) {
    lendingPool = lendingPool_;
    rewardRecipient = msg.sender;
    rewardsController = rewardsController_;
    uniswapRouter = uniswapRouter_;
    pyth = pyth_;
    superformFactory = superformFactory_;
    pythPriceFeedIds[0] = bytes32(0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace); // ETH/USD
    pythPriceFeedIds[1] = bytes32(0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43); // BTC/USD
    pythPriceFeedIds[2] = bytes32(0x385f64d993f7b77d8182ed5003d97c60aa3361f3cecfe711544d2d59165e9bdf); // OP/USD
    pythPriceFeedIds[3] = bytes32(0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5); // ARB/USD
    pythPriceFeedIds[4] = bytes32(0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221); // LINK/USD
  }

  function createERC4626(
    ERC20 asset,
    ERC20 borrowedAsset,
    uint256 minHealthFactor_,
    uint256 maxHealthFactor_,
    uint256 pythPriceFeedId_
  ) external returns (ERC4626 vault) {
    DataTypes.ReserveData memory reserveData = lendingPool.getReserveData(address(asset));
    address aTokenAddress = reserveData.aTokenAddress;
    if (aTokenAddress == address(0)) {
      revert AaveV3ERC4626Factory__ATokenNonexistent();
    }

    bytes32 pythPriceFeed_ = pythPriceFeedIds[pythPriceFeedId_];

    vault = new Vault{salt: bytes32(0)}(
      asset,
      borrowedAsset,
      ERC20(aTokenAddress),
      lendingPool,
      rewardRecipient,
      rewardsController,
      minHealthFactor_,
      maxHealthFactor_,
      uniswapRouter,
      pyth,
      pythPriceFeed_
    );

    superformFactory.createSuperform(1, address(vault));

    emit VaultCreated(address(vault));
  }
}
