import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import "./BrowseAssets.css"

function BrowseAssets({onAssetPurchased}) {
    const currentAddress=window.ethereum.selectedAddress;
    const [assets, setAssets] = useState([]);
    const [newPrice, setNewPrice] = useState('');
    const [shownAssetIds, setShownAssetIds] = useState([]);//maintain prev owner
    const [selectedAssetId, setSelectedAssetId] = useState(null);//for typing in price when relisting
    const [showMyAssets, setShowMyAssets] = useState(true);//toggling view MyAssets
    const [showAvailableAssets, setShowAvailableAssets] = useState(false);//Toggling view AvailableAssets
    
    const fetchAssets = async () => {
        try {
            const response = await axios.get('http://localhost:3001/all-assets');
            setAssets(response.data);
        } catch (error) {
            console.error("Error fetching assets:", error);
        }
    };
    const toggleshowMyAssets=()=>{
        setShowMyAssets(!showMyAssets)
    }
    const toggleshowAvailableAssets=()=>{
        setShowAvailableAssets(!showAvailableAssets)
    }
    const toggleAssetOwners = assetId => {
        if (shownAssetIds.includes(assetId)) {
            setShownAssetIds(prevIds => prevIds.filter(id => id !== assetId));
        } else {
            setShownAssetIds(prevIds => [...prevIds, assetId]);
        }
    };
    const purchaseAsset = async (assetId) => {
        const buyerAddress = window.ethereum.selectedAddress;
    
        try {
            const response = await axios.post('http://localhost:3001/purchase-asset', {
                assetId: assetId,
                buyerAddress: buyerAddress
            });
    
            if (response.data.success) {
                alert("Asset purchased successfully!");
                fetchAssets();
                onAssetPurchased();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(JSON.stringify(error));
            alert("Error purchasing asset. Please try again.");
        }
    };
    const listForSale = async (assetId, price) => {
        try {
            const response = await axios.post('http://localhost:3001/list-for-sale', { 
                assetId: assetId, 
                price: price ,
                owner: window.ethereum.selectedAddress
            });
            if (response.data.success) {
                alert("Asset listed for sale successfully!");
                fetchAssets();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Error listing asset for sale.");
        }
    };

    const removeSaleListing = async (assetId) => {
        try {
            const response = await axios.post('http://localhost:3001/remove-sale-listing', { 
                assetId: assetId ,
                owner: window.ethereum.selectedAddress
        });
            if (response.data.success) {
                alert("Asset removed from sale successfully!");
                fetchAssets();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Error removing asset from sale.");
        }
    };
    useEffect(() => {
        fetchAssets();
        const handleAccountChange = (accounts) => {
            fetchAssets(); // Fetch the balance again if the account changes
        };

        window.ethereum.on('accountsChanged', handleAccountChange);
        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountChange);
        };
    },[]);
    
    console.log(currentAddress)
    const myAssets = assets.filter(asset => asset.owner.toLowerCase() === currentAddress);
    
    console.log(myAssets)
    const assetsForSale = myAssets.filter(asset => asset.forSale);
    const assetsNotForSale = myAssets.filter(asset => !asset.forSale);
    const otherAssets = assets.filter(asset => asset.owner.toLowerCase() !== currentAddress && asset.forSale);
    return (
        <div className='browseBody'>
            <h2 className="clickable-header" onClick={toggleshowMyAssets}>My Assets</h2>
            {showMyAssets&&<>
            <ul className='forSaleAssets'>
                
                {assetsForSale.map(asset => (
                    <Card key={asset.id}>
                        <div style={{margin:10}}>
                        <span onClick={() => toggleAssetOwners(asset.id)}><b>{asset.name}</b><br/></span>
                                        {
                                        shownAssetIds.includes(asset.id) && 
                                            <div>
                                                Previous Owners: 
                                                <ul >
                                                    {asset.previousOwners.map((owner, index) => (
                                                        <li key={index}>{owner}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        } 
                    Price:  {asset.price} MTokens
                    <br/>
                    <Button variant="outline-danger" size='sm' onClick={() => removeSaleListing(asset.id)}>Remove from Sale</Button>
                    </div>
                </Card>
                ))}
                </ul>
            
            <ul className='forSaleAssets'>
                {assetsNotForSale.map(asset => (
                    <Card key={asset.id}>
                        <div style={{margin:10}}>
                        <span onClick={() => toggleAssetOwners(asset.id)}><b>{asset.name}</b><br/></span>
                                        {shownAssetIds.includes(asset.id) && 
                                            <div>
                                                Previous Owners: 
                                                <ul>
                                                    {asset.previousOwners.map((owner, index) => (
                                                        <li key={index}>{owner}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        }
                        <input 
                        type="number" 
                        placeholder="Enter new price" 
                        value={selectedAssetId === asset.id ? newPrice : asset.price} 
                        onFocus={() => setSelectedAssetId(asset.id)}
                        onChange={e => setNewPrice(e.target.value)}
        />
                        <Button variant="outline-success" size='sm' onClick={() => listForSale(asset.id,newPrice||asset.price)}>List for Sale</Button>
                         </div>
                    </Card>
                ))}
            </ul>
            </>
}
<br></br><br/>
            <h2 className="clickable-header" onClick={toggleshowAvailableAssets}>Available Assets</h2>
            {showAvailableAssets&&<>
            <ul className='forSaleAssets'>
                {otherAssets.map(asset => (
                    <Card key={asset.id}>
                        <div style={{margin:10}}>
                        <span onClick={() => toggleAssetOwners(asset.id)}><b>{asset.name}</b><br/></span>
                                        {shownAssetIds.includes(asset.id) && 
                                            <div>
                                                Previous Owners: 
                                                <ul>
                                                    {asset.previousOwners.map((owner, index) => (
                                                        <li key={index}>{owner}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        }
                        
                        
                        <i>Price:</i>{asset.price} mTokens <br></br>Seller:{asset.owner}<br/>
                        <Button variant="success" onClick={() => purchaseAsset(asset.id)}>Purchase</Button>
                        </div>
                    </Card>
                ))}
            </ul></>}
            
        </div>
        
    );
}

export default BrowseAssets;
