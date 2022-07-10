import { BigNumber } from "ethers";
import { network, ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import networkConfig, { developmentChains } from "../helper-hardhat-config";
import { VRFCoordinatorV2Interface } from "../typechain-types";
import { token } from "../typechain-types/@openzeppelin/contracts";
import { storeImages, storeTokenURIMetadata } from "../utils/upload-to-pinata";
import { verify } from "../utils/verify";


const imagesLocation = "./images/randomNFT";   // relative to the project root


const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100
        }
    ]
}

let tokenURIs: string[] = [];

const DeployNFT: DeployFunction = async ({ getNamedAccounts, deployments }) => {

    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    log("-------------------");
    const chainId = network.config.chainId!;
    log("chainId", chainId);
    console.log("gasLane", networkConfig[chainId].gasLane);

    if (process.env.UPLOAD_TO_PINATA === "true") {

        tokenURIs = await handleTokenURIs();
        log(tokenURIs)
    }

    let VRFCoordinatorV2MockAddress, subscriptionId;

    if (developmentChains.includes(network.name)) {

        const VRFCoordinatorV2Mock: VRFCoordinatorV2Interface & { fundSubscription: (arg1: string, arg2: BigNumber) => Promise<boolean> } = await ethers.getContract("VRFCoordinatorV2Mock");
        VRFCoordinatorV2MockAddress = VRFCoordinatorV2Mock.address;
        const tx = await VRFCoordinatorV2Mock.createSubscription();
        const txReceipt = await tx.wait(1);

        if (txReceipt && txReceipt.events && txReceipt.events.length > 0 && txReceipt.events[0].args)
            subscriptionId = txReceipt.events[0].args.subId;
        else throw new Error("Failed to create subscription");

        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, ethers.utils.parseEther("1"));

    }
    else {
        VRFCoordinatorV2MockAddress = networkConfig[chainId].vrfCoordinatorV2;
        subscriptionId = networkConfig[chainId].subscriptionId;
    }

    tokenURIs = [
        'ipfs://QmRiz6hh4FR379J4hxcpVRyZRSocUNJR1WF7g27mov9jZP',
        'ipfs://QmU4JJ1xdft7s9AGNVJ43N19GN99zxU8B9LpfD77rPrU19',
        'ipfs://QmUsq2KSVfWeLJiUHZpfMbZthpbJ3MNSsPVtSb3ABZ1Zpu'
    ]

    const args: any = [
        VRFCoordinatorV2MockAddress,
        subscriptionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callbackGasLimit,
        tokenURIs,
        networkConfig[chainId].mintFee,
    ];

    const RandomIPFSNFTContract = await deploy("RandomIPFSNFT", {
        from: deployer,
        log: true,
        waitConfirmations: 1,
        args,
    })

    if (!developmentChains.includes(network.name)) {
        await verify(RandomIPFSNFTContract.address, args)
    }

}


async function handleTokenURIs() {
    let tokenURIs: any = []
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation);
    for (let imageUploadResponseIndex in imageUploadResponses) {
        let tokenURIMetadata = { ...metadataTemplate };
        tokenURIMetadata.name = files[imageUploadResponseIndex].replace("png", "");
        tokenURIMetadata.description = `An adorable ${tokenURIMetadata.name} pup !`;
        tokenURIMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex]}`;
        console.log(`Uploading the metadata`);
        const metadataUploadResponse = await storeTokenURIMetadata(tokenURIMetadata);
        tokenURIs.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
    }
    console.log("Token URIs uploaded");


    return tokenURIs;

};


export default DeployNFT;
DeployNFT.tags = ["all", "basic-nft"]