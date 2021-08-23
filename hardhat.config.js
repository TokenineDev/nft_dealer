/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');
require('hardhat-deploy');

require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.6.12",
  namedAccounts: {
    deployer: {
      default: 0
    },
    acceptToken: process.env.ACCEPT_TOKEN,
    nftAddress: process.env.NFT_ADDRESS
  },
  networks: {
    testnet: {
      url: process.env.BSC_TESTNET_RPC,
      chainId: 97,
      // accounts: {mnemonic: process.env.MNEMONIC},
      accounts: [process.env.PRIVATE_KEY],
      live: true,
      saveDeployments: true,
      tags: ['staging']
    },
    mainnet: {
      url: process.env.BSC_RPC,
      chainId: 56,
      // accounts: {mnemonic: process.env.MNEMONIC},
      accounts: [process.env.PRIVATE_KEY_MAINNET],
      live: true,
      saveDeployments: true,
      tags: ['production']
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY
  },
};
