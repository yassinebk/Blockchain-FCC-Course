import { ethers, network } from "hardhat";
import { BasicNFT, NFTMarketplace } from "../typechain";
import { moveBlocks } from "../utils/move-blocks";

async function mintAndList() {
  const NFTMarketplace_contract: NFTMarketplace = await ethers.getContract(
    "NFTMarketplace"
  );
  const basicNFT: BasicNFT = await ethers.getContract("BasicNFT");
  const basicNFT_contract = await basicNFT.connect(ethers.getDefaultProvider());
  const mintTx = await basicNFT.mintNft();
  const mintRes = await mintTx.wait(1);
  let tokenId;
  if (mintRes && mintRes.events && mintRes.events[0].args) {
    tokenId = mintRes.events[0].args.tokenId.toNumber();

    console.log(`successfulyl minted ${tokenId} from ${basicNFT.address} by `);
  } else {
    throw new Error("Minting failed");
  }

  if (network.config.chainId === 31337) {
    await moveBlocks(2, 3);
  }
}

mintAndList()
  .then(() => {
    console.log("Mint and list successful");
  })
  .catch((error) => {
    console.error("Error: " + error.message);
  });
