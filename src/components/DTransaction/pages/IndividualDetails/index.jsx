/*
 * Component Name: DTransection Individual Details
 * Author: Priyanka Pandey
 * Created: 2023-06-17
 * Last Modified: 2023-11-20
 * Description: Individual Details Data entry page for new users.
 * Application Release Version:1.0.0
 */
import './index.css';

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputAdornment,
  InputLabel,
  Select,
  TextField,
  Autocomplete,
  IconButton,

} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useEffect, useRef, useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import data from './api-individual-details.json';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import DAlertBox from '../../..//DAlertBox';
import CenterFocusStrongOutlinedIcon from '@mui/icons-material/CenterFocusStrongOutlined';
import DLoaderDialog from '../../../DLoaderDialog';
import { prettifyCamelCase } from '../../../../utils/stringUtils';
import { calculateAge } from '../../../../utils/dateUtils';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import DHeight from '../../../DHeight';

const PHYSICAL_INFORMATION = 'Physical Information';

const IndividualDetails = () => {
  const suffixInputRef = useRef();
  const vipInputRef = useRef();
  const activeInputRef = useRef();
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');
  const [showLoader, setShowLoader] = useState(false);
  const [showVerificationStatus, setShowVerificationStatus] = useState();
  const [calendarOpen, setCalendarOpen] = useState(false)
  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: {
        label: 'Individual Details',
        step: 'Individual Details',
        flowId: flowId,
        substep: true
      }
    });
  }, 100);

  const VerifiedSSN = '123456789';
  function formatSSN(value) {
    if (!value) return value;
    let ssnValue = '';
    const ssn = value.replace(/[^\d]/g, '');
    const ssnLength = ssn.length;
    if (ssnLength < 4) return ssn;
    if (ssnLength < 6) {
      ssnValue = `***-${ssn.slice(3)}`;
    }
    ssnValue = `***-**-${ssn.slice(5, 9)}`;
    return ssnValue;
  }

  const {
    personalInformation,
    languageList,
    eyeColorList,
    hairColorList,
    suffixList,
    genderList,
    optionList,
    optionListUnknown,
    optionOrganDonorList
  } = data;

  const [personalInformationFrom, setPersonalInformationFrom] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    suffix: null,
    birthDate: ''
  });

  const [otherInformationFrom, setOtherInformationFrom] = useState({
    citizen: null,
    veteran: null,
    socialSecurityNumber: '',
    organDonor: null,
    language: null,
    gender: null,
    weight: '',
    heightFeet: '',
    hairColor: null,
    eyeColor: null,
    vip: null,
    activeMilitary: null
  });

  const [open, setOpen] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [socialSecurityNumber, setSocialSecurityNumber] = useState(
    personalInformation.socialSecurityNumber
  );
  const [validationError, setValidationError] = useState({});
  const [validationWarnings, setValidationWarnings] = useState({});
  const [disabledOtherInfo, setDisabledOtherInfo] = useState(true);
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const [formattedSSN, setFormattedSSN] = useState(
    formatSSN(personalInformation.socialSecurityNumber)
  );


  const sortedList = (list) => {
    const sortedList = list.slice().sort((a, b) => a.localeCompare(b));
    const selectIndex = sortedList.findIndex(item => (item === "--SELECT--") || (item === "ENGLISH") || (item === "BLACK"));
    if (selectIndex !== -1) {
      const selectItem = sortedList[selectIndex];
      sortedList.splice(selectIndex, 1);
      sortedList.unshift(selectItem);
    }
    return sortedList;
  };


  const handleSSNChange = e => {
    const value = e.target.value;
    const ssn = value.replace(/[^\d]/g, '');
    let ssnValue;
    const ssnLength = ssn.length;
    if (ssnLength < 4) {
      ssnValue = ssn;
    } else if (ssnLength < 6) {
      ssnValue = `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    } else {
      ssnValue = `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
    }
    setShowVerificationStatus(false);
    setSocialSecurityNumber(ssnValue);
    setFormattedSSN(ssnValue);
  };



  useEffect(() => {
    if (socialSecurityNumber.length === 11) {
      if (socialSecurityNumber.replace(/-/g, '') !== '000000000' && socialSecurityNumber.replace(/-/g, '') !== '999999999') {
        setShowLoader(true);
      }
      setTimeout(() => {
        setShowLoader(false);
        socialSecurityNumber.replace(/-/g, '') !== VerifiedSSN && setOpen(true);
        setShowVerificationStatus(true);
      }, 3000);
    }
  }, [socialSecurityNumber]);

  const truncation = value => {
    return (
      <FormGroup aria-label='position' row>
        <FormControlLabel
          control={<Checkbox size='small' tabIndex='-1' disabled={!value || value.length <= 33} checked={value && value.length > 33 ? true : false} />}
          label='Truncated'
          labelPlacement='end'
        />
        <FormControlLabel disabled={isFormDisabled} control={<Checkbox size='small' />} label='Transliterated' labelPlacement='end' />{' '}
      </FormGroup>
    );
  };

  const validateTransliterated = value => {
    const regex = /^[a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@\\_`{|}~]*$/;
    return regex.test(value);
  };

  const handleSubmitFrom = (e, form) => {
    e.preventDefault();
    let errorMsg = { ...validationError };
    for (const [k, v] of Object.entries(form)) {
      const error = validateFiled(k, v);
      errorMsg = { ...errorMsg, [k]: error };
      if (error === '') { 
        // eslint-disable-next-line no-unused-vars 
        const { k, ...withoutKey } = errorMsg; 
        errorMsg = withoutKey  
      } else {
        handleError(k, v)
        break;
      }
    }
    if (personalInformationFrom.lastName !== '' && personalInformationFrom.birthDate !== '') {
      setDisabledOtherInfo(false);
    }
    setValidationError(errorMsg);
  };

  const handlePersonalInfoChange = (e, field = null) => {
    const { name, value } = e?.target ?? {};
    const newValues = { ...personalInformationFrom };
    newValues[field ? field : name] = field ? e : value === '--SELECT--' ? null : value;
    setPersonalInformationFrom(newValues);
    handleError(field ? field : name, field ? e : value === '--SELECT--' ? null : value);
  };

  const handleOtherInfoChange = e => {
    const { name, value } = e?.target ?? {};
    const newValues = { ...otherInformationFrom };
    newValues[name] = value === '--SELECT--' ? "" : value;
    setOtherInformationFrom(newValues);
  };

  const handleNameChange = e => {
    const { name, value } = e?.target ?? {};
    const newValues = { ...personalInformationFrom };
    if (validateTransliterated(value) && !(/^\s/.test(value) || /\s\s/.test(value))) {
      newValues[name] = value;
      setPersonalInformationFrom(newValues);
    }
    handleError(name, value);
  };



  const handleKeyDown = (e, name) => {
    const value = e.target.value
    if (e.key.length === 1 && e.key.toLowerCase() !== 'a') {
      let exceedKey = `${name}Exceed`;
      const keyPressed = e.key;
      let warnings = { ...validationWarnings }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (value && /\d/.test(value)) {
          warnings[name] = `${prettifyCamelCase(name)} contains numeric, please remove if not intentional`;
        }
      }
      if (!isNaN(keyPressed) && keyPressed !== ' ' && !e.ctrlKey) {
        warnings[name] = `${prettifyCamelCase(name)} contains numeric, please remove if not intentional`;
      }
      if (value.length > 33) {
        warnings[exceedKey] = 'Only 33 characters will be saved and printed on the credential';
      }
      setValidationWarnings(warnings);
    }
  };
  function deleteKeyByValue(obj, value) {
    for (const key in obj) {
      if (obj[key] === value) {
        delete obj[key];
      }
    }
  }

  const getWarning = (name) => {
    const exceedKey = `${name}Exceed`;
    const nameWarning = validationWarnings?.[name];
    const exceedWarning = validationWarnings?.[exceedKey];
    if (personalInformationFrom[name] && personalInformationFrom[name].length > 33) {
      return exceedWarning || nameWarning;
    } else {
      return nameWarning || exceedWarning;
    }
  }

  const handleClearWarning = (warningText, name) => {
    const warnings = { ...validationWarnings };
    deleteKeyByValue(warnings, warningText);
    setValidationWarnings(warnings);
    setFocusedField(name);
    setTimeout(() => { setFocusedField() }, 50)
  }

  const handleError = (name, value) => {
    const error = validateFiled(name, value);
    const errors = { ...validationError, [name]: error };
    if (error === '') {
      delete errors[name];
    }
    setValidationError(errors);

    setIsFormDisabled(Object.values(errors).some(error => error !== ''));
    setFocusedField(error !== '' ? name : '');


  };
  const handleNumberChange = (e, min, max) => {
    const number = e.target.value;
    if (e.target.value === '' || (Number(number) >= min && Number(number) <= max)) {
      handleOtherInfoChange(e);
    }
  };


  const validateFiled = (name, value) => {
    let error = '';
    switch (name) {
      case 'lastName':
        if (value === '') {
          error = 'Invalid Last Name';
        }
        break;
      case 'birthDate':
        if (!dayjs(value, 'MM/DD/YYYY', true).isValid()) {
          error = 'Invalid DOB';
        }
        break;
      case 'socialSecurityNumber':
        if (value.trim() === '' || value.length < 11) {
          error = 'Invalid SSN';
        }
        if (
          otherInformationFrom.socialSecurityNumber.replace(/-/g, '') === '000000000' ||
          otherInformationFrom.socialSecurityNumber.replace(/-/g, '') === '999999999'
        ) {
          error = 'Supervisor Override Required. SSN is all 0s or all 9s.';
        }
        break;
      case 'organDonor':
        if (!value) {
          error = 'Invalid  Organ Donor';
        }
        break;
      case 'language':
        if (!value) {
          error = 'Invalid  Language';
        }
        break;
      case 'gender':
        if (!value) {
          error = 'Invalid Gender';
        }
        break;
      case 'weight':
        if (!value) {
          error = 'Invalid Weight';
        }
        break;
      case 'citizen':
        if (!value) {
          error = 'Invalid Citizen';
        }
        break;
      case 'heightFeet':
        if (!value) {
          error = 'Invalid Height';
        }
        break;
      case 'heightInch':
        if (!value) {
          error = 'Invalid Height';
        }
        break;
      case 'veteran':
        if (!value) {
          error = 'Invalid Veteran';
        }
        break;
      case 'hairColor':
        if (!value) {
          error = 'Invalid Hair Color';
        }
        break;
      case 'eyeColor':
        if (!value) {
          error = 'Invalid Eye Color';
        }
        break;
      default:
    }
    return error;
  };

  useEffect(() => {
    if (Object.keys(validationWarnings).length > 0) {
      setIsFormDisabled(true);
    } else {
      setIsFormDisabled(false);
    }
  }, [validationWarnings])

  useEffect(() => {
    if (socialSecurityNumber) {
      setFormattedSSN('');
      setShowVerificationStatus();
      setSocialSecurityNumber('');
    }
    if (validationError?.socialSecurityNumber) {
      const errors = { ...validationError };
      setValidationError({ ...validationError });
      delete errors['socialSecurityNumber'];
      setValidationError(errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    personalInformationFrom.firstName,
    personalInformationFrom.middleName,
    personalInformationFrom.lastName,
    personalInformationFrom.birthDate
  ]);

  return (
    <div className='d-container'> 
      <form
        onSubmit={e => handleSubmitFrom(e, personalInformationFrom)}
        noValidate
        autoComplete='off'
      >
        <div className='d-sub-title'> Personal Information </div>
        <div className='d-row truncation-row'>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              value={personalInformationFrom.lastName}
              name='lastName'
              size='small'
              error={!!validationError?.lastName}
              helperText={
                <DAlertBox errorText={validationError?.lastName} onClearWarning={(warningText) => handleClearWarning(warningText, 'lastName')} warningText={getWarning('lastName')} />
              }
              fullWidth
              label='Last Name'
              inputProps={{ maxLength: 34 }}
              autoComplete='off'
              onKeyUp={e => handleKeyDown(e, 'lastName')}
              onChange={handleNameChange}
              onBlur={e => handleError(e.target.name, e.target.value)}
              disabled={isFormDisabled && focusedField !== 'lastName'}
              inputRef={focusedField === 'lastName' ? (input) => input?.focus() : null}
            />
            {truncation(personalInformationFrom.lastName)}
          </div>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              value={personalInformationFrom.firstName}
              name='firstName'
              fullWidth
              size='small'
              helperText={<DAlertBox onClearWarning={(warningText) => handleClearWarning(warningText, 'firstName')} warningText={getWarning('firstName')} />}
              label='First Name'
              onKeyUp={e => handleKeyDown(e, 'firstName')}
              inputProps={{ maxLength: 34 }}
              onChange={handleNameChange}
              onBlur={e => handleError(e.target.name, e.target.value)}
              disabled={isFormDisabled}
              inputRef={focusedField === 'firstName' ? (input) => input?.focus() : null}
            />
            {truncation(personalInformationFrom.firstName)}
          </div>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              value={personalInformationFrom.middleName}
              fullWidth
              size='small'
              name='middleName'
              disabled={isFormDisabled}
              helperText={<DAlertBox onClearWarning={(warningText) => handleClearWarning(warningText, 'middleName')} warningText={getWarning('middleName')} />}
              label='Middle Name'
              inputRef={focusedField === 'middleName' ? (input) => input?.input.focus() : null}
              onKeyUp={e => handleKeyDown(e, 'middleName')}
              inputProps={{ maxLength: 34 }}
              onChange={handleNameChange}
              onBlur={e => handleError(e.target.name, e.target.value)}

            />
            {truncation(personalInformationFrom.middleName)}
          </div>
        </div>

        <div className='d-row'>
          <div className='col col-md-4 col-sm-12'>
            <Autocomplete
              options={sortedList(suffixList)}
              fullWidth
              size='small'
              name='suffix'
              disabled={isFormDisabled}
              value={personalInformationFrom.suffix}
              onChange={(e, v) => {
                handlePersonalInfoChange({ target: { name: 'suffix', value: v || null } });
                v === '--SELECT--' && suffixInputRef.current.blur()
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Suffix'
                  inputRef={suffixInputRef}
                />
              )}
            />
          </div>
          <div className='col col-md-4 col-sm-12'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Date of Birth'
                fullWidth
                disabled={isFormDisabled && focusedField !== 'birthDate'}
                open={calendarOpen}
                onOpen={() => setOpen(true)}
                onClose={() => setCalendarOpen(false)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    error: !!validationError?.birthDate,
                    helperText: <DAlertBox errorText={validationError?.birthDate} />,
                    inputRef: focusedField === 'birthDate' ? (input) => input?.focus() : null,
                    onBlur: e => handleError('birthDate', e.target.value),
                    InputProps: {
                      endAdornment: (
                        <><InputAdornment position='end'>
                          <IconButton onClick={() => setCalendarOpen((calendarOpen) => !calendarOpen)}>
                            <CalendarMonthTwoToneIcon />
                          </IconButton>
                        </InputAdornment>
                          {personalInformationFrom.birthDate && <InputAdornment position='end'>
                            {' '}
                            <div className='input-adornment-text'> {calculateAge(personalInformationFrom.birthDate)} </div>{' '}
                          </InputAdornment>}
                        </>
                      )
                    }
                  }
                }}
                maxDate={dayjs(new Date())}
                minDate={dayjs('1901-01-01')}
                value={
                  personalInformationFrom.birthDate && dayjs(personalInformationFrom.birthDate)
                }
                onChange={date => handlePersonalInfoChange(date, 'birthDate')}
              />
            </LocalizationProvider>

          </div>
        </div>
        <div className='d-sub-title'> Photo & Signature </div>
        <button type='submit' className='capture-button'>
          {' '}
          <CenterFocusStrongOutlinedIcon /> <span> CLICK TO CAPTURE </span>{' '}
        </button>
      </form>
      <form onSubmit={e => handleSubmitFrom(e, otherInformationFrom)} noValidate autoComplete='off'>
        <div className='d-sub-title'> Additional Details </div>
        <div className='d-row'>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              value={formattedSSN}
              fullWidth
              size='small'
              error={!!validationError?.socialSecurityNumber}
              name='socialSecurityNumber'
              helperText={<DAlertBox errorText={validationError?.socialSecurityNumber} />}
              inputProps={{ maxLength: 11 }}
              label='Social Security Number (SSN)'
              disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'socialSecurityNumber')}
              inputRef={focusedField === 'socialSecurityNumber' ? (input) => input?.focus() : null}
              placeholder='   -  -    '
              onChange={e => {
                handleSSNChange(e);
                handleOtherInfoChange(e);
              }}
              onBlur={e => {
                handleError('socialSecurityNumber', e.target.value);
                setFormattedSSN(formatSSN(socialSecurityNumber));
              }}
              onFocus={() => setFormattedSSN(socialSecurityNumber)}
              InputProps={{
                endAdornment: showVerificationStatus && (
                  <InputAdornment position='end'>
                    {socialSecurityNumber.replace(/-/g, '') === VerifiedSSN ? (
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
          <div className='col col-md-2 col-sm-12'>
            <Autocomplete
              options={sortedList(optionList)}
              fullWidth
              name='citizen'
              size='small'
              disableClearable={true}
              onChange={handleOtherInfoChange}
              onBlur={e => handleError('citizen', e.target.value)}
              disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'citizen')}

              renderInput={params => (
                <TextField
                  {...params}
                  error={!!validationError?.citizen}
                  label='Citizen'
                  inputRef={focusedField === 'citizen' ? (input) => input?.focus() : null}
                  helperText={<DAlertBox errorText={validationError?.citizen} />}
                />
              )}
            />

          </div>
          <div className='col col-md-2 col-sm-12'>
            <Autocomplete
              options={sortedList(optionOrganDonorList)}
              fullWidth
              size='small'
              name='organDonor'
              disableClearable={true}
              disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'organDonor')}
              value={otherInformationFrom.organDonor}
              onChange={(e, v) => {
                handleOtherInfoChange({ target: { name: 'organDonor', value: v || null } });
              }}
              onBlur={e => handleError('organDonor', e.target.value)}
              renderInput={params => (
                <TextField
                  {...params}

                  error={!!validationError?.organDonor}
                  label='Organ Donor'
                  inputRef={focusedField === 'organDonor' ? (input) => input?.focus() : null}
                  helperText={<DAlertBox errorText={validationError?.organDonor} />}
                />
              )}
            />

          </div>
          <div className='col col-md-4 col-sm-12'>
            <Autocomplete
              options={sortedList(languageList)}
              fullWidth
              size='small'
              name='language'
              disableClearable={true}

              disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'language')}

              onChange={handleOtherInfoChange}
              onBlur={e => handleError('language', e.target.value)}
              renderInput={params => (
                <TextField
                  {...params}
                  error={!!validationError?.language}
                  label='Language'
                  inputRef={focusedField === 'language' ? (input) => input?.focus() : null}
                  helperText={<DAlertBox errorText={validationError?.language} />}
                />
              )}
            />
          </div>
        </div>
        <div className='d-row'>
          <div className='col col-md-2 col-sm-12'>
            <Autocomplete
              options={sortedList(optionListUnknown)}
              fullWidth
              name='vip'
              size='small'
              disabled={disabledOtherInfo || isFormDisabled}
              value={otherInformationFrom.vip}
              onChange={(e, v) => {
                handleOtherInfoChange({ target: { name: 'vip', value: v || null } });
                vipInputRef.current.blur()
              }}

              renderInput={params => (
                <TextField
                  {...params}
                  label='VIP'
                  inputRef={vipInputRef}
                />
              )}
            />

          </div>
          <div className='col col-md-2 col-sm-12'>
            <Autocomplete
              options={sortedList(optionListUnknown)}
              fullWidth
              size='small'
              name='activeMilitary'
              disabled={disabledOtherInfo || isFormDisabled}
              value={otherInformationFrom.activeMilitary}
              onChange={(e, v) => {
                handleOtherInfoChange({ target: { name: 'activeMilitary', value: v || null } });
                activeInputRef.current.blur();
              }}

              renderInput={params => (
                <TextField
                  {...params}
                  label='Active Military'
                  inputRef={activeInputRef}
                />
              )}
            />
          </div>
          <div className='col col-md-2 col-sm-12'>

            <Autocomplete
              options={sortedList(optionList)}
              fullWidth
              name='veteran'
              size='small'
              disableClearable={true}
              disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'veteran')}

              onChange={handleOtherInfoChange}
              onBlur={e => handleError('veteran', e.target.value)}
              renderInput={params => (
                <TextField
                  {...params}
                  error={!!validationError?.veteran}
                  label='Veteran'
                  inputRef={focusedField === 'veteran' ? (input) => input?.focus() : null}
                  helperText={<DAlertBox errorText={validationError?.veteran} />}
                />
              )}
            />
          </div>
        </div>
        <div className='d-sub-title'> {PHYSICAL_INFORMATION} </div>
        <div className='d-row'>
          <div className='col col-lg-12 col-xl-6 pt-0'>
            <div className='d-row'>
              <div className='col col-lg-6 col-xl-8 col-sm-12'>
                <Autocomplete
                  options={sortedList(genderList)}
                  fullWidth
                  name='gender'
                  size='small'
                  disableClearable={true}
                  disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'gender')}

                  onChange={handleOtherInfoChange}
                  onBlur={e => handleError('gender', e.target.value)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={!!validationError?.gender}
                      label='Gender'
                      inputRef={focusedField === 'gender' ? (input) => input?.focus() : null}
                      helperText={<DAlertBox errorText={validationError?.gender} />}
                    />
                  )}
                />


              </div>
              <div className='col col-lg-6 col-xl-4  col-sm-12'>
                <TextField
                  value={otherInformationFrom.weight}
                  label='Weight (Lbs)'
                  fullWidth
                  name='weight'
                  size='small'
                  disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'weight')}
                  inputRef={focusedField === 'weight' ? (input) => input?.focus() : null}
                  error={!!validationError?.weight}
                  onBlur={e => handleError('weight', e.target.value)}
                  helperText={<DAlertBox errorText={validationError?.weight} />}
                  type='number'
                  onChange={e => {
                    if (e.target.value.toString().length <= 3) {
                      handleOtherInfoChange(e);
                    }
                  }}
                  InputProps={{
                    endAdornment: otherInformationFrom.weight && (
                      <InputAdornment position='end'>
                        {' '}
                        <div className='input-adornment-text'> Lbs </div>{' '}
                      </InputAdornment>
                    )
                  }}
                />
              </div>
            </div>

          </div>
          <div className='col col-lg-6 col-xl-2 col-sm-12'>
            <DHeight validationError={validationError} disabledOtherInfo={disabledOtherInfo} isFormDisabled={isFormDisabled} focusedField={focusedField} values={otherInformationFrom} handleError={(fieldName, value) => handleError(fieldName, value)} handleChange={(e, start, end) => handleNumberChange(e, start, end)} />
            <FormHelperText className='custom-error' error={true}>
              {' '}
              <DAlertBox errorText={validationError?.heightFeet || validationError?.heightInch} />
            </FormHelperText>
          </div>
          <div className='col col-lg-6 col-xl-2 col-sm-12'>
            <Autocomplete
              options={sortedList(hairColorList)}
              fullWidth
              size='small'
              disableClearable={true}
              getOptionDisabled={(option) => option === 'UNKNOWN'}
              name='hairColor'
              disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'hairColor')}

              onChange={handleOtherInfoChange}
              onBlur={e => handleError('hairColor', e.target.value)}
              renderInput={params => (
                <TextField
                  {...params}
                  error={!!validationError?.hairColor}
                  label='Hair Color'
                  inputRef={focusedField === 'hairColor' ? (input) => input && input.focus() : null}
                  helperText={<DAlertBox errorText={validationError?.hairColor} />}
                />
              )}
            />

          </div>
          <div className='col col-lg-6 col-xl-2 col-sm-12'>
            <Autocomplete
              options={sortedList(eyeColorList)}
              fullWidth
              size='small'
              name='eyeColor'
              disableClearable={true}
              getOptionDisabled={(option) => option === 'UNKNOWN'}
              disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'eyeColor')}

              onChange={handleOtherInfoChange}
              onBlur={e => handleError('eyeColor', e.target.value)}
              renderInput={params => (
                <TextField
                  {...params}
                  error={!!validationError?.eyeColor}
                  label='Eye Color'
                  inputRef={focusedField === 'eyeColor' ? (input) => input?.focus() : null}
                  helperText={<DAlertBox errorText={validationError?.eyeColor} />}
                />
              )}
            />

          </div>
        </div>
        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
          maxWidth='xs'
          className='override-dialog'
          open={open}
        >
          <div className='requester-container'>
            <div className='requester'>
              <span className='requester-title'> Requester </span>
              <div className='requester-user'> Joe </div>
            </div>
          </div>

          <DialogTitle> Supervisor Override </DialogTitle>
          <DialogContent>
            {socialSecurityNumber.replace(/-/g, '') !== VerifiedSSN ?
              <> {(socialSecurityNumber.replace(/-/g, '') === '000000000' || socialSecurityNumber.replace(/-/g, '') === '999999999') ? <div>
                SSN Verification Not Required. SSN is all 0s or all 9s.
              </div>
                : <div> SSN Verification: Not Verified; {socialSecurityNumber} Supervisor override required </div>} </> : <>  Supervisor Override is necessary to skip document scans. </>}

            <div className='d-row'>
              <div className='col col-md-6'>
                <TextField size='small' label='Login ID' fullWidth />
              </div>
              <div className='col col-md-6'>
                <TextField size='small' label='Password' fullWidth />
              </div>
              <div className='col'>
                <FormControl size='small' fullWidth>
                  <InputLabel id='ReasonOverride'>Reason for Override </InputLabel>
                  <Select
                    labelId='ReasonOverride'
                    id='ReasonOverride'
                    label='Reason for Override'
                  ></Select>
                </FormControl>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant='outlined'
              autoFocus
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                setOpen(false);
              }}
            >
              {' '}
              submit{' '}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
      <DLoaderDialog showLoader={showLoader} loadingText={'SSN verification is in progress'} />
    </div>
  );
};
export default IndividualDetails;