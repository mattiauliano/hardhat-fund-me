// Get access to helper (handling multiple networks and addresses)
const { networkConfig } = require("../helper-hardhat-config");

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

    // Use networkConfig and chainId to handle addresses
    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    const btcUsdPriceFeedAddress = networkConfig[chainId]["btcUsdPriceFeed"];

    // Actually deploy FundMe contract
    const fundMe = await deploy("FundMe", {
        // Named account
        from: deployer,
        // Constructor args (price feed address)
        args: [ethUsdPriceFeedAddress],
        // Log transaction
        log: true,
    })
};