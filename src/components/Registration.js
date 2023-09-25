import React, { useEffect } from 'react';
import axios from 'axios';
import { Button,Card } from 'react-bootstrap';
import { useState } from 'react';

function Registration({ toggleRegistrationClicked }) {
  const [name, setName] = useState(0);
  async function connectMetaMask() {
    try {
        const accounts = await window.ethereum.enable();
        return accounts[0];  // This is the user's address
    } catch (error) {
        console.error("User denied account access");
        return null;
    }
}
const regclick=()=>{
  setName(prevkey=>prevkey+1)
}
  const registerUser = async () => {
   
    const address = await connectMetaMask();
    console.log(address); 
    try {
      const response = await axios.get(`http://localhost:3001/register/${address}`);
      toggleRegistrationClicked();
      regclick();
      
      alert(response.data.message);
      
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user.");
    }
  };

  return (
    <div>
      <Card className="text-center mt-5 mx-auto" style={{ width: '80%', boxShadow: '0px 0px 15px rgba(0,0,0,0.1)' }}>
      <Card.Body>
        <Card.Title>Hi, Welcome to AssetEase!</Card.Title>
        <Card.Text>
          It seems you are not registered. Register now to claim the welcome bonus of <b>1000</b> mTokens.
        </Card.Text>
        <Button variant="success" onClick={registerUser}>Register</Button>
      </Card.Body>
    </Card>
    </div>
  );
}

export default Registration;
