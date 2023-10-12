import { TextField } from '@mui/material';

import React from 'react';

const Title = () => {
  return (
    <>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField
            id='title'
            defaultValue=''
            name='title'
            size='small'
           fullWidth
            label='Title Number'
            variant='outlined'
          />
        </div>
      </div>
    </>
  );
};

export default Title;
