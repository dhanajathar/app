import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import './index.css';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Divider,
  Autocomplete,
  Button
} from '@mui/material';
import data from './api-employee-search.json';
import DAlertBox from '../../../../DAlertBox';
import DTextField from '../../../../DTextField';

const Employee = forwardRef((props, ref) => {
  const initialFormState = {
    isSubmitted: false, // `true` when hit submit
    isSubmitting: false, // `true` when form is being insubmitting state
    isValid: true, // `false` when any of the form controls is invalid
    isDirty: false, // `true` when any of the form controls is updated
    controls: {},
    errors: { ...data.errors },
    values: { ...data.initial_values }
  };
  const [disabledControls, setDisabledControls] = useState([]);

  const [formState, setFormState] = useState(initialFormState);

  const formRef = useRef();

  useEffect(() => {
    resetForm();
    props.shouldDisableSearch(!formState.isValid);
  }, []);

  useImperativeHandle(ref, () => ({
    implementResetForm() {
      resetForm();
    }
  }));

  const validateInputData = (inputName, inputValue) => {
    switch (inputName) {
      case 'loginId':
        const isValidemail = /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@dc([\.])gov/g.test(
          inputValue
        );
        if (!isValidemail) {
          return `invalid Email`;
        }
        return null;
        break;
      case 'employeeId':
        const isValidEmpId = /^\d{1,9}$/.test(inputValue);
        if (!isValidEmpId) {
          return `invalid Employee ID`;
        }
        return null;
        break;
      case 'firstName':
      case 'lastName':
        let isValidName;
        if (inputValue?.length > 33) {
          return `invalid ${inputName}`;
        }
        if (inputName == 'firstName' && !inputValue) {
          return null;
        }
        isValidName = /^(?!.*\d)[A-Za-z'-‘’]+(?: [A-Za-z'-‘’]+)*$/.test(inputValue);
        if (!isValidName) {
          return `invalid ${inputName}`;
        }
        return null;
        break;
      case 'middleName':
        if (inputValue?.length > 31) {
          return `invalid ${inputName}`;
        }
        if (!inputValue) {
          return null;
        }
        const isValidMiddleName = /^(?!.*\d)[A-Za-z'-‘’]+(?: [A-Za-z'-‘’]+)*$/.test(inputValue);
        if (!isValidMiddleName) {
          return `invalid middle name`;
        }
        return null;
        break;
      case 'jobTitle':
        if (!data.jobTitle.includes(inputValue) && inputValue) {
          return `Invalid Job Title`;
        }
        return null;
        break;
      case 'location':
        if (!data.location.includes(inputValue) && inputValue) {
          return `Invalid Location`;
        }
        return null;
        break;
      default:
        return null;
    }
  };

  const handleBlur = event => {
    const inputName = event.target.name;
    setFormState(initialFormState => {
      const newFormState = { ...initialFormState };
      newFormState.controls[inputName].touched = true;
      return newFormState;
    });
  };

  const handleValueChange = event => {
    const inputName = event.target.name;
    const inputValue = event.target.value || null;
    setFormState(initialFormState => {
      const newFormState = { ...initialFormState };
      newFormState.isDirty = true;
      newFormState.controls[inputName].value = inputValue;
      newFormState.controls[inputName].error = validateInputData(inputName, inputValue);
      if (newFormState.controls[inputName].error) {
        newFormState.errors[inputName] = newFormState.controls[inputName].error;
      } else {
        newFormState.errors[inputName] = null;
      }
      newFormState.controls[inputName].isValid = !newFormState.controls[inputName].error;
      newFormState.values[inputName] = inputValue;
      if (inputName === 'jobTitle' && inputValue === '--Select--') {
        newFormState.values[inputName] = null;
        newFormState.controls[inputName].error = null;
        newFormState.controls[inputName].isValid = true;
        document.activeElement.blur();
      }
      if (inputName === 'employeeId') {
        newFormState.values[inputName] = inputValue?.replace(/[^0-9]/g, '') || '';
        newFormState.controls[inputName].value = inputValue?.replace(/[^0-9]/g, '') || '';
      }

      if (['firstName', 'middleName'].includes(inputName) && !formState.values.lastName) {
        newFormState.errors['lastName'] = 'Please enter the Last Name';
        newFormState.controls['lastName'].isValid = false;
        newFormState.controls['lastName'].touched = true;
      }

      if (inputName === 'location' && !inputValue) {
        newFormState.values[inputName] = data.initial_values.location;
        newFormState.controls[inputName].error = null;
        newFormState.controls[inputName].isValid = true;
      }

      const errors = newFormState.errors;
      newFormState.isValid = Object.values(errors).every(error => !error);
      props.shouldDisableSearch(!newFormState.isValid);
      return newFormState;
    });
  };

  const resetForm = () => {
    setDisabledControls([]);
    const values = data.initial_values;
    for (let control in values) {
      initialFormState.controls[control] = initialFormState.controls[control]
        ? { ...initialFormState.controls[control] }
        : { touched: false, isValid: true, value: null, error: null };
      initialFormState.controls[control]['value'] = values[control];
      initialFormState.controls[control]['error'] = validateInputData(
        control,
        initialFormState.controls[control]['value']
      );
      initialFormState.controls[control]['isValid'] = !initialFormState.controls[control]['error'];
      validateInputData(control, initialFormState.controls[control]['value']);
    }
    setFormState(initialFormState);
  };
  const validateForm = () => {
    const { loginId, employeeId, lastName, firstName, middleName, location } = formState.values;
    return (
      (lastName &&
        (firstName || middleName || !firstName || !middleName) &&
        !formState.errors.lastName &&
        !formState.errors.middleName &&
        !formState.errors.firstName) ||
      (loginId && !formState.errors.loginId) ||
      (employeeId && !formState.errors.employeeId)
    );
  };

  const handleFocus = event => {
    const inputName = event.target.name;

    switch (inputName) {
      case 'loginId':
        setDisabledControls([
          'employeeId',
          'firstName',
          'lastName',
          'middleName',
          'location',
          'jobTitle'
        ]);
        break;
      case 'employeeId':
        setDisabledControls([
          'loginId',
          'firstName',
          'lastName',
          'middleName',
          'location',
          'jobTitle'
        ]);
        break;
      case 'firstName':
      case 'lastName':
      case 'middleName':
        setDisabledControls(['loginId', 'employeeId', , 'location', 'jobTitle']);
        break;
      case 'jobTitle':
        setDisabledControls(['loginId', 'employeeId', 'firstName', 'lastName', 'middleName']);
        break;
      default:
    }
  };

  const handleClear = controlName => {
    const targetField = formRef.current.querySelector(`[name='${controlName}']`);
    targetField.value = '';
    handleValueChange({ target: { name: controlName, value: null } });
  };

  return (
    <React.Fragment>
      <form noValidate autoComplete='off' ref={formRef}>
        <div className='d-row truncation-row'>
          <div className='col-12 serach-title'>
            <p className='page-text'>Search an employee by any combination below.</p>
          </div>
          <div className='col col-md-8 col-sm-12'>
            <DTextField
              handleclear={e => handleClear('loginId')}
              enableclear='enable'
              onFocus={handleFocus}
              value={formState.values.loginId}
              name='loginId'
              error={
                formState.controls.loginId?.touched && formState.errors.loginId
                  ? formState.errors.loginId
                  : undefined
              }
              helperText={
                <DAlertBox
                  errorText={
                    formState.controls.loginId?.touched && formState.errors.loginId
                      ? formState.errors.loginId
                      : ''
                  }
                />
              }
              fullWidth
              label='Login ID'
              size='small'
              inputProps={{ maxLength: 45 }}
              autoComplete='off'
              onChange={handleValueChange}
              onBlur={handleBlur}
              disabled={disabledControls.includes('loginId')}
            />
          </div>
          <div className='col col-md-4 col-sm-12'>
            <DTextField
              handleclear={e => handleClear('employeeId')}
              enableclear='enable'
              value={formState.values.employeeId}
              onFocus={handleFocus}
              name='employeeId'
              error={
                formState.controls.employeeId?.touched && formState.errors.employeeId
                  ? formState.errors.employeeId
                  : undefined
              }
              helperText={
                <DAlertBox
                  errorText={
                    formState.controls.employeeId?.touched && formState.errors.employeeId
                      ? formState.errors.employeeId
                      : ''
                  }
                />
              }
              fullWidth
              label='Employee ID'
              size='small'
              inputProps={{ maxLength: 9 }}
              autoComplete='off'
              onChange={handleValueChange}
              onBlur={handleBlur}
              disabled={disabledControls.includes('employeeId')}
            />
          </div>
        </div>
        <div className='d-row truncation-row'>
          <div className='col col-md-4 col-sm-12'>
            <DTextField
              handleclear={e => handleClear('lastName')}
              enableclear='enable'
              value={formState.values.lastName}
              onFocus={handleFocus}
              name='lastName'
              error={
                formState.controls.lastName?.touched && formState.errors.lastName
                  ? formState.errors.lastName
                  : undefined
              }
              helperText={
                <DAlertBox
                  errorText={
                    formState.controls.lastName?.touched && formState.errors.lastName
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
              onChange={handleValueChange}
              onBlur={handleBlur}
              disabled={disabledControls.includes('lastName')}
            />
          </div>

          <div className='col col-md-4 col-sm-12'>
            <DTextField
              handleclear={e => handleClear('firstName')}
              enableclear='enable'
              value={formState.values.firstName}
              onFocus={handleFocus}
              name='firstName'
              error={
                formState.controls.firstName?.touched && formState.errors.firstName
                  ? formState.errors.firstName
                  : undefined
              }
              helperText={
                <DAlertBox
                  errorText={
                    formState.controls.firstName?.touched && formState.errors.firstName
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
              onChange={handleValueChange}
              disabled={disabledControls.includes('firstName')}
              onBlur={handleBlur}
            />
          </div>

          <div className='col col-md-4 col-sm-12'>
            <DTextField
              handleclear={e => handleClear('middleName')}
              enableclear='enable'
              value={formState.values.middleName}
              onFocus={handleFocus}
              name='middleName'
              error={
                formState.controls.middleName?.touched && formState.errors.middleName
                  ? formState.errors.middleName
                  : undefined
              }
              helperText={
                <DAlertBox
                  errorText={
                    formState.controls.middleName?.touched && formState.errors.middleName
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
              onChange={handleValueChange}
              disabled={disabledControls.includes('middleName')}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <Divider sx={{ mt: '2rem', mb: '1rem' }} className='combination-divider'>
          OR
        </Divider>

        <div className='d-row truncation-row'>
          <div className='col col-md-8 col-sm-12'>
            <FormControl fullWidth size='small'>
              <Autocomplete
                onChange={(event, newValue) => {
                  handleValueChange({ target: { name: 'jobTitle', value: newValue || null } });
                }}
                onInputChange={(event, newInputValue) => {
                  handleValueChange({
                    target: { name: 'jobTitle', value: newInputValue || null }
                  });
                }}
                value={formState.values.jobTitle}
                size='small'
                id='jobTitle'
                disabled={disabledControls.includes('jobTitle')}
                options={['--Select--', ...data.jobTitle]}
                renderInput={params => (
                  <TextField
                    onFocus={() => handleFocus({ target: { name: 'jobTitle' } })}
                    {...params}
                    label='Job Title'
                    name='jobTitle'
                    onBlur={handleBlur}
                    helperText={
                      <DAlertBox
                        errorText={
                          formState.controls.jobTitle?.touched && formState.errors.jobTitle
                            ? formState.errors.jobTitle
                            : ''
                        }
                      />
                    }
                  />
                )}
                error={
                  formState.controls.jobTitle?.touched && formState.errors.jobTitle
                    ? formState.errors.jobTitle
                    : undefined
                }
              />
            </FormControl>
          </div>

          <div className='col col-md-4 col-sm-12'>
            <FormControl fullWidth size='small'>
              <Autocomplete
                disableClearable={formState.values.location === 'ALL LOCATIONS'}
                onChange={(event, newValue) => {
                  handleValueChange({
                    target: {
                      name: 'location',
                      value: newValue || null
                    }
                  });
                }}
                onInputChange={(event, newInputValue) => {
                  handleValueChange({
                    target: {
                      name: 'location',
                      value: newInputValue || null
                    }
                  });
                }}
                value={formState.values.location}
                size='small'
                id='location'
                options={[...data.location]}
                disabled={disabledControls.includes('location')}
                renderInput={params => (
                  <TextField
                    onFocus={() => handleFocus({ target: { name: 'location' } })}
                    {...params}
                    label='Location'
                    name='location'
                    onBlur={handleBlur}
                    helperText={
                      <DAlertBox
                        errorText={
                          formState.controls.location?.touched && formState.errors.location
                            ? formState.errors.location
                            : ''
                        }
                      />
                    }
                  />
                )}
                error={
                  formState.controls.location?.touched && formState.errors.location
                    ? formState.errors.location
                    : undefined
                }
              />
            </FormControl>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
});
export default Employee;
