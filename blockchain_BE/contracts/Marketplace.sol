// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Marketplace is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter public _assetTokenIds;// non fungible
    uint256 constant MONEY_TOKEN_ID = 0;//fungible
    uint256 public constant RATE = 10000;//number of mtokens per ether


    struct Asset {
        string name;
        uint256 price;//in terms of mtokens
        address owner;
        address[] previousOwners;
        bool forSale;
    }

    constructor() ERC1155("https://mocktokenapi.local/api/token/{id}") {
    
}

    mapping(uint256 => Asset) private _assets;//mapping asset token id to its details


    function registerUser() external {
        require(balanceOf(msg.sender, MONEY_TOKEN_ID) == 0, "User already registered.");
        _mint(msg.sender, MONEY_TOKEN_ID, 1000, "");//mint 1000 mtokens for the new user
    }

    function addAsset(string calldata name, uint256 price) external {
        _assetTokenIds.increment();
        uint256 newAssetId = _assetTokenIds.current();

        Asset memory newAsset = Asset({
            name: name,
            price: price,
            owner: msg.sender,
            previousOwners: new address[](0),
             forSale: true
            
        });

        _assets[newAssetId] = newAsset;
        _mint(msg.sender, newAssetId, 1, "");  //mint one ssset token
    }

    function purchaseAsset(uint256 assetId) external {
    Asset storage asset = _assets[assetId];//tried memory,push not working
    require(asset.owner != address(0), "Asset not found.");//means empty address 0x0000
    require(asset.forSale, "Asset is not for sale.");
    require(asset.owner != msg.sender,"Cant buy your own assets.LoL");
    require(balanceOf(msg.sender, MONEY_TOKEN_ID) >= asset.price, "Insufficient funds.");

   
    _safeTransferFrom(msg.sender, asset.owner, MONEY_TOKEN_ID, asset.price, ""); //transfer mtokens from buyer to seller

    
    _safeTransferFrom(asset.owner, msg.sender, assetId, 1, "");//transfer asset token from seller to buyer

    // Update asset ownership
    asset.previousOwners.push(asset.owner);
    asset.owner = msg.sender;
    _assets[assetId] = asset;//update with new ownership
}

function viewAsset(uint256 assetId) external view returns (Asset memory) {
    return _assets[assetId];
}

function getMoneyTokenBalance(address user) external view returns (uint256) {
    return balanceOf(user, MONEY_TOKEN_ID);
}
function getAssetOwner(uint256 assetId) external view returns (address) {
    return _assets[assetId].owner;
}
function listAssetForSale(uint256 assetId, uint256 price) external {
    Asset storage asset = _assets[assetId];
    require(msg.sender == asset.owner, "Only the owner can list the asset for sale.");
    asset.forSale = true;
    asset.price = price;
}

function removeFromSale(uint256 assetId) external {
    Asset storage asset = _assets[assetId];
    require(msg.sender == asset.owner, "Only the owner can remove the asset from sale.");
    asset.forSale = false;
}

function buyMoneyTokens() external payable {
    uint256 etherAmount = msg.value / 10**18;  // Convert wei to ether
    uint256 tokensToBuy = etherAmount * RATE;
    // Update balances
    _mint(msg.sender, MONEY_TOKEN_ID, tokensToBuy, "");
}


}
