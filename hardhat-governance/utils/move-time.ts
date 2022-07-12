import { network } from "hardhat";

export async function moveTime(amount: number) {
  await network.provider.send("evm_increaseTime", [amount]);
  console.log("Move time forward " + amount + " seconds");
}
