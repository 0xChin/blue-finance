// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {console} from "forge-std/console.sol";
import {IntegrationBase, Vault} from "test/integration/IntegrationBase.sol";

contract IntegrationVault is IntegrationBase {
  function _healthFactorWithDecimals(uint256 healthFactor) internal pure returns (uint256) {
    return healthFactor * 10 ** 16; // function must be called with 3 decimals. 134 would equal 1.34
  }

  function test_VaultCreation() public {
    console.log("Whale balance: ", _weth.balanceOf(_wethWhale));
    _vault = Vault(
      address(
        _factory.createERC4626(
          _weth, _dai, _healthFactorWithDecimals(125), _healthFactorWithDecimals(130), ethUsdPythId
        )
      )
    );

    vm.startPrank(_wethWhale);
    _weth.approve(address(_vault), type(uint256).max);
    _vault.deposit(_weth.balanceOf(_wethWhale) / 2, _wethWhale);

    _vault.updateHealthFactors(_healthFactorWithDecimals(135), _healthFactorWithDecimals(140));

    _vault.rebalance();

    _vault.approve(address(_pool), type(uint256).max);

    _vault.redeem(_vault.maxRedeem(_wethWhale) - _vault.maxRedeem(_wethWhale) / 100, _wethWhale, _wethWhale);
    vm.stopPrank();
  }
}
