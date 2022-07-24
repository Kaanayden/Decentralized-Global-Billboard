import React, {useState} from 'react';
import {ethers} from 'ethers';
//import contractAbi from './Navbar/abi';


export default function ReportBillboard(props){
    const {contract} = props
    console.log( contract );
    
    const currentTrafficCheckerUrl = contract.TRAFFIC_AND_FIRST_BILLBOARD_CHECKER_API_URL();
    const currentBillboardChecker = contract.BILLBOARD_CHECKER_API_URL();

    async function handleClick() {

    }

    const setApiTestHandler = async (event) => {
		event.preventDefault();
        let input = event.target.setText.value;

	}
	

    return(
		<div>
        <h4> Current Traffic Fetcher API URL:  </h4>
        <h4></h4>
		<h4> {"Get/Set Contract interaction"} </h4>
			<form onSubmit={setApiTestHandler}>
				<input id="setText" type="text"/>
				<button type={"submit"}> Update Contract </button>
			</form>
			<div>
			<button onClick={handleClick} style={{marginTop: '5em'}}> Get Current Contract Value </button>
			</div>
		</div>
    )
    


}