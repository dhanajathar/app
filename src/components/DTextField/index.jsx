import './index.css';

import { IconButton, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';

const DTextField = ({ enableclear, handleclear, ...props }) => {
  return (
    <div className='DTextField-base'>
      <TextField
        {...props}
        InputProps={{
          ...props?.InputProps,
          endAdornment:
            enableclear === 'enable' ? (
              <IconButton
                aria-label='clear'
                disabled={props.disabled}
                size={props.size || 'medium'}
                className='DTextField-close-icon'
                onClick={e => handleclear(e)}
              >
                <svg
                  focusable='false'
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  data-testid='CloseIcon'
                >
                  <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'></path>
                </svg>
              </IconButton>
            ) : (
              <></>
            )
        }}
      />
    </div>
  );
};

export default DTextField;
