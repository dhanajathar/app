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
  MenuItem,
  Select,
  TextField,
  Autocomplete
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

const PHYSICAL_INFORMATION = 'Physical Information';

const IndividualDetails = () => {
  const suffixInputRef = useRef();
  const vipInputRef = useRef();
  const activeInputRef = useRef(); 
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');
  const [showLoader, setShowLoader] = useState(false);
  const [showVerificationStatus, setShowVerificationStatus] = useState();
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
    suffix: '',
    birthDate: ''
  });

  const [otherInformationFrom, setOtherInformationFrom] = useState({
    citizen: '',
    veteran: '',
    socialSecurityNumber: '',
    organDonor: '',
    language: '',
    gender: '',
    weight: '',
    heightFeet: '',
    hairColor: '',
    eyeColor: '',
    vip: '',
    activeMilitary: ''
  });

  const [open, setOpen] = useState(false);
  const [socialSecurityNumber, setSocialSecurityNumber] = useState(
    personalInformation.socialSecurityNumber
  );
  const [lastNameWarning, setLastNameWarning] = useState('');
  const [firstNameWarning, setFirstNameWarning] = useState('');
  const [middleNameWarning, setMiddleNameWarning] = useState('');
  const [validationError, setValidationError] = useState();
  const [disabledOtherInfo, setDisabledOtherInfo] = useState(true);
  const [formattedSSN, setFormattedSSN] = useState(
    formatSSN(personalInformation.socialSecurityNumber)
  );

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

  // mm/dd/yyyy
  const calculateAge = dob => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      month = 12 + month;
      age--;
    }
    return `${isNaN(age) ? '00' : age} year(s) ${isNaN(month) ? '00' : month} month(s)`;
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
      <FormGroup  aria-label='position' row>
        <FormControlLabel
          control={<Checkbox size='small' tabIndex='-1' checked={value && value.length > 33 ? true : false} />}
          label='Truncated'
          labelPlacement='end'
        />
        <FormControlLabel control={<Checkbox  size='small' />} label='Transliterated' labelPlacement='end' />{' '}
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
        delete errorMsg[k];
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
    newValues[field ? field : name] = field ? e : value === 'SELECT' ? null : value;
    setPersonalInformationFrom(newValues);
    handleError(field ? field : name, field ? e : value === 'SELECT' ? null : value);
  };

  const handleOtherInfoChange = e => {
    const { name, value } = e?.target ?? {};
    const newValues = { ...otherInformationFrom };
    newValues[name] = value === 'SELECT' ? "" : value;
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

  const handleError = (name, value) => {
    const error = validateFiled(name, value);
    const errors = { ...validationError, [name]: error };
    if (error === '') {
      delete errors[name];
    }
    setValidationError(errors);
  };
  const handleNumberChange = (e, min, max) => {
    const number = e.target.value;
    if (e.target.value === '' || (Number(number) > min && Number(number) <= max)) {
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
        value && /\d/.test(value)
          ? setLastNameWarning('Last Name contains numeric, please remove if not intentional')
          : value && value.length > 33 ? setLastNameWarning('Only 33 characters will be saved and printed on the credential') : setLastNameWarning('');

        break;
      case 'firstName':
        value && /\d/.test(value)
          ? setFirstNameWarning('First Name contains numeric, please remove if not intentional')
          : value && value.length > 33 ? setFirstNameWarning('Only 33 characters will be saved and printed on the credential') : setFirstNameWarning('');

        break;
      case 'middleName':
        value && /\d/.test(value)
          ? setMiddleNameWarning('Last Name contains numeric, please remove if not intentional')
          : value && value.length > 33 ? setMiddleNameWarning('Only 33 characters will be saved and printed on the credential') : setMiddleNameWarning('');

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
      case 'veteran':
        if (!value) {
          error = 'Invalid veteran';
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
                <DAlertBox errorText={validationError?.lastName} warningText={lastNameWarning} />
              }
              fullWidth
              label='Last Name'
              inputProps={{ maxLength: 45 }}
              autoComplete='off'
              onChange={handleNameChange}
              onBlur={e => handleError(e.target.name, e.target.value)}
            />
            {truncation(personalInformationFrom.lastName)}
          </div>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              value={personalInformationFrom.firstName}
              name='firstName'
              fullWidth
              size='small'
              helperText={<DAlertBox warningText={firstNameWarning} />}
              label='First Name'
              inputProps={{ maxLength: 45 }}
              onChange={handleNameChange}
              onBlur={e => handleError(e.target.name, e.target.value)}
            />
            {truncation(personalInformationFrom.firstName)}
          </div>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              value={personalInformationFrom.middleName}
              fullWidth
              size='small'
              name='middleName'
              helperText={<DAlertBox warningText={middleNameWarning} />}
              label='Middle Name'
              inputProps={{ maxLength: 35 }}
              onChange={handleNameChange}
              onBlur={e => handleError(e.target.name, e.target.value)}
            />
            {truncation(personalInformationFrom.middleName)}
          </div>
        </div>

        <div className='d-row'>
          <div className='col col-md-4 col-sm-12'>
            <Autocomplete
              options={suffixList}
              fullWidth 
              size='small'
              name='suffix'
              value={personalInformationFrom.suffix}
              onChange={(e, v) => {
                handlePersonalInfoChange({ target: { name: 'Suffix', value: v || null } });
                 
              }} 
              renderInput={params => (
                <TextField
                  {...params}
                  label='Suffix'
                  inputRef={suffixInputRef}
                />
              )}
            />

            {personalInformationFrom.suffix}
          </div>
          <div className='col col-md-4 col-sm-12'>
            <div
              className={personalInformationFrom.birthDate ? 'date-picker has-date' : 'date-picker'}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Date of Birth'
                  fullWidth
                  slotProps={{
                    textField: {
                      size:'small',
                      error: !!validationError?.birthDate,
                      helperText: <DAlertBox errorText={validationError?.birthDate} />,
                      onBlur: e => handleError('birthDate', e.target.value),
                    }
                  }}
                  maxDate={dayjs(new Date())}
                  minDate={dayjs('1991-01-01')}
                  value={
                    personalInformationFrom.birthDate && dayjs(personalInformationFrom.birthDate)
                  }
                  onChange={date => handlePersonalInfoChange(date, 'birthDate')}
                />
              </LocalizationProvider>
              {personalInformationFrom.birthDate && (
                <div className='date-helper-text'>
                  {calculateAge(personalInformationFrom.birthDate)}
                </div>
              )}
            </div>
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
              disabled={disabledOtherInfo}
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
              options={optionList}
              fullWidth
              name='citizen'
              size='small'
              disabled={disabledOtherInfo}
              onChange={handleOtherInfoChange}
              onBlur={e => handleError('citizen', e.target.value)}
              renderInput={params => (
                <TextField
                  {...params}
                  error={!!validationError?.citizen}
                  label='Citizen'
                  helperText={<DAlertBox errorText={validationError?.citizen} />}
                />
              )}
            />

          </div>
          <div className='col col-md-2 col-sm-12'>
            <Autocomplete
              options={optionOrganDonorList}
              fullWidth
              size='small'
              name='organDonor'
              disabled={disabledOtherInfo}
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
                  helperText={<DAlertBox errorText={validationError?.organDonor} />}
                />
              )}
            /> 

          </div>
          <div className='col col-md-4 col-sm-12'>
            <Autocomplete
              options={languageList}
              fullWidth
              size='small'
              name='language'
              disabled={disabledOtherInfo}
              onChange={handleOtherInfoChange}
              onBlur={e => handleError('language', e.target.value)}
              renderInput={params => (
                <TextField
                  {...params}
                  error={!!validationError?.language}
                  label='Language'
                  helperText={<DAlertBox errorText={validationError?.language} />}
                />
              )}
            />
          </div>
        </div>
        <div className='d-row'>
          <div className='col col-md-2 col-sm-12'>
            <Autocomplete
              options={optionListUnknown}
              fullWidth
              name='vip'
              size='small'
              disabled={disabledOtherInfo}
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
              options={optionListUnknown}
              fullWidth
              size='small'
              name='activeMilitary'
              disabled={disabledOtherInfo}
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
              options={optionList}
              fullWidth
              name='veteran'
              size='small'
              disabled={disabledOtherInfo}
              onChange={handleOtherInfoChange}
              onBlur={e => handleError('veteran', e.target.value)}
              renderInput={params => (
                <TextField
                  {...params}
                  error={!!validationError?.veteran}
                  label='Veteran'
                  helperText={<DAlertBox errorText={validationError?.veteran} />}
                />
              )}
            />
          </div>
        </div>
        <div className='d-sub-title'> {PHYSICAL_INFORMATION} </div>
        <div className='d-row'>
          <div className='col col-md-4 col-sm-12 pt-0'>
            <div className='d-row'>
              <div className='col col-md-6 col-sm-12'>

                <Autocomplete
                  options={genderList}
                  fullWidth
                  name='gender'
                  size='small'
                  disabled={disabledOtherInfo}
                  onChange={handleOtherInfoChange}
                  onBlur={e => handleError('gender', e.target.value)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={!!validationError?.gender}
                      label='Gender'
                      helperText={<DAlertBox errorText={validationError?.gender} />}
                    />
                  )}
                />


              </div>
              <div className='col col-md-6 col-sm-12'>
                <TextField
                  value={otherInformationFrom.weight}
                  label='Weight (Lbs)'
                  fullWidth
                  name='weight'
                  size='small'
                  disabled={disabledOtherInfo}
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
          <div className='col col-md-4 col-sm-12 pt-0'>
            <div className='d-row'>
              <div className='col col-md-6 col-sm-12'>
                <TextField
                  value={otherInformationFrom.heightFeet}
                  label='Height (Ft)'
                  fullWidth
                  size='small'
                  disabled={disabledOtherInfo}
                  name='heightFeet'
                  type='number'
                  error={!!validationError?.heightFeet}
                  onBlur={e => handleError('heightFeet', e.target.value)}
                  onChange={e => handleNumberChange(e, 0, 9)}
                  InputProps={{
                    endAdornment: otherInformationFrom.heightFeet && (
                      <InputAdornment position='end'>
                        <div className='input-adornment-text'>Ft</div>{' '}
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <div className='col col-md-6 col-sm-12'>
                <TextField
                  value={otherInformationFrom.heightInch}
                  label='Height (In)'
                  fullWidth
                  size='small'
                  disabled={disabledOtherInfo}
                  name='heightInch'
                  type='number'
                  error={!!validationError?.heightFeet}
                  onChange={e => handleNumberChange(e, 0, 11)}
                  InputProps={{
                    endAdornment: otherInformationFrom.heightInch && (
                      <InputAdornment position='end'>
                        <div className='input-adornment-text'>In</div>{' '}
                      </InputAdornment>
                    )
                  }}
                />
              </div>
            </div>
            <FormHelperText className='custom-error' error={true}>
              {' '}
              <DAlertBox errorText={validationError?.heightFeet} />
            </FormHelperText>
          </div>
          <div className='col col-md-4 col-sm-12'>
            <div className='d-row'>
              <div className='col col-md-6 col-sm-12 pt-0'>
                <Autocomplete
                  options={hairColorList}
                  fullWidth
                  size='small'
                  getOptionDisabled={(option) => option === 'UNKNOWN'}
                  name='hairColor'
                  disabled={disabledOtherInfo}
                  onChange={handleOtherInfoChange}
                  onBlur={e => handleError('hairColor', e.target.value)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={!!validationError?.hairColor}
                      label='Hair Color'
                      helperText={<DAlertBox errorText={validationError?.hairColor} />}
                    />
                  )}
                />

              </div>
              <div className='col col-md-6 col-sm-12 pt-0'>
                <Autocomplete
                  options={eyeColorList}
                  fullWidth
                  size='small'
                  name='eyeColor'
                  getOptionDisabled={(option) => option === 'UNKNOWN'}
                  disabled={disabledOtherInfo}
                  onChange={handleOtherInfoChange}
                  onBlur={e => handleError('eyeColor', e.target.value)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={!!validationError?.eyeColor}
                      label='Eye Color'
                      helperText={<DAlertBox errorText={validationError?.eyeColor} />}
                    />
                  )}
                />
              </div>
            </div>
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
                <TextField  size='small' label='Login ID' fullWidth />
              </div>
              <div className='col col-md-6'>
                <TextField  size='small' label='Password' fullWidth />
              </div>
              <div className='col'>
                <FormControl  size='small' fullWidth>
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
        {/* <button type='submit'>Validate </button> */}
      </form>
      <DLoaderDialog showLoader={showLoader} loadingText={'SSN verification is in progress'} />
    </div>
  );
};
export default IndividualDetails;