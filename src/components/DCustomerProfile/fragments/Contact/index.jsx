import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  InputAdornment
} from '@mui/material';
import React, { useState } from 'react';
import './ContactFragment.css';
import mockData from './data.json';

export default function ContactFragment() {
  const [data, setData] = useState(mockData);


  const formatPhoneNumber = (phoneNumber) => {
    let formattedValue = phoneNumber.replace(/\D/g, '');

    if (formattedValue.length > 11) {
      formattedValue = formattedValue.slice(0, 11);
    }
    const countryCode = formattedValue.slice(0, 1);
    const areaCode = formattedValue.slice(1, 4);
    const prefix = formattedValue.slice(4, 7);
    const lineNumber = formattedValue.slice(7);

    let formattedNumber = '';
    if (countryCode) {
      formattedNumber += `+${countryCode} `;
    }
    if (areaCode) {
      formattedNumber += `(${areaCode})`;
    }
    if (prefix) {
      formattedNumber += ` ${prefix}`;
    }
    if (lineNumber) {
      formattedNumber += `-${lineNumber}`;
    }

    return formattedNumber;
  };
  return (
    <>
      <div className='d-sub-title'> Contact Details </div>
      <div className='d-row'>
        <div className='col col-md-4 col-sm-12'>
          <FormControl fullWidth>
            <TextField
              variant='outlined'
              label='Mobile Phone'
              disabled
              value={formatPhoneNumber(data.mobile)}
              onChange={e => setData({ ...data, mobile: e.target.value })}
            />
          </FormControl>
        </div>
        <div className='col col-md-4 col-sm-12'>
          <FormControl fullWidth>
            <InputLabel id='mobilePhoneRegistration'>Mobile Phone Registration</InputLabel>
            <Select
              labelId='mobilePhoneRegistration'
              id='mobilePhoneRegistration'
              defaultValue={data.mobilePhoneRegistration}
              disabled
              label='Mobile Phone Registration'
              onChange={e => setData({ ...data, mobilePhoneRegistration: e.target.value })}
            >
              <MenuItem value={'yes'}>Yes</MenuItem>
              <MenuItem value={'no'}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className='col col-md-4 col-sm-12'>
          <FormControl fullWidth>
            <TextField
              variant='outlined'
              label='Alternate Phone'
              disabled
              value={data.altPhone}
              onChange={e => setData({ ...data, altPhone: e.target.value })}
            />
          </FormControl>
        </div>
      </div>

      <div className='d-row'>
        <div className='col col-md-8 col-sm-12'>
          <FormControl fullWidth>
            <TextField
              variant='outlined'
              label='Email Address'
              type={'email'}
              disabled
              className='input-adornment'
              value={data.email}
              onChange={e => setData({ ...data, email: e.target.value })}
              InputProps={{
                endAdornment: <InputAdornment position='end'>
                  {data.isEmailVerified ? (
                    <div className='input-adornment-text verified-text'> &#10004; Verified </div>
                  ) : (
                    <div className='input-adornment-text not-verified-text'>
                      {' '}
                      &#10060; Not Verified{' '}
                    </div>
                  )}
                </InputAdornment>

              }}
            />
          </FormControl>
        </div>
      </div>
      <div className='d-row'>
        <div className='col col-md-2 col-sm-12'>
          <FormControl fullWidth>
            <InputLabel id='emailSubscriber'>ENotice Subscriber</InputLabel>
            <Select
              labelId='emailSubscriber'
              id='emailSubscriber'
              defaultValue={data.emailSubscriber}
              disabled
              label='Enotice Subscriber'
              onChange={e => setData({ ...data, emailSubscriber: e.target.value })}
            >
              <MenuItem value={'yes'}>Yes</MenuItem>
              <MenuItem value={'no'}>No</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className='col col-md-2 col-sm-12'>
          <FormControl fullWidth>
            <InputLabel id='emailAlert'>Email Alert</InputLabel>
            <Select
              labelId='emailAlert'
              id='emailAlert'
              defaultValue={data.emailAlert}
              disabled
              label='Email Alert'
              onChange={e => setData({ ...data, emailAlert: e.target.value })}
            >
              <MenuItem value={'yes'}>Yes</MenuItem>
              <MenuItem value={'no'}>No</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className='col col-md-2 col-sm-12'>
          <FormControl fullWidth>
            <InputLabel id='activated'>Activated</InputLabel>
            <Select
              labelId='activated'
              id='activated'
              defaultValue={data.activated}
              disabled
              label='Name Suffix'
              onChange={e => setData({ ...data, activated: e.target.value })}
            >
              <MenuItem value={'yes'}>Yes</MenuItem>
              <MenuItem value={'no'}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </>
  );
}
