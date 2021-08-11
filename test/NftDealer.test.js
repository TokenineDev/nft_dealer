const { default: BigNumber } = require("bignumber.js");
const { expect } = require("chai");
const { web3, artifacts } = require("hardhat");

const BasicToken = artifacts.require("BasicToken");
const BasicNft = artifacts.require("BasicNft");
const NftDealer = artifacts.require("NftDealer");

const toWei = web3.utils.toWei;

describe("NftDealer", function () {
  let deployer, recipient, bob, marry, john;
  let busdToken, dealer, nft;
  
  const busdAmount = toWei("10");


  before(async function () {
    let accounts = await web3.eth.getAccounts();
    deployer = accounts[0];
    recipient = accounts[1];
    bob = accounts[2];
    marry = accounts[3];
    john = accounts[4];
  });

  beforeEach(async function () {
    busdToken = await BasicToken.new("BUSD Token", "BUSD");
    nft = await BasicNft.new();
    dealer = await NftDealer.new(
      busdToken.address,
      busdAmount,
      nft.address,
      recipient
    );
  });

  describe("constructor", async function() {
    it("assigns properties", async function () {
      expect(await dealer.token()).to.eq(busdToken.address);
      expect((await dealer.amount()).toString()).to.eq(busdAmount);
      expect(await dealer.nft()).to.eq(nft.address);
      expect(await dealer.recipient()).to.eq(recipient);
    });
  });

  describe("withdraw", async function() {
    it("should transfer all NFT from contract to receiver", async function() {
      for(let i=0; i<10; i++) {
        await nft.newItem(dealer.address);
      }
      await expect(dealer.withdraw(bob, {from:bob})).revertedWith("caller is not the owner");
      await dealer.withdraw(bob);
      expect((await nft.balanceOf(dealer.address)).toString()).to.eq("0");
      expect((await nft.balanceOf(bob)).toString()).to.eq("10");
    });

    it("should transfer the specific NFT from contract to receiver", async function() {
      for(let i=0; i<10; i++) {
        await nft.newItem(dealer.address);
      }
      await dealer.withdraw(bob, 1);
      expect((await nft.balanceOf(dealer.address)).toString()).to.eq("9");
      expect((await nft.balanceOf(bob)).toString()).to.eq("1");

      await expect(dealer.withdraw(bob, 100)).revertedWith("operator query for nonexistent token");
    })
  });

  describe("buy", async function() {
    it("should not transfer nft to caller if token amount is not enough", async function() {
      await busdToken.mint(bob, toWei("1"));
      for(let i=0; i<10; i++) {
        await nft.newItem(dealer.address);
      }
      await busdToken.approve(dealer.address, busdAmount, {from:bob});
      await expect(dealer.buy({from:bob})).revertedWith("transfer amount exceeds balance");
    });
    
    it("should revert if there is no NFT left", async function() {
      await busdToken.mint(bob, busdAmount);
      await busdToken.mint(marry, busdAmount);
      await busdToken.mint(john, busdAmount);
      for(let i=0; i<2; i++) {
        await nft.newItem(dealer.address);
      }
      await busdToken.approve(dealer.address, busdAmount, {from:bob});
      await busdToken.approve(dealer.address, busdAmount, {from:marry});
      await busdToken.approve(dealer.address, busdAmount, {from:john});

      await dealer.buy({from:bob});      
      await dealer.buy({from:marry});
      await expect(dealer.buy({from:john})).revertedWith("Out of stock");
    });

    it("should transfer nft to caller", async function() {
      await busdToken.mint(bob, busdAmount);
      await busdToken.mint(marry, busdAmount);
      await busdToken.mint(john, busdAmount);
      for(let i=0; i<10; i++) {
        await nft.newItem(dealer.address);
      }      
      await busdToken.approve(dealer.address, busdAmount, {from:bob});
      await busdToken.approve(dealer.address, busdAmount, {from:marry});
      await busdToken.approve(dealer.address, busdAmount, {from:john});

      await dealer.buy({from:bob});      
      expect((await nft.balanceOf(dealer.address)).toString()).to.eq("9");
      expect((await nft.balanceOf(bob)).toString()).to.eq("1");
      expect((await busdToken.balanceOf(bob)).toString()).to.eq("0");
      
      await dealer.buy({from:marry});
      expect((await nft.balanceOf(dealer.address)).toString()).to.eq("8");
      expect((await nft.balanceOf(marry)).toString()).to.eq("1");
      expect((await busdToken.balanceOf(marry)).toString()).to.eq("0");

      await dealer.buy({from:john});
      expect((await nft.balanceOf(dealer.address)).toString()).to.eq("7");
      expect((await nft.balanceOf(john)).toString()).to.eq("1");
      expect((await busdToken.balanceOf(john)).toString()).to.eq("0");

      let expectAmount = BigNumber(busdAmount).times(3);
      expect((await busdToken.balanceOf(recipient)).toString()).to.eq(expectAmount.toString());
    });
  });
});
