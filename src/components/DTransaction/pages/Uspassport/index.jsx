import './index.css';

import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DAlertBox from '../../../DAlertBox';
import DLoaderDialog from '../../../DLoaderDialog';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

export default function Uspassport() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'US Passport', step: 'US Passport', flowId: flowId, substep: true }
    });
  }, 100);

  const [isVerified, setIsVerified] = useState(null);
  const [enableVerifyButton, setEnableVerifyButton] = useState(true);
  const [open, setOpen] = useState(false);
  const [passprotForm, setPassportForm] = useState({
    passportNumber: '',
    issueDate: '',
    expirationDate: ''
  });
  const [validationError, setValidationError] = useState();
  const navigate = useNavigate();
  const handlePassportNumberChange = (name, val) => {
    const specialCharacterPattern = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
    if (!specialCharacterPattern.test(val)) {
      handleChange(name, val);
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    let errorMsg = { ...validationError };
    for (const [k, v] of Object.entries(passprotForm)) {
      const error = validateFiled(k, v);
      errorMsg = { ...errorMsg, [k]: error };
      if (error === '') {
        delete errorMsg[k];
      }
    }
    setValidationError(errorMsg);
    navigate('/address');
  };

  const handleChange = (name, value) => {
    const newValues = { ...passprotForm };
    newValues[name] = value;
    setPassportForm(newValues);
    handleError(name, value);
  };

  const handleVerify = () => {
    setOpen(true);
    setTimeout(() => {
      setIsVerified(false);
      setOpen(false);
    }, 3000);
  };

  const handleError = (name, value) => {
    const error = validateFiled(name, value);
    const errors = { ...validationError, [name]: error };
    if (error === '') {
      delete errors[name];
    }
    setValidationError(errors);
  };

  useEffect(() => {
    if (
      passprotForm.passportNumber !== '' &&
      passprotForm.issueDate !== '' &&
      passprotForm.expirationDate !== ''
    ) {
      setEnableVerifyButton(false);
    }
  }, [passprotForm]);

  const validateFiled = (name, value) => {
    let error = '';
    switch (name) {
      case 'passportNumber':
        if (value === '') {
          error = 'Invalid Passport Number';
        }
        break;
      case 'issueDate':
        if (!dayjs(value, 'DD-MM-YYYY', true).isValid()) {
          error = 'Invalid Issue Date';
        }
        break;
      case 'expirationDate':
        if (!dayjs(value, 'DD-MM-YYYY', true).isValid()) {
          error = 'Invalid Expiration Date';
        }
        break;
      default:
    }
    return error;
  };

  return (
    <div className='d-container'>
      <form onSubmit={handleSubmit}>
        <div className='d-sub-title'> Proof of Identity </div>

        <div className='d-row'>
          <div className='col col-md-8 col-sm-12'>
            <FormControl disabled fullWidth>
              <InputLabel id='docType'> Verification Request Document </InputLabel>
              <Select
                id='docType'
                value={'US Passport'}
                label='Verification Request Document'
                
              >
                <MenuItem value={'US Passport'}> US Passport </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className='d-row'>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              
              fullWidth 
              label='Passport Number'
              inputProps={{ maxLength: 20 }}
              error={!!validationError?.passportNumber}
              value={passprotForm.passportNumber}
              helperText={<DAlertBox errorText={validationError?.passportNumber} />}
              onChange={e => handlePassportNumberChange('passportNumber', e.target.value)}
              onBlur={e => {
                handleError('passportNumber', e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {isVerified && (
                      <div className='verified-text input-adornment-text'> &#10004; Verified </div>
                    )}
                    {!isVerified && isVerified != null && (
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
          <div className='col col-md-4 col-sm-12'>
            <div className='date-picker has-date'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Issue Date'
                  fullWidth
                  value={passprotForm.issueDate && dayjs(passprotForm.issueDate)}
                  maxDate={passprotForm.issueDate ? passprotForm.expirationDate : dayjs(new Date())}
                  onChange={date => handleChange('issueDate', date)}
                  slotProps={{
                    textField: {
                      error: !!validationError?.issueDate,
                      helperText: <DAlertBox errorText={validationError?.issueDate} />,
                      onBlur: e => handleError('issueDate', e.target.value)
                    }
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className='col col-md-4 col-sm-12'>
            <div className='date-picker has-date'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  fullWidth
                  minDate={passprotForm.issueDate ? passprotForm.issueDate : dayjs(new Date())}
                  label='Expiration Date'
                  value={passprotForm.expirationDate && dayjs(passprotForm.expirationDate)}
                  onChange={date => handleChange('expirationDate', date)}
                  slotProps={{
                    textField: {
                      error: !!validationError?.expirationDate,
                      helperText: <DAlertBox errorText={validationError?.expirationDate} />,
                      onBlur: e => handleError('expirationDate', e.target.value)
                    }
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          </div>
          <div className='d-row'>
          <div className='col col-md-4 col-sm-12'>
          <div className='date-picker has-date'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Issue Date' 
                  disabled={isVerified===null}
                  value={ dayjs(new Date())}
                />
              </LocalizationProvider>
              </div>
            </div> 
          </div>
          <div className='d-row'>
          <div className='col col-md-4 col-sm-12'>
            {isVerified ? (
              <div className='date-picker has-date'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label='Verify Date' disabled value={dayjs(new Date())} />
                </LocalizationProvider>
              </div>
            ) : (
              <Button onClick={handleVerify} disabled={enableVerifyButton} variant='outlined'>
                {' '}
                VERIFY{' '}
              </Button>
            )}
          </div>
        </div>
      </form>
      <DLoaderDialog showLoader={open} loadingText={'Passport verification in progress'} />
    </div>
  );
}
