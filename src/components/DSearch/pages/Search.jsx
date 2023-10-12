import { Button, Card } from '@mui/material';
import { DEventService, DEvents } from '../../../services/DEventService';
import React, { useEffect, useRef, useState } from 'react';

import BusinessInformation from './fragments/BusinessInformation';
import BusinessPrincipal from './fragments/BusinessPrincipal';
import BusinessSalesPerson from './fragments/BusinessSalesPerson';
import Check from './fragments/Check';
import { DStorageService } from '../../../services/DStorageService';
import DocumentNumberForm from './fragments/DocumentNumberForm';
import Email from './fragments/Email';
import Employee from './fragments/Employee';
import MuiTabs from '../../DTabs/MuiTabs';
import PersonalDetails from './fragments/PersonalDetails';
import SuperTransactionId from './fragments/SuperTransactionId';
import Tag from './fragments/Tag';
import Title from './fragments/Title';
import TransactionId from './fragments/TransactionId';
import VIN from './fragments/VIN';
import { useNavigate } from 'react-router-dom';

export function Search() {
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);
  const tabRef = useRef();
  const storage = new DStorageService(window.sessionStorage);
  const sessionData = storage.get('search');
  const defaultFormData = {
    individual: {
      documentNumber: {
        documentType: 'dlidcard',
        idCard: '',
        ssnumber: '',
        disabilityCard: ''
      },
      personalDetails: {
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: null,
        email: '',
        suffix: '',
        gender: ''
      }
    },
    selectedTab: 'transactions'
  };
  const [formData, setFormData] = useState(sessionData ? sessionData : defaultFormData);
  const [typeVal, setTypeVal] = useState(formData.selectedTab);

  const employeeRef = useRef();

  const handleFormChange = event => {
    const tabIndex = tabRef?.current.getSelectedTabIndex();
    const key = Object.keys(formData[typeVal])[tabIndex];
    const { name, value } = event.target || event;
    setFormData(prevFormData => ({
      ...prevFormData,
      [typeVal]: {
        ...prevFormData[typeVal],
        [key]: {
          ...prevFormData[typeVal][key],
          [name]: value
        }
      }
    }));
  };

  const handleButtonDisable = (isDisable, index) => {
    if (tabRef?.current.getSelectedTabIndex() === index) {
      setIsDisabled(isDisable);
    } else {
      setIsDisabled(false);
    }
  };

  const handleCustomerProfileClick = () => {
    updateSearchData();
    // DEventService.dispatch(DEvents.ROUTE, {
    //   detail: { path: `/customer-profile` }
    // });
  };

  const updateSearchData = () => {
    const data = {
      ...formData,
      selectedTab: typeVal,
      selectedSubTab: tabRef?.current?.getSelectedTabIndex()
    };
    storage.set('search', data);
  };

  const handleSearchHistory = () => {
    if (typeVal === 'individual') {
      updateSearchData();
      navigate('/search/search-history');
    }
  };
  const handleSearchClick = () => {
    if (typeVal === 'individual') {
      handleCustomerProfileClick();
      updateSearchData();
    } else {
      navigate('/search/search-results', { state: { type: typeVal } });
    }
  };

  const handleTabClick = e => {
    setIsDisabled(false);
    setTypeVal(e.target.id);
    updateSearchData();
  };

  const handleClearButton = () => {
    if (typeVal === 'employee') {
      employeeRef.current.implementResetForm();
    }
    setFormData(defaultFormData);
    storage.remove('search');
  };
  const searchTypeList = [
    {
      name: 'Transactions',
      id: 'transactions'
    },
    {
      name: 'Individual',
      id: 'individual'
    },
    {
      name: 'Business',
      id: 'business'
    },
    {
      name: 'Vehicle',
      id: 'vehicle'
    },
    {
      name: 'Employee',
      id: 'employee'
    },
    {
      name: 'Check',
      id: 'check'
    },
    {
      name: 'Email',
      id: 'email'
    }
  ];

  const transTabs = [
    {
      classes: '',
      tabName: 'Super Transaction ID',
      tabContent: <SuperTransactionId />
    },
    {
      classes: '',
      tabName: 'Transaction ID',
      tabContent: <TransactionId />
    }
  ];

  const indTabs = [
    {
      classes: '',
      tabName: 'DOCUMENT NUMBER',
      tabContent: (
        <DocumentNumberForm
          formData={formData.individual.documentNumber}
          handleFormChange={handleFormChange}
          onButtonDisabled={handleButtonDisable}
        />
      )
    },
    {
      classes: '',
      tabName: 'PERSONAL DETAILS',
      tabContent: (
        <PersonalDetails
          formData={formData.individual.personalDetails}
          handleFormChange={handleFormChange}
          onButtonDisabled={handleButtonDisable}
        />
      )
    }
  ];

  const busTabs = [
    {
      classes: '',
      tabName: 'BUSINESS INFORMATION',
      tabContent: <BusinessInformation />
    },
    {
      classes: '',
      tabName: 'PRINCIPAL',
      tabContent: <BusinessPrincipal />
    },
    {
      classes: '',
      tabName: 'SALES PERSON',
      tabContent: <BusinessSalesPerson />
    }
  ];

  const vehTabs = [
    {
      classes: '',
      tabName: 'TAG',
      tabContent: <Tag />
    },
    {
      classes: '',
      tabName: 'VIN',
      tabContent: <VIN />
    },
    {
      classes: '',
      tabName: 'TITLE',
      tabContent: <Title />
    }
  ];

  return (
    <React.Fragment>
      <div className='page-container'>
        <div className='search-title-text'>Destiny Search for</div>
        <Card className='search-card'>
          <div className='search-menu'>
            {searchTypeList.map((item, index) => {
              return (
                <div
                  id={item.id}
                  className={`search-menu-item ${
                    typeVal === item.id ? 'search-menu-item-active' : ''
                  }`}
                  key={`${index}`}
                  onClick={handleTabClick}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
          <div className='search-field-box'>
            {typeVal === 'transactions' && <MuiTabs tabs={transTabs} />}
            {typeVal === 'individual' && (
              <MuiTabs ref={tabRef} selectedTab={formData.selectedSubTab} tabs={indTabs} />
            )}
            {typeVal === 'business' && <MuiTabs tabs={busTabs} />}
            {typeVal === 'vehicle' && <MuiTabs tabs={vehTabs} />}
            {typeVal === 'employee' && (
              <Employee
                ref={employeeRef}
                shouldDisableSearch={disable => {
                  setIsDisabled(disable);
                }}
              />
            )}
            {typeVal === 'check' && <Check />}
            {typeVal === 'email' && <Email />}
          </div>
        </Card>
        <div className='search-buttons'>
          <div>
            {typeVal === 'employee' && (
              <Button
                onClick={() => {
                  navigate('/dashboard');
                }}
                variant='outlined'
              >
                Cancel
              </Button>
            )}
          </div>
          <div>
            <Button variant='contained' color='primary' onClick={handleClearButton}>
              CLEAR
            </Button>
            {typeVal !== 'employee' && (
              <Button onClick={handleSearchHistory} variant='outlined'>
                Search History
              </Button>
            )}

            <Button
              variant='contained'
              color='primary'
              disabled={isDisabled}
              onClick={handleSearchClick}
            >
              SEARCH
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
