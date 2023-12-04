/*
 * Author: Swathi Kudikala
 * Created:
 * Last Modified: 2023-11-22
 * Description: This file shows the tab structure for read-only employee.
 * Application Release Version:1.0.0
 */
import EmployeeInformationFormViewOnly from '../fragments/EmployeeInformationFormViewOnly';
import MuiTabs from '../../../DTabs/MuiTabs';
import ProfilePermissionsList from '../fragments/ProfilePermissionsList';
import React from 'react';
import data from './api-employee-data.json';
import '../../index.css';

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
          <span className='sub_title'>
            Employee Maintenance / {data.initial_values.lastName} {data.initial_values.firstName}{' '}
            <span className={`employee-status ${data.initial_values.status}`}>
              {data.initial_values.status}
            </span>
          </span>
        </div>
      </div>
      <div className='admin-container d-container'>
        <MuiTabs className='search-results-tab' tabs={tabs} />
      </div>
    </React.Fragment>
  );
};
export default EmployeeProfile;
