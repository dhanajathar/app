import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import React from 'react';

const Principal = () => {
  return (
    <>
      <div className='page-text'>Search by any combination below.</div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField fullWidth size='small' label='Driver License / ID' />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <TextField fullWidth size='small' label='SSN' />
        </div>
      </div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField fullWidth size='small' label='Last Name' />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <TextField fullWidth size='small' label='First Name' />
        </div>
        <div className='col col-md-4 col-sm-12'>
          <div className={'date-picker has-date'}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                label='Date of Birth'
              />
            </LocalizationProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Principal;
