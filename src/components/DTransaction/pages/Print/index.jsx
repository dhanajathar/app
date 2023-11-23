import './index.css';

import { Close } from '@mui/icons-material';
import { Button, Divider, Snackbar, SnackbarContent } from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import data from './api-response';

export default function Print() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');
  const transSum = data.transactionSummary;

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'Print', step: 'Print', flowId: flowId, substep: false }
    });
  }, 100);

  const [open, setOpen] = useState(false);
  const [isPrinted, setIsPrinted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(transSum[0].image);
  const [selectedArrow, setSelectedArrow] = useState(transSum[0].field);

  const handleImageClick = (field, image) => {
    setSelectedImage(image);
    setSelectedArrow(field);
  };

  return (
    <React.Fragment>
      <div className='Dprint-conatiner'>
        <div className='Dprint-sum-left-panel'>
          <p className='title'>Transaction Summary</p>
          <Divider style={{ paddingTop: '1.2rem' }} />
          {transSum.map((item, index) => (
            <>
              <div key={`row${index}`} className={`print-row ${selectedArrow === item.field ? 'selected' : ''}`} onClick={() => handleImageClick(item.field, item.image)}>
                <div className='table-field'>{item.field}</div>
                <div className='table-value' style={{ textAlign: 'right' }}>
                  {item.value}
                </div>
              </div>
              {index < transSum.length - 1 && <Divider />}
            </>
          ))}
          <Divider />
        </div>

        <div className='Dprint-panel-right'>
          {selectedImage && <img className='print-img' src={selectedImage} />}
          <Button
            variant={'outlined'}
            color={'primary'}
            size='large'
            className='print-review-secondary-button'
            onClick={() => {
              setOpen(true);
              setIsPrinted(true);
            }}
          >
            {isPrinted ? 'RE-PRINT' : 'CONFIRM PRINT'}
          </Button>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
        onClose={() => setOpen(false)}
        key={'bottom' + 'center'}
      >
        <SnackbarContent
          className='snackbar-content'
          message={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              New ID Card sent to print queue successfully!{' '}
              <Close style={{ marginLeft: '110px' }} onClick={() => setOpen(false)} />
            </div>
          }
        ></SnackbarContent>
      </Snackbar>
    </React.Fragment>
  );
}
