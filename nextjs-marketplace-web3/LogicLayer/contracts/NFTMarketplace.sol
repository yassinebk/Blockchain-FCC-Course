// SPDX-License-Identifier: mMIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NFTMarketplace__PriceMustBePositive();
error NFTMarketplace__AlreadyListed(address, uint256);
error NFTMarketplace__NotApproved();
error NFTMarketplace__NotOwner();
error NFTMarketplace__PriceNotMet(address,uint256,uint256);
error NFTMarketplace__NotListed(address, uint256);
error NFTMarketplace__NoProceeds();
error NFTMarketplace__TransferFailed();
error NFTMarketplace__NotAllowed();

contract NFTMarketplace { 

    struct Listing { 
        uint256 price;
        address seller;
    }
    // NFT Contract Address -> NFT TokenID -> Listing

    mapping(address =>mapping(uint256 => Listing))  private s_listings;
    mapping(address=>uint256) private s_proceeds;

    address immutable i_owner;

    event ItemListed(
        address indexed sender,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
        // This Contract can accept payment in different coins/tokens
    );

    event ItemBought(
        address indexed buyer,
        address indexed NFTAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed NFTAddress,
        uint256 indexed tokenId
        );

    event ItemUpdated(
        address indexed seller,
        address indexed NFTAddress,
        uint256 indexed tokenId,
        uint256  newPrice
        );



modifier notListed(address NFTAddress,uint256 tokenId,address owner){
    Listing memory listing = s_listings[NFTAddress][tokenId];
    if(listing.price>0){
        revert NFTMarketplace__AlreadyListed(NFTAddress,tokenId);
    }
    _;
}

modifier isAdmin(address caller){
    if(caller!=i_owner) revert NFTMarketplace__NotAllowed();
    _;
}

modifier isOwner(address NFTAddress, uint256 tokenId , address owner){ 
    IERC721 NFTContract =  IERC721(NFTAddress);
    address realOwner = NFTContract.ownerOf(tokenId);
    if(owner!=realOwner)
        revert NFTMarketplace__NotOwner();
    _;
} 

modifier isListed(address NFTAddress, uint256 tokenId){
    Listing memory listing = s_listings[NFTAddress][tokenId];
    if(listing.price<=0){
        revert NFTMarketplace__NotListed(NFTAddress,tokenId);
    }
    _;
}


constructor(){
 i_owner=msg.sender;
}

/*
* @notice Method for lising your NFT on the marketplace
* @param NFTAddress Address of the NFT contract
* @param tokenId NFT Token ID (Unique per contract)
* @param price Price of the listing

* @dev we should make the owner pass the ownership of the NFT to the marketplace when listed.
*/

function listItem(address NFTAddress,uint256 tokenId,uint256 price) external
    notListed(NFTAddress,tokenId,msg.sender)
    isOwner(NFTAddress,tokenId,msg.sender)
 {
    if(price<=0 ){
        revert NFTMarketplace__PriceMustBePositive();
    }

    IERC721 nft= IERC721(NFTAddress);
    if(nft.getApproved(tokenId)!=address(this)){
        revert NFTMarketplace__NotApproved();
    }

    s_listings[NFTAddress][tokenId]=Listing(price,msg.sender);

    emit ItemListed(msg.sender,NFTAddress,tokenId,price);
    // 1. Send the NFT to the contract. Transfer -> Contract
    // 2. Owners can still hold their NFT and give the marketplace approval
    // to sell NFT for them
 } 

 function buyItem(address NFTAddress,uint256 tokenId) external payable 
 isListed(NFTAddress,tokenId)
 {
    Listing memory listedItem = s_listings[NFTAddress][tokenId];

    if(msg.value<listedItem.price){
        revert NFTMarketplace__PriceNotMet(NFTAddress,tokenId,listedItem.price);
    }

    s_proceeds[listedItem.seller]+=listedItem.price;
    delete(s_listings[NFTAddress][tokenId]);   // Remove the listing from the marketplace 
    IERC721 nft= IERC721(NFTAddress);
    nft.safeTransferFrom(listedItem.seller,msg.sender,tokenId);

    emit ItemBought(msg.sender,NFTAddress,tokenId,listedItem.price);
 }

 function cancelListing(address NFTAddress,uint256 tokenId) external
 isOwner(NFTAddress,tokenId,msg.sender)
 {
    if(s_listings[NFTAddress][tokenId].price==0){
        revert NFTMarketplace__NotListed(NFTAddress,tokenId);
    }
    delete (s_listings[NFTAddress][tokenId]);
    emit ItemCanceled(msg.sender,NFTAddress,tokenId);
 }

 function updateListing(address NFTAddress, uint256 tokenId,uint256 newPrice)
    external 
    isListed(NFTAddress,tokenId)
    isOwner(NFTAddress,tokenId,msg.sender)
 {
    s_listings[NFTAddress][tokenId].price=newPrice;

    emit ItemUpdated(msg.sender,NFTAddress,tokenId,newPrice);

 } 
  function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NFTMarketplace__NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }


 function getListing(address NFTAddress,uint256 tokenId) public view returns (Listing memory listing){
    return s_listings[NFTAddress][tokenId];
 }

 function getProcceeds()public view returns(uint256){
    return s_proceeds[msg.sender];
 }

 function getAnyProcceeds(address seller) public view 
 isAdmin(msg.sender)
returns(uint256)
 {
    return s_proceeds[seller];
 }
 


}