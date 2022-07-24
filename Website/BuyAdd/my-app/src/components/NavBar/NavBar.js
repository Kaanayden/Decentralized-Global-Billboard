import React from "react";
import { add as dateAdd} from 'date-fns';
import BasicDatePicker from '../BasicDatePicker/BasicDatePicker';
import BasicTimePicker from '../BasicTimePicker/BasicTimePicker';
import '../NavBar/NavBar.css';


function NavBar({chosenDate,handleClickDate,handleClickTime,handleClickNowButton,connectWalletHandler,connButtonText}) {
  return (
    <div className="nav-bar">
        <div className='dater'>
            <button className="billboard-showers" onClick>Billboard Showers</button>
            <div className="date">{chosenDate.toUTCString()}</div>
            <BasicDatePicker className="date-picker" 
                chosenDate = {dateAdd( chosenDate,{
                    minutes: chosenDate.getTimezoneOffset()
                    } )} 
                handleClickDate = {handleClickDate}/>
            <BasicTimePicker className="time-picker" 
                chosenDate = {dateAdd( chosenDate,{
                    minutes: chosenDate.getTimezoneOffset()
                    } )}  
                handleClickTime = {handleClickTime}/>
            <button className="now-button" onClick={handleClickNowButton}>Now</button>
            <button className='conn-button' onClick={connectWalletHandler}>{connButtonText}</button>
        </div>
    </div>
  );
}

export default NavBar;