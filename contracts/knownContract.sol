//Contract based on NFT standard [https://docs.openzeppelin.com/contracts/4.x/wizard]
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract KnownNft is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    uint256 public maxSupply = 100;
    uint256 public userLimit = 3;
    uint256 public balance = address(this).balance;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("KnownNft", "KNWN") {

    }

    //@notice: function to withdraw ether gotten from publicMint
    function withdraw(address _addr) external onlyOwner{
        payable(_addr).transfer(balance);
    }

    /*
    * @notice: Should implement a whitelist here to prevent same user 
    from going beyond minting limit with different wallets
     */
    function publicMint() public payable{
        require(msg.value == 0.01 ether, "Incorrect minting price");
        require(_tokenIdCounter.current() < maxSupply, "No more NFTs available");
        require(balanceOf(msg.sender) < userLimit, "User has reached minting limit");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}