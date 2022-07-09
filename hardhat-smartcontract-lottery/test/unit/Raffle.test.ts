import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import networkConfig, { developmentChains } from "../../helper-hardhat-config";
import { Raffle } from "../typechain";



!developmentChains.includes(network.name) ? describe.skip :
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
            await deployments.fixture("all")
            raffle = await ethers.getContract("Raffle");
            entranceFee = await raffle.getEntranceFee()
            VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
            interval = await raffle.getInterval();
        })
        describe("constructor", async function () {
            it("initializes raffle correctly", async () => {
                const raffleState = await raffle.getRaffleState();
                const interval = await raffle.getInterval();
                assert.equal(raffleState.toString(), "0");
                assert.equal(interval.toString(), networkConfig[chainId].interval);
            })

        })

        describe("enterRaffle", async function () {
            it("Reverts when you don't pay enough", async () => {
                await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughFunds");
            }).timeout(10000);

            it("records players when they enter", async () => {
                await raffle.enterRaffle({ value: entranceFee });
                const playerFromContract = await raffle.getPlayer(0);
                assert.equal(playerFromContract, deployer);
            })

            it("emits event on enter", async function () {
                await expect(raffle.enterRaffle({ value: entranceFee })).to.emit(raffle, "RaffleEnter");

            })

            it("it doesnt' allow entrance when raffle is calculating", async () => {
                await raffle.enterRaffle({ value: entranceFee });
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                await network.provider.send("evm_mine", []);

                // pretend to be a chainLink keeper
                await raffle.performUpkeep([]);
                await expect(raffle.enterRaffle({ value: entranceFee })).to.be.revertedWith("Raffle__NotOpen");
            })

        })

        describe("checkUpKeep", async () => {
            it("it returns false if people haven't sent any ETH", async () => {
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                await network.provider.send("evm_mine", [])
                await raffle.checkUpkeep([]);
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
                assert(!upkeepNeeded)
            })

            it("returns false if raffle isn't open", async () => {
                await raffle.enterRaffle({ value: entranceFee });
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                await network.provider.send("evm_mine", [])
                await raffle.performUpkeep([])
                const raffleState = await raffle.getRaffleState();
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
                assert.equal(upkeepNeeded, false);
                assert.equal(raffleState.toString(), "1");
            })
            it("returns false if enough time hasn't passed", async () => {
                await raffle.enterRaffle({ value: entranceFee })
                await network.provider.send("evm_increaseTime", [interval.toNumber() - 1])
                await network.provider.request({ method: "evm_mine", params: [] })
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
                assert(!upkeepNeeded)
            })
            it("returns true if enough time has passed, has players, eth, and is open", async () => {
                await raffle.enterRaffle({ value: entranceFee })
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                await network.provider.request({ method: "evm_mine", params: [] })
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
                assert(upkeepNeeded)
            })
        })

        describe("performUpkeep", () => {
            it("it can only run if checkupkeep is true", async () => {
                await raffle.enterRaffle({ value: entranceFee });
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                await network.provider.send("evm_mine", [])
                const tx = await raffle.performUpkeep([]);
                assert(tx);
            })

            it("revert when checkupkeep is false", async () => {
                await expect(raffle.performUpkeep([])).to.be.revertedWith("Raffle__UpkeepNotNeeded");
            })
            it("updates the raffle state, emits an event and calls the vrf coordinator", async () => {
                await raffle.enterRaffle({ value: entranceFee });
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                await network.provider.send("evm_mine", [])
                const txResponse = await raffle.performUpkeep([]);
                const txReceipt = await txResponse.wait(1);
                const raffleState = await raffle.getRaffleState();
                assert(txReceipt);
                assert(txReceipt.events);
                const requestId = txReceipt!.events[1]!.args!.requestId;
                assert(requestId.toNumber() > 0);
                assert(raffleState.toString() === "1");
            })

        })
        describe("fulfill Random Words", async () => {
            beforeEach(async () => {
                await raffle.enterRaffle({ value: entranceFee });
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                await network.provider.send("evm_mine", []);
            })

            it("can only be called after performUpKeep", async () => {
                await expect(
                    VRFCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)
                ).to.be.revertedWith("nonexistent request");

                await expect(VRFCoordinatorV2Mock
                    .fulfillRandomWords(1, raffle.address))
                    .to.be.revertedWith("nonexistent request");
            })

            it("picks a winner, rests the lottery and sends money", async () => {
                const accounts = await ethers.getSigners();
                const additionalEntrants = 3;
                const startingAccountIndex = 1;

                for (let i = startingAccountIndex; i < additionalEntrants + startingAccountIndex; i++) {
                    const accountConnectRaffle = raffle.connect(accounts[i]);
                    await accountConnectRaffle.enterRaffle({ value: entranceFee });

                }


                const startingTimeStamp = await raffle.getLastTimeStamp();

                // PerformUpKeep
                // fulfillRandomWords ( mock )
                // we will have to wait the fullfillRandomWords to be called
                await new Promise(async (resolve, reject) => {
                    let raffleBalance;
                    let winnerStartingBalance: BigNumber;
                    raffle.once("WinnerPicked", async () => {

                        try {
                            const recentWinner = await raffle.getRecentWinner();

                            const raffleState = await raffle.getRaffleState()
                            const endingtimeStamp = await raffle.getLastTimeStamp();
                            const numPlayers = await raffle.getNumberOfPlayers();
                            const winnerEndingBalance = await accounts[1].getBalance();

                            assert.equal(winnerEndingBalance.toString(), winnerStartingBalance.add(entranceFee.mul(additionalEntrants + 1)).toString());
                            assert.equal(numPlayers.toString(), "0");
                            assert.equal(raffleState.toString(), "0");
                            assert(endingtimeStamp > startingTimeStamp);
                        }
                        catch (error) {
                            reject(error)
                        }
                        resolve(true);
                    })
                    const tx = await raffle.performUpkeep([]);
                    const txReceipt = await tx.wait(1);
                    assert(txReceipt)
                    assert(txReceipt.events && txReceipt.events[1].args)
                    winnerStartingBalance = await accounts[1].getBalance();
                    raffleBalance = await raffle.provider.getBalance(raffle.address);

                    await VRFCoordinatorV2Mock
                        .fulfillRandomWords(
                            txReceipt!.events[1]!.args.requestId,
                            raffle.address
                        );
                })

            })



        })


    });

