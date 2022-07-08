import { ethers } from "hardhat";

export const developmentChains = ["hardhat", "localhost"];

export const DECIMALS = 8;
export const INITIAL_ANSWER = 200000000000;
const networkConfig: any = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeedAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    VRFCoordinatorV2: "0x6168499c0cffcacd319c818142124b7a15e857abA",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    subscriptionId: "0x0",
    callbackGasLimit: "500000",
    interval: "30"
  },
  default: {
    name: "hardhat",
    keepersUpdateInterval: "30",
  },
  31337: {
    interval: "30",
    name: "localhost",
    subscriptionId: "588",
    gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: ethers.utils.parseEther("0.1"), // 0.1 ETH
    callbackGasLimit: "500000", // 500,000 gas
  },
};

export default networkConfig;
