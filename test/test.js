const {expect} = require("chai");
const { hexStripZeros } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("KnownNft", function() {
    
    beforeEach(async function() {
        const KnownNft = await ethers.getContractFactory("KnownNft");
        [owner, addr1, addr2] = await ethers.getSigners(); 
        knownNft = await KnownNft.deploy();
    });

    describe('Deployment', function() {
        it("Should return the right name and symbol", async function() {
       
        expect(await knownNft.name()).to.equal("KnownNft");
        expect(await knownNft.symbol()).to.equal("KNWN");

       
        
    });

    it("Should be right owner", async function() {
        expect (await knownNft.owner()).to.equal(owner.address)
    });
    });
    

    

    describe('Mint', function() {
        it("Should only mint 3 nfts for 0.01 ether", async function() {
       

            expect(await knownNft.balanceOf(addr1.address)).to.be.equal(0);
            
    
            const tx = await knownNft.connect(addr1).publicMint({value: ethers.utils.parseEther("0.01")});
            expect(await knownNft.balanceOf(addr1.address)).to.be.equal(1);
        });
        });
    });
   