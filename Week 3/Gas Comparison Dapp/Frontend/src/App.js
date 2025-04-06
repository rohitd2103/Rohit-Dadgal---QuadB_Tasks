import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ADDRESS = "0x3E0d0Cb98388a743EaADbfA2032148c413516CFE";
const CONTRACT_ABI = [
  // Paste your contract ABI here
  {
    "inputs": [
      {"internalType": "uint256", "name": "_value", "type": "uint256"}
    ],
    "name": "simpleTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_value", "type": "uint256"}
    ],
    "name": "storageTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_key", "type": "uint256"},
      {"internalType": "string", "name": "_value", "type": "string"}
    ],
    "name": "complexTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_txType1", "type": "string"},
      {"internalType": "string", "name": "_txType2", "type": "string"}
    ],
    "name": "compareTransactions",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [gasResults, setGasResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          
          const gasContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
          );
          setContract(gasContract);
          console.log("Contract initialized:", gasContract);
        } catch (err) {
          console.error("Initialization error:", err);
          setError(`Connection error: ${err.message}`);
        }
      } else {
        setError("Please install MetaMask!");
      }
    };
    init();
  }, []);

  const executeTransaction = async (txType) => {
    if (!contract) {
      setError("Contract not initialized");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      console.log(`Executing ${txType} transaction...`);
      let tx;
      let args = [];
      
      switch(txType) {
        case "simple":
          args = [Math.floor(Math.random() * 100)];
          tx = await contract.simpleTransaction(...args);
          break;
        case "storage":
          args = [Math.floor(Math.random() * 100)];
          tx = await contract.storageTransaction(...args);
          break;
        case "complex":
          args = [
            Math.floor(Math.random() * 100),
            `test-${Math.floor(Math.random() * 100)}`
          ];
          tx = await contract.complexTransaction(...args);
          break;
        default:
          throw new Error("Unknown transaction type");
      }
      
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);
      
      setGasResults(prev => [...prev, {
        type: txType,
        gasUsed: receipt.gasUsed.toString(),
        txHash: tx.hash,
        args: args
      }]);
      
    } catch (err) {
      console.error("Transaction error:", err);
      setError(`Transaction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const compareTransactions = async () => {
    if (!contract) {
      setError("Contract not initialized");
      return;
    }
    
    if (gasResults.length < 2) {
      setError("Need at least 2 transactions to compare");
      return;
    }
    
    try {
      const tx1 = gasResults[gasResults.length - 2];
      const tx2 = gasResults[gasResults.length - 1];
      
      const result = await contract.compareTransactions(
        tx1.type === "simple" ? "Simple" : 
        tx1.type === "storage" ? "Storage" : "Complex",
        tx2.type === "simple" ? "Simple" : 
        tx2.type === "storage" ? "Storage" : "Complex"
      );
      
      setComparison(result);
      setError("");
    } catch (err) {
      console.error("Comparison error:", err);
      setError(`Comparison failed: ${err.message}`);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Gas Fee Comparison DApp</h1>
        <p>Connected Account: {account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Not connected"}</p>
        <p>Contract Address: {CONTRACT_ADDRESS}</p>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="transaction-section">
        <h2>Execute Transactions</h2>
        <div className="buttons">
          <button 
            onClick={() => executeTransaction("simple")}
            disabled={loading}
          >
            {loading ? "Processing..." : "Simple Transaction"}
          </button>
          <button 
            onClick={() => executeTransaction("storage")}
            disabled={loading}
          >
            {loading ? "Processing..." : "Storage Transaction"}
          </button>
          <button 
            onClick={() => executeTransaction("complex")}
            disabled={loading}
          >
            {loading ? "Processing..." : "Complex Transaction"}
          </button>
        </div>
      </div>

      <div className="results-section">
        <h2>Transaction Results</h2>
        {gasResults.length === 0 ? (
          <p>No transactions yet. Execute a transaction above.</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Args</th>
                  <th>Gas Used</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {gasResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.type}</td>
                    <td>{JSON.stringify(result.args)}</td>
                    <td>{result.gasUsed}</td>
                    <td>
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${result.txHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {result.txHash.substring(0, 10)}...
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="comparison">
              <button onClick={compareTransactions}>
                Compare Last Two Transactions
              </button>
              {comparison && (
                <div className="comparison-result">
                  <h3>Comparison Result:</h3>
                  <p>{comparison}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;