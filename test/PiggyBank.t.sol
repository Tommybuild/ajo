// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PiggyBank.sol";

contract PiggyBankTest is Test {
    PiggyBank public piggyBank;
    address public owner = address(this);
    address public user = address(0x1234);
    
    receive() external payable {}

    function setUp() public {
        uint256 unlockTime = block.timestamp + 1 days;
        piggyBank = new PiggyBank{value: 0}(unlockTime);
    }

    function testInitialState() public view {
        assertEq(piggyBank.owner(), owner);
        assertTrue(piggyBank.unlockTime() > block.timestamp);
        assertEq(piggyBank.getBalance(), 0);
    }

    function testDeposit() public {
        uint256 depositAmount = 1 ether;
        piggyBank.deposit{value: depositAmount}();
        assertEq(piggyBank.getBalance(), depositAmount);
    }

    function testCannotWithdrawBeforeUnlock() public {
        uint256 depositAmount = 1 ether;
        piggyBank.deposit{value: depositAmount}();

        vm.expectRevert("PiggyBank: Still locked");
        piggyBank.withdraw();
    }
}