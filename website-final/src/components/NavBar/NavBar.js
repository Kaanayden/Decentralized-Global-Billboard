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
        setInterval( async()=>{
            let val = await contract.balanceOf( account );
            setBalance(val)
        },10000)
        console.log("selam")
    },[connButtonText])
    

    return (
    <ul className='nav-bar'>
        <li>
            <Link to="/">Buy Ad</Link>
        </li>
        <li>
            <Link to="/AdShowers">Ad Showers</Link>
        </li>
        <li>
            <Link to="/ApiTest">ApiTest</Link>
        </li>
        <li>
            <Link to="/Proposal">Proposal</Link>
        </li>
        <li>
            <Link to="/ReportBillboard">ReportbillBoard</Link>
        </li>
        <li className='balance'>
            <div>Current Balance:</div>
        </li>
        <li className='connect-button'>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
        </li>
    </ul>
    );
}
export default NavBar;