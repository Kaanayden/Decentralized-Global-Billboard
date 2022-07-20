import React, {useRef, useEffect, useState} from "react";
import AddGrid from "../AddGrid/AddGrid";
import Carousel from '../Carousel/Carousel';
import './TimeLine.css';


export default function TimeLine(props){
    const {chosenDate, changeChosenDate} = props
    const chosenRef = useRef()
    const [buttons, setButtons] = useState(createButtons(20));
    const index = 1;

    
    function createButtons(n){
        const button = []
        for(var i = 0; i < n; i++){
            button.push(<li className="add-grid"><AddGrid chosenDate={chosenDate}/></li>)
        }
        //setButtons(buttons);
        return button;
    }
    useEffect(()=>{
        setButtons(buttons)
        console.log("deniyoz")
    },[chosenDate])


    return(
        <div>
            <Carousel
                show = {10}
                chosenDate = {chosenDate}
                changeChosenDate = {changeChosenDate}
                index = {index}
            >
                {buttons}
            </Carousel>
        </div>
    )
}