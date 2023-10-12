import './index.css';

import { Route, Routes } from 'react-router-dom';

import { EnterCode } from './pages/EnterCode';
import { LoginError } from './pages/LoginError';
import { LoginPage } from './pages/LoginPage';
import React from 'react';
import { WelcomePage } from './pages/WelcomePage';

const DLogin = () => {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path='login/' element={<LoginPage />} />
      <Route exact path='entercode/' element={<EnterCode />} />
      <Route path='welcome/' element={<WelcomePage />} />
      <Route path='*' element={<LoginError />} />
    </Routes>
  );
};

export default DLogin;
