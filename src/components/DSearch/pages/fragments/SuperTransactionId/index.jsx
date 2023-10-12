import { TextField } from '@mui/material';

import React from 'react';

const SuperTransactionId = () => {
  return (
    <>
      <div className='page-text'>Search Destiny by a Super Transaction ID.</div>

      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField
            id='superTransactionId'
            defaultValue=''
            name='superTranactionId'
            size='small'
            fullWidth
            label='Super Transaction ID'
            variant='outlined'
          />
        </div>
      </div>
    </>
  );
};

export default SuperTransactionId;
