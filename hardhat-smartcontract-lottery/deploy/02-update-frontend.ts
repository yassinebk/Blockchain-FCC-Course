import fs from "fs";
import { ethers, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";


const FRONT_END_ADDRESSES_FILE = "../hardhat-smartcontract-lottery-front/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../hardhat-smartcontract-lottery-front/constants/contractAbi.json";


const DeployFunc = async (hre: HardhatRuntimeEnvironment) => {

    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating frontend");
        await updateContractAdresses();
        await updateAbi();
        console.log("Done updating frontend ✅✅✅");

    }

}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle");
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json));

    console.log("here 22");
}

const updateContractAdresses = async () => {
    const raffle = await ethers.getContract("Raffle");
    const chainId = network.config.chainId?.toString();


    let currentAddresses: any = {}
    if (fs.existsSync(FRONT_END_ADDRESSES_FILE))
        currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"));

    console.log(currentAddresses);

    if (chainId! in currentAddresses) {
        if (!currentAddresses[chainId!].includes[raffle.address])
            currentAddresses[chainId!].push(raffle.address);
    }
    else {
        currentAddresses[chainId!] = [raffle.address];
    }


    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));

    console.log("here");


}


export default DeployFunc;

DeployFunc.tags = ["all", "frontend"]