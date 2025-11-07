# ajo

A decentralized savings application that allows users to deposit ETH into their on-chain piggy bank, lock it for a specific duration, and withdraw only after the set time has passed. Built using **Foundry** for smart contracts and **React + Vite** for the frontend.

---

## 🚀 Overview

The **PiggyBank dApp** helps users cultivate savings discipline by enforcing a time lock on deposits. Users can:

* Deposit ETH to their piggy bank.
* Set a lock duration.
* Withdraw funds only after the lock period.
* View balance and transaction history.

### 🔗 Tech Stack

| Layer              | Tech                         |
| ------------------ | ---------------------------- |
| Smart Contract     | Solidity (Foundry)           |
| Frontend           | React + Vite                 |
| Wallet Integration | WalletConnect / Reown AppKit |
| Blockchain         | Base Testnet                 |
| CI/CD              | GitHub Actions               |

---

## 🧱 Smart Contract — `PiggyBank.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PiggyBank {
    address public owner;
    uint256 public unlockTime;

    constructor(uint256 _unlockTime) payable {
        owner = msg.sender;
        unlockTime = _unlockTime;
    }

    function deposit() external payable {}

    function withdraw() external {
        require(block.timestamp >= unlockTime, "PiggyBank: Locked");
        require(msg.sender == owner, "PiggyBank: Not owner");
        payable(owner).transfer(address(this).balance);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
```

---

## 🧪 Testing (Foundry)

### Installation

```bash
forge init piggybank-dapp
cd piggybank-dapp
forge build
```

### Run Tests

```bash
forge test -vvv
```

Example Test:

```solidity
pragma solidity ^0.8.20;
import "forge-std/Test.sol";
import "../src/PiggyBank.sol";

contract PiggyBankTest is Test {
    PiggyBank piggy;

    function setUp() public {
        piggy = new PiggyBank(block.timestamp + 1 days
```
