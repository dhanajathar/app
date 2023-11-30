import {
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


  return (
    <>
      <div className='col col-sm-12 col-md-4'>
        <FormControl fullWidth size='small'
          disabled={isFormDisabled && focusedField !== 'preDirectional'}>
          <InputLabel id='preDirectional'>Pre-Directional Code</InputLabel>
          <Select
            labelId='preDirectional'
            id='preDirectional'
            name="preDirectional"
            label='Pre-Directional Code'
            value={preDirectionalCode}
            onChange={e => handleAdditionalAddressChange('preDirectionalCode', e.target.value)}
            onBlur={(e) => handleOnbBlur(e.target.name, e.target.value)}
          >
            {preDirectionalList &&
              preDirectionalList.map(item => {
                return (
                  <MenuItem key={`pre-directional${item.code}`} value={item.code}>
                    {' '}
                    {item.value}{' '}
                  </MenuItem>
                );
              })}
          </Select>
          {validationErrors?.preDirectionalCode && (
            <FormHelperText>
              {' '}
              <DAlertBox errorText={validationErrors?.preDirectionalCode} />
            </FormHelperText>
          )}
        </FormControl>
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
        <FormControl fullWidth size='small' disabled={isFormDisabled && focusedField !== 'streetNameSuffix'} error={!!validationErrors?.streetNameSuffix}>
          <InputLabel id='streetNameSuffix'>Street Name Suffix</InputLabel>
          <Select
            labelId='streetNameSuffix'
            id='streetNameSuffix'
            name="streetNameSuffix"
            value={streetNameSuffix}
            inputRef={focusedField === 'streetNameSuffix' ? (input) => input?.focus() : null}
            onChange={e => handleAdditionalAddressChange('streetNameSuffix', e.target.value)}
            label='Street Name Suffix'
            onBlur={(e) => handleOnbBlur(e.target.name, e.target.value)}
          >
            {streetNameSuffixList &&
              streetNameSuffixList.map(item => {
                return (
                  <MenuItem key={`suffix-name${item.code}`} value={item.code}>
                    {' '}
                    {item.value}{' '}
                  </MenuItem>
                );
              })}
          </Select>
          {validationErrors?.streetNameSuffix && (
            <FormHelperText>
              {' '}
              <DAlertBox errorText={validationErrors?.streetNameSuffix} />{' '}
            </FormHelperText>
          )}
        </FormControl>
      </div>
      <div className='col col-sm-12 col-md-4'>
        <FormControl fullWidth size='small' error={!!validationErrors?.postDirectionalCode}
          disabled={isFormDisabled && focusedField !== 'postDirectionalCode'}>
          <InputLabel id='postDirectionalCode'>Post-Directional Code</InputLabel>
          <Select
            labelId='postDirectionalCode'
            id='postDirectionalCode'
            name="postDirectionalCode"
            label='Post-Directional Code'
            inputRef={focusedField === 'postDirectionalCode' ? (input) => input?.focus() : null}
            value={postDirectionalCode}
            onChange={e => handleAdditionalAddressChange('postDirectionalCode', e.target.value)}
            onBlur={(e) => handleOnbBlur(e.target.name, e.target.value)}
          >
            {postDirectionalCodeList &&
              postDirectionalCodeList?.map(item => {
                return (
                  <MenuItem key={`directional-code${item.code}`} value={item.code}>
                    {' '}
                    {item.value}{' '}
                  </MenuItem>
                );
              })}
          </Select>
          {validationErrors?.postDirectionalCode && (
            <FormHelperText>
              {' '}
              <DAlertBox errorText={validationErrors?.postDirectionalCode} />{' '}
            </FormHelperText>
          )}
        </FormControl>
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
