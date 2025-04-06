// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasComparison {
    uint256 public simpleValue;
    uint256[] public storageArray;
    mapping(uint256 => string) public complexMap;
    
    event TransactionExecuted(
        string txType,
        uint256 gasUsed,
        uint256 gasPrice,
        uint256 totalCost
    );
    
    // Simple transaction (writes to single variable)
    function simpleTransaction(uint256 _value) external {
        uint256 startGas = gasleft();
        simpleValue = _value;
        _recordGas("Simple", startGas);
    }
    
    // Storage transaction (writes to array)
    function storageTransaction(uint256 _value) external {
        uint256 startGas = gasleft();
        storageArray.push(_value);
        _recordGas("Storage", startGas);
    }
    
    // Complex transaction (writes to mapping and array)
    function complexTransaction(uint256 _key, string memory _value) external {
        uint256 startGas = gasleft();
        complexMap[_key] = _value;
        storageArray.push(_key);
        _recordGas("Complex", startGas);
    }
    
    function _recordGas(string memory _txType, uint256 _startGas) internal {
        uint256 gasUsed = _startGas - gasleft();
        uint256 gasPrice = tx.gasprice;
        uint256 totalCost = gasUsed * gasPrice;
        
        emit TransactionExecuted(_txType, gasUsed, gasPrice, totalCost);
    }
    
    // Helper function to compare two transaction types
    function compareTransactions(
        string memory _txType1,
        string memory _txType2
    ) external pure returns (string memory) {
        bytes32 type1 = keccak256(abi.encodePacked(_txType1));
        bytes32 type2 = keccak256(abi.encodePacked(_txType2));
        
        if (type1 == keccak256(abi.encodePacked("Simple")) && 
            type2 == keccak256(abi.encodePacked("Storage"))) {
            return "Storage transactions typically cost more than Simple transactions";
        }
        else if (type1 == keccak256(abi.encodePacked("Simple")) && 
                 type2 == keccak256(abi.encodePacked("Complex"))) {
            return "Complex transactions typically cost more than Simple transactions";
        }
        else if (type1 == keccak256(abi.encodePacked("Storage")) && 
                 type2 == keccak256(abi.encodePacked("Complex"))) {
            return "Complex transactions typically cost more than Storage transactions";
        }
        return "Cannot compare these transaction types";
    }
}