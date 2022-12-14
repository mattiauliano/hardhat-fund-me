require("@nomicfoundation/hardhat-toolbox");
// Task to deploy contracts
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // Adding multiple solidity compiler versions
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
    },
    networks: {},
    gasReporter: {
        enabled: false,
        currency: "USD"
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    },
    // getNamedAccounts function returns:
    namedAccounts: {
        // Named account
        deployer: {
            default: 0
            // 5: 1, Ex. For goerli network is the second account
        },
        // Named account
        user: {
            default: 1
        }
    }
};
