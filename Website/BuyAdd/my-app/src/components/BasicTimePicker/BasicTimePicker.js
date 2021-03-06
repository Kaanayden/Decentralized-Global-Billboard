import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function BasicTimePicker({handleClickTime,chosenDate}) {
  const [value, setValue] = React.useState(chosenDate);
  React.useEffect(()=>{
    setValue(chosenDate)
  }, [chosenDate])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label="Select the Time"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        onAccept={(value)=>{handleClickTime(value)}}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
