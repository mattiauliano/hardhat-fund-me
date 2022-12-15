const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai"); // Overwritten by waffle

describe("FundMe", () => {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    // Convert 1ETH in 1000000000000000000
    const sendValue = ethers.utils.parseEther("1");
    // Deploy contracts before each test
    beforeEach(async () => {
        // Get only deployer object and assign it to deployer variable
        deployer = (await getNamedAccounts()).deployer;
        // Deploy contracts with "all" tag
        await deployments.fixture(["all"]);
        // Get contract using ethers-hardhat
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
    });

    // Test constructor function
    describe("constructor", () => {
        it("Sets the aggregator addresses correctly", async () => {
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address);
        });
    });

    // Test fund function
    describe("fund", () => {
        it("Fails if you don't send enough ETH", async () => {
            // Specific revert message from FundMe.sol
            await expect(fundMe.fund()).to.be.revertedWith(
                "Send at least 10$!"
            );
        });
        it("Updates the amount founded data structure", async () => {
            // Fund 1ETH from deployer by default (to check)
            await fundMe.fund({ value: sendValue });
            // Get deployer's funds
            const response = await fundMe.addressToAmountFunds(deployer);
            assert.equal(response.toString(), sendValue.toString());
        });
        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue });
            // funders(0) === funders[0]
            const pushedFunder = await fundMe.funders(0);
            assert.equal(pushedFunder, deployer);
        });
    });
});
