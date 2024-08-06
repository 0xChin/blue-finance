// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IPool} from "aave/core-v3/interfaces/IPool.sol";
import {Factory} from "contracts/Factory.sol";
import {Script} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IRewardsController} from "yield-daddy/aave-v3/external/IRewardsController.sol";

contract Deploy is Script {
  struct DeploymentParams {
    IPool lendingPool_;
    IRewardsController rewardsController_;
  }

  /// @notice Deployment parameters for each chain
  mapping(uint256 _chainId => DeploymentParams _params) internal _deploymentParams;

  function setUp() public {
    // Optimism
    _deploymentParams[10] = DeploymentParams(
      IPool(0x794a61358D6845594F94dc1DB02A252b5b4814aD), IRewardsController(0x929EC64c34a17401F460460D4B9390518E5B473e)
    );
  }

  function run() public {
    DeploymentParams memory _params = _deploymentParams[block.chainid];

    vm.startBroadcast();
    new Factory(_params.lendingPool_, _params.rewardsController_);
    vm.stopBroadcast();
  }
}
