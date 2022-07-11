import { ethers, network } from "hardhat";
import { NFTMarketplace } from "../typechain";
import { moveBlocks } from "../utils/move-blocks";

const TOKEN_ID = 1;
async function cancelItem() {
  const NFTMarketplace: NFTMarketplace = await ethers.getContract(
    "NFTMarketplace"
  );
  const basicNFT = await ethers.getContract("BasicNFT");
  const tx = await NFTMarketplace.cancelListing(basicNFT.address, TOKEN_ID);
  await tx.wait(1);
  console.log("NFT Canceled");

  if (network.config.chainId?.toString() === "31337") {
    await moveBlocks(2, 3);
  }
}


cancelItem().then(()=>console.log("Item Canceled")).catch((error)=>console.error("Error: " + error.message));