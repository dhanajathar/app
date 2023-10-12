import './index.css';

import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Address from './pages/Address';
import BoardOfElections from './pages/BoardOfElections';
import Contact from './pages/Contact';
import DProgressStepper from './components/DProgressStepper';
import DTransactionHead from './components/DTransactionHead/';
import DTransactionNav from './components/DTransactionNav';
import DriverLicense from './pages/DriverLicenseDetails';
import Fees from './pages/Fees';
import IndividualDetails from './pages/IndividualDetails';
import { NewIdDetails } from './pages/NewIdDetails';
import { Outlet } from 'react-router-dom';
import Passport from './pages/Uspassport';
import { PaymentSummary } from './pages/PaymentSummary';
import Print from './pages/Print';
import ProofOfIdentity from './pages/ProofofIdentity';
import Scan from './pages/Scan';
import Vision from './pages/VisionScreening';
import transactionData from './data/transactionData.json';

const DTransaction = () => {
  const [currentTransaction, setCurrentTransaction] = useState(0);
  useEffect(() => {
    setCurrentTransaction(currentTransaction);
  }, [currentTransaction]);

  return (
    <div className='transaction-wrapper'>
      <div className='transaction-content-column'>
        <DTransactionHead
          transactionData={transactionData.superTransaction.transactions[currentTransaction]}
        />
        <div className='transaction-content'>
          <Routes>
            <Route index element={<IndividualDetails />} />
            <Route path='customer-profile/' element={<IndividualDetails />} />
            <Route path='address/' element={<Address />} />
            <Route path='contact/' element={<Contact />} />
            <Route path='new-id-details/' element={<NewIdDetails />} />
            <Route path='fees/' element={<Fees />} />
            <Route path='passport/' element={<Passport />} />
            <Route path='proof/' element={<ProofOfIdentity />} />
            <Route path='scan/' element={<Scan />} />
            <Route path='payment-summary/' element={<PaymentSummary />} />
            <Route path='print/' element={<Print />} />
            <Route path='vision/' element={<Vision />} />
            <Route path='driver-license/' element={<DriverLicense />} />
            <Route path='board-elections/' element={<BoardOfElections />} />
          </Routes>
        </div>
        <DTransactionNav steps={transactionData.flow} />
      </div>
      <div className='transaction-progress'>
        <DProgressStepper steps={transactionData.flow} />
      </div>
    </div>
  );
};

export default DTransaction;
