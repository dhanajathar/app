import { TextField } from '@mui/material';

import React from 'react';

const VIN = () => {
  return (
    <>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField
            id='vin'
            defaultValue=''
            name='vin'
            size='small'
            fullWidth
            label='Vehicle Identification Number'
            variant='outlined'
          />
        </div>
      </div>
    </>
  );
};

export default VIN;
