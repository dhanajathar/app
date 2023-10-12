import './index.css';

import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useEffect, useState } from 'react';

import DBreadcrumb from '../DBreadcrumb';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function DTransactionHead({ transactionData }) {
  const navigate = useNavigate();
  const breadcrumbelements = [transactionData.transactionLabel, 'Individual Details'];
  const personalDetails = {
    fullname: 'Johnny Doe'
  };
  const [editCustomer, setEditCustomer] = useState(false);

  const updateEditCustomer = e => {
    if (e.detail.label === 'Individual Details') {
      setEditCustomer(false);
    } else {
      setEditCustomer(true);
    }
  };

  useEffect(() => {
    DEventService.subscribe(DEvents.PROGRESS, updateEditCustomer);
    return () => {
      DEventService.unsubscribe(DEvents.PROGRESS, updateEditCustomer);
    };
  }, [updateEditCustomer]);

  return (
    <div className='transaction-head'>
      <div className='transaction-head-left'>
        <DBreadcrumb items={breadcrumbelements} transactionInfo={transactionData} />
      </div>
      <div className='transaction-head-right'>
        {editCustomer && (
          <div
            onClick={() => {
              navigate('/');
            }}
            className='customer-edit'
          >
            <div className='customer-title'>Customer</div>
            <div className='customer-container'>
              <Edit color='primary' />
              <h6 className='customer-name'>{personalDetails.fullname}</h6>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
