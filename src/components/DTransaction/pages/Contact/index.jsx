import './index.css';

import { DEventService, DEvents } from '../../../../services/DEventService';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';

import mockData from './data.json';
import { useSearchParams } from 'react-router-dom';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'Contact Details', step: 'Contact Details', flowId: flowId, substep: true }
    });
  }, 100);

  const { optionList, activatedOptionList } = mockData;
  const [mobilePhoneRegistration, setMobilePhoneRegistration] = useState(
    mockData.mobilePhoneRegistration
  );
  const [emailSubscriber, setEmailSubscriber] = useState(mockData.emailSubscriber);
  const [emailAlert, setEmailAlert] = useState(mockData.emailAlert);
  const [activated, setActivated] = useState(mockData.activated);
  const [email, setEmail] = useState(mockData.email);
  const [mobile, setMobile] = useState(mockData.mobile);
  const [altPhone, setAltPhone] = useState(mockData.altPhone);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const handleSubmit = e => {
    e.preventDefault();
    if (isValidEmail) {
    }
  };

  const formatPhoneNumber = phoneNumber => {
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

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    setIsValidEmail(isValidEmail);
    setEmail(email);
  };

  return (
    <div className='d-container'>
      <form onSubmit={handleSubmit}>
        <div className='d-sub-title'> Contact Details </div>
        <div className='d-row'>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              fullWidth
              label='Mobile Phone'
              value={mobile}
              onChange={e => setMobile(formatPhoneNumber(e.target.value))}
            />
          </div>

          <div className='col col-md-4 col-sm-12'>
            <FormControl fullWidth>
              <InputLabel id='mobilePhoneRegistration'> Mobile Phone Registration </InputLabel>
              <Select
                id={'mobilePhoneRegistration'}
                label={'Mobile Phone Registration'}
                value={mobilePhoneRegistration}
                onChange={e => setMobilePhoneRegistration(e.target.value)}
              >
                {optionList?.map(item => {
                  return (
                    <MenuItem key={item} value={item}>
                      {' '}
                      {item}{' '}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              fullWidth
              label='Alternate Phone'
              value={altPhone}
              onChange={e => setAltPhone(formatPhoneNumber(e.target.value))}
            />
          </div>
        </div>
        <div className='d-row'>
          <div className='col col-md-8 col-sm-12'>
            <TextField
              label='Email Address'
              type={'email'}
              fullWidth
              value={email}
              error={!isValidEmail}
              helperText={!isValidEmail ? 'Invalid email address' : ''}
              onChange={e => validateEmail(e.target.value)}
            />
          </div>
        </div>
        <div className='d-row'>
          <div className='col col-lg-2 col-md-4 col-sm-12'>
            <FormControl fullWidth>
              <InputLabel id='Enotice'>Enotice Subscriber</InputLabel>
              <Select
                id='Enotice'
                value={emailSubscriber}
                label={'Enotice Subscriber'}
                onChange={e => setEmailSubscriber(e.target.value)}
              >
                {optionList?.map(item => {
                  return (
                    <MenuItem key={item} value={item}>
                      {' '}
                      {item}{' '}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className='col col-lg-2 col-md-4 col-sm-12'>
            <FormControl fullWidth>
              <InputLabel id='emailAlert'>Email Alert</InputLabel>
              <Select
                id='emailAlert'
                value={emailAlert}
                label={'Email Alert'}
                onChange={e => setEmailAlert(e.target.value)}
              >
                {optionList?.map(item => {
                  return (
                    <MenuItem key={item} value={item}>
                      {' '}
                      {item}{' '}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className='col col-lg-2 col-md-4 col-sm-12'>
            <FormControl fullWidth>
              <InputLabel id='activated'>Activated</InputLabel>
              <Select
                id='activated'
                value={activated}
                label={'Activated'}
                onChange={e => setActivated(e.target.value)}
              >
                {activatedOptionList?.map(item => {
                  return (
                    <MenuItem key={item} value={item}>
                      {' '}
                      {item}{' '}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        </div>
      </form>
    </div>
  );
}
