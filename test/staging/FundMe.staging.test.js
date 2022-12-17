const { assert } = require("chai");
const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

// This is the last step, testing on a real testnet
// Check if the current network is a local testnet or a real one
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", () => {
          let fundMe;
          let deployer;
          const sendValue = ethers.utils.parseEther("0.1");
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContract("FundMe", deployer);
              // Don't need to deploy, assuming that is already deployed
              // Don't need Mock because here will be use only real testnet
          });

          it("Allows people to fund and withdraw", async () => {
              await fundMe.fund({ value: sendValue });
              await fundMe.withdraw();
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );
              assert.equal(endingBalance.toString(), "0");
          });
      });
