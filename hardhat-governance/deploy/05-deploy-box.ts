import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import { Box } from "../typechain";
import { verify } from "../utils/verify";

const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  console.log("Deploying box...");

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  const timeLock = await ethers.getContract("TimeLock");
  const boxContract: Box = await ethers.getContract("Box", deployer);

  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);

  if (!developmentChains.includes(network.name)) {
    verify(box.address, []);
  }
};

export default deployBox;
