// Get access to helper (handling multiple networks and addresses)
const {
    networkConfig,
    developmentChains
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
// Get access to verify function
const { verify } = require("../utils/verify");

// Parameter passed in this async function is 'hre' (hardhat)
// Destructuring 'hre' to get 'getNamedAccounts' and 'deployments' object
module.exports = async ({ getNamedAccounts, deployments }) => {
    // Destructuring deployments to get 'deploy' and 'log' functions
    const { deploy, log } = deployments;
    // getNamedAccounts function returns an object
    // Destructuring to get only the first name 'deployer'
    const { deployer } = await getNamedAccounts();
    // Taking chainId for network conditionals
    const chainId = network.config.chainId;
    // Price feed address
    let ethUsdPriceFeedAddress;

    // If network is a local test network
    if (developmentChains.includes(network.name)) {
        // Use mock to get fake data to use in our FundMe contract
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        // Use networkConfig and chainId to handle addresses
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    const args = [ethUsdPriceFeedAddress];
    // Deploying FundMe contract
    const fundMe = await deploy("FundMe", {
        // Named account
        from: deployer,
        // Constructor args (price feed address)
        args: args,
        // Log transaction
        log: true,
        // Block confirmations to wait
        waitConfirmations: network.config.blockConfirmations || 1
    });

    // If the current network isn't a local net verify the contract
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args);
    }

    log("----------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
