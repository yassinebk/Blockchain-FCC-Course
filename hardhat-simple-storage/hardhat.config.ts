import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter"
import "dotenv/config";
import "solidity-coverage"
import "./tasks"


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */


module.exports = {
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId:4
    }
  },
  etherscan: {
    apiKey: {
      rinkeby:process.env.ETHERSCAN_API_KEY
    },
  },
  solidity: "0.8.4",
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.log",
    currency: "USD",
    coinmarketcap: process.env.COINMARKET_API_KEY
  }

};
