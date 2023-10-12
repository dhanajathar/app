import {
  Grid,
  FormControl,
  Checkbox,
  MenuItem,
  OutlinedInput,
  Select,
  TextField, 
} from '@mui/material';
import React, { useState } from 'react';
import './BoardOfElectionsFragment.css';
import mockData from './data.json';

export default function BoardOfElectionsFragment() {
  const [data, setData] = useState(mockData);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl sx={{ mx: 1 }}>
            <label className='contactlabel'>
              Do you want to register to vote in the District of Columbia
            </label>
            <Select
              sx={{ width: 320 }}
              className='contactselect'
              value={data.registerToVoteColumbia}
              input={<OutlinedInput />}
              disabled
              onChange={e => setData({ ...data, registerToVoteColumbia: e.target.value })}
            >
              <MenuItem value={'yes'}>Yes</MenuItem>
              <MenuItem value={'no'}>No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl sx={{ mx: 1, width: 320 }}>
            <label className='contactlabel'>Registration for Form</label>
            <Select
              className='contactselect'
              value={data.registrationForForm}
              input={<OutlinedInput />}
              disabled
              onChange={e => setData({ ...data, registrationForForm: e.target.value })}
            >
              <MenuItem value={'yes'}>Yes</MenuItem>
              <MenuItem value={'no'}>No</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ mx: 1, width: 320 }}>
            <label className='contactlabel'>Poll Worker</label>
            <Select
              className='contactselect'
              value={data.pollWorker}
              input={<OutlinedInput />}
              disabled
              onChange={e => setData({ ...data, pollWorker: e.target.value })}
            >
              <MenuItem value={'yes'}>Yes</MenuItem>
              <MenuItem value={'no'}>No</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ mx: 1, width: 320 }}>
            <label className='contactlabel'>Language</label>
            <Select
              className='contactselect'
              value={data.language}
              input={<OutlinedInput />}
              disabled
              onChange={e => setData({ ...data, language: e.target.value })}
            >
              <MenuItem value={'yes'}>New Registration</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl sx={{ mx: 1, width: 320 }}>
            <label className='contactlabel'>Party Affiliation</label>
            <Select
              className='contactselect'
              value={data.partyAffiliation}
              input={<OutlinedInput />}
              disabled
              onChange={e => setData({ ...data, partyAffiliation: e.target.value })}
            >
              <MenuItem value={'yes'}>Democratic</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems='flex-end'>
            <Grid item>
              <FormControl sx={{ mx: 1, width: 320 }}>
                <label className='contactlabel'>
                  <Checkbox disabled className='disabled-assistance-required' />
                  Disabled Assistance Required
                </label>

                <TextField
                  placeholder='Reason'
                  className='contactinput'
                  disabled
                  value={data.disableAssistanceRequired}
                  onChange={e => setData({ ...data, disableAssistanceRequired: e.target.value })}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl sx={{ mx: 1, width: 320 }}>
                <TextField
                  variant='outlined'
                  label='Last Name Used'
                  disabled
                  className='contactinput'
                  value={data.lastNameUsed}
                  onChange={e => setData({ ...data, lastNameUsed: e.target.value })}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <h3 className='address-title'>Address Details</h3>
        </Grid>
        <Grid item xs={6}>
          <fieldset className='fieldset'>
            <legend className='legend'>Mailing Address</legend>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <label className='contactlabel'>
                  <Checkbox disabled />
                  Copy Primary Address
                </label>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: 1 }}>
                  <TextField
                    disabled
                    variant='outlined'
                    label='Address Line'
                    className='contactinput'
                    value={data.address.addressline}
                    onChange={e =>
                      setData({
                        ...data,
                        address: { ...data.address, addressline: e.target.value }
                      })
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: 1 }}>
                  <TextField
                    variant='outlined'
                    label='City'
                    className='contactinputreadonly'
                    disabled
                    InputProps={{
                      readOnly: true
                    }}
                    value={data.address.city}
                    onChange={e =>
                      setData({ ...data, address: { ...data.address, city: e.target.value } })
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: 1 }}>
                  <TextField
                    variant='outlined'
                    label='State'
                    disabled
                    className='contactinputreadonly'
                    InputProps={{
                      readOnly: true
                    }}
                    value={data.address.state}
                    onChange={e =>
                      setData({ ...data, address: { ...data.address, state: e.target.value } })
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: 1 }}>
                  <TextField
                    variant='outlined'
                    disabled
                    label='ZIP Code'
                    className='contactinput'
                    value={data.address.zipcode}
                    onChange={e =>
                      setData({ ...data, address: { ...data.address, zipcode: e.target.value } })
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: 1 }}>
                  <TextField
                    variant='outlined'
                    label='Country'
                    disabled
                    className='contactinputreadonly'
                    InputProps={{
                      readOnly: true
                    }}
                    value={data.address.country}
                    onChange={e =>
                      setData({ ...data, address: { ...data.address, country: e.target.value } })
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </fieldset>
        </Grid>
        <Grid item xs={6}>
          <fieldset className='fieldset'>
            <legend className='legend'>Last Address</legend>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <label className='contactlabel'>
                  <Checkbox disabled />
                  Copy Mailing Address
                </label>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: 1 }}>
                  <TextField
                    variant='outlined'
                    label='Address Line'
                    className='contactinput'
                    disabled
                    value={data.addressLineLast}
                    onChange={e => setData({ ...data, addressLineLast: e.target.value })}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: 1 }}>
                  <TextField
                    variant='outlined'
                    label='City'
                    disabled
                    className='contactinputreadonly'
                    InputProps={{
                      readOnly: true
                    }}
                    value={data.cityLast}
                    onChange={e => setData({ ...data, cityLast: e.target.value })}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: 1 }}>
                  <TextField
                    variant='outlined'
                    label='State'
                    disabled
                    className='contactinputreadonly'
                    InputProps={{
                      readOnly: true
                    }}
                    value={data.stateLast}
                    onChange={e => setData({ ...data, stateLast: e.target.value })}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: 1 }}>
                  <TextField
                    variant='outlined'
                    label='ZIP Code'
                    disabled
                    className='contactinput'
                    value={data.zipLast}
                    onChange={e => setData({ ...data, zipLast: e.target.value })}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: 1 }}>
                  <TextField
                    variant='outlined'
                    label='Country'
                    disabled
                    className='contactinputreadonly'
                    InputProps={{
                      readOnly: true
                    }}
                    value={data.countryLast}
                    onChange={e => setData({ ...data, countryLast: e.target.value })}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </fieldset>
        </Grid>
      </Grid>
    </>
  );
}
