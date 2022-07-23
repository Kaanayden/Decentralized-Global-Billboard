import React, { useEffect, useState, useRef } from 'react';
import { add as dateAdd} from 'date-fns';
import './App.css';
import BasicDatePicker from './BasicDatePicker/BasicDatePicker';
import BasicTimePicker from './BasicTimePicker/BasicTimePicker';
import TimeLine from './TimeLine/TimeLine';
import NavBar from './NavBar/NavBar';

function convertToUTC( date ) {
    return dateAdd( date,{
        minutes: -date.getTimezoneOffset()
    }  );
}

const App = ()=>{

    const [chosenDate, setNewDate] = useState( new Date() )
    const [chosenTime, setNewTime] = useState(new Date())
    const [isChosen, setChosen] = useState(false)
   // const chosenHourRef = useRef();

    const handleClickDate = (chosenDate)=>{
        setNewDate(chosenDate)
    }

    const handleClickTime = (chosenTime)=>{
        chosenDate.setHours(chosenTime.getHours());
        chosenDate.setMinutes(chosenTime.getMinutes());
        setNewDate(convertToUTC(chosenDate))
        setChosen(true)
    }

    const handleClickNowButton = ()=>{
        setNewDate(new Date())
        setChosen(true)
    }

    const changeChosenDate = (value)=>{
        setNewDate(dateAdd(chosenDate,{minutes: value}))
    }

    return(
        <div className='all-app'>
            <div className='nav-bar'>
                <NavBar 
                    chosenDate={chosenDate}
                    handleClickDate={handleClickDate}
                    handleClickNowButton={handleClickNowButton}
                    handleClickTime={handleClickTime}
                />
            </div>
            <div className='main'>
                <TimeLine
                    changeChosenDate={changeChosenDate}
                    chosenDate={dateAdd( chosenDate,{
                        minutes: chosenDate.getTimezoneOffset()
                        } )} 
                />    
            </div>      
        </div>
    )
  }

export default App;