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
  if (mintRes && mintRes.events && mintRes.events[0].args)
    tokenId = mintRes.events[0].args.tokenId.toNumber();
  else {
    throw new Error("Minting failed");
  }

  const approvalTx = await basicNFT.approve(
    NFTMarketplace_contract.address,
    tokenId
  );
  await approvalTx.wait(1);

  await NFTMarketplace_contract.listItem(
    basicNFT.address,
    tokenId,
    ethers.utils.parseEther("1").toString()
  );

  const listedItem = await NFTMarketplace_contract.getListing(
    basicNFT.address,
    0
  );
  if (!listedItem) throw new Error("Item not listed");

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
