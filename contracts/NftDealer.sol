// "SPDX-License-Identifier: UNLICENSED"

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftDealer is Ownable {
    using SafeERC20 for IERC20;

    address public token;
    uint256 public amount;
    ERC721 public nft;
    address public recipient;

    constructor(
        address _token,
        uint256 _amount,
        ERC721 _nft,
        address _recipient
    ) public {
        token = _token;
        amount = _amount;
        nft = _nft;
        recipient = _recipient;
    }

    function buy(address _receiver) public {
        uint256 nftAmount = nft.balanceOf(address(this));
        require(nftAmount > 0, "Out of stock");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);        
        
        uint256 tokenId = nft.tokenOfOwnerByIndex(address(this), 0);
        nft.safeTransferFrom(address(this), _receiver, tokenId);
        
        IERC20(token).safeTransfer(recipient, amount);
    }

    function buy() public {
        buy(msg.sender);
    }

    function setAmount(uint256 _amount) external onlyOwner {
        require(_amount != amount);
        amount = _amount;
    }

    function setNft(ERC721 _nft) external onlyOwner {
        require(address(_nft) != address(0) && address(_nft) != address(nft));
        nft = _nft;
    }

    function setToken(address _token) external onlyOwner {
        require(_token != address(0) && _token != token);
        token = _token;
    }

    function setRecipient(address _recipient) external onlyOwner {
        require(_recipient != address(0) && _recipient != recipient);
        recipient = _recipient;
    }
}
