require("@nomicfoundation/hardhat-toolbox");
// Task to deploy contracts
require("hardhat-deploy");
require("dotenv").config();

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://eth-goerli";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key";

module.exports = {
    // Adding multiple solidity compiler versions
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
    },
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            // Specifying how many confirmations block want to wait
            blockConfirmations: 6
        }
    },
    gasReporter: {
        enabled: false,
        currency: "USD"
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
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
