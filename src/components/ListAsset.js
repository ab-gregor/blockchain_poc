import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, FormControl,Container } from 'react-bootstrap';
import './ListAsset.css';

function ListAsset({onAssetListed}) {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    async function connectMetaMask() {
        try {
            const accounts = await window.ethereum.enable();
            return accounts[0];
        } catch (error) {
            console.error("User denied account access");
            return null;
        }
    }

    const listAsset = async () => {
        const owner = await connectMetaMask();

        try {
            const response = await axios.post('http://localhost:3001/list-asset', {
                name,
                price,
                owner
            });
            if (response.data.success) {
                alert(response.data.message);
                onAssetListed();
            } else {
                alert("Failed to list asset on blockchain.");
            }
        } catch (error) {
            console.error("Error listing asset:", error);
            alert("Error listing asset.");
        }
    };

    // Render the component UI
    return (
        <Container className="mt-4 asset-listing-container">
            
            <Form>
                <FormGroup className="mb-3">
                    <Form.Label>Asset Name</Form.Label>
                    <FormControl 
                        type="text"
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Enter Asset Name" 
                    />
                </FormGroup>

                <FormGroup className="mb-3">
                    <Form.Label>Asset Price (in MToken)</Form.Label>
                    <FormControl 
                        type="number"
                        value={price} 
                        onChange={e => setPrice(e.target.value)} 
                        placeholder="Enter Asset Price" 
                    />
                </FormGroup>
                
                <Button variant="primary" onClick={listAsset}>List Asset</Button>
            </Form>
        </Container>
    );
}

export default ListAsset;
