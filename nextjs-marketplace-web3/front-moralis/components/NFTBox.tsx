import { ethers } from "ethers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Card, useNotification } from "web3uikit";
import BasicNFTABI from "../constants/BasicNFT.json";
import NFTMarketplaceABI from "../constants/NFTMarketplace.json";
import UpdateListingModal from "./UpdateListingModal";

const truncateStr = (fullStr: string, strLen: number) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
};

interface NFTBoxProps {
  price: string;
  NFTAddress: string;
  tokenId: string;
  marketplaceAddress: string;
  seller: string;
}

export const NFTBox: React.FC<NFTBoxProps> = ({
  price,
  NFTAddress,
  tokenId,
  marketplaceAddress,
  seller,
}) => {
  const { isWeb3Enabled, account } = useMoralis();
  const [tokenMetadata, setTokenMetadata] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  const dispatch = useNotification();

  const { runContractFunction: getImageURI, isFetching: isImageURIFetching } =
    useWeb3Contract({
      abi: BasicNFTABI,
      contractAddress: NFTAddress,
      functionName: "tokenURI",
      params: {
        tokenId,
      },
    });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: NFTMarketplaceABI,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    params: {
      NFTAddress,
      tokenId,
    },
    msgValue: price,
  });

  async function updateUI() {
    getImageURI({
      async onSuccess(results) {
        let stringResults = results as string;
        let finalOutput;
        console.log(results);
        if (stringResults) {
          const httpsUrl = stringResults.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          );
          const tokenURIResponse = await (await fetch(httpsUrl)).json();
          console.log(finalOutput);
          tokenURIResponse.image.replace("ipfs://", "https://ipfs.io/ipfs/");

          console.log(tokenURIResponse);
          setTokenMetadata(tokenURIResponse);
        }
      },
    });
  }

  const onBuySuccessHandler = async (tx) => {
    await tx.wait(1);
    dispatch({
      position: "topR",
      type: "success",
      message: "Success buying item",
      title: `Buying $${tokenId} from ${seller.slice(0, 8)}`,
    });
  };
  const onClick = () => {
    if (isOwnedByYou) setVisible(true);
    else
      buyItem({
        onSuccess: onBuySuccessHandler,
        onError: (error) => {
          dispatch({
            position: "topR",
            type: "error",
            message: "Failure buying item",
            title: `Buying $${tokenId} from ${seller.slice(0, 8)}`,
          });
        },
      });
  };
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const isOwnedByYou = seller === account || seller === undefined;
  const formattedSellerAddress = isOwnedByYou
    ? "You"
    : truncateStr(seller || "", 10);
  return (
    <div>
      {tokenMetadata ? (
        <>
          <UpdateListingModal
            price={price}
            marketplaceAddress={marketplaceAddress}
            onClose={() => setVisible(false)}
            isVisible={visible}
            tokenId={tokenId}
            NFTAddress={NFTAddress}
          />
          <Card
            onClick={onClick}
            title={tokenMetadata.name}
            description={tokenMetadata.description}
          >
            <div className="flex items-center ">
              <div className="mr-auto w-fit px-4">
                <p className="text-md font-black text-sky-800">#{tokenId}</p>
              </div>

              <div className=" w-fit px-4">
                <span className="text-sm font-bold text-blue-400">
                  Owned by
                </span>
                <span className="text-sm font-italic text-cyan-500">
                  {" "}
                  #{formattedSellerAddress}
                </span>
              </div>
            </div>
            <Image
              loader={() => tokenMetadata.image}
              src={tokenMetadata.image}
              width={200}
              height={200}
              alt={tokenMetadata.name}
            />
            <div className="font-bold text-lg text-amber-600 mx-auto w-fit mt-4 mb-2">
              {ethers.utils.formatUnits(price, "ether")} ETH
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default NFTBox;
