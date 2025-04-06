import { HttpAgent } from "@dfinity/agent";
import { useEffect, useState } from "react";
import { createActor } from "../../declarations/voting_system_backend";
import "./App.css"; // Import the CSS file

// Set backend canister ID manually
const backendId = "b77ix-eeaaa-aaaaa-qaada-cai";
const agent = new HttpAgent();
const votingBackend = createActor(backendId, { agent });

function App() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await votingBackend.get_results();
        console.log("Voting Results:", data);
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch results:", err);
      }
    };
    fetchResults();
  }, []);

  const handleVote = async (candidateIndex) => {
    try {
      await votingBackend.vote(candidateIndex);
      const updatedResults = await votingBackend.get_results();
      setResults(updatedResults);
    } catch (err) {
      console.error("Voting failed:", err);
    }
  };

  return (
    <div className="App">
      <h1>🇮🇳 Indian Election Voting</h1>
      <div className="candidates">
        <button onClick={() => handleVote(0)}>Vote for Narendra Modi (BJP)</button>
        <button onClick={() => handleVote(1)}>Vote for Rahul Gandhi (INC)</button>
        <button onClick={() => handleVote(2)}>Vote for Arvind Kejriwal (AAP)</button>
        <button onClick={() => handleVote(3)}>Vote for Mamata Banerjee (TMC)</button>
        <button onClick={() => handleVote(4)}>Vote for Akhilesh Yadav (SP)</button>
        <button onClick={() => handleVote(5)}>Vote for Mayawati (BSP)</button>
      </div>
      <div className="results">
        <h2>Results</h2>
        {results.length > 0 ? (
          results.map((candidate, index) => (
            <p key={index}>
              {candidate.name} from {candidate.party}: {candidate.votes} votes
            </p>
          ))
        ) : (
          <p>Loading results...</p>
        )}
      </div>
    </div>
  );
}

export default App;
