import React, { useState } from 'react';
import data from './api-edit-employee.json';
import EmployeeInformation from '../fragments/EmployeeInformationForm';

const EditEmployee = () => {
  const [values, setValues] = useState(data.initial_values);
  return (
    <React.Fragment>
      <div className='sub_title'>
        {data.initial_values.firstName} {data.initial_values.lastName} / Edit Employee
      </div>
      <div className='d-container'>
        <div className='d-row truncation-row'>
          <div className='col-12 sub_title'>Employee Information</div>
        </div>
        <EmployeeInformation initialValues={data.initial_values} mode='EDIT' />
      </div>
    </React.Fragment>
  );
};
export default EditEmployee;
