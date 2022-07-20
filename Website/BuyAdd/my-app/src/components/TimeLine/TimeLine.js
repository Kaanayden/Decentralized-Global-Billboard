import React, {useRef, useEffect, useState, Suspense} from "react";
import AddGrid from "../AddGrid/AddGrid";
import { subMinutes, isBefore } from 'date-fns';
import {Grid} from 'react-virtualized';
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
        const column = []
        for(var k = 0; k < 4; k++){
            column.push(<div className="cards-item"><AddGrid chosenDate={start}/></div>)
            start = subMinutes(start,-1)
        }
        cards.push(column)
    }

    function cellRenderer({columnIndex, key, rowIndex, style}) {
        return (
          <div key={key} style={style}>
            {cards[rowIndex][columnIndex]}
          </div>
        );
    }

    return(
            <Grid
            //scrollToRow={(chosenDate.getHours()*60+chosenDate.getMinutes())/4}
            cellRenderer={cellRenderer}
            columnCount={cards[0].length}
            columnWidth={500}
            height={1000}
            rowCount={cards.length}
            rowHeight={200}
            width={2000}
            />
    )
}