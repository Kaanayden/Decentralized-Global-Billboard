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

function BasicExample({chosenDate,isColor}) {
  let colors = ['primary','secondary','success']

  return (
      <Card bg={"primary"} style={{ width: '20rem'}}>
        <Card.Img style={{ width: '100%'}} variant="top" src={MainHeader} />
        <Card.Body>
          <Card.Text>
            {chosenDate.toString()}
          </Card.Text>
          <AddModal addDate={chosenDate} isValid={isValid(chosenDate)}/>
        </Card.Body>
      </Card>
  );
}

export default BasicExample;