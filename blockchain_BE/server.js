const express = require('express');
const Web3 = require('web3').default;
const cors = require('cors');
const app = express();

const fs = require('fs'); 
const PORT = 3001;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());

const web3 = new Web3('http://localhost:7545');

const contractJSON = JSON.parse(fs.readFileSync('build/contracts/Marketplace.json', 'utf8'));
const CONTRACT_ABI = contractJSON.abi;
const CONTRACT_ADDRESS = contractJSON.networks[5777].address;
const marketplaceContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
app.get('/', (req, res) => {
    res.send('Marketplace Backend Server');
});
app.get('/balance/:address', async (req, res) => {
    try {
        let address = req.params.address;
        let balance = await marketplaceContract.methods.getMoneyTokenBalance(address).call();
        res.json({ balance: balance.toString() });
    } catch (error) {
        res.status(500).send(`Error fetching balance: ${error}`);
    }
});

app.get('/register/:address', async (req, res) => {
    let address = req.params.address;
    let marketplaceContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    try {
        await marketplaceContract.methods.registerUser().send({ from: address });
        res.json({ success: true, message: "Registered successfully" });
    } catch (error) {
        res.json({ success: false, message: error.toString() });
    }
});
app.post('/list-asset', async (req, res) => {
    const { name, price,owner } = req.body;
    

    try {
        const gasEstimate = await marketplaceContract.methods.addAsset(name, price).estimateGas({ from: owner });
        const result = await marketplaceContract.methods.addAsset(name, price).send({ from: owner, gas: gasEstimate });
        
        if (result && result.transactionHash) {
            res.json({ success: true, message: 'Asset listed successfully!' });
        } else {
            res.json({ success: false, message: 'Failed to list asset.' });
        }
    } catch (error) {
        console.error("Error listing asset:", error);
        res.json({ success: false, message: 'Error listing asset.' });
    }
});
app.post('/list-for-sale', async (req, res) => {
    const { assetId,price,owner} = req.body;
    

    try {
        const gasEstimate = await marketplaceContract.methods.listAssetForSale(assetId, price).estimateGas({ from: owner });
        const result = await marketplaceContract.methods.listAssetForSale(assetId, price).send({ from: owner, gas: gasEstimate });
        
        if (result && result.transactionHash) {
            res.json({ success: true, message: 'Asset added for sale successfully!' });
        } else {
            res.json({ success: false, message: 'Failed to list asset for sale.' });
        }
    } catch (error) {
        console.error("Error listing asset for sale:", error);
        res.json({ success: false, message: 'Error listing asset for sale.' });
    }
});
app.post('/remove-sale-listing', async (req, res) => {
    const { assetId,owner} = req.body;
    

    try {
        const gasEstimate = await marketplaceContract.methods.removeFromSale(assetId).estimateGas({ from: owner });
        const result = await marketplaceContract.methods.removeFromSale(assetId).send({ from: owner, gas: gasEstimate });
        
        if (result && result.transactionHash) {
            res.json({ success: true, message: 'Asset removed from sale successfully!' });
        } else {
            res.json({ success: false, message: 'Failed to remove asset for sale.' });
        }
    } catch (error) {
        console.error("Error removing asset for sale:", error);
        res.json({ success: false, message: 'Error removing asset for sale.' });
    }
});
app.get('/all-assets', async (req, res) => {
    try {
        const currentAssetCount = await marketplaceContract.methods._assetTokenIds().call();
        let availableAssets = [];

        for (let i = 1; i <= currentAssetCount; i++) { 
            const asset = await marketplaceContract.methods.viewAsset(i).call();
            
                availableAssets.push({
                    id: i,
                    name: asset.name,
                    price: asset.price.toString(),
                    owner: asset.owner,
                    forSale:asset.forSale,
                    previousOwners:asset.previousOwners
                });
            }
        

        res.json(availableAssets);

    } catch (error) {
        console.error("Error fetching available assets:", error);
        res.status(500).json({ success: false, message: "Error fetching available assets" });
    }
});
app.post('/purchase-asset', async (req, res) => {
    const { assetId, buyerAddress } = req.body;

   
    try {
        const transactionReceipt = await marketplaceContract.methods.purchaseAsset(assetId).send({
            from: buyerAddress,
            gas:200000
            
        });

        res.json({ success: true, message: 'Asset purchased successfully!' });
    } catch (error) {
        console.error("Error purchasing asset:", error);
        
        // errorMessage = error.config.response.data.message.innerError.message.split("revert")[1]?.trim();

        res.status(400).json({ success: false, message: error });
    }
});
app.post('/buy-money-tokens', async (req, res) => {
    const { buyerAddress, amountInWei } = req.body;

    try {
        const gasEstimate = await marketplaceContract.methods.buyMoneyTokens().estimateGas({ from: buyerAddress, value: amountInWei });
        const result = await marketplaceContract.methods.buyMoneyTokens().send({ from: buyerAddress, gas: gasEstimate, value: amountInWei });

        if (result && result.transactionHash) {
            res.json({ success: true, message: 'Money tokens purchased successfully!' });
        } else {
            res.json({ success: false, message: 'Failed to purchase money tokens.' });
        }
    } catch (error) {
        console.error("Error purchasing money tokens:", error);
        res.status(500).json({ success: false, message: 'Error purchasing money tokens.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
