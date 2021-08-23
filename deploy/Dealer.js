require('dotenv').config();
const { web3, artifacts } = require("hardhat");
const toWei = web3.utils.toWei;
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer, acceptToken, nftAddress } = await getNamedAccounts()

  if(network.tags.staging) {
    const busdToken = await deployments.get('BasicToken')
    const basicNFT = await deployments.get('BasicNft')
    const dealer = await deploy('NftDealer', {
      from: deployer,
      args: [
        busdToken.address,
        toWei('10'),
        basicNFT.address,
        deployer
      ]
    })
    if (dealer.newlyDeployed) {
      log(`contract NftDealer deployed at ${dealer.address} using ${dealer.receipt.gasUsed} gas`); 
    }
  } else if (network.tags.production) {
    const dealer = await deploy('NftDealer', {
      from: deployer,
      args: [
        acceptToken,
        toWei('10'),
        nftAddress,
        deployer
      ]
    })
    if (dealer.newlyDeployed) {
      log(`contract NftDealer deployed at ${dealer.address} using ${dealer.receipt.gasUsed} gas`); 
    }
  }
  
}
module.exports.tags = ["Dealer"]
module.exports.dependencies = ['BUSDToken', 'BasicNft']