import React, {useRef, useEffect, useState, Suspense} from "react";
import AddGrid from "../AddGrid/AddGrid";
import { subMinutes, isBefore } from 'date-fns';
import VisibilitySensor from 'react-visibility-sensor';
import './TimeLine.css';


export default function TimeLine(props){
    const {chosenDate, changeChosenDate} = props
    const cards = []
    const chosenRef = useRef()
    const [counter, setCounter] = useState(0)
    const index = 8;

    const start = new Date(subMinutes(chosenDate,chosenDate.getHours()*60+chosenDate.getMinutes()))
    const end = new Date(subMinutes(start,-60*24))
    for(let i = start; isBefore(i,end); i=subMinutes(i,-1)){
                /*if(i === chosenDate){
                    cards.push(<VisibilitySensor>
                                    {({isVisible}) =>
                                        <div ref={useRef} className="card"><AddGrid chosenDate={i}/></div>
                                    }
                                </VisibilitySensor>)
                    }
                else cards.push(<VisibilitySensor>
                                    {({isVisible}) =>
                                    <div className="card"><AddGrid chosenDate={i}/></div>
                                     }
                                </VisibilitySensor>)
                */
        cards.push(i);

    }
    return(
        <div className="cards">{
            cards.map((date)=>{
                return(
                    <VisibilitySensor>
                    {({isVisible}) =>
                        <div className="cards-item"><AddGrid chosenDate={date}/></div>
                    }
                    </VisibilitySensor>
                )
            })
        }
        </div>
    )
}