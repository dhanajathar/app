import { Divider, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const PersonalDetails = ({ onButtonDisabled, formData, handleFormChange }) => {
  const [isShowAdditionalDetails, setIsShowAdditionalDetails] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [middleNameError, setMiddleNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [disabledEmail, setDisabledEmail] = useState();
  const [disabledTopForm, setDisabledTopForm] = useState();
  const genderItems = ['Male', 'Female', 'Others'];

  useEffect(() => {
    const isFirstNameValid = formData.firstName.trim().length >= 2;
    const isMiddleNameValid = formData.middleName.trim().length >= 2;
    const isLastNameValid = formData.lastName.trim().length >= 1;
    const isDateOfBirthValid = formData.dateOfBirth !== null;
    onButtonDisabled(
      (isLastNameValid && isDateOfBirthValid) ||
        (isFirstNameValid && isDateOfBirthValid) ||
        (isLastNameValid && isMiddleNameValid && isDateOfBirthValid) ||
        (isFirstNameValid && isMiddleNameValid && isDateOfBirthValid) ||
        (isLastNameValid && isFirstNameValid) ||
        validateEmail(formData.email)
        ? false
        : true,
      1
    );
  }, [formData]);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateInput = value => {
    const allowedCharactersRegex = /^[a-zA-Z0-9! "#$%&'()*+,-./:;<=>?@\\_`{|}~]*$/;
    if (value) {
      if (!allowedCharactersRegex.test(value) || value.trim() === '' || value.match(/\s{2,}/)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handleEmailValidation = () => {
    setDisabledEmail(false);
    setDisabledTopForm(true);
    if (formData.email !== '') {
      validateEmail(formData.email) ? setEmailError('') : setEmailError('Invalid Email');
    } else {
      setEmailError('');
    }
  };

  const handleClick = () => setIsShowAdditionalDetails(!isShowAdditionalDetails);

  const renderAdditionDetails = () => {
    return (
      <div className='d-row'>
        <div className='col col-sm-12 col-md-6 col-lg-4'>
          <TextField
            type='text'
            size='small'
            id='mName'
            name='middleName'
            fullWidth
            label='Middle Name'
            variant='outlined'
            value={formData.middleName}
            error={!!middleNameError}
            helperText={middleNameError}
            disabled={disabledTopForm}
            onChange={handleFormChange}
            onBlur={() => {
              validateInput(formData.middleName)
                ? setMiddleNameError('Invalid Middle Name')
                : setMiddleNameError('');
            }}
            inputProps={{ maxLength: 33 }}
          />
        </div>
        <div className='col col-sm-12 col-md-3 col-lg-2'>
          <FormControl disabled={disabledTopForm} fullWidth size='small'>
            <InputLabel id='genderLabel'>Gender</InputLabel>
            <Select
              labelId='genderLabel'
              id='gender'
              label='Gender'
              name='gender'
              value={formData.gender}
              onChange={handleFormChange}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {genderItems.length &&
                genderItems.map(item => {
                  return (
                    <MenuItem key={`${item}`} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
        <div className='col col-sm-12 col-md-3 col-lg-2'>
          <FormControl disabled={disabledTopForm} fullWidth size='small'>
            <InputLabel id='suffixLabel'>Suffix</InputLabel>
            <Select
              labelId='suffixLabel'
              id='suffix'
              label='Suffix'
              name='suffix'
              value={formData.suffix}
              onChange={handleFormChange}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value={'mr'}>Mr.</MenuItem>
              <MenuItem value={'mrs'}>Mrs.</MenuItem>
              <MenuItem value={'ms'}>Ms.</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='page-text'>
        Search a customer by any combination below to perform a fuzzy search.
      </div>
      <form
        onBlur={() => {
          setDisabledEmail(true);
          setDisabledTopForm(false);
        }}
      >
        <div className='d-row'>
          <div className='col col-sm-12 col-lg-4 col-md-6'>
            <TextField
              id='lName'
              fullWidth
              label='Last Name'
              name='lastName'
              autoComplete='off'
              disabled={disabledTopForm}
              size='small'
              value={formData.lastName}
              error={!!lastNameError}
              helperText={lastNameError}
              onChange={handleFormChange}
              onBlur={() => {
                validateInput(formData.lastName)
                  ? setLastNameError('Invalid Last Name')
                  : setLastNameError('');
              }}
              inputProps={{ maxLength: 33 }}
            />
          </div>
          <div className='col col-sm-12 col-lg-4 col-md-6'>
            <TextField
              id='fName'
              name='firstName'
              size='small'
              fullWidth
              label='First Name'
              value={formData.firstName}
              disabled={disabledTopForm}
              error={!!firstNameError}
              helperText={firstNameError}
              onChange={handleFormChange}
              onBlur={() => {
                validateInput(formData.firstName)
                  ? setFirstNameError('Invalid First Name')
                  : setFirstNameError('');
              }}
              inputProps={{ maxLength: 33 }}
            />
          </div>
          <div className='col col-sm-12 col-lg-4 col-md-6'>
            <div className={'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  fullWidth
                  id='dob'
                  slotProps={{ textField: { size: 'small' } }}
                  name='dateOfBirth'
                  disabled={disabledTopForm}
                  size='small'
                  label='Date of Birth'
                  maxDate={dayjs(new Date())}
                  value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                  onChange={e => handleFormChange({ name: 'dateOfBirth', value: e })}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>

        <p className='additional-search' onClick={handleClick}>
          Additional Search Fields
          {isShowAdditionalDetails ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </p>

        <div>{isShowAdditionalDetails && renderAdditionDetails()}</div>

        <Divider sx={{ m: '1rem' }}>OR</Divider>
      </form>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-12 col-lg-8'>
          <TextField
            type='email'
            id='email'
            name='email'
            size='small'
            fullWidth
            label='Email'
            variant='outlined'
            value={formData.email}
            onChange={handleFormChange}
            disabled={disabledEmail}
            inputProps={{ maxLength: 150 }}
            error={!!emailError}
            helperText={emailError}
            onBlur={handleEmailValidation}
          />
        </div>
      </div>
    </>
  );
};

export default PersonalDetails;
