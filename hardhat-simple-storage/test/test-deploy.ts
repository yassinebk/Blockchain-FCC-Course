
const { expect,assert } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage Contract", function () {
  let simpleStorageFactory;
  let simpleStorage:any;
  beforeEach(async function()  {
     simpleStorageFactory= await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  })

  it("Should start with 0", async function () {
    const currentValue = await simpleStorage.retrieve();
    expect(currentValue.toNumber()).to.equal(0);
  });

  it("Should store a value", async function () {
    const responseTransaction=await simpleStorage.store("7");
    await responseTransaction.wait(1);
    const updatedValue= await simpleStorage.retrieve();
  expect(updatedValue.toNumber()).to.equal(7);
  })
});
