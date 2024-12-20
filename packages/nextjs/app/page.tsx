"use client";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractData from "./Voting.json";

const App: React.FC = () => { 

    interface Candidate {
      id: number;
      name: string;
      voteCount: number;
    }

    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [newCandidate, setNewCandidate] = useState('');
    const [votingCandidateId, setVotingCandidateId] = useState('');

    const contractAddress = '0x4A679253410272dd5232B3Ff7cF5dbB88f295319';
    const contractABI = contractData.abi;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();

    const addCand = async () => { 
      await handleAddCandidate(newCandidate); 
  }; 




  async function fetchCandidates() {
    try {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const [ids, names, voteCounts] = await contract.getCandidates();
        
        console.log("Fetched data from contract:", { ids, names, voteCounts });
        
        const candidates = ids.map((id: number, index: number) => ({
            id,
            name: names[index],
            voteCount: voteCounts[index],
        }));
        
        console.log("Formatted candidates:", candidates); 
        setCandidates(candidates);
    } catch (error) {
        console.error("Error fetching candidates:", error);
    }
}



    async function handleAddCandidate(person:string) {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        await contract.addCandidate(newCandidate);
        setNewCandidate('');
    }

    async function handleVote() {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        await contract.vote(votingCandidateId);
        setVotingCandidateId('');
    }

    return (
        <div>
            <h1>Voting DApp</h1>
            <input
                type="text"
                value={newCandidate}
                onChange={(e) => setNewCandidate(e.target.value)}
                placeholder="Add Candidate"
            />
            <button onClick={() => handleAddCandidate(newCandidate)}>Add Candidate</button>


            <h2>Vote for a Candidate</h2>
            <select value={votingCandidateId} onChange={(e) => setVotingCandidateId(e.target.value)}>
                <option value="">Select a candidate</option>
                {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                        {candidate.name}
                    </option>
                ))}
            </select>
            <button onClick={handleVote}>Vote</button>

            <h2>Results</h2>
            <div>
    <button onClick={fetchCandidates}>Fetch Candidates</button>
    <ul>
        {candidates.length > 0 ? (
            candidates.map(candidate => (
                <li key={candidate.id}>
                    {candidate.name} - Votes: {candidate.voteCount.toString()}
                </li>
            ))
        ) : (
            <li>No candidates available</li>
        )}
    </ul>
</div>
        </div>
    );
};

export default App;
