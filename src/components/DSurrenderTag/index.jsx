import './index.css';

import { DEventService, DEvents } from '../../services/DEventService';
import React, { useState } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { Button } from '@mui/material';



export default function DSurrenderTag() {
 

  return (
    <React.Fragment>
      <div className='d-container'>
        <div className='d-row truncation-row'>
          <div className='col-12 sub_title'>Tag Information</div>
        </div>
      </div>
    </React.Fragment>
  );
}
