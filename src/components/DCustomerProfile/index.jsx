import './index.css';

import { DEventService, DEvents } from '../../services/DEventService';
import React, { useState } from 'react';

import AddressFragment from './fragments/Address';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BoardOfElectionsFragment from './fragments/BoardOfElections';
import { Button } from '@mui/material';
import ContactFragment from './fragments/Contact';
import DlIdCard from './fragments/DdlIdCard';
import IndividualDetailsFragment from './fragments/IndividualDetails';
import MuiTabs from '../DTabs/MuiTabs';
import ProfileContent from './fragments/ProfileContent';
import ProofOfIdentityFragment from './fragments/ProofOfIdentity';
import Vehicles from './fragments/Vehicles';
import Withdrawal from './fragments/Withdrawal';

const BACK = 'Back';
const SELECT_TRANSACTION = 'Select Transaction';
const USER_NAME = 'DWAYNE LEMARR TYYLER';
const CUSTOMER_ID = 'f83c7ae0-218c-4247-8c9c-4c1d8957870e';

export default function DCustomerProfile() {
  const [citizen, setCitizen] = useState(true);
  const citizenType = type => {
    setCitizen(type);
  };
  const tabs = [
    {
      classes: '',
      tabName: 'Individual Details',
      tabContent: <IndividualDetailsFragment citizenType={citizenType} />
    },
    { classes: '', tabName: 'Address', tabContent: <AddressFragment /> },
    { classes: '', tabName: 'Contact', tabContent: <ContactFragment /> },
    {
      classes: '',
      tabName: 'Proof of Identity',
      tabContent: <ProofOfIdentityFragment citizen={citizen} />
    },
    { classes: '', tabName: 'Board Of Elections', tabContent: <BoardOfElectionsFragment /> },
    { classes: '', tabName: 'DL / ID Card', tabContent: <DlIdCard /> },
    { classes: '', tabName: 'Vehicles', tabContent: <Vehicles /> },
    { classes: '', tabName: 'Withdrawal', tabContent: <Withdrawal /> }
  ];

  const handleSelectClick = e => {
    e.preventDefault();
    DEventService.dispatch(DEvents.ROUTE, {
      detail: { path: `/select-transaction?${CUSTOMER_ID}`, payload: { CUSTOMER_ID } }
    });
  };

  return (
    <React.Fragment>
      <div className='profile-page'>
        <div className='page-heading'> {USER_NAME} </div>

        <div className='tab-content'>
          <MuiTabs className='search-results-tab' profileContent={<ProfileContent />} tabs={tabs} />

          <div className='d-flex-between'>
            <div> </div>
            <div>
              <Button variant='outlined' color='inherit' startIcon={<ArrowBackIosIcon />}>
                {' '}
                {BACK.toUpperCase()}{' '}
              </Button>
              <Button
                className='select-button'
                onClick={event => handleSelectClick(event)}
                variant='contained'
                color='primary'
                endIcon={<ArrowForwardIosIcon />}
              >
                {' '}
                {SELECT_TRANSACTION.toUpperCase()}{' '}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
