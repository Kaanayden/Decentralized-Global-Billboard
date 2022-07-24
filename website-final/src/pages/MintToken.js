import React, {useState, useEffect} from 'react';
import {ethers} from 'ethers';
//import contractAbi from './Navbar/abi';


export default function MintToken(props){
    const {contract} = props
    console.log( contract );
    
    const[currentTrafficCheckerUrl, setTraffic] = useState("");
    const[currentBillboardChecker, setBillboard] = useState("");
    const[trafficData, setTrafficData] = useState();
    const[checkData, setCheckData] = useState();
    const[reportText, setReportText] = useState();
    const[mintResult, setMintResult] = useState();


    getContractValues();
    async function getContractValues() {
        contract.TRAFFIC_AND_FIRST_BILLBOARD_CHECKER_API_URL()
        .then( result => setTraffic( result ) );
        contract.BILLBOARD_CHECKER_API_URL()
        .then( result => setBillboard( result ) );
}


    async function handleClick() {

    }

    async function firstStart() {}



    const setApiTestHandler = async (event) => {
		event.preventDefault();
        let input = event.target.setText.value;

	}
	
    const getTrafficData = async (event) => {
        event.preventDefault();
        let input = event.target.setText.value;
        let data = await fetch( currentTrafficCheckerUrl + input );
        let json = await data.json();
        setTrafficData(json.TRAFFIC);
    }

    const getCheckData = async (event) => {
        event.preventDefault();
        let input = event.target.setText.value;
        let data = await fetch( currentBillboardChecker + input );
        let json = await data.json();
        setCheckData(json.TRAFFIC);
    }

    const reportBillboard = async (event) => {
        event.preventDefault();
        let input = event.target.setText.value;
        let data = await fetch( currentBillboardChecker + input );
        let json = await data.json();
        if( json.TRAFFIC == 0 ) {
            try {
                await contract.reportBillboardShower( input );
                setReportText( "Domain has been reported." )
            } catch(err) {
                console.log(err)
                setReportText( "This domain can't be reported " )
            }
            
            
        } else {
            setReportText( "You can't report this domain because it has ad element" )
        }
    }

    let trafficText = "";
    if( trafficData != null) {
        if( trafficData == 0 ) {
            trafficText = "There is no ad element in this website."
        } else {
            trafficText = "Traffic: " + trafficData.toString();
        }
    }

    let checkText = "";
    if( checkData != null) {
        if( checkData == 0 ) {
            checkText = "This website do not have ad element. You can report and get reward."
        } else {
            checkText = "This website has ad element."
        }
    }

    const mintTokens = async () => {
        try {
            await contract.mockMintTokens();
            setMintResult("Minting is successful. 100 Billboard token will be transacted to your account.")
        } catch (err) {
            setMintResult("Already minted. Each address can mint only once.");
        }
    }

    return(
		<div style={{position:"relative", top:"60px"}}>
        { !contract && 
        <div>
            <h4> Please connect Metamask to mint tokens. </h4> 
        </div>
        }
        {contract && 
        <div>
            <button onClick={mintTokens} style={{marginTop: '5em'}}> Mint 100 BBRD </button>
            <h4>{mintResult}</h4>
        </div>

        }

		</div>
    )
    


}