import React, { useEffect, useState, useRef } from 'react';
import { add as dateAdd} from 'date-fns';
import './App.css';
import BasicDatePicker from './BasicDatePicker/BasicDatePicker';
import BasicTimePicker from './BasicTimePicker/BasicTimePicker';
import TimeLine from './TimeLine/TimeLine';
import NavBar from './NavBar/NavBar';
import {ethers} from 'ethers'
import contractAbi from './abi'
import Covalent from './CovalentJson/Covalent';

const contractAddress = '0x2Fb9CAaEc0aBEd9eBF9A2487aFEC5121a18A78b9';

function convertToUTC( date ) {
    return dateAdd( date,{
        minutes: -date.getTimezoneOffset()
    }  );
}

const App = ()=>{

    const [chosenDate, setNewDate] = useState( new Date() )
    const [chosenTime, setNewTime] = useState(new Date())
    const [isChosen, setChosen] = useState(false)
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
				setConnButtonText(defaultAccount);
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

	const setHandler = (event) => {
		event.preventDefault();
		console.log('sending ' + event.target.setText.value + ' to the contract');
		contract.beBillboardShower(event.target.setText.value);
	}

	const getCurrentVal = async () => {
		let val = await contract.billboardShowers( "https://kaanayden.github.io/Decentralized-Global-Billboard/" );
		console.log( val.isActive );
		setCurrentContractVal(val);
	}

    const handleClickDate = (chosenDate)=>{
        setNewDate(chosenDate)
    }

    const handleClickTime = (chosenTime)=>{
        chosenDate.setHours(chosenTime.getHours());
        chosenDate.setMinutes(chosenTime.getMinutes());
        setNewDate(convertToUTC(chosenDate))
        setChosen(true)
    }

    const handleClickNowButton = ()=>{
        setNewDate(new Date())
        setChosen(true)
    }

    const changeChosenDate = (value)=>{
        setNewDate(dateAdd(chosenDate,{minutes: value}))
    }

    return(
        <div className='all-app'>
            <div className='nav-bar'>
                <NavBar
                    connectWalletHandler={connectWalletHandler}
                    connButtonText={connButtonText}
                    chosenDate={chosenDate}
                    handleClickDate={handleClickDate}
                    handleClickNowButton={handleClickNowButton}
                    handleClickTime={handleClickTime}
                />
            </div>
            <div className='main'>
                <Covalent contractProp={contract}/>  
            </div>    
            <div>
                
            </div>  
        </div>
    )
  }

export default App;