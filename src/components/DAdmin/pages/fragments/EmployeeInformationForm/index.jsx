import React, { useEffect, useState } from 'react';
import { Autocomplete, FormControl, InputAdornment, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import DAlertBox from '../../../../DAlertBox';
import API_DATA from './api-employee-data.json';
import * as _ from 'lodash';

const initialFormState = {
  isValid: true,
  isDirty: false,
  submitted: false,
  isSubmitting: false,
  values: {
    lastName: '',
    middleName: '',
    firstName: '',
    loginId: '',
    employeeId: '',
    department: null,
    jobTitle: null,
    location: null,
    lockerBoxId: '',
    mobilePhone: '',
    workPhone: '',
    beginDate: dayjs(new Date()),
    endDate: '',
    userType: 'NORMAL'
  },
  touched: {
    lastName: false,
    middleName: false,
    firstName: false,
    loginId: false,
    employeeId: false,
    department: false,
    jobTitle: false,
    location: false,
    lockerBoxId: false,
    mobilePhone: false,
    workPhone: false,
    beginDate: false,
    endDate: false,
    userType: false
  },
  errors: {
    lastName: 'Last Name is required',
    middleName: null,
    firstName: 'First Name is required',
    loginId: 'Login Id is required',
    employeeId: 'Employee Id is required',
    department: 'Department is required',
    jobTitle: 'Job Title is required',
    location: 'Location is required',
    lockerBoxId: null,
    mobilePhone: null,
    workPhone: null,
    beginDate: null,
    endDate: undefined,
    userType: null
  }
};

const EmployeeInformation = ({ employeeData, mode = 'new' }) => {
  const [formState, setFormState] = useState({
    ...initialFormState,
    values: { ...initialFormState.values, ...employeeData }
  });
  const [formFieldToCorrect, setFormFieldToCorrect] = useState(null);
  const readOnly = mode === 'read-only';
  useEffect(() => {
    if (!!employeeData) {
      const newFormState = { ...formState };
      const values = newFormState.values;
      Object.keys(formState.values).forEach(inputName => {
        newFormState.touched[inputName] = true;
        newFormState.errors[inputName] = validateFormInput({
          target: { name: inputName, value: values[inputName] }
        });
      });
      newFormState.isValid = Object.values(newFormState.errors).every(error => !error);
      setFormState(newFormState);
    }
  }, []);

  const validateFormInput = event => {
    const inputName = event.target.name;
    if (mode === 'edit' && ['beginDate', 'employeeId', 'userType'].includes(inputName)) {
      return null;
    }
    if (mode === 'read-only' && ['beginDate', 'employeeId', 'userType'].includes(inputName)) {
      return null;
    }
    const inputValue = event.target.value;
    switch (inputName) {
      case 'lastName':
      case 'firstName':
        // Mandatory input
        if (!inputValue) return `Invalid ${inputName === 'lastName' ? 'Last Name' : 'First Name'}`;
        let isValidName;
        if (inputValue?.length > 33) {
          return `Invalid ${inputName}`;
        }
        if (inputName == 'firstName' && !inputValue) {
          return null;
        }
        isValidName = /^(?! )[a-zA-Z '‘’ -]{1,33}$/.test(inputValue);
        if (!isValidName) {
          return `Invalid ${inputName === 'lastName' ? 'Last Name' : 'First Name'}`;
        }
        return null;
        break;
      case 'middleName':
        if (!inputValue) return null;
        if (inputValue?.length > 31) {
          return `Invalid Middle Name`;
        }
        if (!inputValue) {
          return null;
        }
        const isValidMiddleName = /^(?! )[a-zA-Z '‘’ -]{1,31}$/.test(inputValue);
        if (!isValidMiddleName) {
          return `Invalid Middle Name`;
        }
        return null;
        break;
      case 'loginId':
        // Mandatory input
        if (!inputValue) return 'Invalid Login Id';
        let isValidemail;
        isValidemail = inputValue.length <= 100;
        isValidemail =
          isValidemail && /^[a-zA-Z0-9._%+-]+@[dD][cC]\.[gG][oO][vV]$/g.test(inputValue);
        if (!isValidemail) {
          return `Invalid Login ID`;
        }
        return null;
        break;
      case 'employeeId':
        // Mandatory input
        if (!inputValue) return 'Invalid Employee Id';
        const isValidEmpId = /^\d{1,9}$/.test(inputValue);
        if (!isValidEmpId) {
          return `Invalid Employee ID`;
        }
        return null;
        break;
      case 'department':
        // Mandatory input
        if (!inputValue) {
          return 'Department is required';
        }
        if (inputValue && !API_DATA.dropDowns.department.includes(inputValue)) {
          return `Invalid Department`;
        }
        return null;
        break;
      case 'jobTitle':
        if (!inputValue) {
          return 'Job Title is required';
        }
        if (inputValue && !API_DATA.dropDowns.jobTitle.includes(inputValue)) {
          return `Invalid Job Title`;
        }
        return null;
        break;
      case 'location':
        if (!inputValue) {
          return 'Location is required';
        }
        if (inputValue && !API_DATA.dropDowns.location.includes(inputValue)) {
          return `Invalid Location`;
        }
        return null;
        break;
      case 'lockerBoxId':
        if (!inputValue) return null;
        const isLockerBoxIdValid = inputValue.length <= 12;
        if (!isLockerBoxIdValid) {
          return `Invalid Locker Box Id`;
        }
        return null;
        break;
      case 'mobilePhone':
      case 'workPhone':
        if (!inputValue) return null;
        const isValidPhoneNumber = /\(\d{3}\) \d{3}-\d{4}/.test(inputValue);
        if (!isValidPhoneNumber) {
          return `Invalid ${inputName === 'mobilePhone' ? 'Mobile Phone' : 'Work Phone'}`;
        }
        break;
      case 'beginDate':
        const today = new Date().setHours(0, 0, 0, 0);
        if (inputValue && today <= new Date(inputValue).getTime()) {
          return null;
        }
        return `Invalid Begin date`;
        break;
      case 'endDate':
        if (!inputValue) return null;
        const beginDate = new Date(formState.values.beginDate).setHours(0, 0, 0, 0);
        if (inputValue && beginDate <= new Date(inputValue).setHours(0, 0, 0, 0)) {
          return null;
        }
        return `Invalid End date`;
        break;
      case 'userType':
        if (inputValue && !API_DATA.dropDowns.userType.includes(inputValue)) {
          return `Invalid User Type`;
        }
        return null;
        break;
      default:
        break;
    }
  };

  const handleValueChange = event => {
    setFormState(_formState => {
      const inputName = event.target.name;
      const inputValue = event.target.value;
      const newFormState = { ..._formState };

      newFormState.isDirty = true;
      newFormState.isSubmitting = false;
      newFormState.values[inputName] = inputValue;
      newFormState.errors[inputName] = validateFormInput(event);

      if (['mobilePhone', 'workPhone'].includes(inputName)) {
        const formattedValue = inputValue.replace(/\D/g, '');
        let formattedNumber = formattedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

        newFormState.values[inputName] = formattedNumber;
        newFormState.errors[inputName] = validateFormInput({
          target: { value: formattedNumber, name: inputName }
        });
      }

      if (
        ['jobTitle', 'location', 'department', 'userType'].includes(inputName) &&
        inputValue === '--Select--'
      ) {
        newFormState.values[inputName] = null;
        newFormState.errors.inputName = null;
        document.activeElement.blur();
      }

      if (inputName === 'employeeId') {
        newFormState.values[inputName] = inputValue?.replace(/[^0-9]/g, '') || '';
      }

      if (['firstName', 'middleName', 'lastName'].includes(inputName)) {
        newFormState.values[inputName] = inputValue?.replace(/[^A-Za-z \'\-\‘\’]/g, '') || '';
      }

      if (['firstName', 'middleName'].includes(inputName) && !formState.values.lastName) {
        newFormState.errors['lastName'] = 'Please enter the Last Name';
        newFormState.touched.lastName = true;
      }

      if (inputName === 'beginDate') {
        newFormState.values.endDate = null;
        newFormState.errors.endDate = null;
      }

      newFormState.isValid = Object.values(newFormState.errors).every(error => !error);
      if (
        !_.isEmpty(formFieldToCorrect) &&
        formFieldToCorrect === inputName &&
        !newFormState.errors[inputName]
      ) {
        setFormFieldToCorrect(null);
      }
      return newFormState;
    });
  };

  const handleFocus = event => {
    const inputName = event.target.name;
  };

  const handleInputBlur = event => {
    const inputName = event.target.name;
    setFormState(_formState => {
      const newFormState = { ...formState };
      let inputValue = event.target.value || null;

      if (typeof inputValue === 'string') {
        let stanitizedInputValue = inputValue.trim().toUpperCase();
        if (inputValue.toLowerCase().includes('mm/dd/yyyy')) {
          stanitizedInputValue = '';
        }
        newFormState.values[inputName] = stanitizedInputValue;
        newFormState.errors[inputName] = validateFormInput({
          target: { name: inputName, value: stanitizedInputValue }
        });
      }
      newFormState.touched[inputName] = true;
      newFormState.isDirty = true;
      if (newFormState.errors[inputName]) {
        event.target.focus();
        setFormFieldToCorrect(inputName);
      } else if (formFieldToCorrect) {
        setFormFieldToCorrect(null);
      }
      return newFormState;
    });
  };

  return (
    <React.Fragment>
      <form noValidate autoComplete='off' className='employee-information-form'>
        <div className='d-row truncation-row'>
          <div className='col col-md-8 col-sm-12'>
            <TextField
              disabled={
                readOnly || (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'loginId')
              }
              name='loginId'
              error={formState.touched.loginId && !!formState.errors.loginId}
              helperText={
                <DAlertBox
                  errorText={
                    formState.touched.loginId && formState.errors.loginId
                      ? formState.errors.loginId
                      : ''
                  }
                />
              }
              fullWidth
              label='Login Id'
              size='small'
              value={formState.values.loginId}
              inputProps={{ maxLength: 100 }}
              autoComplete='off'
              onChange={handleValueChange}
              onBlur={handleInputBlur}
            />
          </div>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              name='employeeId'
              error={formState.touched.employeeId && !!formState.errors.employeeId}
              helperText={
                <DAlertBox
                  errorText={
                    formState.touched.employeeId && formState.errors.employeeId
                      ? formState.errors.employeeId
                      : ''
                  }
                />
              }
              fullWidth
              label='Employee Id'
              size='small'
              inputProps={{ maxLength: 9 }}
              autoComplete='off'
              disabled={true}
              value={formState.values.employeeId}
              onChange={handleValueChange}
              onBlur={handleInputBlur}
            />
          </div>
        </div>
        <div className='d-row truncation-row'>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              disabled={
                readOnly || (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'lastName')
              }
              name='lastName'
              error={formState.touched.lastName && !!formState.errors.lastName}
              helperText={
                <DAlertBox
                  errorText={
                    formState.touched.lastName && formState.errors.lastName
                      ? formState.errors.lastName
                      : ''
                  }
                />
              }
              fullWidth
              label='Last Name'
              size='small'
              inputProps={{ maxLength: 33 }}
              autoComplete='off'
              value={formState.values.lastName}
              onChange={handleValueChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div className='col col-md-4 col-sm-12'>
            <TextField
              disabled={
                readOnly || (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'firstName')
              }
              name='firstName'
              error={formState.touched.firstName && !!formState.errors.firstName}
              helperText={
                <DAlertBox
                  errorText={
                    formState.touched.firstName && formState.errors.firstName
                      ? formState.errors.firstName
                      : ''
                  }
                />
              }
              fullWidth
              label='First Name'
              size='small'
              inputProps={{ maxLength: 33 }}
              autoComplete='off'
              value={formState.values.firstName}
              onChange={handleValueChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div className='col col-md-4 col-sm-12'>
            <TextField
              disabled={
                readOnly || (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'middleName')
              }
              name='middleName'
              error={formState.touched.middleName && !!formState.errors.middleName}
              helperText={
                <DAlertBox
                  errorText={
                    formState.touched.middleName && formState.errors.middleName
                      ? formState.errors.middleName
                      : ''
                  }
                />
              }
              fullWidth
              label='Middle Name'
              size='small'
              inputProps={{ maxLength: 31 }}
              autoComplete='off'
              value={formState.values.middleName}
              onChange={handleValueChange}
              onBlur={handleInputBlur}
            />
          </div>
        </div>

        <div className='d-row truncation-row'>
          <div className='col col-md-4 col-sm-12'>
            <FormControl fullWidth size='small'>
              <Autocomplete
                disabled={
                  readOnly ||
                  (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'department')
                }
                disableClearable={true}
                onChange={(event, newValue) => {
                  handleValueChange({
                    target: {
                      name: 'department',
                      value: newValue || null,
                      labels: [{ innerText: 'Department' }]
                    }
                  });
                }}
                onInputChange={(event, newInputValue) => {
                  handleValueChange({
                    target: {
                      name: 'department',
                      value: newInputValue || null,
                      labels: [{ innerText: 'Department' }]
                    }
                  });
                }}
                value={formState.values.department}
                size='small'
                id='department'
                options={[...API_DATA.dropDowns.department]}
                renderInput={params => (
                  <TextField
                    onFocus={() => handleFocus({ target: { name: 'department' } })}
                    {...params}
                    error={formState.touched.department && !!formState.errors.department}
                    label='Department'
                    name='department'
                    onBlur={handleInputBlur}
                    helperText={
                      <DAlertBox
                        errorText={
                          formState.touched.department && formState.errors.department
                            ? formState.errors.department
                            : ''
                        }
                      />
                    }
                  />
                )}
              />
            </FormControl>
          </div>

          <div className='col col-md-4 col-sm-12'>
            <FormControl fullWidth size='small'>
              <Autocomplete
                disabled={
                  readOnly || (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'jobTitle')
                }
                disableClearable={true}
                onChange={(event, newValue) => {
                  handleValueChange({
                    target: {
                      name: 'jobTitle',
                      value: newValue || null,
                      labels: [{ innerText: 'Job Title' }]
                    }
                  });
                }}
                onInputChange={(event, newInputValue) => {
                  handleValueChange({
                    target: {
                      name: 'jobTitle',
                      value: newInputValue || null,
                      labels: [{ innerText: 'Job Title' }]
                    }
                  });
                }}
                value={formState.values.jobTitle}
                size='small'
                id='jobTitle'
                options={[...API_DATA.dropDowns.jobTitle]}
                renderInput={params => (
                  <TextField
                    onFocus={() => handleFocus({ target: { name: 'jobTitle' } })}
                    {...params}
                    label='Job Title'
                    name='jobTitle'
                    onBlur={handleInputBlur}
                    helperText={
                      <DAlertBox
                        errorText={
                          formState.touched.jobTitle && formState.errors.jobTitle
                            ? formState.errors.jobTitle
                            : ''
                        }
                      />
                    }
                    error={formState.touched.jobTitle && !!formState.errors.jobTitle}
                  />
                )}
              />
            </FormControl>
          </div>

          <div className='col col-md-4 col-sm-12'>
            <FormControl fullWidth size='small'>
              <Autocomplete
                disabled={
                  readOnly || (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'location')
                }
                disableClearable={true}
                onChange={(event, newValue) => {
                  handleValueChange({
                    target: {
                      name: 'location',
                      value: newValue || null,
                      labels: [{ innerText: 'Location' }]
                    }
                  });
                }}
                onInputChange={(event, newInputValue) => {
                  handleValueChange({
                    target: {
                      name: 'location',
                      value: newInputValue || null,
                      labels: [{ innerText: 'Location' }]
                    }
                  });
                }}
                value={formState.values.location}
                size='small'
                id='location'
                options={[...API_DATA.dropDowns.location]}
                renderInput={params => (
                  <TextField
                    onFocus={() => handleFocus({ target: { name: 'location' } })}
                    {...params}
                    label='Location'
                    name='location'
                    onBlur={handleInputBlur}
                    helperText={
                      <DAlertBox
                        errorText={
                          formState.touched.location && formState.errors.location
                            ? formState.errors.location
                            : ''
                        }
                      />
                    }
                    error={formState.touched.location && !!formState.errors.location}
                  />
                )}
              />
            </FormControl>
          </div>
        </div>

        <div className='d-row truncation-row'>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              disabled={
                readOnly || (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'lockerBoxId')
              }
              name='lockerBoxId'
              error={formState.touched.lockerBoxId && !!formState.errors.lockerBoxId}
              helperText={
                <DAlertBox
                  errorText={
                    formState.touched.lockerBoxId && formState.errors.lockerBoxId
                      ? formState.errors.lockerBoxId
                      : ''
                  }
                />
              }
              fullWidth
              label='Locker Box Id'
              size='small'
              value={formState.values.lockerBoxId}
              inputProps={{ maxLength: 12 }}
              autoComplete='off'
              onChange={handleValueChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div className='col col-md-4 col-sm-12'>
            <TextField
              disabled={
                readOnly || (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'mobilePhone')
              }
              name='mobilePhone'
              error={!!formState.touched.mobilePhone && !!formState.errors.mobilePhone}
              helperText={
                <DAlertBox
                  errorText={
                    formState.touched.mobilePhone && formState.errors.mobilePhone
                      ? formState.errors.mobilePhone
                      : ''
                  }
                />
              }
              fullWidth
              label='Mobile Phone'
              size='small'
              value={formState.values.mobilePhone}
              inputProps={{ maxLength: 14 }}
              InputProps={{
                startAdornment: <InputAdornment position='start'>+1</InputAdornment>
              }}
              autoComplete='off'
              onChange={handleValueChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div className='col col-md-4 col-sm-12'>
            <TextField
              disabled={
                readOnly || (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'workPhone')
              }
              name='workPhone'
              error={!!formState.touched.workPhone && !!formState.errors.workPhone}
              helperText={
                <DAlertBox
                  errorText={
                    formState.touched.workPhone && !!formState.errors.workPhone
                      ? formState.errors.workPhone
                      : ''
                  }
                />
              }
              fullWidth
              label='Work Phone'
              value={formState.values.workPhone}
              size='small'
              inputProps={{ maxLength: 14 }}
              InputProps={{
                startAdornment: <InputAdornment position='start'>+1</InputAdornment>
              }}
              autoComplete='off'
              onChange={handleValueChange}
              onBlur={handleInputBlur}
            />
          </div>
        </div>

        <div className='d-row truncation-row'>
          <div className='col col-md-2 col-sm-12'>
            <div className={'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled={
                    readOnly ||
                    !!employeeData ||
                    (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'beginDate')
                  }
                  fullWidth
                  id='beginDate'
                  slotProps={{
                    textField: {
                      size: 'small',
                      onBlur: handleInputBlur,
                      name: 'beginDate',
                      helperText: (
                        <DAlertBox
                          errorText={
                            formState.touched.beginDate && formState.errors.beginDate
                              ? formState.errors.beginDate
                              : ''
                          }
                        />
                      )
                    }
                  }}
                  name='beginDate'
                  size='small'
                  label='Begin Date'
                  minDate={mode === 'new' ? dayjs(new Date().setHours(0, 0, 0, 0)) : null}
                  error={!!formState.touched.beginDate && !!formState.errors.beginDate}
                  value={formState.values.beginDate ? dayjs(formState.values.beginDate) : null}
                  onChange={e =>
                    handleValueChange({
                      target: { value: e || null, name: 'beginDate' }
                    })
                  }
                  onBlur={e => handleInputBlur({ target: { value: e, name: 'beginDate' } })}
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className='col col-md-2 col-sm-12'>
            <div className={'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled={
                    readOnly ||
                    !!formState.errors.beginDate ||
                    (!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== 'endDate')
                  }
                  fullWidth
                  id='endDate'
                  slotProps={{
                    textField: {
                      size: 'small',
                      onBlur: handleInputBlur,
                      name: 'endDate',
                      helperText: (
                        <DAlertBox
                          errorText={
                            formState.touched.endDate && formState.errors.endDate
                              ? formState.errors.endDate
                              : ''
                          }
                        />
                      )
                    }
                  }}
                  name='endDate'
                  size='small'
                  label='End Date'
                  error={!!formState.touched.endDate && !!formState.errors.endDate}
                  minDate={
                    formState.values.beginDate
                      ? dayjs(formState.values.beginDate).startOf('day')
                      : null
                  }
                  value={formState.values.endDate ? dayjs(formState.values.endDate) : null}
                  onChange={e =>
                    handleValueChange({
                      target: { value: e.toDate(), name: 'endDate' }
                    })
                  }
                  onBlur={e => handleInputBlur({ target: { value: e, name: 'endDate' } })}
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className='col col-md-4 col-sm-12'>
            <FormControl fullWidth size='small'>
              <Autocomplete
                disableClearable={true}
                onChange={(event, newValue) => {
                  handleValueChange({
                    target: {
                      name: 'userType',
                      value: newValue || null,
                      labels: [{ innerText: 'User Type' }]
                    }
                  });
                }}
                onInputChange={(event, newInputValue) => {
                  handleValueChange({
                    target: {
                      name: 'userType',
                      value: newInputValue || null,
                      labels: [{ innerText: 'User Type' }]
                    }
                  });
                }}
                disabled={true}
                value={formState.values.userType}
                size='small'
                id='userType'
                options={[...API_DATA.dropDowns.userType]}
                renderInput={params => (
                  <TextField
                    disabled={!_.isEmpty(formFieldToCorrect) && formFieldToCorrect !== ''}
                    onFocus={() => handleFocus({ target: { name: 'userType' } })}
                    {...params}
                    label='User Type'
                    name='userType'
                    onBlur={handleInputBlur}
                    helperText={
                      <DAlertBox
                        errorText={
                          formState.touched.userType && formState.errors.userType
                            ? formState.errors.userType
                            : ''
                        }
                      />
                    }
                  />
                )}
                error={
                  formState.touched.userType && formState.errors.userType
                    ? formState.errors.userType
                    : undefined
                }
              />
            </FormControl>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default EmployeeInformation;
