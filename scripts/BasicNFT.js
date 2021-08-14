module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()  
  const basicNft = await deploy("BasicNft", {
    from: deployer,
    log: true,
    deterministicDeployment: false
  })
  if (basicNft.newlyDeployed) {
    log(
      `contract BasicNft deployed at ${basicNft.address} using ${basicNft.receipt.gasUsed} gas`
    );
  }
}
module.exports.tags = ["BasicNft"]