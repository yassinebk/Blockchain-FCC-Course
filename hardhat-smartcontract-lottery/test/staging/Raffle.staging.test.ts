import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, getNamedAccounts, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { Raffle } from "../typechain";



developmentChains.includes(network.name) ? describe.skip :
    describe('Raffle Unit Tests', async function () {
        let raffle: Raffle, VRFCoordinatorV2Mock: any;
        let deployer: string;
        let entranceFee: BigNumber;
        let chainId: number;
        let interval: BigNumber;

        beforeEach(async () => {
            const { deployer: signer } = await getNamedAccounts();
            deployer = signer;
            chainId = network.config.chainId!;
            raffle = await ethers.getContract("Raffle");
            console.log(raffle.address);
            
            entranceFee = await raffle.getEntranceFee()
        })

        describe("fulfillRandomWords", async function () {
            it("works with live ChainLink keepers", async () => {

                const startingTimeStamp = await raffle.getLastTimeStamp();
                const accounts = await ethers.getSigners();

                await new Promise(async (resolve, reject) => {
                    raffle.once("WinnerPicked", async () => {
                        console.log("WinnerPicked event fired !");
                        try {

                            const recentWinner = await raffle.getRecentWinner();
                            const raffleState = await raffle.getRaffleState();
                            const winnerEndingBalance = await accounts[0].getBalance();
                            const endingtimeStamp = await raffle.getLastTimeStamp();

                            await expect(raffle.getPlayer(0)).to.be.reverted;
                            assert.equal(recentWinner.toString(), accounts[0].address);
                            assert.equal(
                                winnerEndingBalance.toString(),
                                winnerStartingBalance.add(entranceFee).toString()
                            )
                            assert(raffleState,"0");
                            assert(endingtimeStamp > startingTimeStamp);
                            resolve(true);

                        }
                        catch (error) {
                            reject(error);
                        }
                    })
                    // entering the raffle
                    await raffle.enterRaffle({ value: entranceFee });
                    const interval=await raffle.getInterval();
                    console.log(interval.toString());
                    const winnerStartingBalance = await accounts[0].getBalance();


                })

            })
        });

    });