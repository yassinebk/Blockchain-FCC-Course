import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTMarketplaceABI from "../constants/NFTMarketplace.json";
import NetworkMapping from "../constants/networkMapping.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Accordion, Button, CryptoLogos, useNotification } from "web3uikit";

interface ProcceedsWithdrawalProps {}

type NetworkConfigItem = {
  NFTMarketplace: string;
};

type NetworkConfigMap = {
  [chainId: string]: NetworkConfigItem;
};

export const ProcceedsWithdrawal: React.FC<ProcceedsWithdrawalProps> = ({}) => {
  const { chainId, isWeb3Enabled } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const [procceeds, setProcceeds] = useState("");

  const dipatch = useNotification();

  const marketplaceAddress = (NetworkMapping as NetworkConfigMap)[chainString]
    .NFTMarketplace;
  const { runContractFunction: getProcceeds } = useWeb3Contract({
    abi: NFTMarketplaceABI,
    contractAddress: marketplaceAddress,
    functionName: "getProcceeds",
  });

  const { runContractFunction: withdraw } = useWeb3Contract({
    abi: NFTMarketplaceABI,
    contractAddress: marketplaceAddress,
    functionName: "withdrawProceeds",
  });

  const withdrawFunds = async () => {
    function withdrawOnError(error) {
      console.log(error);
      dipatch({
        position: "topR",
        type: "error",
        message: "Error withdrawing procceeds",
      });
    }
    async function withdrawOnSuccess(tx) {
      await tx.wait(1);

      dipatch({
        position: "topR",
        type: "success",
        message: "withdrawing done",
      });
      setProcceeds("0");
    }
    withdraw({
      onSuccess: withdrawOnSuccess,
      onError: withdrawOnError,
    });
  };

  useEffect(() => {
    if (isWeb3Enabled)
      getProcceeds({
        onSuccess(results) {
          setProcceeds(ethers.utils.formatEther(results.toString()).toString());
        },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeb3Enabled]);
  return (
    <div>
      <h1 className="text-3xl font-bold">Withdraw proceedings</h1>
      <div className="flex items-center ">
        <p className="text-xl text-blue-500">You have {procceeds} ETH </p>
        <div className="w-4" />
        <CryptoLogos chain="ethereum" />
      </div>
      <div className="h-4" />
      <Button
        icon="check"
        iconLayout="trailing"
        id="test-button-outline-icon-after"
        onClick={withdrawFunds}
        text="Withdraw funs"
        theme="colored"
        color="yellow"
        type="button"
        size="large"
      />
    </div>
  );
};

export default ProcceedsWithdrawal;
