import { Chip } from '@mui/material';
import EmployeeInformationFormViewOnly from '../fragments/EmployeeInformationFormViewOnly';
import MuiTabs from '../../../DTabs/MuiTabs';
import ProfilePermissionsList from '../fragments/ProfilePermissionsList';
import React from 'react';

const EmployeeProfile = () => {
  const tabs = [
    {
      classes: '',
      tabName: 'Employee Information',
      tabContent: <EmployeeInformationFormViewOnly />
    },
    { classes: '', tabName: 'Profile Permissions', tabContent: <ProfilePermissionsList /> }
  ];
  return (
    <React.Fragment>
      <div className='d-row'>
        <div className='col-12'>
          <span className='sub_title'>Employee Maintenance / Employee Name </span>
          <Chip label='Active' color='success' variant='outlined' />
        </div>
      </div>
      <div className='d-container'>
        <MuiTabs className='search-results-tab' tabs={tabs} />
      </div>
    </React.Fragment>
  );
};
export default EmployeeProfile;
