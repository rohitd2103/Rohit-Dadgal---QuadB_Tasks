// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SecureContract {
    mapping(address => uint256) private balances;
    mapping(address => uint256) private lastTransactionTime;

    uint256 public constant COOLDOWN_TIME = 2 hours; // Set cooldown time (e.g., 2 hours)

    event TransactionInfo(
        address indexed user,
        uint256 balanceAfterTransaction,
        uint256 nextTransactionTime
    );

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    // Deposit function
    function deposit() external payable {
        require(msg.value > 0, "Must deposit more than 0");

        balances[msg.sender] += msg.value;
        lastTransactionTime[msg.sender] = block.timestamp; // Update transaction time

        emit Deposited(msg.sender, msg.value);
        emit TransactionInfo(msg.sender, balances[msg.sender], lastTransactionTime[msg.sender] + COOLDOWN_TIME);
    }

    // Secure withdraw function with cooldown (but no external contract calls before state updates)
    function withdraw() external {
        require(block.timestamp >= lastTransactionTime[msg.sender] + COOLDOWN_TIME, "Wait for cooldown period");

        uint256 amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");

        // **Checks-Effects-Interactions Pattern**
        balances[msg.sender] = 0; // Update state before external call
        lastTransactionTime[msg.sender] = block.timestamp; // Update transaction time

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, amount);
        emit TransactionInfo(msg.sender, balances[msg.sender], lastTransactionTime[msg.sender] + COOLDOWN_TIME);
    }

    // Function to get balance
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    // Function to check when user can transact next
    function nextTransactionTime(address user) external view returns (uint256) {
        return lastTransactionTime[user] + COOLDOWN_TIME;
    }
}
