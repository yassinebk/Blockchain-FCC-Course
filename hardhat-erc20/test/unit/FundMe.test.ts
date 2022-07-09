import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { FundMe, MockV3Aggregator } from "../../typechain";

developmentChains.includes(network.name)
  ? describe("FundMe", async function () {
      let fundMe: FundMe;
      let deployer: SignerWithAddress;
      let mockV3Aggregator: MockV3Aggregator;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async () => {
        await deployments.fixture(["all"]);
        // const deploymentsDone = await deployments.fixture("all");
        fundMe = await ethers.getContract("FundMe", deployer);

        deployer = (await ethers.getSigners())[0];
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", async () => {
        it("sets the aggregator address", async function () {
          const response = await fundMe.getPriceFeed();
          assert.equal(response, mockV3Aggregator.address);
        });
      });

      describe("fund", () => {
        it("fails without enough eth", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });

        it("updated the amount of funded data structure", async () => {
          await fundMe.fund({ value: sendValue });
          const res = await fundMe.getAddressToAmountFunded(deployer!.address);
          assert.equal(res.toString(), sendValue.toString());
        });

        it("Adds funder to array of funders", async () => {
          await fundMe.fund({ value: sendValue });
          const funder = await fundMe.getFunder(0);
          assert.equal(funder, deployer!.address);
        });
      });

      describe("withdraw", () => {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
        });
        it("withdraw ETH from a signle founder", async function () {
          // Arrange
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // Act
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );

          const transactionRes = await fundMe.withdraw();
          const transactionRec = await transactionRes.wait(1);
          const endingFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );

          assert.equal(endingFundBalance.toNumber(), 0);
          assert.equal(
            endingDeployerBalance.toString(),
            startingDeployerBalance
              .add(startingFundMeBalance)
              .sub(transactionRec.gasUsed.mul(transactionRec.effectiveGasPrice))
              .toString()
          );
          // Assert
        });
        it("Allows us to withdraw with multiple funders", async () => {
          const accounts = await ethers.getSigners();
          const promiseArrays = [];
          for (let i = 0; i < accounts.length; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            promiseArrays.push(
              fundMeConnectedContract.fund({ value: sendValue })
            );
          }
          await Promise.all(promiseArrays);
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // Act
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );

          const transactionRes = await fundMe.withdraw();
          const transactionRec = await transactionRes.wait(1);
          const endingFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );
          assert.equal(endingFundBalance.toNumber(), 0);
          assert.equal(
            endingDeployerBalance.toString(),
            startingDeployerBalance
              .add(startingFundMeBalance)
              .sub(transactionRec.gasUsed.mul(transactionRec.effectiveGasPrice))
              .toString()
          );
          await expect(fundMe.getFunder(0)).to.be.reverted;
          for (let i = 0; i < accounts.length; i++) {
            assert.equal(
              (
                await fundMe.getAddressToAmountFunded(accounts[i].address)
              ).toNumber(),
              0
            );
          }
        });

        it("Only allows the owner to withdraw", async () => {
          const attacker = (await ethers.getSigners())[1];
          const attackerConnectedContract = await fundMe.connect(attacker);
          await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
            "FundMe__NotOwner"
          );
        });
        it("Cheaper Withdraw", async () => {
          const accounts = await ethers.getSigners();
          const promiseArrays = [];
          for (let i = 0; i < accounts.length; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            promiseArrays.push(
              fundMeConnectedContract.fund({ value: sendValue })
            );
          }
          await Promise.all(promiseArrays);
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // Act
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );

          const transactionRes = await fundMe.cheaperWithdraw();
          const transactionRec = await transactionRes.wait(1);
          const endingFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );
          assert.equal(endingFundBalance.toNumber(), 0);
          assert.equal(
            endingDeployerBalance.toString(),
            startingDeployerBalance
              .add(startingFundMeBalance)
              .sub(transactionRec.gasUsed.mul(transactionRec.effectiveGasPrice))
              .toString()
          );
          await expect(fundMe.getFunder(0)).to.be.reverted;
          for (let i = 0; i < accounts.length; i++) {
            assert.equal(
              (
                await fundMe.getAddressToAmountFunded(accounts[i].address)
              ).toNumber(),
              0
            );
          }
        });
        it("cheaper withdraw ETH from a signle founder", async function () {
          // Arrange
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // Act
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );

          const transactionRes = await fundMe.cheaperWithdraw();
          const transactionRec = await transactionRes.wait(1);
          const endingFundBalance = await fundMe.provider.getBalance(
            fundMe.address
          );

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );

          assert.equal(endingFundBalance.toNumber(), 0);
          assert.equal(
            endingDeployerBalance.toString(),
            startingDeployerBalance
              .add(startingFundMeBalance)
              .sub(transactionRec.gasUsed.mul(transactionRec.effectiveGasPrice))
              .toString()
          );
          // Assert
        });
      });
    })
  : console.log("skipping local tests...");
