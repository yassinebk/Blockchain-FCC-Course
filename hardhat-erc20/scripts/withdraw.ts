import { ethers, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Withdrawing from the contract");
  const trasactionRes = await fundMe.withdraw();
  await trasactionRes.wait(1);
}

main()
  .then(() => console.log("script finished ✅✅✅✅✅✅✅"))
  .catch((error: any) => {
    console.log(error.message);
  });
