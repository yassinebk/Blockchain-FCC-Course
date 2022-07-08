import { ethers, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding the contract 💲💲💲💲💲💲💲💲💲💲");
  const trasactionRes = await fundMe.fund({
    value: ethers.utils.parseEther("0.1"),
  });
  await trasactionRes.wait(1);
}

main()
  .then(() => console.log("script finished ✅✅✅✅✅✅✅✅✅"))
  .catch((error: any) => {
    console.log(error.message);
  });
