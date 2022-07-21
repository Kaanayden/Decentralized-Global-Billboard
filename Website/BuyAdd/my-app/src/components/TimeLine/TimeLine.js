import React, {useRef, useEffect, useState, Suspense} from "react";
import AddGrid from "../AddGrid/AddGrid";
import { subMinutes, isBefore, isEqual } from 'date-fns';
import {Grid, WindowScroller, AutoSizer} from 'react-virtualized';
import Infinite from 'react-infinite';
import './TimeLine.css';


export default function TimeLine(props){
    const {chosenDate, changeChosenDate} = props
    const cards = []
    const chosenRef = useRef()
    const [counter, setCounter] = useState(0)
    const index = 8;

    let start = new Date(subMinutes(chosenDate,chosenDate.getHours()*60+chosenDate.getMinutes()))
    //const end = new Date(subMinutes(start,-60*24))
    for(var j = 0; j < 1440/4; j++){
        const row = []
        for(var k = 0; k < 4; k++){
          if(isEqual(start,chosenDate)){
            row.push(<div ref={chosenRef} className="cards-item"><AddGrid chosenDate={start}/></div>)
          }
          else row.push(<div className="cards-item"><AddGrid chosenDate={start}/></div>)
            start = subMinutes(start,-1)
        }
        cards.push(<div className="cards">{row[0]}{row[1]}{row[2]}{row[3]}</div>)
    }
    useEffect(()=>{
      chosenRef.current?.scrollIntoView();
    },[chosenDate])

    return(
      <div>
        <Infinite 
          containerHeight={100}
          elementHeight={200}
          useWindowAsScrollContainer>
          {cards.map((card)=>{
            return card;
          })}
        </Infinite>
      </div>
    )
}