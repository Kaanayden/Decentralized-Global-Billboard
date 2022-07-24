import React, {useState} from 'react';
import {ethers} from 'ethers';
import contractAbi from './abi';

const Covalent = async () => {
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
}
export default Covalent;
