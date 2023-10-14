import './UspassportFragment.css';

import { InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import data from './api-response-uspassport.json';
export default function UspassportFragment(props) {
  return (
    <>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField
            fullWidth
            id='passportnumber'
            label='Passport Number'
            name='passportnumber'
            className='input-adornment'
            value={data.passportNumber}
            disabled
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {data.status && (
                    <div className='verified-text input-adornment-text'> &#10004; Verified </div>
                  )}
                  {!data.status && data.status != null && (
                    <div className='input-adornment-text not-verified-text'>
                      {' '}
                      &#10060; Not Verified{' '}
                    </div>
                  )}
                </InputAdornment>
              )
            }}
          />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Issue Date'
              slotProps={{ textField: { fullWidth: true } }}
              disabled
              value={dayjs(data.issueDate)}
            />
          </LocalizationProvider>
        </div>
        <div className='col col-sm-12 col-md-4'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              flex-end
              slotProps={{ textField: { fullWidth: true } }}
              disabled
              label='Expiration Date'
              value={dayjs(data.expirationDate)}

            />
          </LocalizationProvider>
        </div>
      </div>
      <div className='d-row'>

        <div className='col col-sm-12 col-md-4'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              disabled
              slotProps={{ textField: { fullWidth: true } }}
              label='Verify Date'
              value={dayjs(data.verifyDate)}
            />
          </LocalizationProvider>
        </div>
      </div>
    </>
  );
}