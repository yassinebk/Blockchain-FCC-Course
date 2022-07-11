import { ethers, network } from "hardhat";
import { BasicNFT, NFTMarketplace } from "../typechain";
import { moveBlocks } from "../utils/move-blocks";

const TOKEN_ID = 2;
async function buyItem() {
  const nftMarketplace: NFTMarketplace = await ethers.getContract(
    "NFTMarketplace"
  );
  const basicNFT: BasicNFT = await ethers.getContract("BasicNFT");
  const listing = await nftMarketplace.getListing(basicNFT.address, TOKEN_ID);
  const price = listing.price.toString();
  const tx = await nftMarketplace.buyItem(basicNFT.address, TOKEN_ID, {
    value: price,
  });
  await tx.wait(1);

  console.log(`Bought NFT ${TOKEN_ID} for ${price}`);

  if (network.config.chainId === 31337) {
    await moveBlocks(4, 3);
  }
}

buyItem()
  .then(() => console.log("Item Bought"))
  .catch((error) => console.error("Error: " + error.message));
