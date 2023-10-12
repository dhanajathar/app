import './UspassportFragment.css';

import { Grid, Link, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import uspassportdata from './api-response-uspassport.json';

const initialVerifyStatus = false;

export default function UspassportFragment(props) {
  const { addrapiUrl, id } = props;
  const [isVerified, setIsVerified] = useState(initialVerifyStatus);
  const [passportNumber, setPassportNumber] = useState(uspassportdata.uspassport.passportnumber);
  const [issueDate, setIssueDate] = useState(uspassportdata.uspassport.issue_date);
  const [expirationDate, setExpirationDate] = useState(uspassportdata.uspassport.expiration_date);

  //Handle verify button to update status - verified or not verified
  const handleVerifyClick = () => {
    setIsVerified(!isVerified);
  };

  //Fetching JSON API data
  useEffect(() => {
    fetch(`${addrapiUrl}/${id}`)
      .then(response => response.json())
      .then(data => setDetails(data))
      .catch(error => console.log(error));
    //.then((data) => {setDetails(data.address); console.log(details.city)});
  });

  return (
    <>
      <Grid container sx={{ mt: 2, }} spacing={1}>
        <Grid item xs={4}>
          <TextField
            className='usp-passptnum'
            fullWidth
            id='passportnumber'
            label='Passport Number'
            name='passportnumber'
            disabled
            value={passportNumber}
            onChange={e => setPassportNumber(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className='usp-datepick'
              label='Issue Date'
              slotProps={{ textField: { fullWidth: true } }}
              disabled
              value={dayjs(issueDate)}
              onChange={issuedate => setIssueDate(issuedate)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className='usp-datepick'
              flex-end
              slotProps={{ textField: { fullWidth: true } }}
              minDate={issueDate}
              disablePast={true}
              disabled
              label='Expiration Date'
              value={dayjs(expirationDate)}
              onChange={expirdate => setExpirationDate(expirdate)}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 2 }} spacing={1}>
        {/* <Grid item xs={4}>
          <Grid container spacing={4} justifyContent='flex-start' alignItems='flex-end'>
            <Grid item xs={4}>
              <div className='usp-status'>Status</div>
              <div className='usp-verify'>{isVerified ? 'VERIFIED' : 'NOT VERIFIED'}</div>
            </Grid>
            <Grid item>
              <Link href='#' className='usp-verifylink' onClick={handleVerifyClick}>
                Verify
              </Link>
            </Grid>
          </Grid>
        </Grid> */}
        <Grid item xs={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className='usp-datepick'
              disabled
              slotProps={{ textField: { fullWidth: true } }}
              label='Verify Date'
              value={dayjs(uspassportdata.uspassport.verify_date)}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </>
  );
}
