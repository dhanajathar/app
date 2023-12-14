import './AddressFragment.css';

import { Accordion, AccordionDetails, AccordionSummary, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import data from './api-addressfragment.json';
import dayjs from 'dayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmber from '@mui/icons-material/WarningAmber';


export default function AddressFragment() {
  const PRIMARY = 'PRIMARY';

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
      {data && data.map((address, index) => (
        <Accordion className='address-accordion' key={index} defaultExpanded={index === 0 ? true : false}                  >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            {address.addressDetails.addressLine}
            <div className='address-duration-wrapper'>
              <div className='customer-address-duration'>
                {`${dayjs(address.fromDate).format('MM/DD/YYYY')} -  ${address.addressType === PRIMARY
                  ? 'TILL Date'
                  : dayjs(address.toDate).format('MM/DD/YYYY')
                  }`}
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <>
              <div className='d-row'>
                <div className='col col-sm-12 col-md-4'>
                  <FormControl fullWidth size='small'>
                    <InputLabel id='addressType'>Address Type</InputLabel>
                    <Select
                      labelId='addressType'
                      id='addressType'
                      value={address.addressType}
                      label='Address Type'
                      disabled
                    >
                      <MenuItem value={'PRIMARY'}>PRIMARY</MenuItem>
                      <MenuItem value={'TEMPORARY'}>TEMPORARY</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className='col col-sm-12 col-md-4'>
                  <div className='date-picker'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}    >
                      <DatePicker

                        label='From Date'
                        value={address.fromDate ? dayjs(address.fromDate) : null}
                        disabled
                        slotProps={{
                          textField: {
                            size: 'small'
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className='col col-sm-12 col-md-4'>
                  <div className='date-picker'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label='To Date'
                        value={address.toDate && dayjs(address.toDate)}
                        disabled
                        slotProps={{
                          textField: {
                            size: 'small'
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <div className='d-row'>
                <div className='col col-sm-12 col-md-4'>
                  <TextField
                    fullWidth
                    size='small'
                    label='Address Line'
                    disabled
                    value={address.addressDetails.addressLine}

                  />
                </div>

                <div className='col col-sm-12 col-md-2'>
                  <TextField
                    fullWidth
                    size='small'
                    label='City'
                    disabled
                    value={address.addressDetails.city}

                  />
                </div>
                <div className='col col-sm-12 col-md-2'>
                  <TextField
                    fullWidth
                    size='small'
                    label='State'
                    disabled
                    value={address.addressDetails.state}

                  />
                </div>
                <div className='col col-sm-12 col-md-2'>
                  <TextField
                    fullWidth
                    size='small'
                    label='ZIP Code'
                    disabled
                    value={address.addressDetails.zipCode}
                  />
                </div>
                <div className='col col-sm-12 col-md-2'>
                  <TextField
                    fullWidth
                    size='small'
                    label='Country'
                    disabled
                    value={address.addressDetails.country}

                  />
                </div>
              </div>
              <div className='address-status-wrapper'>
                <div className='address-status'>
                  {address.addressDetails.isValidate ? (
                    <div className='valid-address'>
                      <div className='address-line'>
                        {' '}
                        200 I ST SE
                        <br />
                        WASHINGTON DC 20003-3317
                      </div>
                      <div>Parking Zone: 2</div>
                      <div className='address-status-text'>
                        <CheckIcon /> USPS Validated Address
                      </div>
                    </div>
                  ) : (
                    <div className='invalid-address'>
                      <WarningAmber />{' '}
                      <span>
                        {' '}
                        STREET NAME WAS NOT FOUND IN THE POSTAL DIRECTORY. PLEASE VERIFY AND
                        RE-SUBMIT.
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {address?.residencyCertification && <> <div className='d-row'>
                <div className='col col-sm-12 col-md-4'>
                  <FormControl fullWidth size='small'>
                    <InputLabel id='certificate'> Residency Certification</InputLabel>
                    <Select
                      labelId='certificate'
                      id='certificate'
                      value={address.residencyCertification.isCertification}
                      label='Residency Certification'
                      disabled
                    >
                      <MenuItem value={'YES'}>YES</MenuItem>
                      <MenuItem value={'NO'}>NO</MenuItem>
                    </Select>
                  </FormControl>
                </div>

              </div>
                {address.residencyCertification.isCertification === 'YES' && <>
                  <div className='d-sub-title'> Certifier Information
                  </div>
                  <div className='d-row'>
                    <div className='col col-sm-12 col-md-8'>
                      <TextField
                        size='small'
                        fullWidth
                        name='certifier'
                        disabled
                        defaultValue={address.residencyCertification.certifiedInfo.certifierFullName}
                        label='Certifier Full Name'
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <div className={'date-picker'}>
                        <TextField
                          size='small'
                          fullWidth
                          name='dateOfBirth'
                          disabled
                          label='Date of Birth'
                          defaultValue={address.residencyCertification.certifiedInfo.dateOfBirth}
                          className='input-adornment'
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                {' '}
                                <div className='input-adornment-text'> {calculateAge(address.residencyCertification.certifiedInfo.dateOfBirth)} </div>{' '}
                              </InputAdornment>
                            )
                          }}
                        >
                        </TextField>

                      </div>
                    </div>
                  </div>
                  <div className='d-row'>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        size='small'
                        fullWidth
                        name='driverLicense'
                        disabled
                        defaultValue={address.residencyCertification.certifiedInfo.driverLicense}
                        label='Driver License'
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        size='small'
                        disabled
                        fullWidth
                        label='Expiration Date'
                        defaultValue={address.residencyCertification.certifiedInfo.expirationDate}
                      >
                        {' '}
                      </TextField>
                    </div>
                  </div>
                </>}
              </>}
            </>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
