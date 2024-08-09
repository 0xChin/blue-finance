// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import {IPool} from "aave/core-v3/interfaces/IPool.sol";
import {Factory} from "contracts/Factory.sol";
import {Script} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {ISwapRouter} from "uniswap/v3-periphery/interfaces/ISwapRouter.sol";
import {IRewardsController} from "yield-daddy/aave-v3/external/IRewardsController.sol";

contract Deploy is Script {
  struct DeploymentParams {
    IPool lendingPool_;
    IRewardsController rewardsController_;
    ISwapRouter uniswapRouter_;
    IPyth pyth;
  }

  /// @notice Deployment parameters for each chain
  mapping(uint256 _chainId => DeploymentParams _params) internal _deploymentParams;

  function setUp() public {
    // Optimism
    _deploymentParams[10] = DeploymentParams(
      IPool(0x794a61358D6845594F94dc1DB02A252b5b4814aD),
      IRewardsController(0x929EC64c34a17401F460460D4B9390518E5B473e),
      ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564),
      IPyth(0xff1a0f4744e8582DF1aE09D5611b887B6a12925C)
    );
  }

  function run() public {
    DeploymentParams memory _params = _deploymentParams[block.chainid];

    vm.startBroadcast();
    new Factory(_params.lendingPool_, _params.rewardsController_, _params.uniswapRouter_, _params.pyth);
    vm.stopBroadcast();
  }
}
