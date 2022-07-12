import React from "react";

import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Form, useNotification } from "web3uikit";
import BasicNFT_ABI from "../constants/BasicNFT.json";
import NetworkMapping from "../constants/networkMapping.json";
import NFTMarketplaceABI from "../constants/NFTMarketplace.json";

interface SellFormProps {}

type NetworkConfigItem = {
  NFTMarketplace: string;
};

type NetworkConfigMap = {
  [chainId: string]: NetworkConfigItem;
};

export const SellForm: React.FC<SellFormProps> = () => {
  const { chainId } = useMoralis();
  const dispatch = useNotification();
  const router = useRouter();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";

  const marketplaceAddress = (NetworkMapping as NetworkConfigMap)[chainString]
    .NFTMarketplace;
  // @ts-ignore
  const { runContractFunction } = useWeb3Contract();

    async function handleApproveSuccess(
      nftAddress: string,
      tokenId: string,
      price: string
    ) {
      console.log("Ok... Now listing the item...");

      const options = {
        abi: NFTMarketplaceABI,
        contractAddress: marketplaceAddress,
        functionName: "listItem",
        params: {
          NFTAddress: nftAddress,
          tokenId: tokenId,
          price: price,
        },
      };

      await runContractFunction({
        params: options,
        onSuccess: () => handleListSuccess(),
        onError: (error) => console.log(error),
      });
    }

    async function handleListSuccess() {
      dispatch({
        type: "success",
        message: "NFT Listed successfully",
        title: "NFT Listed",
        position: "topR",
      });
    }

    async function approveAndList(data: any) {
      console.log("Approving...");
      const nftAddress = data.data[0].inputResult;
      const tokenId = data.data[1].inputResult;
      const price = ethers.utils
        .parseUnits(data.data[2].inputResult, "ether")
        .toString();

      const options = {
        abi: BasicNFT_ABI,
        contractAddress: data.data[0].inputResult,
        functionName: "approve",
        params: {
          to: marketplaceAddress,
          tokenId: data.data[1].inputResult,
        },
      };

      await runContractFunction({
        params: options,
        onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
        onError: (error) => {
          console.log(error);
        },
      });
    }

  // async function approveAndList(data) {
  //   const NFTAddress = data.data[0].inputResult;
  //   const tokenId = data.data[1].inputResult;
  //   const price = ethers.utils
  //     .parseUnits(data.data[2].inputResult, "ether")
  //     .toString();
  //   console.log(data, price);

  //   const approveOptions = {
  //     abi: BasicNFT_ABI,
  //     contractAddress: NFTAddress,
  //     functionName: "approve",
  //     params: {
  //       to: marketplaceAddress,
  //       tokenId,
  //     },
  //   };
  //   const handleApproveSuccess = async (tx) => {
  //     console.log("approved");

  //     const listOptions = {
  //       abi: NFTMarketplaceABI,
  //       contractAddress: marketplaceAddress,
  //       functionName: "listItem",
  //       params: {
  //         NFTAddress,
  //         tokenId,
  //         price,
  //       },
  //     };
  //     await tx.wait(1);
  //     const handleListSuccess = async (tx) => {
  //       await tx.wait(1);
  //       dispatch({
  //         type: "success",
  //         position: "topR",
  //         message: "Successfully listed item",
  //       });
  //     };
  //     await runContractFunction({
  //       params: listOptions,
  //       onError(error) {
  //         dispatch({
  //           type: "error",
  //           position: "topR",
  //           message: `Failure listing item ${error.message}`,
  //         });
  //       },
  //       onSuccess: handleListSuccess,
  //     });
  //   };

  //   await runContractFunction({
  //     params: approveOptions,
  //     onSuccess: handleApproveSuccess,
  //   });
  // }

  return (
    <Form
      onSubmit={approveAndList}
      data={[
        {
          name: "NFT Address",
          type: "text",
          inputWidth: "100%",
          value: "0x0000",
        },
        {
          name: "Token ID",
          type: "number",
          value: "0",
          inputWidth: "100%",
        },
        {
          name: "Price (in ETH)",
          type: "number",
          value: "",
          key: "price",
          inputWidth: "100%",
        },
      ]}
      title={"List your NFT"}
      id={"list-nft"}
    ></Form>
  );
};

export default SellForm;
