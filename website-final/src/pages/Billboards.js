import React, { useState, useEffect } from 'react';
import BillboardCard from '../components/Card/BillboardCard';
import bigNumberToFloat from '../scripts/bigNumberToFloat';
import covalent from '../scripts/Covalent';

export default function Billboards(props){
    const {contract, account} = props
    const [elements, setElements] = useState([]);
    const [totalCoefficent, setTotalCoefficient] = useState();
    const [pool, setPool] = useState();

    
    const deactivateButton = async ( domainName ) => {
        try {
        await contract.deactivateBillboardShower( domainName );
        } catch( err ) {

        }
    }

    const activateButton = async ( domainName ) => {
        try {
        await contract.beBillboardShower( domainName );
        } catch( err ) {

        }
    }

    const withdraw = async ( domainName ) => {
        try {
        await contract.withdrawReward( domainName );
        } catch( err ) {

        }
    }

    async function getBillboards() {
        const data = await covalent();
        const events = data.billboards;
        const newList = [];
        const billboardNames = [];
        for( const anEvent of events ) {
            let domainName = anEvent.domainName;
            if( !billboardNames.includes( domainName ) ) {
                billboardNames.push( anEvent.domainName );
                const newBillboard = await contract.billboardShowers( domainName );
                const reward = await contract.getReward( domainName );
                const newElement = <BillboardCard key = {newBillboard} domainName = { domainName } billboard = {newBillboard} account = {account} deactivateButton = {deactivateButton} activateButton = {activateButton} reward = {reward} withdraw = {withdraw}/>
                
                newList.push( newElement );
            }
            
        }
        setElements( newList );
        contract.getCurrentTotalCoefficient()
        .then( output => setTotalCoefficient( output.toString() ) );
        contract.billboardShowerPool()
        .then( output => setPool(  bigNumberToFloat( output, 12 ) ) )
        
    }


    useEffect(()=>{
        getBillboards();
        const intervalId = setInterval( ()=>{
            getBillboards()
    },3000);
    return() => clearInterval( intervalId );

    },[contract]);
    

    return(
        <div style={{position:"relative", top:"60px"}}>
            <p>Total Coefficient : { totalCoefficent }</p>
            <p>Total reward in pool : { pool }</p>
            {elements.map( element => {
                return element;
            }) }
            
        </div>
    )
}