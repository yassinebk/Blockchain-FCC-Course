import { assert, expect } from "chai"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { NFTMarketplace, BasicNFT } from "../../typechain";


!developmentChains.includes(network.name) ?
    describe.skip :
    describe("NFT Marketplace Tests", () => {
        let NFTMarketplace_client: NFTMarketplace;
        let NFTMarketplace_deployer: NFTMarketplace;
        let BasicNFT: BasicNFT;
        let deployer: string;
        let player: string;
        const PRICE = ethers.utils.parseEther("0.1");

        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            player = (await getNamedAccounts()).player;
            await deployments.fixture("all");
            NFTMarketplace_deployer = await ethers.getContract("NFTMarketplace");
            NFTMarketplace_client = await NFTMarketplace_deployer.connect(player);
            BasicNFT = await ethers.getContract("BasicNFT");
            await BasicNFT.mintNft();
            await BasicNFT.approve(NFTMarketplace_client.address, 0);
        })

        it("lists and can be bought", async () => {
            await NFTMarketplace_deployer.listItem(BasicNFT.address, 0, PRICE);
            await NFTMarketplace_client.buyItem(BasicNFT.address, 0, { value: PRICE });
            const newOwner = await BasicNFT.ownerOf(0);
            const deployerProceeds = await NFTMarketplace_deployer.getProcceeds();
            assert(newOwner.toString(), player);
            assert(deployerProceeds.toString(), PRICE.toString());
        })
    })