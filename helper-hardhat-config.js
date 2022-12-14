// Use helper-hardhat-config to handle different addresses and networks
const networkConfig = {
    // Goerli network
    5: {
        name: "goerli",
        // Pairs price feed addresses
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        btcUsdPriceFeed: "0xA39434A63A52E749F02807ae27335515BA4b07F7"
    }
};

// Development chains to mocking
const developmentChains = ["hardhat", "localhost"];
// Adding fake decimals and value to pass them in mock constructor
const DECIMALS = 8;
const INITIAL_ANSWER = 100000000000;

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
};
