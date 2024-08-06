// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Factory} from "contracts/Factory.sol";
import {Vault} from "contracts/Vault.sol";
import {Test} from "forge-std/Test.sol";

import {IPool} from "aave/core-v3/interfaces/IPool.sol";
import {ERC4626} from "solmate/mixins/ERC4626.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {IRewardsController} from "yield-daddy/aave-v3/external/IRewardsController.sol";

contract IntegrationBase is Test {
  uint256 internal constant _FORK_BLOCK = 123_135_920;

  address internal _user = makeAddr("user");
  address internal _merchant = makeAddr("merchant");
  address internal _owner = makeAddr("owner");
  address internal _wethWhale = 0x478946BcD4a5a22b316470F5486fAfb928C0bA25;
  address[] internal _tokens;
  IPool internal _pool = IPool(0x794a61358D6845594F94dc1DB02A252b5b4814aD);
  IRewardsController internal _rewardsController = IRewardsController(0x929EC64c34a17401F460460D4B9390518E5B473e);
  ERC20 internal _weth = ERC20(0x4200000000000000000000000000000000000006);
  ERC20 internal _dai = ERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
  address _aWeth = 0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8;
  uint256 internal _amount = 1e25;
  Factory internal _factory;
  Vault internal _vault;

  function setUp() public {
    vm.startPrank(_owner);
    _factory = new Factory(_pool, _rewardsController);
    vm.createSelectFork(vm.rpcUrl("optimism"), _FORK_BLOCK);
    vm.label(address(_vault), "Vault");
  }
}
