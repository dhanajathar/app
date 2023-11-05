

import {
  Autocomplete,
  TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import DAlertBox from '../../../../DAlertBox';
import mockData from '../data.json';

export default function BOEAddress({ validationErrors, address, handleAddressChange, handleAddressError, disabledFields, isFormDisabled }) {
  const { addressLine, city, state, zipCode, country } = address;
  const [focusedField, setFocusedField] = useState();
  const { countryList, stateList } = mockData;

  useEffect(() => {
    if (validationErrors) {
      const keys = Object.keys(validationErrors);
      setFocusedField(keys.length > 0 && keys[0] ? keys[0] : '');
    } else {
      setFocusedField('');
    }
  }, [validationErrors]);

  return (<div className='d-row'>
    <div className='col col-sm-12 col-md-4'>
      <TextField
        fullWidth
        size='small'
        label='Address Line'
        value={addressLine}
        disabled={disabledFields || (isFormDisabled && focusedField !== 'addressLine')}
        error={!!validationErrors?.addressLine}
        inputRef={focusedField === 'addressLine' ? (input) => input && input.focus() : null}
        helperText={<DAlertBox errorText={validationErrors?.addressLine} />}
        onChange={e => handleAddressChange('addressLine', e.target.value)}
        onBlur={e => handleAddressError('addressLine', e.target.value)}
      />
    </div>
    <div className='col col-sm-12 col-md-2'>
      <TextField
        fullWidth
        size='small'
        label='City'
        value={city}
        disabled={disabledFields || (isFormDisabled && focusedField !== 'city')}
        error={!!validationErrors?.city}
        inputRef={focusedField === 'city' ? (input) => input && input.focus() : null}
        helperText={<DAlertBox errorText={validationErrors?.city} />}
        onChange={e => handleAddressChange('city', e.target.value)}
        onBlur={e => handleAddressError('city', e.target.value)}
      />
    </div>
    <div className='col col-sm-12 col-md-2'>
      <Autocomplete
        options={stateList}
        fullWidth
        size='small'
        name='state'
        value={state}
        onChange={(e, v) => handleAddressChange('state', v)}
        disabled={disabledFields || (isFormDisabled && focusedField !== 'state')}
        onBlur={e => handleAddressError('state', e.target.value)}
        renderInput={params => (
          <TextField
            {...params}
            error={!!validationErrors?.state}
            inputRef={focusedField === 'state' ? (input) => input && input.focus() : null}
            helperText={<DAlertBox errorText={validationErrors?.state} />}
            label='State'
          />
        )}
      />
    </div>
    <div className='col col-sm-12 col-md-2'>
      <TextField
        fullWidth
        label='ZIP Code'
        size='small'
        value={zipCode}
        disabled={disabledFields || (isFormDisabled && focusedField !== 'zipCode')}
        error={!!validationErrors?.zipCode}
        inputRef={focusedField === 'zipCode' ? (input) => input && input.focus() : null}
        helperText={<DAlertBox errorText={validationErrors?.zipCode} />}
        onChange={e => handleAddressChange('zipCode', e.target.value)}
        onBlur={e => handleAddressError('zipCode', e.target.value)}
      />
    </div>
    <div className='col col-sm-12 col-md-2'>
      <Autocomplete
        options={countryList}
        fullWidth
        size='small'
        name='country'
        value={country}
        onChange={(e, v) => handleAddressChange('country', v)}
        disabled={disabledFields || (isFormDisabled && focusedField !== 'country')}
        onBlur={e => handleAddressError('country', e.target.value)}
        renderInput={params => (
          <TextField
            {...params}
            inputRef={focusedField === 'country' ? (input) => input && input.focus() : null}
            error={!!validationErrors?.country}
            helperText={<DAlertBox errorText={validationErrors?.country} />}
            label='Country'
          />
        )}
      />
    </div>
  </div>);
}
