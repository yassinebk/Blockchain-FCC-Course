import { ethers } from "./ether-5.6.esm.min.js";
import { FundMeABI, FundMeContractAddress } from "./constants.js"



async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        console.log("Ethereum is available");
        try {
            window.ethereum.request({ method: 'eth_requestAccounts' })
            document.getElementById("connect").innerHTML = "Connected";
        }
        catch (error) {
            document.getElementById("connect").innerHTML = "Error Occured.. retry";
        }

    }
    else {
        console.log("Ethereum is not available");
        document.getElementById("connect").innerHTML = "Please Install Metamask 🦊";

    }
}

async function fund(e) {
    console.log("Funding");
    e.preventDefault();
    console.log();


    if (typeof window.ethereum !== 'undefined') {
        {
            //provider, signer , wallet 
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const wallet = await signer.getAddress();
            const contract = new ethers.Contract(FundMeContractAddress, FundMeABI, signer);
            console.log(contract)
            const transactionRes = await contract.fund({ value: ethers.utils.parseEther(document.forms[0].elements[0].value.toString()) })
            listenForTransactionMine(transactionRes, provider);

            s
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log("Mining Transaction ⚒️ " + transactionResponse.hash);


    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (tranactionReceipt) => {
            console.log("Transaction Mined ❎ ⚒️ " + transactionReceipt.confirmations);


            document.getElementById("message").innerText = "Funding Successful ✅ , total fundednow: "
            resolve();
        })
    })

}
async function withdraw() {
    if (typeof window.ethereum !== 'undefined') {
        {
            //provider, signer , wallet 
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const wallet = await signer.getAddress();
            const contract = new ethers.Contract(FundMeContractAddress, FundMeABI, signer);
            try {
                const transactionRes=await contract.withdraw();
                await listenForTransactionMine(transactionRes, provider);
            }
            catch (error) {
                console.log(error.message)
            }
        }
    }
}

async function getBalance() {

    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(FundMeContractAddress);
        document.getElementById("balance").innerText = "Balance: " + ethers.utils.formatEther(balance);

    }
}

document.getElementById("connect").onclick = connect;
document.getElementById("balance").onclick = getBalance;
document.getElementById("withdraw").onclick = withdraw;
document.getElementById("fund-form").onsubmit = fund;


