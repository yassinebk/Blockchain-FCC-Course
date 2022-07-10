
import { BasicNFT } from "../typechain-types"
import { assert, expect } from 'chai';

import { deployments, ethers, getNamedAccounts } from "hardhat";

describe("Basic NFT", () => {
    let BasicNFT: BasicNFT;
    let deployer: string;

    beforeEach(async () => {
        await deployments.fixture("all")
        deployer = (await getNamedAccounts()).deployer;
        BasicNFT = await ethers.getContract("BasicNFT", deployer);
    });

    describe("constructor", () => {
        it("initializes the contract", async () => {
            const contract = await BasicNFT.deployed();
            const address = contract.address;
            assert.ok(address);
        });

        it("initializes token_counter to 0", async () => {
            const token_counter = await BasicNFT.getTokenCounter();
            assert.equal(token_counter.toNumber(), 0);
        })
    })

    describe("Token URI", async () => {
        it("token URI is correct", async () => {
            const token_uri = await BasicNFT.TOKEN_URI();
            assert.equal(token_uri, "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json");
        })
    })

    describe("Minting an NFT", async () => {
        it("increments counter", async () => {
            const before_token_counter = await BasicNFT.getTokenCounter();
            const tx = await BasicNFT.mintNft()
            const res = await tx.wait(1)


            const after_token_counter = await BasicNFT.getTokenCounter();

            assert.equal(after_token_counter.toNumber(), before_token_counter.toNumber() + 1);

        })

    })


});
