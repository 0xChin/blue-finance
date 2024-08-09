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
          _weth,
          _dai,
          _healthFactorWithDecimals(125),
          _healthFactorWithDecimals(130),
          bytes32(0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace)
        )
      )
    );

    vm.startPrank(_wethWhale);
    _weth.approve(address(_vault), type(uint256).max);
    uint256 shares = _vault.deposit(1e18, _wethWhale);

    _vault.updateHealthFactors(_healthFactorWithDecimals(135), _healthFactorWithDecimals(140));

    _vault.rebalance();

    console.log("redeem", _vault.previewRedeem(shares));
    console.log("redeem", _vault.previewWithdraw(1e18));
    /* _vault.redeem(shares, _wethWhale, _wethWhale); */
    vm.stopPrank();
  }
}
