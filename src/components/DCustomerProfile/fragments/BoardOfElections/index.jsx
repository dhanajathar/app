
import React, { useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './BoardOfElectionsFragment.css';
import mockData from './data.json';
import CheckIcon from '@mui/icons-material/Check';

export default function BoardOfElectionsFragment() {
  const [data, setData] = useState(mockData);
  const PRIMARY = 'PRIMARY';
  return (
    <>
    <div className='notification-msg'> <CheckIcon/> BOE NOTIFIED </div>
       <div className='d-row'>
       <div className='col col-sm-12 col-md-4'>
        <TextField
            fullWidth
            label='Registered to Vote in District of Columbia'
            disabled
            value={data.registerToVoteColumbia}

          />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <FormControl fullWidth>
            <InputLabel id='registrationForm'>Registration For Form </InputLabel>
            <Select
              labelId='registrationForm'
              id='registrationForm'
              value={data.registrationForForm}
              label='Registration For Form '
              disabled
            >
              <MenuItem value={'NEW REGISTRATION'}> NEW REGISTRATION </MenuItem> 
            </Select>
          </FormControl>
        </div>
       
        
      </div>
      <div className='d-row'>
       <div className='col col-sm-12 col-md-4'>
        <TextField
            fullWidth
            label='Poll Worker'
            disabled
            value={data.pollWorker}

          />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <FormControl fullWidth>
            <InputLabel id='language'>Language </InputLabel>
            <Select
              labelId='language'
              id='language'
              value={data.language}
              label='Language'
              disabled
            >
              <MenuItem value={'ENGLISH'}> ENGLISH </MenuItem> 
            </Select>
          </FormControl>
        </div>
        <div className='col col-sm-12 col-md-4'>
          <FormControl fullWidth>
            <InputLabel id='language'>Party Affiliation </InputLabel>
            <Select
              labelId='partyAffiliation'
              id='partyAffiliation'
              value={data.partyAffiliation}
              label='Party Affiliation'
              disabled
            >
              <MenuItem value={'DEMOCRATIC'}> DEMOCRATIC </MenuItem> 
            </Select>
          </FormControl>
        </div>
       
        
      </div>

      <div className='d-row'>
         <div className='col col-sm-12 col-md-4'>
         <TextField
            fullWidth
            label='Last Name Used'
            disabled
            value={data.lastNameUsed}

          />
        </div>
        <div className='col col-sm-12 col-md-4'>
        <FormControlLabel disabled
        control={<Checkbox />}
        label='Disabled Assistance Required'
        labelPlacement='end'
      />
        </div>
        <div className='col col-sm-12 col-md-4'>
         <TextField
            fullWidth
            label='Disabled Assistance Reason'
            disabled
            value={data.disableAssistanceReason}

          />
        </div>
      </div>
      <div className='d-sub-title'> Mailing Address Details </div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <FormControl fullWidth>
            <InputLabel id='addressType'>Address Type</InputLabel>
            <Select
              labelId='addressType'
              id='addressType'
              value={data.address.addressType}
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
                value={data.address.fromDate ? dayjs(data.address.fromDate) : null}
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
                value={data.address.toDate && dayjs(data.address.toDate)}
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
            value={data.address.addressLine}

          />
        </div>

        <div className='col col-sm-12 col-md-2'>
          <TextField
            fullWidth
            label='City'
            disabled
            value={data.address.city}

          />
        </div>
        <div className='col col-sm-12 col-md-2'>
          <TextField
            fullWidth
            label='State'
            disabled
            value={data.address.state}

          />
        </div>
        <div className='col col-sm-12 col-md-2'>
          <TextField
            fullWidth
            label='ZIP Code'
            disabled
            value={data.address.zipCode}
          />
        </div>
        <div className='col col-sm-12 col-md-2'>
          <TextField
            fullWidth
            label='Country'
            disabled
            value={data.address.country} 
          />
        </div>
      </div>
    </>
  );
}
