import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function BasicDatePicker({handleClickDate,chosenDate}) {
  const [value, setValue] = React.useState(chosenDate);
  React.useEffect(()=>{
    setValue(chosenDate)
  }, [chosenDate])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Select the Date"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        onAccept={(value)=>{handleClickDate(value)}}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
