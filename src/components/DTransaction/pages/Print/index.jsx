import './index.css';

import { ArrowForwardIos, Close, Edit } from '@mui/icons-material';
import { Button, Container, Divider, Grid, Paper, Snackbar, SnackbarContent } from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import data from './api-response';

export default function Print() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'Print', step: 'Print', flowId: flowId, substep: false }
    });
  }, 100);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isPrinted, setIsPrinted] = useState(false);
  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={5} className='left-panel'>
          <p className='title'>Transaction Summary</p>

          <Divider className='divider' />

          <table width={'100%'}>
            <tbody>
              <tr>
                <td className='table-field'>New ID Card</td>
                <td className='table-value' align='right'>
                  Fee Paid
                </td>
              </tr>
            </tbody>
          </table>

          <Divider className='divider' style={{ marginTop: '13px' }} />
        </Grid>
        <Grid item xs={7} className='print-review-panel-right'>
          <img src={data.reviewPrintURL} height={'281px'} width={'100%'} />
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
        </Grid>
      </Grid>
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
