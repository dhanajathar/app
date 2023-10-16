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
import React, { useEffect, useState } from 'react';

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
  }, 10);

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
    optionListUnknown
  } = data;

  const [personalInformationFrom, setPersonalInformationFrom] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    suffix: 'select',
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
  })


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
    const ssn = value.replace(/[^\d]/g, "");
    let ssnValue;
    const ssnLength = ssn.length;
    if (ssnLength < 4) {
      ssnValue = ssn
    } else if (ssnLength < 6) {
      ssnValue = `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    } else {
      ssnValue = `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
    }
    setShowVerificationStatus(false)
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
      setShowLoader(true)
      setTimeout(() => {
        setShowLoader(false)
        socialSecurityNumber.replace(/-/g, "") !== VerifiedSSN && setOpen(true);
        setShowVerificationStatus(true)
      }, 3000)
    }

  }, [socialSecurityNumber]);

  const truncation = (value) => {

    return (
      <FormGroup aria-label='position' row>
        <FormControlLabel
          control={<Checkbox tabIndex='-1' checked={value && value.length > 33 ? true : false} />}
          label='Truncated'
          labelPlacement='end'
        />
        <FormControlLabel
          control={
            <Checkbox
            />
          }
          label='Transliterated'
          labelPlacement='end'
        />      </FormGroup>
    );
  };



  const validateTransliterated = (value) => {
    const regex = /^[a-zA-Z0-9 !"#$%&'()+,-./:;<=>?@\\_`{|}~]*$/;
    return regex.test(value);
  };


  const handleSubmitFrom = (e, form) => {
    e.preventDefault();
    let errorMsg = { ...validationError };
    for (const [k, v] of Object.entries(form)) {
      const error = validateFiled(k, v);
      errorMsg = { ...errorMsg, [k]: error };
      if (error === "") {
        delete errorMsg[k];
      }
    }
    if ((personalInformationFrom.lastName !== "") && personalInformationFrom.birthDate !== "") {
      setDisabledOtherInfo(false)
    }
    setValidationError(errorMsg)
  }

  const handlePersonalInfoChange = (e, field = null) => {
    const { name, value } = e?.target ?? {};
    const newValues = { ...personalInformationFrom };
    newValues[field ? field : name] = field ? e : value;
    setPersonalInformationFrom(newValues);
    handleError(field ? field : name, field ? e : value)
  };

  const handleOtherInfoChange = (e) => {
    const { name, value } = e?.target ?? {};
    const newValues = { ...otherInformationFrom };
    newValues[name] = value;
    setOtherInformationFrom(newValues);
    handleError(name, value)
  };

  const handleLanguageChange = (name, value) => {
    const obj = {
      target: {
        name: name,
        value: value
      }
    }
    handleOtherInfoChange(obj)
  }
  const handleNameChange = (e) => {
    const { name, value } = e?.target ?? {};
    const newValues = { ...personalInformationFrom };
    if (validateTransliterated(value) && !(/^\s/.test(value) || /\s\s/.test(value))) {
      newValues[name] = value
      setPersonalInformationFrom(newValues);
    }
    handleError(name, value)
  }

  const handleError = (name, value) => {
    const error = validateFiled(name, value);
    const errors = { ...validationError, [name]: error };
    if (error === "") {
      delete errors[name];
    }
    setValidationError(errors)
  }
  const handleNumberChange = (e, min, max) => {
    const number = e.target.value;
    if (e.target.value === "" || (Number(number) > min && Number(number) <= max)) {
      handleOtherInfoChange(e)
    }
  }

  const validateFiled = (name, value) => {
    let error = '';
    switch (name) {
      case 'lastName':
        if (value === "") { error = 'Invalid Last Name'; }
        value && /\d/.test(value) ?
          setLastNameWarning('Last Name contains numeric, please remove if not intentional') : setLastNameWarning('');
        break
      case 'firstName':
        value && /\d/.test(value) ?
          setFirstNameWarning('First Name contains numeric, please remove if not intentional') : setFirstNameWarning('');
        break
      case 'middleName':
        value && /\d/.test(value) ?
          setMiddleNameWarning('Last Name contains numeric, please remove if not intentional') : setMiddleNameWarning('');
        break
      case 'birthDate':
        if (!dayjs(value, 'MM/DD/YYYY', true).isValid()) { error = 'Invalid DOB' }
        break
      case 'socialSecurityNumber':
        if (value.trim() === '' || value.length <= 11 ) {
          error = 'Invalid SSN';
        }
        if (otherInformationFrom.socialSecurityNumber.replace(/-/g, "") === '000000000' || otherInformationFrom.socialSecurityNumber.replace(/-/g, "") === '999999999') {
          error = 'SSN Verification Not Required. SSN is Zeroes or All 9s'
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

  }



  useEffect(() => {
    if (socialSecurityNumber) {
      setFormattedSSN('');
      setShowVerificationStatus()
      setSocialSecurityNumber('');
    }
    if (validationError?.socialSecurityNumber) {
      const errors = { ...validationError };
      setValidationError({ ...validationError, })
      delete errors['socialSecurityNumber'];
      setValidationError(errors)
    }

  }, [personalInformationFrom.firstName, personalInformationFrom.middleName, personalInformationFrom.lastName, personalInformationFrom.birthDate]);

  return (
    <div className='d-container'>
      <form onSubmit={e => handleSubmitFrom(e, personalInformationFrom)} noValidate autoComplete='off'>
        <div className='d-sub-title'> Personal Information </div>
        <div className='d-row truncation-row'>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              value={personalInformationFrom.lastName}
              name='lastName'
              error={!!validationError?.lastName}
              helperText={<DAlertBox errorText={validationError?.lastName} warningText={lastNameWarning} />}
              fullWidth
              label='Last Name'
              inputProps={{ maxLength: 45 }}
              autoComplete='off'
              onChange={handleNameChange}
              onBlur={(e) => handleError(e.target.name, e.target.value)}
            />
            {truncation(personalInformationFrom.lastName)}
          </div>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              value={personalInformationFrom.firstName}
              name='firstName'
              fullWidth
              helperText={<DAlertBox warningText={firstNameWarning} />}
              label='First Name'
              inputProps={{ maxLength: 45 }}
              onChange={handleNameChange}
              onBlur={(e) => handleError(e.target.name, e.target.value)}
            />
            {truncation(personalInformationFrom.firstName)}
          </div>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              value={personalInformationFrom.middleName}
              fullWidth
              name='middleName'
              helperText={<DAlertBox warningText={middleNameWarning} />}
              label='Middle Name'
              inputProps={{ maxLength: 35 }}
              onChange={handleNameChange}
              onBlur={(e) => handleError(e.target.name, e.target.value)}
            />
            {truncation(personalInformationFrom.middleName)}
          </div>
        </div>

        <div className='d-row'>
          <div className='col col-md-4 col-sm-12'>
            <FormControl fullWidth className='formControl'>
              <InputLabel id='name_suffix'> Name Suffix </InputLabel>
              <Select
                id='name_suffix'
                value={personalInformationFrom.suffix}
                label='Name Suffix'
                name='suffix'
                onChange={(e) => handlePersonalInfoChange(e)}
              >
                <MenuItem value={'select'} >
                  Select
                </MenuItem>
                {suffixList &&
                  suffixList.map(item => {
                    return (
                      <MenuItem key={`suffix${item}`} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
          <div className='col col-md-4 col-sm-12'>
            <div className={personalInformationFrom.birthDate ? 'date-picker has-date' : 'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Date of Birth'
                  fullWidth
                  slotProps={{
                    textField: {
                      error: !!validationError?.birthDate,
                      helperText: <DAlertBox errorText={validationError?.birthDate} />,
                      onBlur: (e) => handleError('birthDate', e.target.value),
                    }
                  }}
                  maxDate={dayjs(new Date())}
                  value={personalInformationFrom.birthDate && dayjs(personalInformationFrom.birthDate)}
                  onChange={date => handlePersonalInfoChange(date, 'birthDate')}

                />
              </LocalizationProvider>
              {personalInformationFrom.birthDate && <div className='date-helper-text'>{calculateAge(personalInformationFrom.birthDate)}</div>}
            </div>
          </div>
        </div>
        <div className='d-sub-title'> Photo & Signature </div>
        <button type='submit' className='capture-button'> <CenterFocusStrongOutlinedIcon /> <span> CLICK TO CAPTURE </span>  </button>
      </form>
      <form onSubmit={e => handleSubmitFrom(e, otherInformationFrom)} noValidate autoComplete='off'>
        <div className='d-sub-title'> Additional Details </div>
        <div className='d-row'>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              value={formattedSSN}
              fullWidth
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
              onBlur={() => { handleError('socialSecurityNumber', socialSecurityNumber); setFormattedSSN(formatSSN(socialSecurityNumber)) }}
              onFocus={() => setFormattedSSN(socialSecurityNumber)}
              InputProps={{
                endAdornment: showVerificationStatus && (
                  <InputAdornment position='end'>
                    {socialSecurityNumber.replace(/-/g, "") === VerifiedSSN ? (
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
            <FormControl fullWidth error={!!validationError?.citizen} className='formControl'>
              <InputLabel id='citizen'> Citizen </InputLabel>
              <Select
                id='citizen'
                value={otherInformationFrom.citizen}
                name='citizen'
                disabled={disabledOtherInfo}
                label='Citizen'
                onChange={handleOtherInfoChange}
                onBlur={e => handleError('citizen', e.target.value)}
              >
                {optionList &&
                  optionList.map(item => {
                    return (
                      <MenuItem key={`citizen${item}`} value={item}>
                        {' '}
                        {item}{' '}
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText> <DAlertBox errorText={validationError?.citizen} /> </FormHelperText>
            </FormControl>
          </div>
          <div className='col col-md-2 col-sm-12'>
            <FormControl fullWidth error={!!validationError?.organDonor}>
              <InputLabel id='organDonor'>Organ Donor</InputLabel>
              <Select
                labelId='organDonor'
                id='organDonor'
                disabled={disabledOtherInfo}
                name='organDonor'
                defaultValue={otherInformationFrom.organDonor}
                label='Organ Donor'
                onChange={handleOtherInfoChange}
                onBlur={e => handleError('organDonor', e.target.value)}
              >
                {optionListUnknown &&
                  optionListUnknown.map(item => {
                    return (
                      <MenuItem key={`organ${item}`} value={item}>
                        {' '}
                        {item}{' '}
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText> <DAlertBox errorText={validationError?.organDonor} /> </FormHelperText>
            </FormControl>
          </div>
          <div className='col col-md-4 col-sm-12'>

            <Autocomplete
              options={languageList}
              fullWidth
              name='language'
              disabled={disabledOtherInfo}
              onChange={(e, value) => handleLanguageChange('language', value)}
              onBlur={e => handleError('language', e.target.value)}
              renderInput={(params) => <TextField {...params}
                error={!!validationError?.language}
                label="Language"

                helperText={<DAlertBox errorText={validationError?.language} />}
              />}
            />

          </div>
        </div>
        <div className='d-row'>
          <div className='col col-md-2 col-sm-12'>
            <FormControl fullWidth>
              <InputLabel id='VIP'>VIP</InputLabel>
              <Select
                labelId='VIP'
                id='VIP'
                name='vip'
                disabled={disabledOtherInfo}
                defaultValue={otherInformationFrom.vip}
                label='VIP'
                onChange={handleOtherInfoChange}
              >
                {optionListUnknown &&
                  optionListUnknown.map(item => {
                    return (
                      <MenuItem key={`vip${item}`} value={item}>
                        {' '}
                        {item}{' '}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
          <div className='col col-md-2 col-sm-12'>
            <FormControl fullWidth>
              <InputLabel id='activeMilitary'>Active Military</InputLabel>
              <Select
                labelId='activeMilitary'
                id='activeMilitary'
                disabled={disabledOtherInfo}
                defaultValue={otherInformationFrom.activeMilitary}
                label='Active Military'
                onChange={handleOtherInfoChange}
              >
                {optionListUnknown &&
                  optionListUnknown.map(item => {
                    return (
                      <MenuItem key={`military${item}`} value={item}>
                        {' '}
                        {item}{' '}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
          <div className='col col-md-2 col-sm-12'>
            <FormControl
              fullWidth
              error={!!validationError?.veteran}
              className='formControl'
            >
              <InputLabel id='veteran'> Veteran </InputLabel>
              <Select
                id='veteran'
                name='veteran'
                disabled={disabledOtherInfo}
                value={otherInformationFrom.veteran}
                label='Veteran'
                onBlur={e => handleError('veteran', e.target.value)}
                onChange={handleOtherInfoChange}
              >
                {optionList &&
                  optionList.map(item => {
                    return (
                      <MenuItem key={`veteran${item}`} value={item}>
                        {' '}
                        {item}{' '}
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText> <DAlertBox errorText={validationError?.veteran} /> </FormHelperText>
            </FormControl>
          </div>
        </div>
        <div className='d-sub-title'> {PHYSICAL_INFORMATION} </div>
        <div className='d-row'>
          <div className='col col-md-3 col-sm-12'>
            <FormControl fullWidth error={!!validationError?.gender}>
              <InputLabel id='gender'>Gender</InputLabel>
              <Select
                labelId='gender'
                id='gender'
                name="gender"
                disabled={disabledOtherInfo}
                defaultValue={otherInformationFrom.gender}
                label='Gender'
                onBlur={e => handleError('gender', e.target.value)}
                onChange={handleOtherInfoChange}
              >
                {genderList &&
                  genderList.map(item => {
                    return (
                      <MenuItem key={`gender${item}`} value={item}>
                        {' '}
                        {item}{' '}
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText><DAlertBox errorText={validationError?.gender} /> </FormHelperText>
            </FormControl>
          </div>
          <div className='col col-md-5 col-sm-12 pt-0'>
            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={otherInformationFrom.weight}
                  label='Weight'
                  fullWidth
                  name='weight'
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
                        <div className='input-adornment-text'> LBs </div>{' '}
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <div className='col col-md-8 col-sm-12 pt-0'>
                <div className='d-row'>
                  <div className='col col-md-6 col-sm-12'>
                    <TextField
                      value={otherInformationFrom.heightFeet}
                      label='Height (ft)'
                      fullWidth
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
                      label='Height (in)'
                      fullWidth
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
            </div>
          </div>
          <div className='col col-md-4 col-sm-12'>
            <div className='d-row'>
              <div className='col col-md-6 col-sm-12 pt-0'>
                <FormControl fullWidth error={!!validationError?.hairColor}>
                  <InputLabel id='hairColor'>Hair Color</InputLabel>
                  <Select
                    labelId='hairColor'
                    id='hairColor'
                    name="hairColor"
                    disabled={disabledOtherInfo}
                    value={otherInformationFrom.hairColor}
                    label='Hair Color'
                    onBlur={e => handleError('hairColor', e.target.value)}
                    onChange={handleOtherInfoChange}
                  >
                    {hairColorList &&
                      hairColorList.map(item => {
                        return (
                          <MenuItem key={`hair${item}`} value={item}>
                            {' '}
                            {item}{' '}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  <FormHelperText>
                    {' '}
                    <DAlertBox errorText={validationError?.hairColor} />{' '}
                  </FormHelperText>
                </FormControl>
              </div>
              <div className='col col-md-6 col-sm-12 pt-0'>
                <FormControl fullWidth error={!!validationError?.eyeColor}>
                  <InputLabel id='eyeColor'>Eye Color</InputLabel>
                  <Select
                    labelId='eyeColor'
                    id='eyeColor'
                    name="eyeColor"
                    disabled={disabledOtherInfo}
                    value={otherInformationFrom.eyeColor}
                    label='Eye Color'
                    onBlur={e => handleError('eyeColor', e.target.value)}
                    onChange={handleOtherInfoChange}
                  >
                    {eyeColorList &&
                      eyeColorList.map(item => {
                        return (
                          <MenuItem key={`eye${item}`} value={item}>
                            {' '}
                            {item}{' '}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  <FormHelperText>
                    {' '}
                    <DAlertBox errorText={validationError?.eyeColor} />
                  </FormHelperText>
                </FormControl>
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
              <div className='requester-user'>  Joe </div>
            </div>
          </div>

          <DialogTitle> Supervisor Override </DialogTitle>
          <DialogContent>
            Supervisor Override is necessary to skip document scans.
            <div className='d-row'>
              <div className='col col-md-6'>
                <TextField label='Login ID' fullWidth />
              </div>
              <div className='col col-md-6'>
                <TextField label='Password' fullWidth />
              </div>
              <div className='col'>
                <FormControl fullWidth>
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
