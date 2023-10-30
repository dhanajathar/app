import './index.css';

import { DEventService, DEvents } from '../../../../services/DEventService';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';

import mockData from './data.json';
import { useSearchParams } from 'react-router-dom';
import DAlertBox from '../../../DAlertBox';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');
  const mRegistrationRef = useRef();
  const eNoticeRef = useRef();
  const emailRef = useRef();
  const activatedRef = useRef();

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'Contact Details', step: 'Contact Details', flowId: flowId, substep: true }
    });
  }, 100);

  const { optionList, activatedOptionList } = mockData;

  const [isValidEmail, setIsValidEmail] = useState(null);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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
    newValues[name] = (name == 'mobile' || name == 'altPhone') ? formatPhoneNumber(value) : value === '--SELECT--' ? null : value;
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

    if (formattedValue.length > 10) {
      formattedValue = formattedValue.slice(0, 10);
    }
    const areaCode = formattedValue.slice(0, 3);
    const prefix = formattedValue.slice(3, 6);
    const lineNumber = formattedValue.slice(6);

    let formattedNumber = '';

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
      if (!isValidEmail) {
        setIsFormDisabled(true);
        setFocusedField('email');
      }
    } else {
      setIsValidEmail(null);

    }

  };

  const isValidPhoneNumber = (value) => {
    const pattern = /^\(\d{3}\) \d{3}-\d{4}$/;

    if (!pattern.test(value)) {
      return false;
    }

    const strippedNumber = value.replace(/\D/g, '');
    const firstThreeDigits = strippedNumber.substring(0, 3);

    if (strippedNumber.split('').every(char => char === strippedNumber[0])) {
      return false;
    }

    if (firstThreeDigits.split('').every(char => char === firstThreeDigits[0])) {
      return false;
    }

    return true;
  }

  const handleError = (e) => {
    const { name, value } = e?.target ?? {};
    const error = validateFiled(name, value);
    const errors = { ...validationError, [name]: error };
    if (error === '') {
      delete errors[name];
    }
    setValidationError(errors);
    setIsFormDisabled(Object.values(errors).some(error => error !== ''));
    setFocusedField(error !== '' ? name : '');

  };

  const validateFiled = (name, value) => {
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
              size='small'
              label='Mobile Phone'
              name="mobile"
              error={!!validationError?.mobile}
              value={contactFrom.mobile}
              helperText={
                <DAlertBox errorText={validationError?.mobile} />
              }
              disabled={isFormDisabled && focusedField !== 'mobile'}
              inputRef={focusedField === 'mobile' ? (input) => input && input.focus() : null}
              InputProps={{
                startAdornment: contactFrom.mobile !== "" && <InputAdornment position="start">+1</InputAdornment>,
              }}
              onKeyDown={handleBackspace}
              onBlur={handleError}
              onChange={handleChange}
            />
          </div>

          <div className='col col-md-4 col-sm-12'>
            <Autocomplete
              options={optionList}
              fullWidth
              size='small'
              name='mobilePhoneRegistration'
              disabled={isFormDisabled}
              value={contactFrom.mobilePhoneRegistration}
              onChange={(e, v) => {
                handleChange({ target: { name: 'mobilePhoneRegistration', value: v || null } });
                v == '--SELECT--' && mRegistrationRef.current.blur()

              }}
              renderInput={params => (
                <TextField
                  {...params}
                  inputRef={mRegistrationRef}
                  label='Mobile Phone Registration'
                />
              )}
            />
          </div>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              fullWidth
              size='small'
              name="altPhone"
              label='Alternate Phone'
              value={contactFrom.altPhone}
              onChange={handleChange}
              onBlur={handleError}
              InputProps={{
                startAdornment: contactFrom.altPhone !== "" && <InputAdornment position="start">+1</InputAdornment>,
              }}
              error={!!validationError?.altPhone}
              disabled={contactFrom.mobile === "" || (isFormDisabled && focusedField !== 'altPhone')}
              inputRef={focusedField === 'altPhone' ? (input) => input && input.focus() : null}
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
              fullWidth
              size='small'
              name="email"
              value={contactFrom.email}
              error={isValidEmail == false}
              helperText={
                <DAlertBox errorText={isValidEmail == false ? 'Invalid email address' : ''} />
              }
              disabled={isFormDisabled && focusedField !== 'email'}
              inputRef={focusedField === 'email' ? (input) => input && input.focus() : null}
              onChange={handleChange}
              onBlur={e => validateEmail(e.target.value)}
              InputProps={{
                endAdornment: contactFrom.email !== "" && isValidEmail && (
                  <InputAdornment position='end'>
                    {verifiedEmail === contactFrom.email ? (
                      <div className='input-adornment-text verified-text'> &#10004; Valid </div>
                    ) : (
                      <div className='input-adornment-text not-verified-text'>
                        {' '}
                        &#10060; Not Valid{' '}
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
              size='small'
              disabled={verifiedEmail !== contactFrom.email || isFormDisabled}
              value={contactFrom.emailNoticeSubscriber}
              name='emailNoticeSubscriber'
              className='enotice-sub'
              onChange={(e, v) => {
                handleChange({ target: { name: 'emailNoticeSubscriber', value: v || null } });
                v == '--SELECT--' && eNoticeRef.current.blur()
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  inputRef={eNoticeRef}
                  label='Enotice Subscriber'
                />
              )}
            />


          </div>
          <div className='col col-lg-2 col-md-4 col-sm-12'>
            <Autocomplete
              options={optionList}
              fullWidth
              size='small'
              disabled={verifiedEmail !== contactFrom.email || isFormDisabled}
              value={contactFrom.emailAlert}
              name='emailAlert'
              onChange={(e, v) => {
                handleChange({ target: { name: 'emailAlert', value: v || null } });
                v == '--SELECT--' && emailRef.current.blur()
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  inputRef={emailRef}
                  label='Email Alert'
                />
              )}
            />
          </div>
          <div className='col col-lg-2 col-md-4 col-sm-12'>
            <Autocomplete
              options={activatedOptionList}
              fullWidth disabled
              size='small'
              value={contactFrom.activated}
              name='activated'
              onChange={(e, v) => {
                handleChange({ target: { name: 'activated', value: v || null } });
                v == '--SELECT--' && activatedRef.current.blur()
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  inputRef={activatedRef}
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