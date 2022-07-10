// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



error RandomIPFSNFT_RangOutOfBound();
error RandomIPFSNFT_NeedMoreEth();
error RandomIPFSNFT_TransferFailed();

contract RandomIPFSNFT is VRFConsumerBaseV2, ERC721,Ownable { 

      uint64 private immutable i_subscriptionId;
      address private immutable i_VRFCoordinator ;
      uint32 private immutable i_callbackGasLimit;
      bytes32 private immutable i_gasLane;

      uint16 private constant REQUEST_CONFIRMATIONS=3;
      uint32 private constant NUM_WORDS=1;


    string[] internal s_dogTokenURIs;
    mapping (uint256=>address) public s_requestIdToSender;

    enum Breed{ 
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }


    uint256 public s_tokenCounter;
    uint256 public constant MAX_CHANCE_VALUE=100;

    uint256 public i_mintFee;

// When we mint an NFT we will trigger a ChainLink VRF call to get usa random number
constructor( 
    address vrfCoordinatorV2,
    uint64 subscriptionId,
    bytes32 gasLane,
    uint32 callbackGasLimit,
    string[3] memory dogTokenURIs
    uint256 mintFee
    )
 VRFConsumerBaseV2(vrfCoordinatorV2)
 ERC721("Random IPFS NFT","RIN")
 {

    i_VRFCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
    i_subscriptionId = subscriptionId;
    i_callbackGasLimit = callbackGasLimit;
    i_gasLane = gasLane;
    s_dogTokenURIs = dogTokenURIs;
    i_mintFee = mintFee;

}

function requestNFT() public returns(uint256 requestId){
    if(msg.value<i_mintFee){
        revert RandomIPFSNFT_NeedMoreEth();
    }

     requestId = i_VRFCoordinator.requestRandomWords(
      i_gasLane,
      i_subscriptionId,
      REQUEST_CONFIRMATIONS,
      i_callbackGasLimit,
      NUM_WORDS
    );

    s_requestIdToSender[requestId]=msg.sender;

}

function withdraw() public onlyOwner(){ 
    uint256 amount = address(this).balance;
    (bool success,)= payable(msg.sender).call{value:amount}("");
    if(!success){
        revert RandomIPFSNFT_TransferFailed();
    }
}



function fulfilRandomWords(uint256 requestId,uint256[]memory randomWords) internal override{

    address dogOwner=s_requestIdToSender[requestId];
    uint256 newTokenId= s_tokenCounter;

    uint256 moddedRNG=randomWords[0]%MAX_CHANCE_VALUE;

    Breed dogBreed=getBreedFromModdedRNG( moddedRNG);

    _safeMint(dogOwner,newTokenId);
    _setTokenURI(newTokenId,s_dogTokenURIs[uint256(dogBreed)]);

}

function getBreedFromModdedRNG(uint256 moddedRNG) public pure returns (Breed){

    uint256 cumulativeSum=0;
    uint256[3] memory chanceArray= getChanceArray();

    for(uint256 i=0;i<chanceArray.length;i++){
        
        if(moddedRNG>=cumulativeSum && moddedRNG<cumulativeSum+chanceArray[i]){
            return Breed(i);
        }
        cumulativeSum+=chanceArray[i];
    }

    revert RandomIPFSNFT_RangOutOfBound();
}

function getChanceArray() public pure returns(uint256[3] memory){
    return [10,30,MAX_CHANCE_VALUE];
}

function getMintFee()public view returns(uint256){
    return i_mintFee;
}

function getDogTokenURIs( uint256 index)public view returns(string memory){
    return s_dogTokenURIs[index];;
}

function  getTokenCountere()public view returns(uint256){
    return s_tokenCounter;
}


}
