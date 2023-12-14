/*
 * Author: Rupesh Allu
 * Created:
 * Last Modified: 2023-11-28
 * Description: This print page which shows ready to print trnsactions.
 * Application Release Version:1.0.0
 */

import './index.css';

import { Close } from '@mui/icons-material';
import { Button, Divider, Snackbar, SnackbarContent } from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import data from './api-response';

export default function Print() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');
  const transSum = data.transactionSummary;

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'Submit Payment', step: 'Submit Payment', flowId: flowId, substep: false }
    });
  }, 100);

  const [open, setOpen] = useState(false);
  const [isPrinted, setIsPrinted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(transSum[0].image);
  const [selectedField, setSelectedField] = useState(transSum[0].field);
  const [topValue, setTopValue] = useState(27);

  const handleImageClick = (field, image) => {
    setSelectedImage(image);
    setSelectedField(field);
  };

  // Using useEffect for 'top' value when 'selectedField' changes
  useEffect(() => {
    // Calculate the dynamic 'top' value based on the index of the selected field
    const index = transSum.findIndex(item => item.field === selectedField);
    const dynamicTopValue = `${29 + index * 10}%`; // Start at 10 and increment by 10 for each index
    setTopValue(dynamicTopValue);
  }, [selectedField, transSum]);

  return (
    <React.Fragment>
      <div className='Dprint-container'>
        <div className='Dprint-sum-left-panel'>
          <p className='Dprint-sum-title'>Transaction Summary</p>
          <Divider className='Dprint-sum-divider' />
          {transSum.map((item, index) => (
            <div key={index}>
              <div
                className='Dprint-sum-left-grid'
                onClick={() => handleImageClick(item.field, item.image)}
              >
                <div className='table-field'>{item.field}</div>
                <div className='table-value'>{item.value}</div>
              </div>
              {index < transSum.length - 1 && <Divider />}
            </div>
          ))}
          <Divider />
        </div>
        <div className='Dprint-panel-right-1' style={{ top: topValue }}></div>
        <div className='Dprint-panel-right'>
          {selectedImage && (
            <img src={selectedImage} height={'281px'} width={'100%'} />
            /*Will update below code in next PR*/
            // <DPdf
            //   pdfUrl={pdfUrl}
            //   showAddDelete={false}
            //   onPdfNumOfPages={handlePDFPages}
            //   onPdfPageNum={handlePDFPageNum}
            //   onPdfSize={handlePdfSize}
            //   onPdfFile={handlePdfFile}
            //   showZoom={false}
            //   showPagination={false}
            //   showFullScreen={false}
            //   showRotate={false}
            // ></DPdf>
          )}
          <Button
            variant={'outlined'}
            color={'primary'}
            size='large'
            className='print-review-secondary-button'
            onClick={() => {
              setOpen(true);
              setIsPrinted(true);
            }}
            disabled={selectedField === transSum[1].field}
          >
            {selectedField === transSum[1].field
              ? 'PRINTED'
              : selectedField === transSum[2].field
              ? 'RE-PRINT'
              : isPrinted
              ? 'RE-PRINT'
              : 'CONFIRM PRINT'}
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
          className='Dprint-snackbar-content'
          message={
            <div className='Dprint-sum-snackbar'>
              {selectedField} sent to print queue successfully.{' '}
              <Close className='Dprint-snackbar-close' onClick={() => setOpen(false)} />
            </div>
          }
        ></SnackbarContent>
      </Snackbar>
    </React.Fragment>
  );
}
