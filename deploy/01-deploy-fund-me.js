// Get access to helper (handling multiple networks and addresses)
const {
    networkConfig,
    developmentChains
} = require("../helper-hardhat-config");
const { network } = require("hardhat");

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
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPrice"];
    }

    // Deploying FundMe contract
    const fundMe = await deploy("FundMe", {
        // Named account
        from: deployer,
        // Constructor args (price feed address)
        args: [ethUsdPriceFeedAddress],
        // Log transaction
        log: true
    });
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
