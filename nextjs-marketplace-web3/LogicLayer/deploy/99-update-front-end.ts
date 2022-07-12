import { ethers, network } from "hardhat";
import { NFTMarketplace } from "../typechain";
import fs from "fs";
import { setFlagsFromString } from "v8";

const frontEndABIFilesLocation =
  "/workspaces/Blockchain-FCC-Course/nextjs-marketplace-web3/front-moralis/constants/";
const frontEndContractsFile =
  "/workspaces/Blockchain-FCC-Course/nextjs-marketplace-web3/front-moralis/constants/networkMapping.json";
const UpdateFront = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating front end");
    await updateContractAddresses();
    await updateABI();
  }
};

console.log(__dirname, __filename);

async function updateContractAddresses() {
  const NFTMarketplace: NFTMarketplace = await ethers.getContract(
    "NFTMarketplace"
  );
  const chainId = network.config.chainId!.toString();
  const contractAddress = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  );
  console.log("here", contractAddress);
  if (chainId in contractAddress) {
    if (contractAddress[chainId]["NFTMarketplace"] !== NFTMarketplace.address) {
      contractAddress[chainId]["NFTMarketplace"] = NFTMarketplace.address;
    }
  } else {
    contractAddress[chainId] = { NFTMarketplace: NFTMarketplace.address };
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddress));
}

async function updateABI() {
  const NFTMarketplace = await ethers.getContract("NFTMarketplace");
  fs.writeFileSync(
    `${frontEndABIFilesLocation}NFTMarketplace.json`,
    NFTMarketplace.interface.format(ethers.utils.FormatTypes.json)
  );
  const BasicNFT = await ethers.getContract("BasicNFT");
  fs.writeFileSync(
    `${frontEndABIFilesLocation}BasicNFT.json`,
    BasicNFT.interface.format(ethers.utils.FormatTypes.json)
  );
}

export default UpdateFront;
UpdateFront.tags = ["all", "front"];
