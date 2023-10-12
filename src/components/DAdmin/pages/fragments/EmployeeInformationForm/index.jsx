import React, { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import TransformNameFields from '../TransformNameFields';
import employeeData from './api-employee-data.json';
// const errors = ;

const userNameRegex = /^[a-zA-Z0-9 !"#$%&'()+,-./:;<=>?@\\_`{|}~]*$/;
const validateTransliterated = (isTransliterated, value) => {
  if (isTransliterated) {
    return true;
  }
  return userNameRegex.test(value);
};

const EmployeeInformation = ({ initialValues, mode }) => {
  const [formMode, setFormMode] = useState('CREATE' || mode);
  const [dropDowns, setDropDowns] = useState(employeeData.dropDowns);
  const [values, setValues] = useState(initialValues || employeeData.initial_values);
  const [errors, setErrors] = useState({
    lastName: '',
    middleName: '',
    firstName: '',
    loginId: '',
    employeeId: '',
    department: '',
    jobTitle: '',
    location: '',
    lockerBoxId: '',
    mobilePhone: '',
    workPhone: '',
    beginDate: '',
    endDate: '',
    userType: ''
  });
  const handleTransliterated = (formatOption, value, targertFormControl) => {
    setValues(values => {
      return {
        ...values,
        [formatOption]: value,
        [targertFormControl]: value ? values[targertFormControl] : ''
      };
    });
  };

  const handleValueChange = event => {
    setValues(values => {
      const field = event?.field;
      const value = event?.value;
      if (field && (value || typeof value === 'boolean')) {
        return { ...values, [field]: value };
      }
      const formControl = event.target;
      let returnValues = { ...values };
      if (['lastName', 'middleName', 'firstName'].indexOf(formControl.name) >= 0) {
        const fieldTruncated = `${formControl.name}IsTruncated`;
        const fieldTransliterated = `${formControl.name}IsTransliterated`;
        returnValues = {
          ...values,
          [formControl.name]: validateTransliterated(values[fieldTransliterated], formControl.value)
            ? formControl.value
            : values[formControl.name],
          [fieldTruncated]: formControl.value.length >= 33
        };

        return returnValues;
      }
      if (['mobilePhone', 'workPhone'].indexOf(formControl.name) >= 0) {
        const phonePattern = /^[0-9]{0,10}$/g;
        returnValues = {
          ...values,
          [formControl.name]: phonePattern.test(formControl.value)
            ? formControl.value
            : values[formControl.name]
        };
        return returnValues;
      }
      returnValues = { ...values, [formControl.name]: formControl.value };
      return returnValues;
    });
  };

  return (
    <React.Fragment>
      <form noValidate autoComplete='off'>
        <div className='d-row truncation-row'>
          <div className='col col-md-8 col-sm-12'>
            <TextField
              name='loginId'
              error={!!errors.loginId}
              helperText={errors.loginId}
              fullWidth
              label='Login Id'
              size='small'
              value={values.loginId}
              inputProps={{ maxLength: 45 }}
              autoComplete='off'
              onChange={handleValueChange}
            />
          </div>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              name='employeeId'
              error={!!errors.employeeId}
              helperText={errors.employeeId}
              fullWidth
              label='Employee Id'
              size='small'
              inputProps={{ maxLength: 45 }}
              autoComplete='off'
              value={values.employeeId}
              onChange={handleValueChange}
            />
          </div>
        </div>
        <div className='d-row truncation-row'>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              name='lastName'
              error={!!errors.lastName}
              helperText={errors.lastName}
              fullWidth
              label='Last Name'
              size='small'
              inputProps={{ maxLength: 45 }}
              autoComplete='off'
              value={values.lastName}
              onChange={handleValueChange}
            />
            {
              <TransformNameFields
                isTransliterated={values.lastNameIsTransliterated}
                isTruncated={values.lastNameIsTruncated}
                onTransliterated={e =>
                  handleTransliterated('lastNameIsTransliterated', e, 'lastName')
                }
              />
            }
          </div>

          <div className='col col-md-4 col-sm-12'>
            <TextField
              name='firstName'
              error={!!errors.firstName}
              helperText={errors.firstName}
              fullWidth
              label='First Name'
              size='small'
              inputProps={{ maxLength: 45 }}
              autoComplete='off'
              value={values.firstName}
              onChange={handleValueChange}
            />
            {
              <TransformNameFields
                isTransliterated={values.firstNameIsTransliterated}
                isTruncated={values.firstNameIsTruncated}
                onTransliterated={e =>
                  handleTransliterated('firstNameIsTransliterated', e, 'firstName')
                }
              />
            }
          </div>

          <div className='col col-md-4 col-sm-12'>
            <TextField
              name='middleName'
              error={!!errors.middleName}
              helperText={errors.middleName}
              fullWidth
              label='Middle Name'
              size='small'
              inputProps={{ maxLength: 45 }}
              autoComplete='off'
              value={values.middleName}
              onChange={handleValueChange}
            />
            {
              <TransformNameFields
                isTransliterated={values.middleNameIsTransliterated}
                isTruncated={values.middleNameIsTruncated}
                onTransliterated={e =>
                  handleTransliterated('middleNameIsTransliterated', e, 'middleName')
                }
              />
            }
          </div>
        </div>

        <div className='d-row truncation-row'>
          <div className='col col-md-4 col-sm-12'>
            <FormControl fullWidth size='small'>
              <InputLabel id='department'>Department</InputLabel>
              <Select
                labelId='department'
                label='Department'
                name='department'
                value={values.department}
                onChange={handleValueChange}
              >
                <MenuItem value='' disabled>
                  <em>None</em>
                </MenuItem>
                {!!dropDowns?.department &&
                  dropDowns.department.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      {option.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className='col col-md-4 col-sm-12'>
            <FormControl fullWidth size='small'>
              <InputLabel id='jobTitle'>Job Title</InputLabel>
              <Select
                labelId='jobTitle'
                label='Job Title'
                name='jobTitle'
                value={values.jobTitle}
                onChange={handleValueChange}
              >
                <MenuItem value='' disabled>
                  <em>None</em>
                </MenuItem>
                {!!dropDowns?.jobTitle &&
                  dropDowns.jobTitle.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      {option.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className='col col-md-4 col-sm-12'>
            <FormControl fullWidth size='small'>
              <InputLabel id='location'>Location</InputLabel>
              <Select
                labelId='location'
                label='Location'
                name='location'
                value={values.location}
                onChange={handleValueChange}
              >
                {!!dropDowns?.location &&
                  dropDowns.location.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      {option.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className='d-row truncation-row'>
          <div className='col col-md-4 col-sm-12'>
            <TextField
              name='lockerBoxId'
              error={!!errors.lockerBoxId}
              helperText={errors.lockerBoxId}
              fullWidth
              label='Locker Box Id'
              size='small'
              value={values.lockerBoxId}
              inputProps={{ maxLength: 45 }}
              autoComplete='off'
              onChange={handleValueChange}
            />
          </div>

          <div className='col col-md-4 col-sm-12'>
            <TextField
              name='mobilePhone'
              error={!!errors.mobilePhone}
              helperText={errors.mobilePhone}
              fullWidth
              label='Mobile Phone'
              size='small'
              value={values.mobilePhone}
              inputProps={{ maxLength: 45 }}
              autoComplete='off'
              onChange={handleValueChange}
            />
          </div>

          <div className='col col-md-4 col-sm-12'>
            <TextField
              name='workPhone'
              error={!!errors.workPhone}
              helperText={errors.workPhone}
              fullWidth
              label='Work Phone'
              value={values.workPhone}
              size='small'
              inputProps={{ maxLength: 45 }}
              autoComplete='off'
              onChange={handleValueChange}
            />
          </div>
        </div>

        <div className='d-row truncation-row'>
          <div className='col col-md-2 col-sm-12'>
            <div className={'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  fullWidth
                  id='beginDate'
                  slotProps={{ textField: { size: 'small' } }}
                  name='beginDate'
                  size='small'
                  label='Begin Date'
                  minDate={dayjs(new Date())}
                  disabled={mode === 'EDIT'}
                  value={values.beginDate ? dayjs(values.beginDate) : null}
                  onChange={e => handleValueChange({ value: e, field: 'beginDate' })}
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className='col col-md-2 col-sm-12'>
            <div className={'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  fullWidth
                  id='endDate'
                  slotProps={{ textField: { size: 'small' } }}
                  name='endDate'
                  size='small'
                  label='End Date'
                  minDate={dayjs(new Date())}
                  value={values.endDate ? dayjs(values.endDate) : null}
                  onChange={e => handleValueChange({ value: e, field: 'endDate' })}
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className='col col-md-4 col-sm-12'>
            <FormControl fullWidth size='small'>
              <InputLabel id='userType'>User Type</InputLabel>
              <Select
                labelId='userType'
                label='User Type'
                name='userType'
                value={values.userType}
                onChange={handleValueChange}
              >
                <MenuItem value='' disabled>
                  <em>None</em>
                </MenuItem>
                {!!dropDowns?.userType &&
                  dropDowns.userType.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      {option.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default EmployeeInformation;