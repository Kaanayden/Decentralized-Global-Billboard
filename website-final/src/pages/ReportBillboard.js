import React, {useState, useEffect} from 'react';
import {ethers} from 'ethers';
//import contractAbi from './Navbar/abi';


export default function ReportBillboard(props){
    const {contract} = props
    console.log( contract );
    
    const[currentTrafficCheckerUrl, setTraffic] = useState("");
    const[currentBillboardChecker, setBillboard] = useState("");
    const[trafficData, setTrafficData] = useState();
    const[checkData, setCheckData] = useState();
    const[reportText, setReportText] = useState();


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


    return(
		<div style={{position:"relative", top:"60px"}}>
        { !contract && <h4> Please connect Metamask to get contract data and interact with contract. </h4> }
        <p> You can test API's which are registered in contact with this tool and report if any registered domain do not show advertisement and get reward. </p>
        <h4> Current Traffic Fetcher API URL: {currentTrafficCheckerUrl}  </h4>
        <h4> Current Billboard Checker API URL: {currentBillboardChecker} </h4>
			<form onSubmit={ getTrafficData }>
				<input id="setText" type="text"/>
				<button type={"submit"}> Get Traffic Data and Check Advertisement Element </button>
                <p>{trafficText}</p>
			</form>
            <form onSubmit={ getCheckData }>
				<input id="setText" type="text"/>
				<button type={"submit"}> Check Whether Advertisement Element Exists</button>
                <p>{checkText}</p>
			</form>
            <form onSubmit={ reportBillboard }>
				<input id="setText" type="text"/>
				<button type={"submit"}> Report Billboard Shower </button>
                <p>{reportText}</p>
			</form>
			<div>
			<button onClick={handleClick} style={{marginTop: '5em'}}> Get Current Contract Value </button>
			</div>
		</div>
    )
    


}