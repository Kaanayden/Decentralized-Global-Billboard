import React, { useState, useEffect } from 'react';
import BillboardCard from '../components/Card/BillboardCard';
import covalent from '../scripts/Covalent';

export default function Billboards(props){
    const {contract, account} = props
    const [elements, setElements] = useState([]);
    


    async function getBillboards() {
        const data = await covalent();
        const events = data.billboards;
        const newList = [];
        for( const anEvent of events ) {
            let domainName = anEvent.domainName;
            const newBillboard = await contract.billboardShowers( domainName );
            const newElement = <BillboardCard key = {newBillboard} domainName = { domainName } billboard = {newBillboard} account = {account}/>
            newList.push( newElement );
            
        }
        setElements( newList );
        
    }


    useEffect(()=>{
        getBillboards();
    },[contract]);
    

    return(
        <div style={{position:"relative", top:"60px"}}>
            {elements.map( element => {
                return element;
            }) }
            
        </div>
    )
}