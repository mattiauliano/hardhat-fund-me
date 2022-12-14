require("@nomicfoundation/hardhat-toolbox");
// Task to deploy contracts
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.8",
  networks: {},
  gasReporter: {
    enabled: false,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  // getNamedAccounts function returns:
  namedAccounts: {
    // Named account
    deployer: {
      default: 0,
      // 4: 1, Ex. For goerli network is the second account
    },
    // Named account
    user: {
      default: 1,
    },
  }
};