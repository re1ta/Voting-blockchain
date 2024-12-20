import { ethers } from "hardhat";
import { expect } from "chai";

describe("Voting Contract", function () {
    let Voting: any;
    let voting: any;

    beforeEach(async function () {
        Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy();
    });

    describe("addCandidate", function () {
      it("should add a new candidate", async function () {
        await voting.addCandidate("John Doe");
        const [ids, names, voteCounts] = await voting.getCandidates();
        const index = ids.findIndex((id: BigInt) => id === BigInt(1));
        expect(names[index]).to.equal("John Doe");
        expect(voteCounts[index]).to.equal(0);
    });
    
    });

    describe("vote", function () {
      it("should allow a user to vote for a candidate", async function () {
        await voting.addCandidate("Jane Doe");
        await voting.vote(1);
        const [ids, names, voteCounts] = await voting.getCandidates();
        const index = ids.findIndex((id: BigInt) => id === BigInt(1));
        expect(voteCounts[index]).to.equal(1);
    });
    

        it("should not allow a user to vote twice", async function () {
            await voting.addCandidate("Jane Doe");
            await voting.vote(1);
            await expect(voting.vote(1)).to.be.revertedWith("You have already voted.");
        });
    });
});
 