import { setSeconds } from 'date-fns';
import React, { useState } from 'react';
import DateTimePicker from '../components/DateTimePicker/DateTimePicker';
import TimeLine from '../components/TimeLine/TimeLine';


export default function BuyAd(props){
    const {contract} = props
    const [chosenDate, setChosenDate] = useState(new Date)

    const setDate = (date)=>{
        setChosenDate(date)
        console.log(chosenDate.toString())
    }
    return(
        <div style={{position:"relative", top:"60px"}}>
            <div>
                <DateTimePicker setDate={setDate}/>
            </div>
            <div style={{position:"relative", top:"100px"}}><TimeLine chosenDate={chosenDate}/></div>
        </div>
    )
}