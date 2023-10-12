import './index.css';

import {
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useState } from 'react';

import mockData from './data.json';
import { useSearchParams } from 'react-router-dom';

export default function BoardOfElections() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: {
        label: 'Board of Elections',
        step: 'Board of Elections',
        flowId: flowId,
        substep: true
      }
    });
  }, 100);

  const [data, setData] = useState(mockData);

  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
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
                onChange={e => setData({ ...data, language: e.target.value })}
              >
                {data.languageList &&
                  data.languageList.map((item, idx) => {
                    return (
                      <MenuItem key={idx} value={item}>
                        {' '}
                        {item}{' '}
                      </MenuItem>
                    );
                  })}
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
                  <FormControlLabel
                    disabled
                    control={<Checkbox />}
                    className='checkbox'
                    label='Disabled Assistance Required'
                  />
                  <TextField
                    placeholder='Reason'
                    className='contactinput'
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
                    <Checkbox />
                    Copy Mailing Address
                  </label>
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ width: 1 }}>
                    <TextField
                      variant='outlined'
                      label='Address Line'
                      className='contactinput'
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
      </form>
    </Container>
  );
}
