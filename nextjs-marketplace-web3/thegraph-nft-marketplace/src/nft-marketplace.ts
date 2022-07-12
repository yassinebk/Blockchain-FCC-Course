import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  ItemUpdated as ItemUpdatedEvent,
} from "../generated/NFTMarketplace/NFTMarketplace";
import {
  ActiveItem,
  ItemBought,
  ItemCanceled,
  ItemListed,
  ItemUpdated,
} from "../generated/schema";

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBought = ItemBought.load(
    getIdFromEventParams(event.params.tokenId, event.params.NFTAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.NFTAddress)
  );

  if (!itemBought) {
    itemBought = new ItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.NFTAddress)
    );
    itemBought.buyer = event.params.buyer;
    itemBought.NFTAddress = event.params.NFTAddress;
    itemBought.tokenId = event.params.tokenId;
    itemBought.price = event.params.price;
  }

  if (!activeItem) {
    console.log("item not found");
    return;
  }

  activeItem.buyer = event.params.buyer;

  activeItem.save();
  itemBought.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = new ItemCanceled(
    getIdFromEventParams(event.params.tokenId, event.params.NFTAddress)
  );

  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
      getIdFromEventParams(event.params.tokenId, event.params.NFTAddress)
    );
  }

  let itemListed = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.NFTAddress)
  );

  if (!itemListed) {
    return;
  }

  itemListed.buyer = Address.fromHexString(
    "0x000000000000000000000000000000000000Ea0"
  );

  itemCanceled.NFTAddress = event.params.NFTAddress;
  itemCanceled.seller = event.params.seller;
  itemCanceled.tokenId = event.params.tokenId;

  itemListed.save();
  itemCanceled.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );

  if (!itemListed) {
    itemListed = new ItemListed(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }

  itemListed.setBytes("NFTAddress", event.params.nftAddress);

  activeItem.buyer = Address.fromString(
    "0x000000000000000000000000000000000000000"
  );

  itemListed.tokenId = event.params.tokenId;
  activeItem.tokenId = event.params.tokenId;

  itemListed.price = event.params.price;
  activeItem.price = event.params.price;

  itemListed.seller = event.params.sender;
  activeItem.seller = event.params.sender;

  itemListed.save();
  activeItem.save();
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
  let itemUpdated = ItemUpdated.load(
    getIdFromEventParams(event.params.tokenId, event.params.NFTAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.NFTAddress)
  );

  if (!itemUpdated) {
    itemUpdated = new ItemUpdated(
      getIdFromEventParams(event.params.tokenId, event.params.NFTAddress)
    );
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.NFTAddress)
    );
  }

  itemUpdated.setBytes("NFTAddress", event.params.NFTAddress);

  activeItem.buyer = Address.fromString(
    "0x000000000000000000000000000000000000000"
  );

  itemUpdated.tokenId = event.params.tokenId;
  activeItem.tokenId = event.params.tokenId;

  itemUpdated.price = event.params.newPrice;
  activeItem.price = event.params.newPrice;

  itemUpdated.seller = event.params.seller;
  activeItem.seller = event.params.seller;

  itemUpdated.save();
  activeItem.save();
}

function getIdFromEventParams(tokenId: BigInt, NFTAddress: Address): string {
  return tokenId.toHexString() + NFTAddress.toHexString();
}
