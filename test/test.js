const {expect} = require("chai");
const { hexStripZeros } = require("ethers/lib/utils");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("KnownNft", function() {
    it("Should return the right name and symbol", async function() {
        const KnownNft = await hre.ethers.getContractFactory("KnownNft");
        const knownNft = await KnownNft.deploy();

        await knownNft.deployed();
        expect(await knownNft.name()).to.equal("KnownNft");
        expect(await knownNft.symbol()).to.equal("KNWN");
    });
})