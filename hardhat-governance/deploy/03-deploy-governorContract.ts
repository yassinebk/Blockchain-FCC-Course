import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";
import { VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE } from "../constants";

const deployGovernanceContract: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const governanceToken = await ethers.getContract("GovernanceToken");
  const timeLock = await ethers.getContract("TimeLock");

  console.log("Deploying governance contract...");

  const governanceContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governanceToken.address,
      timeLock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE,
    ],
    log: true,
    waitConfirmations: 1,
  });

  console.log(`Governance token deployed at ${governanceContract.address}`);

  if (!developmentChains.includes(network.name)) {
    verify(governanceContract.address, []);
  }
};
export default deployGovernanceContract;
