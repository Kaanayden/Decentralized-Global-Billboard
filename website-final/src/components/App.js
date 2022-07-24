import React,{useState} from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import BuyAd from "../pages/BuyAd";
import AdShowers from "../pages/AdShowers";
import ApiTest from "../pages/ApiTest";
import Proposal from "../pages/Proposal";
import ReportBillboard from "../pages/ReportBillboard";
import {ethers} from 'ethers'
import contractAbi from './abi'
import './App.css';

const contractAddress = '0x2Fb9CAaEc0aBEd9eBF9A2487aFEC5121a18A78b9';


export default function App() {
  const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [billBoardShowers, setBilboardShowers] = useState([{isActive:true,isBanned:false,rewardCoefficent:8275,startTime:8457698,ownerAddress:895748}])

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
    const butText = newAccount.toString()
    setConnButtonText(butText);
		updateEthers();
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, contractAbi, tempSigner);
		setContract(tempContract);	
	}


  return (
    <Router>
      <div>
        <NavBar 
          connectWalletHandler={connectWalletHandler}
          connButtonText={connButtonText}
        />
        <Switch>
          <Route exact path="/">
            <BuyAd contract={contract}/>
          </Route>
          <Route path="/AdShowers">
            <AdShowers contract={contract}/>
          </Route>
          <Route path="/ApiTest">
            <ApiTest contract={contract}/>
          </Route>
          <Route path="/Proposal">
            <Proposal contract={contract}/>
          </Route>
          <Route path="/ReportBillboard">
            <ReportBillboard contract={contract}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

