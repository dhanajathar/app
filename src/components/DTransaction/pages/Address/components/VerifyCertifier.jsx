/*
 * Component Name: Address
 * Author: Priyanka Pandey
 * Created: 2023-07-15
 * Last Modified: 2023-12-19
 * Description: This page is obtaining user consent for certifier information, for their (primary) address.
 * Application Release Version:1.0.0
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import data from '../api-address.json';
import DAlertBox from '../../../../DAlertBox';
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
  Autocomplete
} from '@mui/material';

function VerifyCertifier({ onSubmit, onCancel }) {
  const { relationShipList, documentList } = data;
  const [relationShip, setRelationsShip] = useState(null);
  const [primaryDocument, setPrimaryDocument] = useState(null);
  const [secondaryDocument, setSecondaryDocument] = useState(null);
  const [relationShipError, setRelationShipError] = useState();
  const [primaryDocumentError, setPrimaryDocumentError] = useState();
  const [secondaryDocumentError, setSecondaryDocumentError] = useState();
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
            <TextField
              size='small'
              value={'JONATHAN DOE'}
              label='Certifier Full Name'
              disabled
              fullWidth
            />
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
            <TextField
              size='small'
              value={'04/21/2030'}
              label='Expiration Date'
              disabled
              fullWidth
            />
          </div>
        </div>

        <div className='certifier-additional-details'>
          <div className='certifier-title'> Additional Details</div>
          <div className='d-row'>
            <div className='col col-sm-12 col-md-4'>
              <Autocomplete
                options={relationShipList}
                fullWidth
                size='small'
                name='relationship'
                value={relationShip}
                disableClearable={true}
                onChange={(e, v) => setRelationsShip(v)}
                onBlur={() =>
                  !relationShip
                    ? setRelationShipError('Please select a value for Relationship')
                    : setRelationShipError()
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Relationship'
                    error={!!relationShipError}
                    helperText={
                      relationShipError ? (
                        <DAlertBox errorText={relationShipError} />
                      ) : (
                        "Certifier can certify unto 4 'OTHER' applicants in a year."
                      )
                    }
                  />
                )}
              />
            </div>
            {relationShip === 'Other' && (
              <div className='col col-sm-12 col-md-4'>
                <TextField size='small' fullWidth />
              </div>
            )}
          </div>
          <div className='d-row'>
            <div className='col col-sm-12 col-md-4'>
              <Autocomplete
                options={documentList}
                fullWidth
                size='small'
                name='primaryDocument'
                value={primaryDocument}
                disableClearable={true}
                onChange={(e, v) => setPrimaryDocument(v)}
                onBlur={() =>
                  !primaryDocument
                    ? setPrimaryDocumentError('Please select a value for Primary Document')
                    : setPrimaryDocumentError()
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Primary Document'
                    error={!!primaryDocumentError}
                    helperText={<DAlertBox errorText={primaryDocumentError} />}
                  />
                )}
              />
            </div>
            <div className='col col-sm-12 col-md-4'>
              <Autocomplete
                options={documentList}
                fullWidth
                size='small'
                name='secondaryDocument'
                value={secondaryDocument}
                disableClearable={true}
                onChange={(e, v) => setSecondaryDocument(v)}
                onBlur={() =>
                  !primaryDocument
                    ? setSecondaryDocumentError('Please select a value for Secondary Document')
                    : setSecondaryDocumentError()
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Secondary Document'
                    error={!!secondaryDocumentError}
                    helperText={<DAlertBox errorText={secondaryDocumentError} />}
                  />
                )}
              />
            </div>
          </div>
          <div className='d-row'>
            <div className='col col-md-12'>
              <Checkbox /> I acknowledge that the above information is verified as per the Residency
              Certification application
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
