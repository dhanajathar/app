import { TextField } from '@mui/material';

import React from 'react';

const BusinessSalesPerson = () => {
  return (
    <>
      <div className='page-text'>Search by Sales Person.</div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField size='small' name='Sales Person Name' fullWidth />
        </div>
      </div>
    </>
  );
};

export default BusinessSalesPerson;
