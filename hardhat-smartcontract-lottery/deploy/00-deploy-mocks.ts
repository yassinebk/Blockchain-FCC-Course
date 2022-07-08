import { network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { developmentChains } from "../helper-hardhat-config";

const BASE_FEE = "250000000000000000"; // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9; // link per gas, is this the gas lane? // 0.000000001 LINK per gas

const DeployFunc: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  const args = [BASE_FEE, GAS_PRICE_LINK];
  if (developmentChains.includes(network.name)) {
    log("Local Network Detected ! Deploying mocks....");
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args,
    });

    log("Mocks Deployed!");
    log("-------------------------------------------------------------------");
  }
};

export default DeployFunc;

DeployFunc.tags = ["all", "mocks"];
