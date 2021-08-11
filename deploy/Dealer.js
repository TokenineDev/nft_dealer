require('dotenv').config();
const { web3, artifacts } = require("hardhat");
const toWei = web3.utils.toWei;
module.exports = async function ({ getNamedAccounts, deployments }) {
  if(network.tags.staging) {
    const { deploy, log, execute } = deployments
    const { deployer } = await getNamedAccounts()
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
  }
}
module.exports.tags = ["Dealer"]
module.exports.dependencies = ['BUSDToken', 'BasicNft']