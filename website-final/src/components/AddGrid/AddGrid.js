import React, {useState} from 'react'
import { subMinutes, isBefore, isEqual } from 'date-fns';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import AddModal from "../Modal/Modal";
import MainHeader from '../../images/exampleAd.png'

let isValid = (date)=>{
  if(isBefore(subMinutes(new Date,2880),date) && isBefore(date,subMinutes(new Date,10)))return true;
  return false;
}

function convertToUTCUnix( date ) {
  return date.getTime() / 1000 - date.getTimezoneOffset() * 60;
}

function isValidNew( date ) {
  let unix = convertToUTCUnix( date );
  let timeNow = new Date()
  let nowUnix = timeNow.getTime() / 1000;
  if( unix > nowUnix ) {
    return true;
  } else {
    return false;
  }
}

function BasicExample(props) {
  let colors = ['primary','secondary','success']



  return (
    <div >
      <Card bg={"primary"} style={{ width: '20rem'}}>
        <Card.Img style={{ width: '100%'}} variant="top" src={MainHeader} />
        <Card.Body>
          <Card.Text>
            {props.chosenDate.getHours().toString() + ":" + props.chosenDate.getMinutes().toString()}
          </Card.Text>
          {isValidNew( props.chosenDate ) &&
            <AddModal addDate={props.chosenDate} contract = {props.contract}/>}
        </Card.Body>
      </Card>
      </div>
  );
}

export default BasicExample;