import { TextField } from '@mui/material';

import React from 'react';

const TransactionId = () => {
  return (
    <>
      <div className='page-text'>Search Destinty for a specific Tranaction ID.</div>

      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField
            id='transactionId'
            defaultValue=''
            name='transactionId'
            size='small'
            fullWidth
            label='Transaction ID'
            variant='outlined'
          />
        </div>
      </div>
    </>
  );
};

export default TransactionId;
