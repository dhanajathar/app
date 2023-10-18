import './index.css';

import { DEventService, DEvents } from '../../../../services/DEventService';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';

import mockData from './data.json';
import { useSearchParams } from 'react-router-dom';
import DAlertBox from '../../../DAlertBox';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'Contact Details', step: 'Contact Details', flowId: flowId, substep: true }
    });
  }, 100);

  const { optionList, activatedOptionList } = mockData;

  const [isValidEmail, setIsValidEmail] = useState(null);

  const verifiedEmail = 'jony_doe@gmail.com'
  const handleSubmit = e => {
    e.preventDefault();
    if (isValidEmail) {
    }
  };
  const [validationError, setValidationError] = useState();

  const [contactFrom, setContactFrom] = useState({
    mobile: '',
    mobilePhoneRegistration: '',
    emailNoticeSubscriber: '',
    email: '',
    altPhone: '',
    emailAlert: '',
    activated: ''
  });


  const handleChange = (e) => {
    const { name, value } = e?.target ?? {};
    const newValues = { ...contactFrom };
    newValues[name] = (name == 'mobile' || name == 'altPhone') ? formatPhoneNumber(value) : value;
    setContactFrom(newValues);
  };

  const handleBackspace = (e) => {
    const { name, value } = e?.target ?? {};
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newValues = { ...contactFrom };
      newValues[name] = value.slice(0, -1);
      setContactFrom(newValues);

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
    if (email !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(email);
      setIsValidEmail(isValidEmail);
    } else {
      setIsValidEmail(null)
    }

  };

  const isValidPhoneNumber = (value) => {
    const pattern = /^\+\d{1,3}\s\(\d{3}\)\s\d{3}-\d{4}$/;
    return pattern.test(value)
  }

  const handleError = (e) => {
    const { name, value } = e?.target ?? {};
    const error = validateFiled(name, value);
    const errors = { ...validationError, [name]: error };
    if (error === '') {
      delete errors[name];
    }
    setValidationError(errors);
  };

  const validateFiled = (name, value) => {
    console.log(isValidPhoneNumber(value))
    let error = '';
    switch (name) {
      case 'mobile':
        if (value !== "" && !isValidPhoneNumber(value)) {
          error = 'Invalid Mobile Phone Number';
        }
        break;
      case 'altPhone':
        if (value !== "" && !isValidPhoneNumber(value)) {
          error = 'Invalid Alternate Phone Number';
        }
        break;
      case 'language':
        if (!value) {
          error = 'Invalid  Language';
        }
        break;
      default:
    }
    return error;
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
              name="mobile"
              error={!!validationError?.mobile}
              value={contactFrom.mobile}
              helperText={
                <DAlertBox errorText={validationError?.mobile} />
              }
              onKeyDown={handleBackspace}
              onBlur={handleError}
              onChange={handleChange}
            />
          </div>

          <div className='col col-md-4 col-sm-12'>
            <Autocomplete
              options={optionList}
              fullWidth
              name='mobilePhoneRegistration'
              value={contactFrom.mobilePhoneRegistration}
              onChange={handleChange}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Mobile Phone Registration'
                />
              )}
            />
          </div>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              disabled={contactFrom.mobile === ""}
              fullWidth
              name="altPhone"
              label='Alternate Phone'
              value={contactFrom.altPhone}
              onChange={handleChange}
              onBlur={handleError}
              error={!!validationError?.altPhone}
              onKeyDown={handleBackspace}
              helperText={
                <DAlertBox errorText={validationError?.altPhone} />
              }
            />
          </div>
        </div>
        <div className='d-row'>
          <div className='col col-md-8 col-sm-12'>
            <TextField
              label='Email Address'
              type={'email'}
              fullWidth
              name="email"
              value={contactFrom.email}
              error={isValidEmail == false}
              helperText={isValidEmail == false ? 'Invalid email address' : ''}
              onChange={handleChange}
              onBlur={e => validateEmail(e.target.value)}
              InputProps={{
                endAdornment: contactFrom.email !== "" && isValidEmail && (
                  <InputAdornment position='end'>
                    {verifiedEmail === contactFrom.email ? (
                      <div className='input-adornment-text verified-text'> &#10004; Verified </div>
                    ) : (
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
        </div>
        <div className='d-row'>
          <div className='col col-lg-2 col-md-4 col-sm-12'>
            <Autocomplete
              options={optionList}
              fullWidth
              value={contactFrom.emailNoticeSubscriber}
              name='emailNoticeSubscriber'
              onChange={handleChange}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Enotice Subscriber'
                />
              )}
            />


          </div>
          <div className='col col-lg-2 col-md-4 col-sm-12'>
            <Autocomplete
              options={optionList}
              fullWidth
              value={contactFrom.emailAlert}
              name='emailAlert'
              onChange={handleChange}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Email Alert'
                />
              )}
            />
          </div>
          <div className='col col-lg-2 col-md-4 col-sm-12'>
            <Autocomplete
              options={activatedOptionList}
              fullWidth
              value={contactFrom.activated}
              name='activated'
              onChange={handleChange}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Activated'
                />
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
