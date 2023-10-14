import './AddressFragment.css';

import { Accordion, AccordionDetails, AccordionSummary, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React  from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import data from './api-addressfragment.json';
import dayjs from 'dayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function AddressFragment() {
  const PRIMARY = 'PRIMARY';


  return (
    <>
      {data && data.map((address, index) => (
        <Accordion className='address-accordion' defaultExpanded={index === 0 ? true : false}                  >
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
                  <FormControl fullWidth>
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
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <div className='d-row'>
                <div className='col col-sm-12 col-md-4'>
                  <TextField
                    fullWidth
                    label='Address Line'
                    disabled
                    value={address.addressDetails.addressLine}

                  />
                </div>

                <div className='col col-sm-12 col-md-2'>
                  <TextField
                    fullWidth
                    label='City'
                    disabled
                    value={address.addressDetails.city}

                  />
                </div>
                <div className='col col-sm-12 col-md-2'>
                  <TextField
                    fullWidth
                    label='State'
                    disabled
                    value={address.addressDetails.state}

                  />
                </div>
                <div className='col col-sm-12 col-md-2'>
                  <TextField
                    fullWidth
                    label='ZIP Code'
                    disabled
                    value={address.addressDetails.zipCode}
                  />
                </div>
                <div className='col col-sm-12 col-md-2'>
                  <TextField
                    fullWidth
                    label='Country'
                    disabled
                    value={address.addressDetails.country}

                  />
                </div>
              </div>
              {address?.residencyCertification && <div className='d-row'>
                <div className='col col-sm-12 col-md-4'>
                  <FormControl fullWidth>
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
              </div>}
            </>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
