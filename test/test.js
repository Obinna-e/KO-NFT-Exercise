const {expect} = require("chai");
const { hexStripZeros } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("KnownNft", function() {
    
    this.beforeEach(async function() {
        const KnownNft = await ethers.getContractFactory("KnownNft");
         knownNft = await KnownNft.deploy();
    });

    it("Should return the right name and symbol", async function() {
       
        expect(await knownNft.name()).to.equal("KnownNft");
        expect(await knownNft.symbol()).to.equal("KNWN");
    });

    it("Should only mint 3 nfts for 0.01 ether", async function() {
        const [owner, addr1, addr2] = await ethers.getSigners();

        const KnownNft = await ethers.getContractFactory("KnownNft");
        const knownNft = await KnownNft.deploy();

        await knownNft.deployed();
        

        knownNft.connect(addr1).publicMint();
        expect(await knownNft.balanceOf(addr1.address)).to.equal('0');
    });
})