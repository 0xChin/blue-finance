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
  }

  function createERC4626(
    ERC20 asset,
    ERC20 borrowedAsset,
    uint256 minHealthFactor_,
    uint256 maxHealthFactor_,
    bytes32 pythPriceFeed_
  ) external returns (ERC4626 vault) {
    DataTypes.ReserveData memory reserveData = lendingPool.getReserveData(address(asset));
    address aTokenAddress = reserveData.aTokenAddress;
    if (aTokenAddress == address(0)) {
      revert AaveV3ERC4626Factory__ATokenNonexistent();
    }

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
  }
}
