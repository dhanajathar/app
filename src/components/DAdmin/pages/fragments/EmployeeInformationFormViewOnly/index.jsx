/*
 * Author: Swathi Kudikala
 * Created:
 * Last Modified: 2023-11-22
 * Description: This file shows the read-only information of employee.
 * Application Release Version:1.0.0
 */

import React from 'react';
import data from '../../EmployeeProfile/api-employee-data.json';
import EmployeeInformation from '../EmployeeInformationForm';

const EmployeeInformationFormViewOnly = () => {
  return (
    <React.Fragment>
      <EmployeeInformation employeeData={data.initial_values} mode={'read-only'} />
    </React.Fragment>
  );
};
export default EmployeeInformationFormViewOnly;
