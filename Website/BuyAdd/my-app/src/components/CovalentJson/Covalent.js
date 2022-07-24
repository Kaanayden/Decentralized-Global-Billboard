// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, {useState} from 'react';
import {ethers} from 'ethers';
//import {Web3} from 'web3';
import contractAbi from './abi';

const contractAddress = '0x2Fb9CAaEc0aBEd9eBF9A2487aFEC5121a18A78b9';



const Covalent = () => {
    
	// deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
	

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState();

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

	const getEventsCovalent = async () => {
		//token sil
		const COVALENT_EVENT_API_URL = "https://api.covalenthq.com/v1/42/events/address/0x2Fb9CAaEc0aBEd9eBF9A2487aFEC5121a18A78b9/?quote-currency=USD&format=JSON&starting-block=32795515&ending-block=latest&page-size=10000&key="
		const COVALENT_TOKEN = "ckey_6f1736ded11741c1bdf54833060"
        const iFace = new ethers.utils.Interface( [
            "event RequestTraffic(bytes32 indexed requestId, uint256 traffic, string domainName)",
            "event MadeProposal( Target indexed targetType, string proposedURL, uint index )",
            "event AdBuy( uint time, string imageURI )",
            "event NewBillboard( address indexed owner, string domainName )",
            "event BannedBillboard( address indexed owner, string domainName )"
        ] );
        let covalentApiUrl = COVALENT_EVENT_API_URL + COVALENT_TOKEN;
        let data = await fetch( covalentApiUrl );
        let json = await data.json();

        const billboards = [];
        const bannedBillboards = [];
        const ads = [];
        const proposals = [];

        const logs = json.data.items;
        logs.forEach( ( encodedEvent ) => {
            let rawData = encodedEvent.raw_log_data;
            let rawTopics = encodedEvent.raw_log_topics;
            try{
                
                let newItem = iFace.decodeEventLog( 
                    "MadeProposal(Target,string,uint )" ,rawData , rawTopics
                );
                
                proposals.push( newItem );
                } catch(err) {}
            try{
            let newItem = iFace.decodeEventLog( 
                "NewBillboard" ,rawData , rawTopics
            );
            billboards.push( newItem );
            } catch(err) {}
            try{
                let newItem = iFace.decodeEventLog( 
                    "BannedBillboard" ,rawData , rawTopics
                );
                bannedBillboards.push( newItem );
                } catch(err) {}
                try{
                    let newItem = iFace.decodeEventLog( 
                        "AdBuy" ,rawData , rawTopics
                    );
                    ads.push( newItem );
                    } catch(err) {}

                        

        } );

        

        const covalentData = {
            billboards: billboards,
            bannedBillboards: bannedBillboards,
            ads: ads,
            proposals: proposals
        }
        return covalentData;

	}

    async function handleClick() {
        let result = await getEventsCovalent();
        setCurrentContractVal( result.billboards[0].domainName );
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
				<button type={"submit"}> Update Contract </button>
			</form>
			<div>
			<button onClick={handleClick} style={{marginTop: '5em'}}> Get Current Contract Value </button>
			</div>
			{currentContractVal}
			{errorMessage}
            
		</div>
	);
}

export default Covalent;