// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    uint256 public candidateCount;

    event CandidateAdded(uint256 id, string name);
    event Voted(uint256 candidateId);

    function addCandidate(string memory name) public {
        candidateCount++;
        candidates.push(Candidate(candidateCount, name, 0));
        emit CandidateAdded(candidateCount, name);
    }

    function vote(uint256 candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(candidateId > 0 && candidateId <= candidateCount, "Invalid candidate.");

        hasVoted[msg.sender] = true;
        candidates[candidateId - 1].voteCount++;

        emit Voted(candidateId);
    }

    function getCandidates()
        public
        view
        returns (uint256[] memory ids, string[] memory names, uint256[] memory voteCounts)
    {
        uint256[] memory ids = new uint256[](candidates.length);
        string[] memory names = new string[](candidates.length);
        uint256[] memory voteCounts = new uint256[](candidates.length);

        for (uint256 i = 0; i < candidates.length; i++) {
            ids[i] = candidates[i].id;
            names[i] = candidates[i].name;
            voteCounts[i] = candidates[i].voteCount;
        }

        return (ids, names, voteCounts);
    }

    function getVoteCount(uint256 candidateId) public view returns (uint256) {
        require(candidateId > 0 && candidateId <= candidateCount, "Invalid candidate.");
        return candidates[candidateId - 1].voteCount;
    }
}
