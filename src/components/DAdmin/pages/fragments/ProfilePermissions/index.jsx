import React from 'react';
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
import profiles from './api-profiles-list.json';
import './ProfilePermissions.css';

const ProfilePermissions = () => {
  const [profilesToAdd, setProfilesToAdd] = React.useState(profiles);
  const [profilesAdded, setProfilesAdded] = React.useState([]);

  const handleProfileAdd = profile => {
    setProfilesToAdd(existingProfiles => {
      return existingProfiles.filter(_profile => _profile !== profile);
    });
    setProfilesAdded(addedProfiles => {
      return [...addedProfiles, { profile, startDate: null, endDate: null }];
    });
  };
  const handleProfileRemove = profile => {
    setProfilesAdded(existingProfiles => {
      return existingProfiles.filter(_profile => _profile.profile !== profile);
    });
    setProfilesToAdd(existingProfiles => {
      const profilesNotSelected = [profile, ...existingProfiles];
      return profiles.filter(_profile => profilesNotSelected.includes(_profile));
    });
  };
  const handleAddAllProfiles = () => {
    let profilesToBeAdded = profiles.filter(profile => {
      return !profilesAdded.find(addedProfile => addedProfile.profile == profile);
    });
    setProfilesToAdd([]);
    profilesToBeAdded = profilesToBeAdded.map(profile => ({
      profile,
      startDate: null,
      endDate: null
    }));
    setProfilesAdded(existingProfiles => {
      return [...existingProfiles, ...profilesToBeAdded];
    });
  };
  const handleRemoveAllProfiles = () => {
    setProfilesAdded([]);
    setProfilesToAdd(profiles);
  };

  return (
    <React.Fragment>
      <div className='d-container'>
        <div className='d-row'>
          <div className='col-12 sub_title'>Profile Permissions</div>
        </div>
        <div className='d-row align-items-strech'>
          <div className='col-4 '>
            <div className='profile-permisiions-list'>
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
                    {profilesToAdd.map(profile => (
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
                <span className='table-btn' onClick={handleAddAllProfiles}>
                  {'ADD ALL'}
                  <KeyboardDoubleArrowRightIcon />
                </span>
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
                      <TableRow key={profile.profile}>
                        <TableCell>{profile.profile}</TableCell>
                        <TableCell className='date-feild'>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              value={profile.startDate || null}
                              onChange={newValue => {}}
                              slotProps={{
                                textField: {
                                  size: 'small'
                                }
                              }}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell className='date-feild'>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              value={profile.endDate || null}
                              onChange={newValue => {}}
                              slotProps={{ textField: { size: 'small' } }}
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
                <span className='table-btn' onClick={handleRemoveAllProfiles}>
                  <KeyboardDoubleArrowLeftIcon />
                  {'REMOVE ALL'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProfilePermissions;
