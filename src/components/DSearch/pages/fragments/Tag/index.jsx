import {  TextField } from '@mui/material';

import React from 'react';

const Tag = () => {
  return (
    <>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField
            id='tag'
            defaultValue=''
            name='tag'
            size='small'
           fullWidth
            label='Tag Number'
            variant='outlined'
          />
        </div>
      </div>
    </>
  );
};

export default Tag;
