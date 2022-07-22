import React, { useEffect, useState, useRef } from 'react';
import { add as dateAdd} from 'date-fns';
import './App.css';
import BasicDatePicker from './BasicDatePicker/BasicDatePicker';
import BasicTimePicker from './BasicTimePicker/BasicTimePicker';
import TimeLine from './TimeLine/TimeLine';
import MainHeader from './images/main-header.jpg';
import { StickyContainer, Sticky } from 'react-sticky';

function convertToUTC( date ) {
    return dateAdd( date,{
        minutes: -date.getTimezoneOffset()
    }  );
}

const App = ()=>{

    const [chosenDate, setNewDate] = useState(new Date())
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
            <StickyContainer>
                <Sticky>{({ style }) => <h1 style={style}>{
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
                    </div> }  
                </h1>}</Sticky>
            <div className='time-line'>
                <TimeLine
                    changeChosenDate={changeChosenDate}
                    chosenDate={dateAdd( chosenDate,{
                        minutes: chosenDate.getTimezoneOffset()
                        } )} 
                />    
            </div>
            </StickyContainer>       
        </div>
    )
  }

export default App