import { network } from "hardhat";

async function moveBlocks(amount: number, sleepAmount = 0) {
  console.log("Moving blocks...");
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }

  if (sleepAmount > 0) {
    console.log("Sleeping for " + sleepAmount + " seconds...");
    await new Promise((resolve) => setTimeout(resolve, sleepAmount * 1000));
  }
}


export {moveBlocks}