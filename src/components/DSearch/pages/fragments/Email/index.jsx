import { TextField } from '@mui/material';

import React from 'react';

const Email = () => {
  return (
    <>
      <div className='page-text'>Search Destiny by Email Address</div>

      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField
            id='email'
            name='email'
            size='small'
            fullWidth
            label='Enter email address'
            variant='outlined'
          />
        </div>
      </div>
    </>
  );
};

export default Email;
