

import {
  Autocomplete,
  TextField
} from '@mui/material';
import React from 'react';

import DAlertBox from '../../../../DAlertBox';
import mockData from '../data.json';

export default function BOEAddress({ validationErrors, address, handleAddressChange, handleAddressError, disabledFields }) {
  const { addressLine, city, state, zipCode, country } = address;
  const { countryList, stateList } = mockData;
  return (<div className='d-row'>
    <div className='col col-sm-12 col-md-4'>
      <TextField
        fullWidth
        size='small'
        label='Address Line'
        value={addressLine}
        disabled={disabledFields}
        error={!!validationErrors?.addressLine}
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
        disabled={disabledFields}
        error={!!validationErrors?.city}
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
        disabled={disabledFields}
        onBlur={e => handleAddressError('state', e.target.value)}
        renderInput={params => (
          <TextField
            {...params}
            error={!!validationErrors?.state}
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
        disabled={disabledFields}
        error={!!validationErrors?.zipCode}
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
        disabled={disabledFields}
        onBlur={e => handleAddressError('country', e.target.value)}
        renderInput={params => (
          <TextField
            {...params}
            error={!!validationErrors?.country}
            helperText={<DAlertBox errorText={validationErrors?.country} />}
            label='Country'
          />
        )}
      />
    </div>
  </div>);
}
