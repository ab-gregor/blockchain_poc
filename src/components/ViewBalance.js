import React, { useState, useEffect} from 'react';
import axios from 'axios';
import styles from "./ViewBalance.module.css"

function ViewBalance({balancekey,tokenBuyKey,setMtokenBalance}) {
    const [balance, setBalance] = useState(null);
    console.log("Render with keys:", balancekey, tokenBuyKey);
    const fetchBalance = async () => {
   
        const address = window.ethereum.selectedAddress;
        console.log(address); 
        try {
          const response = await axios.get(`http://localhost:3001/balance/${address}`);
          console.log(response.data.balance);
          setBalance(response.data.balance)
          setMtokenBalance(response.data.balance);

        } catch (error) {
          console.error("Error fetching balnace:", error);
          alert("Error fetching balance.");
        }
      };
      useEffect(() => {
        console.log(tokenBuyKey);
        console.log(balancekey)
        fetchBalance();
        const handleAccountChange = (accounts) => {
            fetchBalance(); // Fetch the balance again if the account changes
        };

        window.ethereum.on('accountsChanged', handleAccountChange);
        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountChange);
        };
        

    }, [balancekey,tokenBuyKey]);


    
      return (
        <>
          <p className={styles.balanceContainer}>Your mToken balance :{balance}</p>
        </>
      );
    }

    

export default ViewBalance;
