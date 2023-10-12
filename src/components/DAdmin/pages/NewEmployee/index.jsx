import React, { useState } from 'react';
import data from './api-new-employee.json';
import EmployeeInformation from '../fragments/EmployeeInformationForm';

const NewEmployee = () => {
  const [values, setValues] = useState(data.initial_values);
  return (
    <React.Fragment>
      <div className='sub_title'>Employee Maintenance / New Employee</div>
      <div className='d-container'>
        <div className='d-row truncation-row'>
          <div className='col-12 sub_title'>Employee Information</div>
        </div>
        <EmployeeInformation initialValues={data.initial_values} dropDowns={data.dropDowns} />
      </div>
    </React.Fragment>
  );
};
export default NewEmployee;
