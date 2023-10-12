import './index.css';

import { Route, Routes } from 'react-router-dom';

import { AdminError } from './pages/AdminError';
import EditEmployee from './pages/EditEmployee';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeeSearch from './pages/EmployeeSearch';
import NewEmployee from './pages/NewEmployee';
import ProfilePermissions from './pages/fragments/ProfilePermissions';
import React from 'react';

const DAdmin = () => {
  return (
    <Routes>
      <Route index element={<NewEmployee />} />
      {/* <Route path='employee-search//*' element={<EmployeeSearch />} /> */}
      <Route path='new-employee/' element={<NewEmployee />} />
      <Route path='employee-profile/' element={<EmployeeProfile />} />
      <Route path='edit-employee/' element={<EditEmployee />} />
      <Route path='profile-permission/' element={<ProfilePermissions />} />
      <Route path='*' element={<AdminError />} />
    </Routes>
  );
};

export default DAdmin;
