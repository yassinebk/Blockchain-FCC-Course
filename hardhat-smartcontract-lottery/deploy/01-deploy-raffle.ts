import { network, ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import networkConfig, { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";
import { VRFCoordinatorV2Mock } from "../typechain"

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30");
const DeployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, ethers } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    let VRFCoordinatorV2Address, subscriptionId;

    if (developmentChains.includes(network.name)) {

        const VRFCoordinatorV2Mock: VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");

        VRFCoordinatorV2Address = VRFCoordinatorV2Mock.address;

        // console.log(VRFCoordinatorV2Mock)

        const transactionResponse = await VRFCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);

        subscriptionId = transactionReceipt.events[0].args.subId;
        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT);

    } else {

        VRFCoordinatorV2Address =
            networkConfig[network.config.chainId as number].VRFCoordinatorV2;
        subscriptionId = networkConfig[network.config.chainId as number].subscriptionId;
    }
    log("Deploying....");

    const entranceFee = networkConfig[network.config.chainId!].callbackGasLimit;
    const gasLane = networkConfig[network.config.chainId!].gasLane;
    const callbackGasLimit = networkConfig[network.config.chainId!].callbackGasLimit;
    const interval = networkConfig[network.config.chainId!].interval;

    const args = [
        VRFCoordinatorV2Address,
        entranceFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        interval
    ];
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1,
    });
    console.log('here');

    if (!developmentChains.includes(network.name)) {
        verify(raffle.address, args)
    }
    log("Raffle address deployed at :", raffle.address);
};

export default DeployFunc;

DeployFunc.tags = ["all", "raffle"];
