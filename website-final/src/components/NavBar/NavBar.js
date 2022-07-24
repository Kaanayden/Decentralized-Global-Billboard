import React, {useEffect, useState} from 'react';
import {  Link } from "react-router-dom";
import {ethers} from 'ethers'
import './NavBar.css'
import contractAbi from '../abi.json';


const NavBar= (props) =>{
    const {connButtonText,connectWalletHandler,contract,account} = props
    const [balance, setBalance] = useState()
    
    const getCurrentBalance = async () => {
        let val = await contract.balanceOf( account );
        return val;
    }

    useEffect(()=>{
        const intervalId = setInterval( ()=>{

                contract.balanceOf( account )
                .then( val => {
                    const DECIMAL_NUMBER = 4;
                    let decimals = ethers.BigNumber.from( 10 ).pow( ethers.BigNumber.from( 18 - DECIMAL_NUMBER ) );
                    let floatValue = val.div( decimals ).toNumber() / 10 ** DECIMAL_NUMBER;
                    setBalance(floatValue );
                } );


            
        },1000);
        return() => clearInterval( intervalId );
    },[connButtonText])
    

    return (
    <ul className='nav-bar'>
        <li>
            <Link to="/">Buy Ad</Link>
        </li>
        <li>
            <Link to="/Billboards">Billboards</Link>
        </li>
        <li>
            <Link to="/MintToken">Mint Tokens</Link>
        </li>
        <li>
            <Link to="/Proposal">API Proposals</Link>
        </li>
        <li>
            <Link to="/ReportBillboard">Report Billboard</Link>
        </li>
        <li className='balance'>
            { contract && <div>Current Balance: {balance} BBRD</div>}
        </li>
        <li className='connect-button'>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
        </li>
    </ul>
    );
}
export default NavBar;