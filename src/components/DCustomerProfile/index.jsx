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
import VersionHistory from './components/VersionHistory/VersionHistory';

const BACK = 'Back';
const SELECT_TRANSACTION = 'Select Transaction';
const USER_NAME = 'DWAYNE LEMARR TYYLER';
const CUSTOMER_ID = 'f83c7ae0-218c-4247-8c9c-4c1d8957870e';

export default function DCustomerProfile({ isSearchCertifier = false, onCancel, onBackPage, onSelectUser }) {
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
    { classes: '', tabName: 'Withdrawal', tabContent: <Withdrawal /> },
    { classes: '', tabName: 'Tags', tabContent: <> </> },
    { classes: '', tabName: 'Convictions', tabContent: <></> }
  ];

  const handleSelectClick = e => {
    e.preventDefault();
    DEventService.dispatch(DEvents.ROUTE, {
      detail: { path: `/select-transaction?${CUSTOMER_ID}`, payload: { CUSTOMER_ID } }
    });
  };

  const renderProfileContent = () => {
    return <><div className='user-profile'>
      <div className='profile-content'>
        {' '}
        <ProfileContent />{' '}
      </div>
      <div className='tabs-wrapper'>
        <MuiTabs
          tabAction={<VersionHistory />}
          contentClass='tab-content-scroll'
          selectedTab={isSearchCertifier ? 1 : null}
          tabs={tabs}
        />
      </div>
    </div>
    </>
  }

  return (
    <div className={ isSearchCertifier ? 'search-certifier profile-page': 'profile-page'}>
      <div className='page-heading'> {USER_NAME} </div>
      <div className='tab-content'>
        {renderProfileContent()}
        <div className='action-buttons'>
          <div> {isSearchCertifier && <Button onClick={() => onCancel()} variant='text'  > Cancel </Button>} </div>
          <div className='right-buttons'>
            <Button onClick={()=> isSearchCertifier && onBackPage()} variant='outlined'  startIcon={<ArrowBackIosIcon />}>
              {' '}
              {BACK.toUpperCase()}{' '}
            </Button>
          <div className='divider'></div>
            {isSearchCertifier ?  <Button
          onClick={() => onSelectUser()}
          variant='contained'
          color='primary'
          endIcon={<ArrowForwardIosIcon />}
        >
          SELECT & VERIFY CERTIFIER
        </Button> :
            <Button 
              onClick={event => handleSelectClick(event)}
              variant='contained'
              color='primary'
              endIcon={<ArrowForwardIosIcon />}
            >
              {' '}
              {SELECT_TRANSACTION.toUpperCase()}{' '}
            </Button>}
          </div>
        </div>
      </div>
    </div> 
  );
}
