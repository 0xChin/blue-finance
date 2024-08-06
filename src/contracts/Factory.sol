// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import {ERC4626} from "solmate/mixins/ERC4626.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";

import {Vault} from "./Vault.sol";
import {IPool} from "aave/core-v3/interfaces/IPool.sol";
import {DataTypes} from "aave/core-v3/protocol/libraries/types/DataTypes.sol";

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

  constructor(IPool lendingPool_, IRewardsController rewardsController_) {
    lendingPool = lendingPool_;
    rewardRecipient = msg.sender;
    rewardsController = rewardsController_;
  }

  function createERC4626(
    ERC20 asset,
    uint256 minHealthFactor_,
    uint256 maxHealthFactor_
  ) external returns (ERC4626 vault) {
    DataTypes.ReserveData memory reserveData = lendingPool.getReserveData(address(asset));
    address aTokenAddress = reserveData.aTokenAddress;
    if (aTokenAddress == address(0)) {
      revert AaveV3ERC4626Factory__ATokenNonexistent();
    }

    vault = new Vault{salt: bytes32(0)}(
      asset, ERC20(aTokenAddress), lendingPool, rewardRecipient, rewardsController, minHealthFactor_, maxHealthFactor_
    );
  }
}
