/*
 * Author: Swathi Kudikala
 * Created: 2023-12-01
 * Last Modified: 2023-12-05
 * Description: This file shows the information of employee search results to edit.
 * Application Release Version:1.0.0
 */
import React, { useEffect, useState } from 'react';
import EmployeeInformation from '../fragments/EmployeeInformationForm';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EditEmployee = () => {
  const [employeeData, setEmployeeData] = useState();
  const location = useLocation();

  useEffect(() => {
    const options = {
      url: '/src/components/DAdmin/pages/fragments/EmployeeSearchResults/api-search-results-list.json',
      method: 'GET'
    };
    axios(options)
      .then(({ data }) => {
        if (data) {
          const selectedEMployee = data.find(
            employee => employee.employeeId == location.state.employeeId
          );
          setEmployeeData(selectedEMployee);
        }
      })
      .catch(error => {
        console.error({ error });
      });
  }, []);

  if (!employeeData) {
    return <></>;
  }
  return (
    <React.Fragment>
      <div className='sub_title'>
        {employeeData.firstName} {employeeData.lastName} / Edit Employee{' '}
        <span className={`employee-status ${employeeData.status}`}>{employeeData.status}</span>
      </div>
      <div className='admin-container d-container'>
        <div className='d-row truncation-row'>
          <div className='col-12 sub_title'>Employee Information</div>
        </div>
        <EmployeeInformation employeeData={employeeData} mode={'edit'} />
      </div>
    </React.Fragment>
  );
};
export default EditEmployee;
