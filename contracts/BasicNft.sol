// "SPDX-License-Identifier: UNLICENSED"

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BasicNft is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    constructor() public ERC721("Basic NFT", "NFT") {}

    function newItem(
        address player        
    ) external onlyOwner returns (uint256) {
        tokenIds.increment();
        uint256 newItemId = tokenIds.current();
        _mint(player, newItemId);
        return newItemId;
    }

}