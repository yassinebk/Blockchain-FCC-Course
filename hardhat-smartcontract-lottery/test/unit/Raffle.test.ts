import { assert } from "chai";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { Raffle } from "../typechain";



!developmentChains.includes(network.name) ? describe.skip :
    describe('Raffle Unit Tests', async function () {
        let raffle: Raffle, VRFCoordinatorV2Mock;

        beforeEach(async () => {
            const { deployer } = await getNamedAccounts();
            await deployments.fixture("all")
            raffle = await ethers.getContract("Raffle");
            VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        })
        describe("constructor", async function () {
            it("initializes raffle correctly", async () => {
                const raffleState = await raffle.getRaffleState();
                assert.equal(raffleState, 0);
            })
        })

    })

