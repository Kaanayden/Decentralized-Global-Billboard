import React, {useRef, useEffect, useState, Suspense} from "react";
import AddGrid from "../AddGrid/AddGrid";
import { subMinutes, isBefore, isEqual } from 'date-fns';
import AddModal from "../Modal/Modal";
import './TimeLine.css';
import { Modal } from "@mui/material";


export default function TimeLine(props){
    const {chosenDate} = props
    const cards = []
    const chosenRef = useRef()
    //const [counter, setCounter] = useState(0)

    let start = new Date(subMinutes(chosenDate,chosenDate.getHours()*60+chosenDate.getMinutes()))
    //const end = new Date(subMinutes(start,-60*24))

    for(var j = 0; j < 1440/4; j++){
        const row = []
        for(var k = 0; k < 4; k++){
          if(isEqual(start,chosenDate)){
            row.push(<div ref={chosenRef} className="cards-item"><AddGrid 
              chosenDate={start}/>
              <AddModal addDate={start}/>
              </div>)
          }
          else row.push(<div className="cards-item"><AddGrid 
              chosenDate={start}/>
              <AddModal addDate={start}/>
              </div>)
            start = subMinutes(start,-1)
        }
        cards.push(<div className="cards">{row}</div>)
    }

    useEffect(()=>{
      window.scrollTo({ behavior: 'smooth', top: chosenRef.current?.offsetTop })
    },[chosenDate])

    return(
      <div>
          {cards.map((card)=>{
            return card;
          })}
      </div>
    )
}