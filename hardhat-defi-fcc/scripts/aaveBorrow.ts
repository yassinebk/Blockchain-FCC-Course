import { BigNumber } from "ethers";
import { ethers, getNamedAccounts } from "hardhat";
import { AggregatorV3Interface, ILendingPool, ILendingPoolAddressesProvider } from "../typechain-types";
import { getWeth } from "./getWeth";

const AMOUNT = ethers.utils.parseEther("0.02");

async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();
    const lendingPool = await getLendingPool(deployer);

    // Approving Weth into ower allowances (who can we trade with), we need to use Weth as the token that the Avee protocol accepts.
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)

    // Depositing
    console.log("Depositing ...");
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
    console.log("deposited !");

    // Borrowing: 
    /* 1. How much can we borrow ? We access our account's data
    * 2. Start the borrowing process
   *
   * */
    let { availableBorrowsETH, totalDebtETH } = await getBorrowedUserData(lendingPool, deployer);
    const daiPrice = await getDaiPrice();
    const amountDaiToBorrow: number = (availableBorrowsETH.toString() as unknown as number) * (1 / daiPrice.toNumber()) * 0.95;

    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString());
    console.log(amountDaiToBorrowWei.toString());

    const DaiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

    await borrowDai(DaiTokenAddress, lendingPool, amountDaiToBorrowWei, deployer);
    await getBorrowedUserData(lendingPool, deployer);
    await repay(amountDaiToBorrowWei, DaiTokenAddress, lendingPool, deployer);
    await getBorrowedUserData(lendingPool, deployer);

}

async function repay(amount: BigNumber, daiTokenAddress: string, lendingPool: ILendingPool, account: string) {

    await approveErc20(daiTokenAddress, lendingPool.address, amount, account);
    const repayTx = await lendingPool.repay(daiTokenAddress, amount, 1, account);
    await repayTx.wait(1);
    await console.log("Debt repayed");

}

async function borrowDai(daiAddress: string, lendingPool: ILendingPool, amountDaiToBorrow: BigNumber, account: string) {

    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrow, 1, 0, account);
    await borrowTx.wait(1);

    console.log("Loan taken !")
}


async function getDaiPrice() {

    const daiEthPriceFeed: AggregatorV3Interface = await ethers.getContractAt("AggregatorV3Interface", "0x773616e4d11a78f511299002da57a0a94577f1f4")
    const price = (await daiEthPriceFeed.latestRoundData())[1];
    console.log(`The DAI/ETH price is ${price.toString()}`);

    return price;
}

async function getBorrowedUserData(lendingPool: ILendingPool, account: string) {

    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } = await lendingPool.getUserAccountData(account);
    console.log(`You have ${totalCollateralETH} worth of ETH deposited`);
    console.log(`You have ${totalDebtETH} worth of ETH borrowed`);
    console.log(`You have ${availableBorrowsETH} worth of ETH to borrow`);

    return { availableBorrowsETH, totalDebtETH };


}
async function approveErc20(
    wethTokenAddress: string,
    spenderAddress: string,
    amount: BigNumber,
    account: string
) {

    const erc20 = await ethers.getContractAt("IERC20", wethTokenAddress, account);
    const tx = await erc20.approve(spenderAddress, amount);
    await tx.wait(1);
    console.log("Approved");


}

async function getLendingPool(
    account: string
) {

    const lendingPoolAddressProvider: ILendingPoolAddressesProvider = await ethers
        .getContractAt("ILendingPoolAddressesProvider", "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", account);

    const lendingPoolAddress: string = await lendingPoolAddressProvider.getLendingPool();
    const lendingPool: ILendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account);

    return lendingPool;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error.message);
    });

