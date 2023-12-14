import './index.css';

import { ArrowBackIos, ArrowForwardIos, Edit, Error } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField
} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import data from './api-response';
import { useSelector } from 'react-redux';

export function PaymentSummary() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

  const { updatedTranData } = useSelector(state => state.transaction);

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'Payment', step: 'Payment', flowId: flowId, substep: false }
    });
  }, 100);

  const substeps = [
    { label: 'Payment', status: 'complete', onClick: () => navigate('/') },
    { label: 'Customer Review', status: 'complete', onClick: () => navigate('/payment-review') },
    {
      label: 'Customer Summary',
      status: 'inprogress',
      onClick: () => navigate('/payment-summary')
    },
    {
      label: 'Review Print',
      status: 'incomplete',
      onClick: () => navigate('/payment-review-print')
    }
  ];
  const paymentMethods = data.paymentMethods;
  const paymentSummary = data.paymentSummary;

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState(data.selectedPaymentMethod);

  useEffect(() => {
    data.selectedPaymentMethod = selectedMethods;
  }, [selectedMethods]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = e => {
    var index = selectedMethods.indexOf(e.target.name);
    if (index > -1) {
      var modifiedArr = [...selectedMethods];
      modifiedArr.splice(index, 1);
      setSelectedMethods(modifiedArr);
    } else {
      setSelectedMethods([...selectedMethods, e.target.name]);
    }
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={5} className='summary-left-panel'>
          <div className='title'>Fee Summary</div>

          <Divider className='divider' />

          <table width={'100%'}>
            <tbody>
              {updatedTranData.map((item, idx) => (
                <tr key={idx}>
                  <td className='table-field'>{item.description}</td>
                  <td className='table-value-amount'>$ {item.feestobecollected}</td>
                </tr>
              ))}
              <tr>
                <td className='table-field' colSpan={2}>
                  <Divider className='divider' style={{ height: '3px' }} />
                </td>
              </tr>
              <tr>
                <td className='table-value'>Grand Total</td>
                <td className='table-value-amount'>
                  ${' '}
                  {updatedTranData
                    .reduce(
                      (sum, a) =>
                        sum + Math.round(parseFloat(a.feestobecollected.replace(/,/g, ''))) || sum,
                      0
                    )
                    .toLocaleString('en-US', {
                      minimumFractionDigits: 2
                    })}
                </td>
              </tr>
            </tbody>
          </table>
        </Grid>
        <Grid item xs={7} className='summary-right-panel'>
          <div className='title'>Payment Type</div>

          <FormControl component='fieldset' className='payment-method-checkbox'>
            {paymentMethods.map(method => (
              <FormControlLabel
                key={method.id}
                value={method.name}
                control={
                  <Checkbox
                    color='primary'
                    name={method.name}
                    onChange={handleCheckboxChange}
                    checked={selectedMethods.indexOf(method.name) > -1}
                  />
                }
                label={<span className='span-label'>{method.name}</span>}
              />
            ))}
          </FormControl>

          <Table style={{ marginTop: '35px' }}>
            <TableBody>
              {selectedMethods.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className='table-value'>{item} Collected</TableCell>
                  <TableCell align='right'>
                    <TextField
                      style={{ background: 'white' }}
                      variant='outlined'
                      inputProps={{ className: 'summary-text-field' }}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>$</InputAdornment>
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className='table-value'>Balance Due</TableCell>
                <TableCell align='right'>
                  <TextField
                    style={{ background: 'white' }}
                    variant='outlined'
                    inputProps={{ className: 'summary-text-field' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          $ {paymentSummary.balanceDue}
                        </InputAdornment>
                      )
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='table-value'>Change Due</TableCell>
                <TableCell align='right'>
                  <TextField
                    style={{ background: 'white' }}
                    variant='outlined'
                    inputProps={{ className: 'summary-text-field' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          $ {paymentSummary.changeDue}
                        </InputAdornment>
                      )
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='table-value'>Change Returned</TableCell>
                <TableCell className='table-value' align='right'>
                  $ {paymentSummary.changeReturned}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        {!confirm && (
          <>
            <DialogContent>
              <h2 id='form-dialog-title' className='dialogTitle'>
                <Error className='dialogIcon' /> Interrupt Transaction
              </h2>
              <DialogContentText className='dialogSubtitle'>
                Please provide the reason for interrupting the transaction.
              </DialogContentText>
              <FormControl variant='outlined' className='formControl' style={{ width: '100%' }}>
                <label className='dialogLabel'>Reason</label>
                <Select
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={'other'}
                >
                  <MenuItem value={'other'}>Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant='outlined' className='formControl' style={{ width: '100%' }}>
                <label className='dialogLabel'>Comment</label>
                <TextField id='outlined-multiline-static' multiline rows={3} variant='outlined' />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                variant='outlined'
                color='primary'
                className='secondary-button'
              >
                Cancel
              </Button>
              <Button
                onClick={() => setConfirm(true)}
                variant='contained'
                color='primary'
                className='button'
              >
                Confirm
              </Button>
            </DialogActions>
          </>
        )}
        {confirm && (
          <div className='confrim-spinner'>
            <CircularProgress />
          </div>
        )}
      </Dialog>
    </React.Fragment>
  );
}
