// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, {useState} from 'react'
import {ethers} from 'ethers'
import contractAbi from './abi'

const contractAddress = '0x2Fb9CAaEc0aBEd9eBF9A2487aFEC5121a18A78b9';

const MetamaskTest = () => {
    //console.log(contractAbi);
	// deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
	

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
				setConnButtonText('Wallet Connected');
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
	
	return (
		<div>
		<h4> {"Get/Set Contract interaction"} </h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<form onSubmit={setHandler}>
				<input id="setText" type="text"/>
				<button type={"submit"}> AddYourDomain </button>
				<div>You should have billboard ready in your website.</div>
			</form>
			<div>
			<button onClick={getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button>
			</div>
   			<div>
				{billBoardShowers.map((shower)=>{
					return(
						<div>
							<div>{shower.isActive.toString()}</div>
							<div>{shower.isBanned.toString()}</div>
							<div>{shower.rewardCoefficent}</div>
							<div>{shower.startTime}</div>
							<div>{shower.ownerAddress}</div>
						</div>
					)
				})}
			</div>

			{errorMessage}
            
		</div>
	);
}

export default MetamaskTest;