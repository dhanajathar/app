/*
 * Author: Sushree Dash
 * Created:
 * Last Modified: 2023-11-08
 * Description: This file shows all the fees related for that transaction.
 * Application Release Version:1.0.0
 */
import './index.css';
import { Add, Close, Edit } from '@mui/icons-material';
import _ from 'lodash';
import {
  InputAdornment,
  Snackbar,
  SnackbarContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Tooltip
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import data from './api-response';
import { useSearchParams } from 'react-router-dom';
import DeleteConfirmDialog from '../../../DDialog/components/DeleteConfirmDialog';
import SupOverrideDialog from '../../../DDialog/components/SupOverrideDialog';
import { setTransaction } from '../../../../store/features/transaction/transactionSlice';

const Fees = ({ isPaymentConfirmed }) => {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');
  const { preview } = useSelector(state => state.transaction);
  const dispatch = useDispatch();

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'Fees', step: 'Fees', flowId: flowId, substep: false }
    });
  }, 100);

  const [total, setTotal] = useState(0);
  const [isOrganDonationAdded, setIsOrganDonationAdded] = useState(
    data.feesDetails.findIndex(i => i.agencyObjectCode == 3166) > -1
  );

  const [rows, setRows] = useState(data.feesDetails);
  const [open, setOpen] = useState(isPaymentConfirmed);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSup, setOpenSup] = useState(false);

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    setIsOrganDonationAdded(false);
    const index = rows.findIndex(i => i.agencyObjectCode == 3166);
    rows.splice(index, 1);
    setRows(rows);
    setOpenDialog(false);
  };

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const addOrganDonation = () => {
    setRows([
      ...rows,
      {
        agencyObjectCode: 3166,
        description: 'Organ Donor Registry Donation',
        feestobecollected: '',
        feescomputed: ''
      }
    ]);
    setIsOrganDonationAdded(true);
  };

  useEffect(() => {
    data.feesDetails = rows;
  }, [rows]);

  useEffect(() => {
    dispatch(setTransaction(rows));
  }, [preview]);

  useEffect(() => {
    setTotal(
      rows.reduce(
        (sum, a) => sum + Math.round(parseFloat(a.feestobecollected.replace(/,/g, ''))) || sum,
        0
      )
    );
  }, [JSON.stringify(rows)]);

  return (
    <React.Fragment>
      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell className='table-header'>Agency Code</TableCell>
              <TableCell className='table-header'>Description</TableCell>
              <TableCell className='table-header' align='right'>
                Fees Computed
              </TableCell>
              <TableCell className='table-header' align='right'>
                Fees to be Collected
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                className='table-row'
                key={i}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align='left'>{row.agencyObjectCode}</TableCell>
                <TableCell>{row.description}</TableCell>
                {!_.isEmpty(row.feescomputed) ? (
                  <TableCell align='right'>
                    ${(Math.round(row.feescomputed * 100) / 100).toFixed(2)}
                  </TableCell>
                ) : (
                  <TableCell align='right'>{row.feescomputed}</TableCell>
                )}
                <TableCell align='right'>
                  <TextField
                    variant='outlined'
                    inputProps={{ className: 'fees-tobe-collected-text-field' }}
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>$</InputAdornment>
                    }}
                    //endA
                    //type='number'
                    disabled={row.agencyObjectCode !== 3166 && data.user.role !== 'Supervisior'}
                    value={row.feestobecollected}
                    onChange={e => {
                      if (!isNaN(e.target.value)) {
                        let num;
                        e.target.value === '0' ? (num = '1') : (num = e.target.value);
                        const extendRows = [...rows];
                        extendRows[i].feestobecollected = num;
                        setRows(extendRows);
                      }
                    }}
                    onBlur={e => {
                      if (!isNaN(e.target.value)) {
                        let num;
                        _.isEmpty(row.feestobecollected)
                          ? (num = '1')
                          : (num = row.feestobecollected);
                        const extendRows = [...rows];
                        extendRows[i].feestobecollected = parseFloat(num).toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        });
                        setRows(extendRows);
                      }
                    }}
                    error={isOrganDonationAdded && rows[i].feestobecollected < 1}
                    helperText={
                      isOrganDonationAdded && rows[i].feestobecollected < 1 ? 'Invalid Amount' : ''
                    }
                  />
                </TableCell>
                {row.agencyObjectCode == 3166 && (
                  <TableCell>
                    <Tooltip arrow className='d-tooltip' title='Delete' placement='top'>
                      <DeleteOutlineIcon
                        onClick={() => handleDelete()}
                        className='delete-address'
                      />
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {!isOrganDonationAdded && (
              <TableRow className='table-row'>
                <TableCell align='left' colSpan={4}>
                  <div className='donation-container' onClick={() => addOrganDonation()}>
                    <Add /> <h6 className='donation-text'>Donation for Organ Registry</h6>
                  </div>
                </TableCell>
              </TableRow>
            )}
            <TableRow className='table-row'>
              <TableCell align='left' className='table-header'>
                <Button
                  variant='outlined'
                  color='primary'
                  size='large'
                  className='scan-back-button scan-override-button'
                  onClick={() => {
                    setOpenSup(true);
                  }}
                >
                  OVERRIDE
                </Button>
              </TableCell>
              <TableCell align='right' colSpan={4} className='table-header'>
                <b>
                  Grand Total&nbsp;&nbsp;&nbsp;&nbsp; $
                  {total.toLocaleString('en-US', {
                    minimumFractionDigits: 2
                  })}{' '}
                </b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

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
              Confirmation received from the customer.{' '}
              <Close style={{ marginLeft: '110px' }} onClick={() => setOpen(false)} />
            </div>
          }
        ></SnackbarContent>
      </Snackbar>
      <DeleteConfirmDialog
        data='delete donation for Organ registry'
        open={openDialog}
        onConfirmClick={handleConfirmDelete}
        close={handleCancel}
      />
      <SupOverrideDialog open={openSup} close={() => setOpenSup(false)} />
    </React.Fragment>
  );
};

export default Fees;
