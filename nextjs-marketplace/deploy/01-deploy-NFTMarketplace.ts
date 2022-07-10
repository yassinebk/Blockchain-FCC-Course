import { network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";




const DeployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {

    const { deployments, getNamedAccounts } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const args: any = [];

    const NFTMarketplace = await deploy("NFTMarketplace", {
        from: deployer, args,
        log: true,
        waitConfirmations: 1
    });

    if (!developmentChains.includes(network.name)) {
        await verify(NFTMarketplace.address, args);
    }

    log("Deployed !", NFTMarketplace.address);

}

export default DeployFunc;

DeployFunc.tags = ["main", "all"]