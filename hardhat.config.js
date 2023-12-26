require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-contract-sizer")
require('@typechain/hardhat')
// require("@openzeppelin/hardhat-upgrades");

const {
  PLS_URL,
  PLS_DEPLOY_KEY,
  PLS_API_KEY,
} = require("./env.json")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.info(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "pulse",
  networks: {
    localhost: {
      timeout: 120000
    },
    hardhat: {
      forking: {
        url: PLS_URL,
      },
      allowUnlimitedContractSize: true
    },
    pulse: {
      url: PLS_URL,
      gasPrice: 7000000000000000,
      // gas: 50000,
      chainId: 369,
      accounts: [PLS_DEPLOY_KEY]
    },
  },
  etherscan: {
    apiKey: {
      pulse: PLS_API_KEY
      // cronos: CRONOSSCAN_API_KEY,
      // butane: BUTANE_API_KEY,
    },
    customChains: [
      {
        network: "pulse",
        chainId: 369,
        urls: {
          apiURL: "https://scan.pulsechain.com/api",
          browserURL: "https://scan.pulsechain.com"
        }
      }
    ]
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: false,
            runs: 200
          }
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: "0.8.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      }
    ],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
}
