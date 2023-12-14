import React, { useState } from 'react';
import PropTypes from 'prop-types';
import data from '../api-address.json';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Checkbox,
  FormHelperText,
  InputAdornment,
} from '@mui/material';

function VerifyCertifier({ onSubmit, onCancel }) {
  const {
    relationShipList,
    documentList
  } = data;
  const [relationShip, setRelationsShip] = useState(null);
  const [primaryDocument, setPrimaryDocument] = useState(null);
  const [secondaryDocument, setSecondaryDocument] = useState(null);
  const [relationShipError, setRelationShipError] = useState();
  const [primaryDocumentError, setPrimaryDocumentError] = useState();
  const [secondaryDocumentError, setSecondaryDocumentError] = useState()
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

      <div className='certifier-wrapper'>
        <div className='certifier-title'> Certifier Information</div>
        <div className='d-row'>
          <div className='col col-sm-12 col-md-8'>
            <TextField size='small' value={'JONATHAN DOE'} label='Certifier Full Name' disabled fullWidth />
          </div>
          <div className='col col-sm-12 col-md-4'>
            <TextField
              size='small'
              fullWidth
              name='dateOfBirth'
              disabled
              label='Date of Birth'
              defaultValue={'12/29/1980'}

              className='input-adornment'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {' '}
                    <div className='input-adornment-text'> {calculateAge('12/29/1980')} </div>{' '}
                  </InputAdornment>
                )
              }}
            >
              {' '}
            </TextField>

          </div>
        </div>
        <div className='d-row'>
          <div className='col col-sm-12 col-md-4'>
            <TextField size='small' value={'200 I ST SE'} label='Address Line' disabled fullWidth />
          </div>
          <div className='col col-sm-12 col-md-2'>
            <TextField size='small' value={'WASHINGTON'} label='City' disabled fullWidth />
          </div>
          <div className='col col-sm-12 col-md-2'>
            <TextField size='small' value={'DC'} label='State' disabled fullWidth />
          </div>
          <div className='col col-sm-12 col-md-2'>
            <TextField size='small' value={'20003-3317'} label='ZIP Code' disabled fullWidth />
          </div>
          <div className='col col-sm-12 col-md-2'>
            <TextField size='small' value={'UNITED STATES'} label='Country' disabled fullWidth />
          </div>
        </div>
        <div className='d-row'>
          <div className='col col-sm-12 col-md-4'>
            <TextField size='small' value={'221122'} label='Driver License' disabled fullWidth />
          </div>
          <div className='col col-sm-12 col-md-4'>
            <TextField size='small' value={'04/21/2030'} label='Expiration Date' disabled fullWidth />
          </div>
        </div>

        <div className='certifier-additional-details'>
          <div className='certifier-title'> Additional Details</div>
          <div className='d-row'>
            <div className='col col-sm-12 col-md-4'>
              <FormControl size='small' fullWidth error={!!relationShipError}>
                <InputLabel id='relationship'>Relationship</InputLabel>
                <Select
                  labelId='relationship'
                  id='relationship'
                  value={relationShip}
                  label='Relationship'
                  onBlur={() =>
                    !relationShip
                      ? setRelationShipError('Please select a value for Relationship')
                      : setRelationShipError()
                  }
                  onChange={e => setRelationsShip(e.target.value)}
                >
                  {relationShipList &&
                    relationShipList.map(item => {
                      return (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                </Select>
                {relationShipError ? (
                  <FormHelperText> {relationShipError} </FormHelperText>
                ) : (
                  <FormHelperText>
                    Certifier can certify unto 4 'OTHER' applicants in a year.{' '}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            {relationShip === 'Other' && (
              <div className='col col-sm-12 col-md-4'>
                <TextField size='small' fullWidth />
              </div>
            )}
          </div>
          <div className='d-row'>
            <div className='col col-sm-12 col-md-4'>
              <FormControl size='small' fullWidth error={!!primaryDocumentError}>
                <InputLabel id='primaryDocument'>Primary Document</InputLabel>
                <Select
                  labelId='primaryDocument'
                  id='primaryDocument'
                  value={primaryDocument}
                  label='Primary Document'
                  onBlur={() =>
                    !primaryDocument
                      ? setPrimaryDocumentError('Please select a value for Primary Document')
                      : setPrimaryDocumentError()
                  }
                  onChange={e => setPrimaryDocument(e.target.value)}
                >
                  {documentList &&
                    documentList.map(item => {
                      return (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                </Select>
                {primaryDocumentError && (
                  <FormHelperText> {primaryDocumentError} </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className='col col-sm-12 col-md-4'>
              <FormControl size='small' fullWidth error={!!secondaryDocumentError}>
                <InputLabel id='primaryDocument'>Secondary Document</InputLabel>
                <Select
                  labelId='secondaryDocument'
                  id='secondaryDocument'
                  value={secondaryDocument}
                  label='Secondary Document'
                  onBlur={() =>
                    !primaryDocument
                      ? setSecondaryDocumentError(
                        'Please select a value for Secondary Document'
                      )
                      : setSecondaryDocumentError()
                  }
                  onChange={e => setSecondaryDocument(e.target.value)}
                >
                  {documentList &&
                    documentList.map(item => {
                      return (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                </Select>
                {secondaryDocumentError && (
                  <FormHelperText> {secondaryDocumentError} </FormHelperText>
                )}
              </FormControl>
            </div>
          </div>
          <div className='d-row'>
            <div className='col col-md-12'>
              <Checkbox /> I acknowledge that the above information is verified as per the
              Residency Certification application
            </div>
          </div>
        </div>
      </div>

      <div className='certifier-actions-button'>
        <Button variant='text' onClick={() => onCancel()}>
          {' '}
          Cancel{' '}
        </Button>
        <Button
          variant='contained'
          onClick={() => onSubmit()}
          autoFocus
          disabled={!relationShip || !primaryDocument || !secondaryDocument}
        >
          Confirm certifier
        </Button>
      </div>

    </>
  );
}

export default VerifyCertifier;
