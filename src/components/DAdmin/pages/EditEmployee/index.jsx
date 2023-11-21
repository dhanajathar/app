import React from 'react';
import data from './api-edit-employee.json';
import EmployeeInformation from '../fragments/EmployeeInformationForm';

const EditEmployee = () => {
  return (
    <React.Fragment>
      <div className='sub_title'>
        {data.initial_values.firstName} {data.initial_values.lastName} / Edit Employee{' '}
        <span className={`employee-status ${data.initial_values.status}`}>
          {data.initial_values.status}
        </span>
      </div>
      <div className='d-container'>
        <div className='d-row truncation-row'>
          <div className='col-12 sub_title'>Employee Information</div>
        </div>
        <EmployeeInformation employeeData={data.initial_values} mode={'edit'} />
      </div>
    </React.Fragment>
  );
};
export default EditEmployee;
