module.exports = async function ({ getNamedAccounts, deployments, network }) {
  if(network.tags.staging) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const busd = await deploy("BasicToken", {
      from: deployer,
      args: ["BUSD Token", "BUSD"],
      log: true,
      deterministicDeployment: false
    })
    if (busd.newlyDeployed) {
      log(
        `contract BUSDToken deployed at ${busd.address} using ${busd.receipt.gasUsed} gas`
      );
    }
  }
}
module.exports.tags = ["BUSDToken"]