import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as _ from 'lodash';

import profiles from './api-profiles-list.json';
import './ProfilePermissions.css';
import * as dayjs from 'dayjs';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import '../../../index.css';

import { nanoid } from 'nanoid';
import DAlertBox from '../../../../DAlertBox';

const ProfilePermissions = params => {
  const defaultBeginDate = params?.defaultBeginDate
    ? dayjs(this.props.defaultBeginDate).startOf('day')
    : dayjs(new Date()).startOf('day');
  const [profilesToAdd, setProfilesToAdd] = useState([...profiles].sort());
  const [profilesToAddFiltered, setProfilesToAddFiltered] = useState(profilesToAdd);
  const [filterKey, setFilterkey] = useState('');
  const [profilesAdded, setProfilesAdded] = useState([]);
  const [formState, setFormState] = useState({
    errors: {},
    isValid: false,
    isDirty: false,
    touched: {}
  });

  useEffect(() => {
    handleFilterInput({ target: { value: filterKey } });
  }, [profilesToAdd]);

  const validateInputDate = key => {
    const { startDate, endDate } = profilesAdded.find(profile => profile.key === key) || {};

    if (!startDate) {
      return { error: 'Start Date cannot be empty', feild: 'startDate' };
    }

    dayjs.extend(isSameOrAfter);

    if (startDate && !dayjs(startDate).isSameOrAfter(defaultBeginDate)) {
      return {
        error: `Start Date cannot be before ${dayjs(defaultBeginDate).format('MM//DD/YYYY')}`,
        feild: 'startDate'
      };
    }

    if (endDate && !dayjs(endDate).isSameOrAfter(startDate)) {
      return {
        error: `End Date cannot be before ${dayjs(startDate).format('MM//DD/YYYY')}`,
        feild: 'endDate'
      };
    }
    null;
  };

  const handleFilterInput = event => {
    const _filterKey = event?.target?.value;
    setFilterkey(_filterKey);
    if (!_filterKey || _filterKey.length < 3) {
      setProfilesToAddFiltered(profilesToAdd);
    } else {
      setProfilesToAddFiltered(() => {
        return profilesToAdd.filter(profile =>
          profile.toLowerCase().includes(_filterKey.trim().toLowerCase())
        );
      });
    }
  };

  const handleProfileAdd = profile => {
    setProfilesToAdd(existingProfiles => {
      return _.sortBy(existingProfiles.filter(_profile => _profile !== profile));
    });
    setProfilesAdded(addedProfiles => {
      return _.orderBy(
        [...addedProfiles, { profile, startDate: defaultBeginDate, endDate: null, key: nanoid(8) }],
        'profile',
        'asc'
      );
    });
  };
  const handleProfileRemove = profile => {
    setProfilesAdded(existingProfiles => {
      return existingProfiles.filter(_profile => _profile.profile !== profile);
    });
    setProfilesToAdd(existingProfiles => {
      const profilesNotSelected = [profile, ...existingProfiles];
      return _.sortBy(profiles.filter(_profile => profilesNotSelected.includes(_profile)));
    });
  };
  const handleAddAllProfiles = () => {
    const profilesTobeAdded = [
      ...profilesAdded,
      ...profilesToAddFiltered.map(profile => ({
        profile,
        startDate: defaultBeginDate,
        endDate: null,
        key: nanoid(8)
      }))
    ];
    setProfilesAdded(_.orderBy(profilesTobeAdded, 'profile', 'asc'));
    setProfilesToAdd(() => {
      const addedProfiles = profilesTobeAdded.map(profile => profile.profile);
      return _.sortBy(profiles.filter(profile => !addedProfiles.includes(profile)));
    });
    setFilterkey('');
  };
  const handleRemoveAllProfiles = () => {
    setProfilesAdded([]);
    setProfilesToAdd(_.sortBy(profiles));
  };

  const handleBegindDateChange = (dateValue, key) => {
    setProfilesAdded(profilesAdded => {
      const newProfilesData = [...profilesAdded];
      const profileIndex = newProfilesData.findIndex(_profile => _profile.key === key);
      newProfilesData[profileIndex].startDate = dateValue;
      newProfilesData[profileIndex].endDate = null;
      const dateError = validateInputDate(key);
      setFormState(_formState => {
        const newFormSate = _formState;
        newFormSate.errors[key] = null;
        newFormSate.touched[key] = { startDate: true, endDate: newFormSate.touched[key]?.endDate };
        if (dateError) {
          newFormSate.errors = {
            ...newFormSate.errors,
            [key]: newFormSate.errors[key]
              ? { ...newFormSate.errors[key], [dateError.feild]: dateError.error }
              : { [dateError.feild]: dateError.error }
          };
        }
        return newFormSate;
      });

      return _.orderBy(newProfilesData, 'profile', 'asc');
    });
  };

  const handleEndDateChange = (dateValue, key) => {
    setProfilesAdded(profilesAdded => {
      const newProfilesData = [...profilesAdded];
      const profileIndex = newProfilesData.findIndex(_profile => _profile.key === key);
      newProfilesData[profileIndex].endDate = dateValue;
      const dateError = validateInputDate(key);

      setFormState(_formState => {
        const newFormSate = _formState;
        newFormSate.errors[key] = null;
        newFormSate.touched[key] = {
          endDate: true,
          startDate: newFormSate.touched[key]?.startDate
        };
        if (dateError) {
          newFormSate.errors = {
            ...newFormSate.errors,
            [key]: newFormSate.errors[key]
              ? { ...newFormSate.errors[key], [dateError.feild]: dateError.error }
              : { [dateError.feild]: dateError.error }
          };
        }
        return newFormSate;
      });
      return _.orderBy(newProfilesData, 'profile', 'asc');
    });
  };

  return (
    <React.Fragment>
      <div className='admin-container d-container'>
        <div className='d-row'>
          <div className='col-12 sub_title'>Profile Permissions</div>
        </div>
        <div className='d-row align-items-strech'>
          <div className='col-4 '>
            <div className='profile-permisiions-list'>
              <div className='profile-permision-search'>
                <TextField
                  id='outlined-basic'
                  size='small'
                  variant='outlined'
                  fullWidth
                  onChange={handleFilterInput}
                  value={filterKey}
                  InputProps={{
                    startAdornment: <SearchIcon fontSize='small' />
                  }}
                  placeholder=' Search Permissions'
                />
              </div>
              <TableContainer className='profile-permission-table'>
                <Table
                  aria-label='simple table'
                  className='system-admin-table'
                  size='small'
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Profiles</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profilesToAddFiltered.map(profile => (
                      <TableRow key={profile}>
                        <TableCell>{profile}</TableCell>
                        <TableCell>
                          <span className='table-btn' onClick={() => handleProfileAdd(profile)}>
                            {'ADD'} <ChevronRightIcon />
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className='system-admin-table-footer'>
                {profilesToAddFiltered?.length > 0 && (
                  <span className='table-btn' onClick={handleAddAllProfiles}>
                    {'ADD ALL'}
                    <KeyboardDoubleArrowRightIcon />
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className='col-8'>
            <div className='profile-permisiions-list'>
              <TableContainer className='granted-profile-table'>
                <Table
                  aria-label='simple table'
                  className='system-admin-table'
                  size='small'
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Granted Profile</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profilesAdded.map(profile => (
                      <TableRow key={profile.key}>
                        <TableCell>{profile.profile}</TableCell>
                        <TableCell className='date-feild'>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              value={profile.startDate || null}
                              onChange={newValue => handleBegindDateChange(newValue, profile.key)}
                              minDate={defaultBeginDate}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  helperText:
                                    formState.errors[profile.key]?.startDate &&
                                    formState.touched[profile.key].startDate ? (
                                      <DAlertBox
                                        errorText={formState.errors[profile.key].startDate}
                                      />
                                    ) : null
                                }
                              }}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell className='date-feild'>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              disabled={!!formState.errors[profile.key]?.startDate}
                              value={profile.endDate || null}
                              onChange={newValue => {
                                handleEndDateChange(newValue, profile.key);
                              }}
                              minDate={profile.startDate}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  helperText:
                                    formState.errors[profile.key]?.endDate &&
                                    formState.touched[profile.key].endDate ? (
                                      <DAlertBox
                                        errorText={formState.errors[profile.key].endDate}
                                      />
                                    ) : null
                                }
                              }}
                            />
                          </LocalizationProvider>
                        </TableCell>

                        <TableCell>
                          <span
                            className='table-btn'
                            onClick={() => handleProfileRemove(profile.profile)}
                          >
                            <ChevronLeftIcon /> {'REMOVE'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className='system-admin-table-footer'>
                {profilesAdded?.length > 0 && (
                  <span className='table-btn' onClick={handleRemoveAllProfiles}>
                    <KeyboardDoubleArrowLeftIcon />
                    {'REMOVE ALL'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProfilePermissions;
