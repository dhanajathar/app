import { TextField } from '@mui/material';

import React from 'react';

const Check = () => {
  return (
    <>
      <div className='page-text'>Search Destiny by any combination of Check Information</div>

      <div className='d-row'>
        <div className='col col-sm12 col-md-4'>
          <TextField
            id='checkNum'
            name='checkNum'
            size='small'
            fullWidth
            label='Check Number'
            variant='outlined'
          />
        </div>
      </div>
    </>
  );
};

export default Check;
