
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
      <div className='notification-msg'> <CheckIcon /> BOE NOTIFIED </div>
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
            control={<Checkbox checked={data.disableAssistanceRequired} />}
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
      {data.addresses.map(address => (
        <>
          <div className='d-sub-title'> {address.title} </div>
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
                value={address.addressLine}

              />
            </div>

            <div className='col col-sm-12 col-md-2'>
              <TextField
                fullWidth
                label='City'
                disabled
                value={address.city}

              />
            </div>
            <div className='col col-sm-12 col-md-2'>
              <TextField
                fullWidth
                label='State'
                disabled
                value={address.state}

              />
            </div>
            <div className='col col-sm-12 col-md-2'>
              <TextField
                fullWidth
                label='ZIP Code'
                disabled
                value={address.zipCode}
              />
            </div>
            <div className='col col-sm-12 col-md-2'>
              <TextField
                fullWidth
                label='Country'
                disabled
                value={address.country}
              />
            </div>
          </div>
        </>
      ))}

      <div className='d-row mt-1'>
        {data.userConditions.map(item => (
          <div className='col col-sm-12 col-md-6 pt-0'>
            <FormControlLabel
              control={<Checkbox checked={item.value} />}
              label={item.name}
              labelPlacement='end'
            />
          </div>
        ))}
      </div>

    </>
  );
}
