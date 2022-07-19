import React, {useRef, useEffect} from "react";
import './TimeLine.css';

export default function TimeLine({chosenHour}){
    const chosenHourRef = useRef()
    const buttons = [];
    function createButtons(n){
        for(var i = 0; i < n; i++){
            if(i == chosenHour)buttons.push(<li><button ref={chosenHourRef}>Chosen</button></li>)
            else buttons.push(<li><button>{i}</button></li>)
        }
        //setButtons(buttons);
        return buttons;
    }

    useEffect(()=>{
        chosenHourRef.current.scrollIntoView({
            behavior: "smooth",
        });
    }, [chosenHour])

    return(
        <div>
            <ul>
                {createButtons(100)}
            </ul>
        </div>
    )
}