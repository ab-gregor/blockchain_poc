
import Registration from './components/Registration';
import ListAsset from './components/ListAsset';
import BrowseAssets from './components/BrowseAssets';
import './App.css';
import { useState } from 'react';
import ViewBalance from './components/ViewBalance';
import BuyMoneyTokens from './components/BuyMoneyTokens';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshBalanceKey, setRefreshBalanceKey] = useState(0);
  const [refreshTokenBuyKey, setRefreshTokenBuyKey] = useState(0);
  const [buyMoreButtonCLicked,setBuyMoreButtonCLicked]=useState(false);
  const [registrationClicked, setRegistrationClicked] = useState(0);
  const [listAssetClicked, setlistAssetClicked] = useState(false);
  const [mtokenBalance, setMtokenBalance] = useState(null);
  console.log(mtokenBalance);
    const refreshAssets = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };
    const refreshBalance=()=>{
        setRefreshBalanceKey(prevKey=>prevKey+1);
    };
    const refreshTokenBuy=()=>{
      setRefreshTokenBuyKey(prevKey=>prevKey+1);
      console.log(refreshTokenBuyKey)
    }

    const toggleBuymore=()=>{
      setBuyMoreButtonCLicked(!buyMoreButtonCLicked)
    }
    const toggleListItem=()=>{
      setlistAssetClicked(!listAssetClicked)
    }
    const toggleRegistrationClicked=()=>{
      setRegistrationClicked(prevKey=>prevKey+1);
    }
    
  return (
    <div className="App">
      <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">AssetEase</Navbar.Brand>
          <Nav className="me-auto">
            
            
          </Nav>
          <ViewBalance balancekey={refreshBalanceKey} tokenBuyKey={refreshTokenBuyKey} setMtokenBalance={setMtokenBalance}/>
          <Button variant="secondary" style={{marginLeft:5}} onClick={toggleBuymore}>Buy More</Button>
        </Container>
      </Navbar>
      <br />
      </>
      
      {mtokenBalance === "0" &&<Registration onRegisterClick={toggleRegistrationClicked}/>}
      
      <br/>
      {buyMoreButtonCLicked&&<BuyMoneyTokens onTokenBuy={refreshTokenBuy}/>}
      <br/>
      <h2 className="clickable-header" onClick={toggleListItem}>List an Asset</h2>

      {listAssetClicked&&<ListAsset onAssetListed={refreshAssets}/>}
      <br/>
      <br/>
      <BrowseAssets key={refreshKey} onAssetPurchased={refreshBalance}/>

    </div>
  );
  
}

export default App;
