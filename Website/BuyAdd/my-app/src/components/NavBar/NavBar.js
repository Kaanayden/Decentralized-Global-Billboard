import React from "react";
import { add as dateAdd} from 'date-fns';
import BasicDatePicker from '../BasicDatePicker/BasicDatePicker';
import BasicTimePicker from '../BasicTimePicker/BasicTimePicker';
import '../NavBar/NavBar.css';


function NavBar({chosenDate,handleClickDate,handleClickTime,handleClickNowButton}) {
  return (
    <div className="nav-bar">
        <div className='dater'>
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
            <div>{chosenDate.toUTCString()}</div>
        </div>
    </div>
  );
}

export default NavBar;