{
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