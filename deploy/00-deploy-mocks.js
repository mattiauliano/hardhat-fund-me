const { network } = require("hardhat");
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    // Deploy if developmentChains includes the current network
    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            // Price decimals and value 1000.00000000
            args: [DECIMALS, INITIAL_ANSWER]
        });
        log("Mocks deployed!");
        log("----------------------------------------------------");
    }
};

module.exports.tags = ["all", "mocks"];
