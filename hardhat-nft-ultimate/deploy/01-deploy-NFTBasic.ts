import { network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";



const DeployNFT: DeployFunction = async ({ getNamedAccounts, deployments }) => {

    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    log("-------------------")
    const args: any = [];

    const BasicNFTContract = await deploy("BasicNFT", {
        from: deployer,
        log: true,
        waitConfirmations: 1
    })

    if (!developmentChains.includes(network.name)) {
        await verify(BasicNFTContract.address, args)
    }

}

export default DeployNFT;
DeployNFT.tags=["all","basic-nft"]