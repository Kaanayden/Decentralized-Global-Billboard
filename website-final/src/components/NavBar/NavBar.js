import React from 'react';
import {  Link } from "react-router-dom";
import './NavBar.css'

const NavBar= (props) =>{
    const {connButtonText,connectWalletHandler} = props

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
        <li className='connect-button'>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
        </li>
    </ul>
    );
}
export default NavBar;