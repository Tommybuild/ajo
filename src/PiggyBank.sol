 // SPDX-License-Identifier: MIT
 pragma solidity ^0.8.20;
 
 /**
  * @title PiggyBank
  * @notice A decentralized time-locked savings contract that enforces disciplined ETH deposits
  * @dev This contract allows users to deposit ETH and withdraw only after a specified unlock time.
  *      It includes pause functionality for emergency situations and ownership transfer capabilities.
  * @author Ajo PiggyBank Team
  */
 contract PiggyBank {
     /**
      * @notice The address of the contract owner who can withdraw funds and manage the contract
      */
     address public owner;
 
     /**
      * @notice The timestamp (in seconds) when the contract becomes unlocked for withdrawals
      */
     uint256 public unlockTime;
 
     /**
      * @notice Boolean flag indicating whether the contract is currently paused
      * @dev When paused, deposits and withdrawals are disabled
      */
     bool public paused;
 
     /**
      * @notice Emitted when ETH is deposited into the contract
      * @param depositor The address that made the deposit
      * @param amount The amount of ETH deposited in wei
      */
     event Deposited(address indexed depositor, uint256 amount);
 
     /**
      * @notice Emitted when ETH is withdrawn from the contract
      * @param withdrawer The address that initiated the withdrawal
      * @param amount The amount of ETH withdrawn in wei
      */
     event Withdrawn(address indexed withdrawer, uint256 amount);
 
     /**
      * @notice Emitted when the contract is paused by the owner
      * @param account The address that paused the contract
      */
     event Paused(address account);
 
     /**
      * @notice Emitted when the contract is unpaused by the owner
      * @param account The address that unpaused the contract
      */
     event Unpaused(address account);
 
     /**
      * @notice Emitted when ownership of the contract is transferred
      * @param previousOwner The previous owner address
      * @param newOwner The new owner address
      */
     event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
 
     /**
      * @notice Constructs the PiggyBank contract with a specified unlock time
      * @param _unlockTime The timestamp (in seconds) when the contract should become unlocked
      * @dev The constructor can optionally receive ETH during deployment
      */
     constructor(uint256 _unlockTime) payable {
         owner = msg.sender;
         unlockTime = _unlockTime;
         paused = false;
         emit OwnershipTransferred(address(0), msg.sender);
     }
 
     /**
      * @notice Modifier that ensures the contract is not paused when executing a function
      * @dev Reverts with "Contract is paused" if the contract is currently paused
      */
     modifier whenNotPaused() {
         require(!paused, "Contract is paused");
         _;
     }
 
     /**
      * @notice Modifier that ensures the contract is paused when executing a function
      * @dev Reverts with "Contract is not paused" if the contract is not currently paused
      */
     modifier whenPaused() {
         require(paused, "Contract is not paused");
         _;
     }
 
     /**
      * @notice Modifier that restricts function access to the contract owner
      * @dev Reverts with "Not owner" if the caller is not the current owner
      */
     modifier onlyOwner() {
         require(msg.sender == owner, "Not owner");
         _;
     }
 
     /**
      * @notice Pauses the contract, disabling deposits and withdrawals
      * @dev Can only be called by the owner when the contract is not already paused
      * @dev Emits a {Paused} event
      */
     function pause() external onlyOwner whenNotPaused {
         paused = true;
         emit Paused(msg.sender);
     }
 
     /**
      * @notice Unpauses the contract, re-enabling deposits and withdrawals
      * @dev Can only be called by the owner when the contract is paused
      * @dev Emits an {Unpaused} event
      */
     function unpause() external onlyOwner whenPaused {
         paused = false;
         emit Unpaused(msg.sender);
     }
 
     /**
      * @notice Transfers ownership of the contract to a new address
      * @param newOwner The address to transfer ownership to
      * @dev Can only be called by the current owner
      * @dev Reverts if the new owner address is the zero address
      * @dev Emits an {OwnershipTransferred} event
      */
     function transferOwnership(address newOwner) external onlyOwner {
         require(newOwner != address(0), "New owner is zero address");
         emit OwnershipTransferred(owner, newOwner);
         owner = newOwner;
     }
 
     /**
      * @notice Deposits ETH into the contract
      * @dev Can be called by anyone when the contract is not paused
      * @dev Reverts if the deposit amount is zero
      * @dev Emits a {Deposited} event
      */
     function deposit() external payable whenNotPaused {
         require(msg.value > 0, "Must deposit something");
         emit Deposited(msg.sender, msg.value);
     }
 
     /**
      * @notice Withdraws all ETH from the contract to the owner
      * @dev Can only be called by the owner when the contract is not paused and after the unlock time
      * @dev Reverts if called before the unlock time with "PiggyBank: Still locked"
      * @dev Reverts if called by a non-owner with "PiggyBank: Not owner"
      * @dev Uses the checks-effects-interactions pattern and safe withdrawal to prevent reentrancy
      * @dev Emits a {Withdrawn} event
      */
     function withdraw() external whenNotPaused {
         require(block.timestamp >= unlockTime, "PiggyBank: Still locked");
         require(msg.sender == owner, "PiggyBank: Not owner");
         uint256 amount = address(this).balance;
         emit Withdrawn(msg.sender, amount);
         // Use safe withdrawal pattern to prevent reentrancy
         (bool success, ) = payable(owner).call{value: amount}("");
         require(success, "Transfer failed");
     }
 
     /**
      * @notice Returns the current ETH balance of the contract
      * @return The contract's ETH balance in wei
      */
     function getBalance() external view returns (uint256) {
         return address(this).balance;
     }
 
     /**
      * @notice Returns the unlock timestamp of the contract
      * @return The unlock timestamp in seconds since epoch
      */
     function getUnlockTime() external view returns (uint256) {
         return unlockTime;
     }
 
     /**
      * @notice Returns whether the contract is currently unlocked
      * @return true if the current timestamp is >= unlockTime, false otherwise
      */
     function isUnlocked() external view returns (bool) {
         return block.timestamp >= unlockTime;
     }
 }
