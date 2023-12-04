import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import PropTypes from 'prop-types';

import DAlertBox from '../../../../DAlertBox';
import React, { useRef } from 'react';
import data from '../api-address.json';

function AdditionalAddressDetails({
  additionalAddress,
  handleAdditionalAddressChange,
  handleOnbBlur,
  validationErrors,
  focusedField,
  isFormDisabled
}) {
  const {
    preDirectionalCode,
    streetName,
    streetNumber,
    streetNameSuffix,
    postDirectionalCode,
    apartmentNumber,

  } = additionalAddress;
  const { preDirectionalList, streetNameSuffixList, postDirectionalCodeList } = data;

  const setFocusOnInput = (e, fieldName) => {
    if (fieldName === focusedField) {
      if (e) {
        e.focus();
      }
    }
  };
  return (
    <>
      <div className='col col-sm-12 col-md-4'>
      <Autocomplete
          options={preDirectionalList}
          fullWidth
          size='small'
          name='preDirectional'
          value={preDirectionalCode}
          disableClearable={true}
          onChange={(e, v) => handleAdditionalAddressChange('preDirectionalCode', v)}
          disabled={isFormDisabled && focusedField !== 'preDirectional'}
          onBlur={(e) => handleOnbBlur('preDirectional', e.target.value)}
          renderInput={params => (
            <TextField
              {...params} 
              inputRef={e => setFocusOnInput(e, 'preDirectional')}
              label='Pre-Directional Code'
            />
          )}
        /> 
      </div>
      <div className='col col-sm-12 col-md-4'>
        <TextField
          fullWidth
          label='Street Number'
          size='small'
          name="streetNumber"
          inputProps={{ maxLength: 10 }}
          value={streetNumber}
          error={!!validationErrors?.streetNumber}
          disabled={isFormDisabled && focusedField !== 'streetNumber'}
          inputRef={focusedField === 'streetNumber' ? (input) => input?.focus() : null}
          helperText={<DAlertBox errorText={validationErrors?.streetNumber} />}
          onChange={e => handleAdditionalAddressChange('streetNumber', e.target.value)}
          onBlur={(e) => handleOnbBlur(e.target.name, e.target.value)}
        />{' '}
      </div>
      <div className='col col-sm-12 col-md-4'>
        <TextField
          fullWidth
          label='Street Name'
          size='small'
          value={streetName}
          name="streetName"
          inputProps={{ maxLength: 40 }}
          error={!!validationErrors?.streetName}
          disabled={isFormDisabled && focusedField !== 'streetName'}
          helperText={<DAlertBox errorText={validationErrors?.streetName} />}
          inputRef={focusedField === 'streetName' ? (input) => input?.focus() : null}
          onChange={e => handleAdditionalAddressChange('streetName', e.target.value)}
          onBlur={(e) => handleOnbBlur(e.target.name, e.target.value)}
        />{' '}
      </div>
      <div className='col col-sm-12 col-md-4'>

      <Autocomplete
                        options={streetNameSuffixList}
                        fullWidth
                        size='small'
                        name='streetNameSuffix'
                        value={streetNameSuffix}
                        disableClearable={true}
                        onChange={(e, v) => handleAdditionalAddressChange( 'streetNameSuffix', v)}
                        disabled={isFormDisabled && focusedField !== 'streetNameSuffix'}
                        onBlur={(e) => handleOnbBlur('streetNameSuffix', e.target.value)}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={!!validationErrors?.streetNameSuffix}
                            inputRef={e => setFocusOnInput(e, 'streetNameSuffix')}
                            helperText={<DAlertBox errorText={validationErrors?.streetNameSuffix} />}
                            label='Street Name Suffix'
                          />
                        )}
                      /> 
      </div>
      <div className='col col-sm-12 col-md-4'>

      <Autocomplete
                        options={postDirectionalCodeList}
                        fullWidth
                        size='small'
                        name='postDirectionalCode'
                        value={postDirectionalCode}
                        disableClearable={true}
                        onChange={(e, v) => handleAdditionalAddressChange( 'postDirectionalCode', v)}
                        disabled={isFormDisabled && focusedField !== 'postDirectionalCode'}
                        onBlur={(e) => handleOnbBlur('postDirectionalCode', e.target.value)}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={!!validationErrors?.postDirectionalCode}
                            inputRef={e => setFocusOnInput(e, 'postDirectionalCode')}
                            helperText={<DAlertBox errorText={validationErrors?.postDirectionalCode} />}
                            label='Post-Directional Code'
                          />
                        )}
                      />  
      </div>
      <div className='col col-sm-12 col-md-4'>
        <TextField
          fullWidth
          size='small'
          name="apartmentNumber"
          label='Apartment Number'
          value={apartmentNumber}
          inputProps={{ maxLength: 10 }}
          disabled={isFormDisabled && focusedField !== 'apartmentNumber'}
          inputRef={focusedField === 'apartmentNumber' ? (input) => input?.focus() : null}
          error={!!validationErrors?.apartmentNumber}
          helperText={<DAlertBox errorText={validationErrors?.apartmentNumber} />}
          onChange={e => handleAdditionalAddressChange('apartmentNumber', e.target.value)}
          onBlur={(e) => handleOnbBlur(e.target.name, e.target.value)}
        />{' '}
      </div>
    </>
  );
}

export default AdditionalAddressDetails;

AdditionalAddressDetails.propTypes = {
  additionalAddress: PropTypes.object.isRequired,
  handleAdditionalAddressChange: PropTypes.func,
  handleOnbBlur: PropTypes.func,
  validationErrors: PropTypes.object.isRequired,
  focusedField: PropTypes.string,
  isFormDisabled: PropTypes.bool,
};
