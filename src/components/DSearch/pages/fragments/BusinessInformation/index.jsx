import { TextField } from '@mui/material';

import React from 'react';

const BusinessInformation = () => {
  return (
    <>
      <div className='page-text'>Search by any combination below.</div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField fullWidth size='small' label='Business Name' />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <TextField fullWidth size='small' label='Trading Name' />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <TextField fullWidth size='small' label='FEIN' />
        </div>
      </div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField fullWidth size='small' label='Occupancy Permit Number' />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <TextField fullWidth size='small' label='Zip' />
        </div>
      </div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-8'>
          <TextField fullWidth size='small' label='Email Address' />
        </div>
      </div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <div className='info-text'>Plate Information </div>
          <TextField fullWidth size='small' label='Tag Number' />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <div className='info-text'> Other Information</div>
          <TextField fullWidth size='small' label='Title Number' />
        </div>
      </div>
    </>
  );
};

export default BusinessInformation;
