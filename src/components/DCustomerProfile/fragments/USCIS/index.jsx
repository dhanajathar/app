import './index.css';

import { FormControl, Grid, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';

import DCircleLoader from '../../../DCircleLoader';
import data from './api-uscisfragment.json';

export default function UscisFragment() {
  const [document, setDocument] = useState();
  const [visaType, setVisaType] = useState();
  const [firstName, setFirstName] = useState(data.firstName);
  const [middleName, setMiddleName] = useState(data.middleName);
  const [lastName, setLastName] = useState(data.lastName);
  const [alienNo, setAlienNo] = useState(data.alienNo);
  const [receiptNo, setReceiptNo] = useState(data.receiptNo);
  const [documentExpiryDate, setDocumentExpiryDate] = useState(data.documentExpiryDate);
  const [birthDate, setbirthDate] = useState(data.birthDate);
  const { documentTypes, visaTypes, verificationStatus } = data;

  const calculateAge = dob => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      month = 12 + month;
      age--;
    }
    return `${age} year(s) ${month} months`;
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <FormControl fullWidth variant='outlined' className='formControl'>
            <label>Document</label>
            <Select
              value={document}
              disabled
              onChange={e => {
                setDocument(e.target.value);
              }}
            >
              {documentTypes.length &&
                documentTypes.map(item => {
                  return (
                    <MenuItem key={`${item}`} defaultValue={'OTHER'}>
                      {item}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
        {document && (
          <Grid item xs={4}>
            <FormControl fullWidth variant='outlined' className='formControl'>
              <label>Visa Type</label>
              <Select
                value={visaType}
                disabled
                onChange={e => {
                  setVisaType(e.target.value);
                }}
              >
                {visaTypes.length &&
                  visaTypes.map(item => {
                    return (
                      <MenuItem key={`${item}`} value={''}>
                        {item}
                      </MenuItem>
                    );
                  })}

                <MenuItem value={'other'}>F1</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={2} className='grid-top-margin'>
        <Grid item xs={4}>
          <TextField
            fullWidth
            value={alienNo}
            disabled
            onChange={e => {
              setAlienNo(e.target.value);
            }}
            label='Alien Number'
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            value={receiptNo}
            disabled
            onChange={e => {
              setReceiptNo(e.target.value);
            }}
            label='Receipt#'
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type='date'
            defaultValue={documentExpiryDate}
            disabled
            onChange={e => {
              setDocumentExpiryDate(new Date(e.target.value));
            }}
            fullWidth
            label='Document Expiration Date'
            variant='outlined'
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} className='grid-top-margin'>
        <Grid item xs={4}>
          <TextField
            disabled
            fullWidth
            label='Last Name #'
            value={lastName}
            onChange={e => {
              setLastName(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            fullWidth
            label='First Name'
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            fullWidth
            label='Middle Name'
            value={middleName}
            onChange={e => {
              setMiddleName(e.target.value);
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} className='grid-top-margin'>
        <Grid item xs={4}>
          <TextField
            type='date'
            disabled
            defaultValue={birthDate}
            fullWidth
            label='Date of Birth'
            variant='outlined'
            onChange={e => {
              setbirthDate(new Date(e.target.value));
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {' '}
                  <div className='input-adornment-text'> {calculateAge(birthDate)} </div>{' '}
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <strong> Status </strong>
          <div className='status'>
            <div>{verificationStatus} </div>
            <DCircleLoader /> <div className='status-text'>initial Verification in progress</div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
