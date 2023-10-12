import './index.css';

import { Add, Close, Edit } from '@mui/icons-material';
import {
  Container,
  InputAdornment,
  Snackbar,
  SnackbarContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useEffect, useState } from 'react';

import data from './api-response';
import { useSearchParams } from 'react-router-dom';

export default function Fees({ isPaymentConfirmed }) {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

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
  const addOrganDonation = () => {
    setRows([
      ...rows,
      {
        agencyObjectCode: 3166,
        description: 'Organ Donor Registry Donation',
        feestobecollected: 0,
        feescomputed: 0
      }
    ]);
    setIsOrganDonationAdded(true);
  };

  useEffect(() => {
    data.feesDetails = rows;
  }, [rows]);

  useEffect(() => {
    setTotal(rows.reduce((sum, a) => sum + Math.round(parseFloat(a.feestobecollected)) || 0, 0));
  }, [JSON.stringify(rows)]);

  return (
    <React.Fragment>
      <Container>
        <TableContainer>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell className='table-header'>Agency Object Code</TableCell>
                <TableCell className='table-header'>Description</TableCell>
                <TableCell className='table-header' align='right'>
                  Fees Computed
                </TableCell>
                <TableCell className='table-header' align='right'>
                  Fees to be Collected
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{row.agencyObjectCode}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align='right'>$ {row.feescomputed}</TableCell>
                  <TableCell align='right'>
                    <TextField
                      variant='outlined'
                      inputProps={{ className: 'fees-tobe-collected-text-field' }}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>$</InputAdornment>
                      }}
                      disabled={row.agencyObjectCode !== 3166 && data.user.role !== 'Supervisior'}
                      value={row.feestobecollected}
                      onChange={e => {
                        if (!isNaN(e.target.value)) {
                          const extendRows = [...rows];
                          extendRows[i].feestobecollected = e.target.value;
                          setRows(extendRows);
                        }
                      }}
                      onBlur={e => {
                        const extendRows = [...rows];
                        extendRows[i].feestobecollected = Math.round(parseFloat(e.target.value));
                        setRows(extendRows);
                      }}
                      error={rows[i].feestobecollected < 1}
                      helperText={rows[i].feestobecollected < 1 ? 'Invalid Amount' : ''}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {!isOrganDonationAdded && (
                <TableRow>
                  <TableCell align='left' colSpan={4}>
                    <div className='donation-container' onClick={() => addOrganDonation()}>
                      <Add /> <h6 className='donation-text'>Donation for Organ Registry</h6>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell align='right' colSpan={4} className='table-header'>
                  Grand Total &nbsp;&nbsp;&nbsp;&nbsp; ${total.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
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
    </React.Fragment>
  );
}
