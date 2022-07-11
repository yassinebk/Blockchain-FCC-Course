const Moralis = require("moralis/node");
const contractAddresses = require("../constants/networkMapping.json");
require("dotenv").config();

console.log(contractAddresses);

let chainId = process.env.CHAIN_ID || 31337;
const contractAddress = contractAddresses[chainId].NFTMarketplace;

chainId = process.env.CHAIN_ID === "31337" ? "1337" : process.env.CHAIN_ID;

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const masterKey = process.env.MORALIS_MASTER_KEY;
async function setMoralisDB() {
  await Moralis.start({ appId, masterKey, serverUrl });
  console.log("Moralis Working with contract ", contractAddress);

  let itemListedOptions = {
    chainId,
    topic: "ItemListed(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemListed",
      type: "event",
    },
    tableName: "itemListed",
    address: contractAddress,
    limit: 50000,
    sync_historical: true,
  };

  let itemBoughtOptions = {
    chainId,
    topic: "ItemBought(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "NFTAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemBought",
      type: "event",
    },
    tableName: "itemBought",
    address: contractAddress,
    limit: 50000,
    sync_historical: true,
  };

  let itemCanceledOptions = {
    chainId,
    topic: "ItemCanceled(address,address,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "NFTAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ItemCanceled",
      type: "event",
    },
    tableName: "itemCanceled",
    address: contractAddress,
    limit: 50000,
    sync_historical: true,
  };

  let itemUpdatedOptions = {
    chainId,
    topic: "ItemUpdated(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "NFTAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newPrice",
          type: "uint256",
        },
      ],
      name: "ItemUpdated",
      type: "event",
    },
    tableName: "itemUpdated",
    address: contractAddress,
    sync_historical: true,
  };

  const listedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemListedOptions,
    {
      useMasterKey: true,
    }
  );
  const boughtResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemBoughtOptions,
    {
      useMasterKey: true,
    }
  );
  const canceledResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemCanceledOptions,
    {
      useMasterKey: true,
    }
  );

  const updatedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemUpdatedOptions,
    {
      useMasterKey: true,
    }
  );

  if (listedResponse && boughtResponse && canceledResponse && updatedResponse) {
    console.log(
      "updated successefully",
      listedResponse,
      updatedResponse,
      canceledResponse,
      boughtResponse
    );
  }
}

setMoralisDB().then(() => console.log("Moralis DB set"));
