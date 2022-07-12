import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";
import { MIN_DELAY } from "../constants";

const deployTimeLock: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  console.log("Deploying time lock...");

  const governanceToken = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], []],
    log: true,
    waitConfirmations: 1,
  });

  console.log(`Governance token deployed at ${governanceToken.address}`);

  if (!developmentChains.includes(network.name)) {
    verify(governanceToken.address, []);
  }
};

export default deployTimeLock;
