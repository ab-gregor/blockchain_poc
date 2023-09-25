import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, Form,FormControl } from 'react-bootstrap';


function BuyMoneyTokens({onTokenBuy}) {
    const [etherAmount, setEtherAmount] = useState('');
    const buyTokens = async () => {
        
        const buyerAddress = window.ethereum.selectedAddress;
        const amountInWei = etherAmount*(10**18);
        console.log(amountInWei)

        try {
            const response = await axios.post('http://localhost:3001/buy-money-tokens', {
                buyerAddress: buyerAddress,
                amountInWei: amountInWei
            });

            if (response.data.success) {
                alert(response.data.message);
                onTokenBuy();
            } else {
                alert("Failed to purchase money tokens.");
            }
        } catch (error) {
            console.error("Error purchasing money tokens:", error);
            alert("Error purchasing money tokens.");
        }
    };

    return (
        <Card className="mt-3 p-3 shadow" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2>Buy Money Tokens</h2>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Amount in Ether</Form.Label>
                    <FormControl 
                        type="text" 
                        value={etherAmount} 
                        onChange={e => setEtherAmount(e.target.value)} 
                        placeholder="Enter amount"
                    />
                </Form.Group>
                <Button variant="primary" onClick={buyTokens}>
                    Buy Tokens
                </Button>
            </Form>
        </Card>
    
    
    );
}

export default BuyMoneyTokens;
