
import {ethers, run,network} from "hardhat"


async function main() {
  
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract ...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed()
  console.log(`Deployed contract to ${simpleStorage.address}`);
  

  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }
  
  const currentValue = await simpleStorage.retrieve();
  console.log("The current value is:", currentValue.toNumber());

  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);

  const updatedValue= await simpleStorage.retrieve();
  console.log("The updated value is:", updatedValue.toNumber());

}


main().then(() => process.exit(0))
  .catch((error) => console.log(error.message))

async function verify(contactAddress:string, args:any) {

  console.log("verifying contract ....");
  try { 
    await run("verify:verify", {
      address: contactAddress,
      constructorArgs: args,
    });
  }
  catch (e:any) {
    console.log("verify failed",e.message);
  }

  }
