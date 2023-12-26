import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import Locations from './Pages/Locations';

const DLocations = () => {
  return (
    <Routes>
      <Route index element={<Locations />} />
    </Routes>
  );
};

export default DLocations;
