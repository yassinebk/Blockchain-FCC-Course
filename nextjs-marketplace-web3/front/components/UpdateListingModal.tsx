import React, { useState } from "react";
import { Modal, Button, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import NFTMarketplace from "../constants/NFTMarketplace.json";

interface UpdateListModalProps {
  marketplaceAddress: string;
  NFTAddress: string;
  tokenId: string;
  isVisible: boolean;
  onClose: () => void;
  price;
}

export const UpdateListingModal: React.FC<UpdateListModalProps> = ({
  marketplaceAddress,
  isVisible,
  NFTAddress,
  tokenId,
  onClose,
  price,
}) => {
  const [updatedPrice, setUpdatedPrice] = useState(price);
  const [error, setError] = useState("");
  console.log(marketplaceAddress);
  const dispatch = useNotification();

  const handleUpdateListingSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Listing updated successfully",
      title: "Listing updated - please refres ( and move blocks)",
      position: "topR",
    });
    onClose();
    setUpdatedPrice("0");
  };

  const { runContractFunction: updatePrice } = useWeb3Contract({
    abi: NFTMarketplace,
    contractAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",

    functionName: "updateListing",
    params: {
      NFTAddress,
      tokenId,
      newPrice: updatedPrice,
    },
  });
  const onOk = async () => {
    await updatePrice({
      onError(error) {
        setError(error.message);
      },
      onSuccess: handleUpdateListingSuccess,
    });
  };
  return (
    <Modal
      isVisible={isVisible}
      onCloseButtonPressed={onClose}
      onOk={onOk}
      onCancel={onClose}
      hasCancel={false}
      isCentered
      okText="Update"
    >
      <div className="min-h-[100px]">
        <Input
          errorMessage={error}
          label="Update Listing pirce in L1 Currency (ETH)"
          name="New Listing Price"
          type="number"
          value={updatedPrice}
          onChange={(e) => setUpdatedPrice(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default UpdateListingModal;
