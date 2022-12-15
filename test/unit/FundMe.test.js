const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", () => {
    let fundMe;
    let deployer;
    // Deploying contracts before each test
    beforeEach(async () => {
        // Getting only deployer object and assign it to deployer variable
        deployer = (await getNamedAccounts()).deployer;
        // Deploying contracts with "all" tag
        await deployments.fixture(["all"]);
        // Getting contract using ethers-hardhat
        fundMe = await ethers.getContract("FundMe");
    });
});
