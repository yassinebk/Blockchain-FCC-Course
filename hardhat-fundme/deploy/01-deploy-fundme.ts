import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deployments, network } from "hardhat";

import networkConfig, { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

async function DeployFunc(hre: HardhatRuntimeEnvironment) {
  const { deploy, log } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;

  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");

    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  }

  const args = [
    ethUsdPriceFeedAddress || networkConfig[chainId!].ethUsdPriceFeedAddress,
  ];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args, // feed address,,
    // log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
  });
  log(`FundMe deployed at ${fundMe.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }

  log("Deployed FundMe");
  log("----------------------------------------------------------------");
}

export default DeployFunc;
DeployFunc.tags = ["all", "mocks"];
