const {expect} = require("chai");
const { hexStripZeros } = require("ethers/lib/utils");
const { ethers, network } = require("hardhat");
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
        it("Should mint 1 nft for 0.01 ether", async function() {
       

            expect(await knownNft.balanceOf(addr1.address)).to.be.equal(0);
            
    
            await knownNft.connect(addr1).publicMint({value: ethers.utils.parseEther("0.01")});
            expect(await knownNft.balanceOf(addr1.address)).to.equal(1);
        });
        
        it("Should only mint 3 nfts", async function() {
       

            expect(await knownNft.balanceOf(addr1.address)).to.be.equal(0);
            
    
            await knownNft.connect(addr1).publicMint({value: ethers.utils.parseEther("0.01")});
            expect(await knownNft.balanceOf(addr1.address)).to.equal(1);
            await knownNft.connect(addr1).publicMint({value: ethers.utils.parseEther("0.01")});
            expect(await knownNft.balanceOf(addr1.address)).to.equal(2);
            await knownNft.connect(addr1).publicMint({value: ethers.utils.parseEther("0.01")});
            expect(await knownNft.balanceOf(addr1.address)).to.equal(3);
            await expect(knownNft.connect(addr1).publicMint({value: ethers.utils.parseEther("0.01")})).to.revertedWith('User has reached minting limit');
        });

        it("Should only mint within window", async function() {
            
            await network.provider.send("evm_increaseTime", [3600]);
            expect(await knownNft.balanceOf(addr1.address)).to.be.equal(0);
            
    
            await knownNft.connect(addr1).publicMint({value: ethers.utils.parseEther("0.01")});
            expect(await knownNft.balanceOf(addr1.address)).to.equal(1);

            //Increased current time by slightly above a week (1.09 weeks)
            await network.provider.send("evm_increaseTime", [659232]);
            await expect(knownNft.connect(addr1).publicMint({value: ethers.utils.parseEther("0.01")})).to.revertedWith('Minting window is now closed');
        });

        });

        describe('withdraw', function() {

            it("Should be reverted because caller is not owner", async function() {
                await expect(knownNft.connect(addr1).withdraw(addr1.address)).to.be.revertedWith('caller is not the owner');
            });

            it("Should withdraw funds by the owner", async function() {
  
                await knownNft.connect(owner).withdraw(owner.address);
            });

            it("Should change funds in contract", async function() {
                
                
                await knownNft.connect(addr1).publicMint({value: ethers.utils.parseEther("0.01")});
                await knownNft.connect(addr1).publicMint({value: ethers.utils.parseEther("0.01")});
                await knownNft.connect(addr1).publicMint({value: ethers.utils.parseEther("0.01")});
                await knownNft.connect(addr2).publicMint({value: ethers.utils.parseEther("0.01")});
                await knownNft.connect(addr2).publicMint({value: ethers.utils.parseEther("0.01")});
                await knownNft.connect(addr2).publicMint({value: ethers.utils.parseEther("0.01")});
                const contractFunds = await ethers.provider.getBalance(knownNft.address);

                expect(
                     contractFunds
                ).to.be.equal(ethers.utils.parseEther("0.06"));

            });
        });
    });
   