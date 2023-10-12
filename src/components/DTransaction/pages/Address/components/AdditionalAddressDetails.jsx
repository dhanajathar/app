import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';

import DAlertBox from '../../../../DAlertBox';
import React from 'react';
import data from '../api-address.json';

function AdditionalAddressDetails({
  additionalAddress,
  handleAdditionalAddressChange,
  validationErrors
}) {
  const {
    preDirectionalCode,
    streetName,
    streetnumber,
    streetNameSuffix,
    postDirectionalCode,
    apartmentNumber
  } = additionalAddress;
  const { preDirectionalList, streetNameSuffixList, postDirectionalCodeList } = data;

  return (
    <>
      <div className='col col-sm-12 col-md-4'>
        <FormControl fullWidth>
          <InputLabel id='preDirectional'>Pre-Directional Code</InputLabel>
          <Select
            labelId='preDirectional'
            id='preDirectional'
            label='Pre-Directional Code'
            value={preDirectionalCode}
            error={!!validationErrors?.preDirectionalCode}
            helperText={<DAlertBox errorText={validationErrors?.preDirectionalCode} />}
            onChange={e => handleAdditionalAddressChange('preDirectionalCode', e.target.value)}
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
        </FormControl>
      </div>
      <div className='col col-sm-12 col-md-4'>
        <TextField
          fullWidth
          label='Street Number'
          inputProps={{ maxLength: 10 }}
          value={streetnumber}
          error={!!validationErrors?.streetnumber}
          helperText={<DAlertBox errorText={validationErrors?.streetnumber} />}
          onChange={e => handleAdditionalAddressChange('streetnumber', e.target.value)}
        />{' '}
      </div>
      <div className='col col-sm-12 col-md-4'>
        <TextField
          fullWidth
          label='Street Name'
          value={streetName}
          inputProps={{ maxLength: 40 }}
          error={!!validationErrors?.streetName}
          helperText={<DAlertBox errorText={validationErrors?.streetName} />}
          onChange={e => handleAdditionalAddressChange('streetName', e.target.value)}
        />{' '}
      </div>
      <div className='col col-sm-12 col-md-4'>
        <FormControl fullWidth error={!!validationErrors?.streetNameSuffix}>
          <InputLabel id='suffixName'>Street Name Suffix</InputLabel>
          <Select
            labelId='suffixName'
            id='suffixName'
            value={streetNameSuffix}
            onChange={e => handleAdditionalAddressChange('streetNameSuffix', e.target.value)}
            label='Street Name Suffix'
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
        <FormControl fullWidth error={!!validationErrors?.postDirectionalCode}>
          <InputLabel id='directionalCode'>Post-Directional Code</InputLabel>
          <Select
            labelId='directionalCode'
            id='directionalCode'
            label='Post-Directional Code'
            value={postDirectionalCode}
            onChange={e => handleAdditionalAddressChange('postDirectionalCode', e.target.value)}
          >
            {postDirectionalCodeList &&
              postDirectionalCodeList.map(item => {
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
          label='Apartment Number'
          value={apartmentNumber}
          inputProps={{ maxLength: 10 }}
          error={!!validationErrors?.apartmentNumber}
          helperText={<DAlertBox errorText={validationErrors?.apartmentNumber} />}
          onChange={e => handleAdditionalAddressChange('apartmentNumber', e.target.value)}
        />{' '}
      </div>
    </>
  );
}

export default AdditionalAddressDetails;
