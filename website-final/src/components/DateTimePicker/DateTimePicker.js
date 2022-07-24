import React, {useEffect, useState} from "react";
import BasicDatePicker from './BasicDatePicker/BasicDatePicker';
import BasicTimePicker from "./BasicTimePicker/BasicTimePicker";
import { add as dateAdd} from 'date-fns';
import './DateTimePicker.css'

function convertToUTC( date ) {
    return dateAdd( date,{
        minutes: -date.getTimezoneOffset()
    }  );
}

export default function DateTimePicker(props){
    const {setDate} = props;
    
    const [chosenDate, setNewDate] = useState( new Date() )
    const [chosenTime, setNewTime] = useState( new Date() )
    chosenDate.setSeconds(0);
    const handleClickDate = (chosenDate)=>{
        setNewDate(chosenDate)
    }

    const handleClickTime = (chosenTime)=>{
        chosenDate.setHours(chosenTime.getHours());
        chosenDate.setMinutes(chosenTime.getMinutes());
        chosenDate.setSeconds(0);
        setNewDate(convertToUTC(chosenDate))
    }

    const handleClickNowButton = ()=>{
        setNewDate(new Date())
    }
    useEffect(()=>{
        setDate(chosenDate)
    },[chosenDate.getHours()*60+chosenDate.getMinutes()])

    return(
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
    )
}