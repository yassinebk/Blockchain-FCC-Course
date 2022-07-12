// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ItemBought extends ethereum.Event {
  get params(): ItemBought__Params {
    return new ItemBought__Params(this);
  }
}

export class ItemBought__Params {
  _event: ItemBought;

  constructor(event: ItemBought) {
    this._event = event;
  }

  get buyer(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get NFTAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get price(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class ItemCanceled extends ethereum.Event {
  get params(): ItemCanceled__Params {
    return new ItemCanceled__Params(this);
  }
}

export class ItemCanceled__Params {
  _event: ItemCanceled;

  constructor(event: ItemCanceled) {
    this._event = event;
  }

  get seller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get NFTAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ItemListed extends ethereum.Event {
  get params(): ItemListed__Params {
    return new ItemListed__Params(this);
  }
}

export class ItemListed__Params {
  _event: ItemListed;

  constructor(event: ItemListed) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get nftAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get price(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class ItemUpdated extends ethereum.Event {
  get params(): ItemUpdated__Params {
    return new ItemUpdated__Params(this);
  }
}

export class ItemUpdated__Params {
  _event: ItemUpdated;

  constructor(event: ItemUpdated) {
    this._event = event;
  }

  get seller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get NFTAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get newPrice(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class NFTMarketplace__getListingResultListingStruct extends ethereum.Tuple {
  get price(): BigInt {
    return this[0].toBigInt();
  }

  get seller(): Address {
    return this[1].toAddress();
  }
}

export class NFTMarketplace extends ethereum.SmartContract {
  static bind(address: Address): NFTMarketplace {
    return new NFTMarketplace("NFTMarketplace", address);
  }

  getAnyProcceeds(seller: Address): BigInt {
    let result = super.call(
      "getAnyProcceeds",
      "getAnyProcceeds(address):(uint256)",
      [ethereum.Value.fromAddress(seller)]
    );

    return result[0].toBigInt();
  }

  try_getAnyProcceeds(seller: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getAnyProcceeds",
      "getAnyProcceeds(address):(uint256)",
      [ethereum.Value.fromAddress(seller)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getListing(
    NFTAddress: Address,
    tokenId: BigInt
  ): NFTMarketplace__getListingResultListingStruct {
    let result = super.call(
      "getListing",
      "getListing(address,uint256):((uint256,address))",
      [
        ethereum.Value.fromAddress(NFTAddress),
        ethereum.Value.fromUnsignedBigInt(tokenId)
      ]
    );

    return changetype<NFTMarketplace__getListingResultListingStruct>(
      result[0].toTuple()
    );
  }

  try_getListing(
    NFTAddress: Address,
    tokenId: BigInt
  ): ethereum.CallResult<NFTMarketplace__getListingResultListingStruct> {
    let result = super.tryCall(
      "getListing",
      "getListing(address,uint256):((uint256,address))",
      [
        ethereum.Value.fromAddress(NFTAddress),
        ethereum.Value.fromUnsignedBigInt(tokenId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<NFTMarketplace__getListingResultListingStruct>(
        value[0].toTuple()
      )
    );
  }

  getProcceeds(): BigInt {
    let result = super.call("getProcceeds", "getProcceeds():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getProcceeds(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getProcceeds", "getProcceeds():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class BuyItemCall extends ethereum.Call {
  get inputs(): BuyItemCall__Inputs {
    return new BuyItemCall__Inputs(this);
  }

  get outputs(): BuyItemCall__Outputs {
    return new BuyItemCall__Outputs(this);
  }
}

export class BuyItemCall__Inputs {
  _call: BuyItemCall;

  constructor(call: BuyItemCall) {
    this._call = call;
  }

  get NFTAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class BuyItemCall__Outputs {
  _call: BuyItemCall;

  constructor(call: BuyItemCall) {
    this._call = call;
  }
}

export class CancelListingCall extends ethereum.Call {
  get inputs(): CancelListingCall__Inputs {
    return new CancelListingCall__Inputs(this);
  }

  get outputs(): CancelListingCall__Outputs {
    return new CancelListingCall__Outputs(this);
  }
}

export class CancelListingCall__Inputs {
  _call: CancelListingCall;

  constructor(call: CancelListingCall) {
    this._call = call;
  }

  get NFTAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class CancelListingCall__Outputs {
  _call: CancelListingCall;

  constructor(call: CancelListingCall) {
    this._call = call;
  }
}

export class ListItemCall extends ethereum.Call {
  get inputs(): ListItemCall__Inputs {
    return new ListItemCall__Inputs(this);
  }

  get outputs(): ListItemCall__Outputs {
    return new ListItemCall__Outputs(this);
  }
}

export class ListItemCall__Inputs {
  _call: ListItemCall;

  constructor(call: ListItemCall) {
    this._call = call;
  }

  get NFTAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get price(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class ListItemCall__Outputs {
  _call: ListItemCall;

  constructor(call: ListItemCall) {
    this._call = call;
  }
}

export class UpdateListingCall extends ethereum.Call {
  get inputs(): UpdateListingCall__Inputs {
    return new UpdateListingCall__Inputs(this);
  }

  get outputs(): UpdateListingCall__Outputs {
    return new UpdateListingCall__Outputs(this);
  }
}

export class UpdateListingCall__Inputs {
  _call: UpdateListingCall;

  constructor(call: UpdateListingCall) {
    this._call = call;
  }

  get NFTAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get newPrice(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class UpdateListingCall__Outputs {
  _call: UpdateListingCall;

  constructor(call: UpdateListingCall) {
    this._call = call;
  }
}

export class WithdrawProceedsCall extends ethereum.Call {
  get inputs(): WithdrawProceedsCall__Inputs {
    return new WithdrawProceedsCall__Inputs(this);
  }

  get outputs(): WithdrawProceedsCall__Outputs {
    return new WithdrawProceedsCall__Outputs(this);
  }
}

export class WithdrawProceedsCall__Inputs {
  _call: WithdrawProceedsCall;

  constructor(call: WithdrawProceedsCall) {
    this._call = call;
  }
}

export class WithdrawProceedsCall__Outputs {
  _call: WithdrawProceedsCall;

  constructor(call: WithdrawProceedsCall) {
    this._call = call;
  }
}
