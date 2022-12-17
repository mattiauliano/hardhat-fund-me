const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai"); // Overwritten by waffle
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", () => {
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
                  const response = await fundMe.getPriceFeed();
                  assert.equal(response, mockV3Aggregator.address);
              });
          });

          // Test fund function
          describe("fund", () => {
              it("Fails if you don't send enough ETH", async () => {
                  // Specific revert message from FundMe.sol
                  await expect(fundMe.fund()).to.be.revertedWithCustomError(
                      fundMe,
                      "FundMe__NotEnoughMoney"
                  );
              });

              it("Updates the amount founded data structure", async () => {
                  // Fund 1ETH from deployer by default (to check)
                  await fundMe.fund({ value: sendValue });
                  // Get deployer's funds
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  );
                  assert.equal(response.toString(), sendValue.toString());
              });

              it("Adds funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue });
                  // funders(0) === funders[0]
                  const pushedFunder = await fundMe.getFunder(0);
                  assert.equal(pushedFunder, deployer);
              });
          });

          // Test withdraw function
          describe("withdraw", () => {
              // Add ETH to FundMe contract
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue });
              });

              it("Withdraw ETH from single account", async () => {
                  // Arrange
                  const initialContractBalance = await ethers.provider.getBalance(
                      fundMe.address
                  );
                  const initialDeployerBalance = await ethers.provider.getBalance(
                      deployer
                  );

                  // Act
                  const response = await fundMe.withdraw();
                  const transactionReceipt = await response.wait(1);
                  // Get the gas cost
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  // Multiply to get gasCost
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingContractBalance = await ethers.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance = await ethers.provider.getBalance(
                      deployer
                  );

                  // Assert
                  assert.equal(endingContractBalance, 0);
                  // .add and .toString methods are used because of bigNumber type
                  assert.equal(
                      initialContractBalance
                          .add(initialDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );
              });

              it("Allow us to withdraw with multiple funders", async () => {
                  // Arrange
                  // Get multiple accounts
                  const accounts = await ethers.getSigners();
                  // Connect accounts to the contract
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectContract = await fundMe.connect(
                          accounts[i]
                      );
                      await fundMeConnectContract.fund({ value: sendValue });
                  }
                  // Get initial balances
                  const initialContractBalance = await ethers.provider.getBalance(
                      fundMe.address
                  );
                  const initialDeployerBalance = await ethers.provider.getBalance(
                      deployer
                  );

                  // Act
                  const response = await fundMe.withdraw();
                  const transactionReceipt = await response.wait(1);
                  // Get the gas cost
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  // Multiply to get gasCost
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingContractBalance = await ethers.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance = await ethers.provider.getBalance(
                      deployer
                  );

                  // Assert
                  // .add and .toString methods are used because of bigNumber type
                  assert.equal(
                      initialContractBalance
                          .add(initialDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );

                  // Make sure that funders reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted;

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      );
                  }
              });

              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners();
                  const attacker = accounts[1];
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  );
                  // Revert with custom error
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
              });
          });
      });
