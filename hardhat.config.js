require("@nomicfoundation/hardhat-toolbox");
// Task to deploy contracts
require("hardhat-deploy");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;

module.exports = {
    // Adding multiple solidity compiler versions
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
    },
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5
        }
    },
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
            default: 0,
            // For goerli network is the first account
            5: 0
        },
        // Named account
        user: {
            default: 1
        }
    }
};
