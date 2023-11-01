import React, { useState } from 'react';
import { InputAdornment, IconButton } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import dayjs from 'dayjs';
import { calculateAge } from '../../utils/dateUtils';
import DAlertBox from '../DAlertBox';

const DDatePicker = React.memo(({ label, disabled, name, validationError, focusedField, value, minDate, maxDate, handleChange, handleError, isCalculateAge = false }) => {
  console.log(validationError)
  const [calendarOpen, setCalendarOpen] = useState(false);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        fullWidth
        disabled={disabled}
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        slotProps={{
          textField: {
            size: 'small',
            fullWidth: true,
            error: !!validationError,
            helperText: <DAlertBox errorText={validationError} />,
            inputRef: focusedField === name ? (input) => input && input.focus() : null,
            onBlur: e => handleError(name, e.target.value),
            InputProps: {
              endAdornment: (
                <>
                  <InputAdornment position='end'>
                    <IconButton onClick={() => { !disabled && setCalendarOpen((calendarOpen) => !calendarOpen) }}>
                      <CalendarMonthTwoToneIcon />
                    </IconButton>
                  </InputAdornment>
                  {value && isCalculateAge && <InputAdornment position='end'>
                    {' '}
                    <div className='input-adornment-text'> {calculateAge(value)} </div>{' '}
                  </InputAdornment>}
                </>
              )
            }
          }
        }}
        maxDate={maxDate}
        minDate={minDate}
        value={value && dayjs(value)}
        onChange={date => handleChange(dayjs(date).format('DD/MM/YYYY'), name)}
      />
    </LocalizationProvider>
  );
});

export default DDatePicker;
