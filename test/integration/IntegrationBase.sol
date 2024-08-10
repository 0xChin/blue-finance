// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Factory} from "contracts/Factory.sol";
import {Vault} from "contracts/Vault.sol";
import {Test} from "forge-std/Test.sol";

import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {IPool} from "aave/core-v3/interfaces/IPool.sol";

import {ISuperformFactory} from "contracts/external/ISuperformFactory.sol";
import {ERC4626} from "solmate/mixins/ERC4626.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {ISwapRouter} from "uniswap/v3-periphery/interfaces/ISwapRouter.sol";
import {IRewardsController} from "yield-daddy/aave-v3/external/IRewardsController.sol";

contract IntegrationBase is Test {
  uint256 internal constant _FORK_BLOCK = 123_851_299;

  uint256 ethUsdPythId = 0;
  uint256 btcUsdPythId = 1;
  uint256 opUsdPythId = 2;
  uint256 arbUsdPythId = 3;
  uint256 linkUsdPythId = 4;

  address internal _user = makeAddr("user");
  address internal _merchant = makeAddr("merchant");
  address internal _owner = makeAddr("owner");
  address internal _wethWhale = 0xDFF90E4A6c229565f25337B1DB9fA12f6d8cB118;
  address[] internal _tokens;
  IPool internal _pool = IPool(0x794a61358D6845594F94dc1DB02A252b5b4814aD);
  IRewardsController internal _rewardsController = IRewardsController(0x929EC64c34a17401F460460D4B9390518E5B473e);
  ERC20 internal _weth = ERC20(0x4200000000000000000000000000000000000006);
  ERC20 internal _dai = ERC20(0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1);
  ISwapRouter internal _swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
  IPyth internal _pyth = IPyth(0xff1a0f4744e8582DF1aE09D5611b887B6a12925C);
  ISuperformFactory internal _superformFactory = ISuperformFactory(0xD85ec15A9F814D6173bF1a89273bFB3964aAdaEC);
  uint256 internal _amount = 1e25;
  Factory internal _factory;
  Vault internal _vault;

  function setUp() public {
    vm.startPrank(_owner);
    _factory = new Factory(_pool, _rewardsController, _swapRouter, _pyth, _superformFactory);
    vm.createSelectFork(vm.rpcUrl("optimism"), _FORK_BLOCK);
    vm.label(address(_vault), "Vault");
    vm.label(address(_factory), "Factory");
    vm.label(address(_pool), "Pool");
    vm.label(address(_swapRouter), "SwapRouter");
    vm.label(address(_rewardsController), "RewardsController");
    vm.label(address(_weth), "WETH");
    vm.label(address(_dai), "DAI");
  }
}
