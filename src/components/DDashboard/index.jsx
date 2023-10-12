import './index.css';

import * as React from 'react';

import { DEventService, DEvents } from '../../services/DEventService';

import { DStorageService } from '../../services/DStorageService';
import iCoffetable from './assets/coffee-table.png';
import iScan from './assets/scan.png';
import iSearch from './assets/search.png';

export default function DDashboard() {
  const storage = new DStorageService(window.sessionStorage);
  const dispatchScanRoute = e => {
    e.preventDefault();
    alert('The future link to Scan Code. Stay tuned ✔️');
  };

  const dispatchSearchRoute = e => {
    e.preventDefault();
    storage.remove('search');
    DEventService.dispatch(DEvents.ROUTE, { detail: { path: '/search', payload: 'funk' } });
  };

  return (
    <React.Fragment>
      <div className='dash-container'>
        <div className='dash-head'>
          <div>
            <h1 className='headtext'>Good morning! John</h1>
            <div className='sub-head'>
              You’ve <span className={'todo-item'}> 1 pending work </span> at this time.
            </div>
          </div>
          <div>
            <img src={iCoffetable} loading='lazy' />
          </div>
        </div>
        <div className='dash-menu-head'> What do you want to do? </div>

        <div className='dash-cards-container'>
          <button onClick={dispatchSearchRoute}>
            <div className='dash-card'>
              <div className='dash-card-content'>
                <img src={iSearch} />
                <div className='dash-card-text'>Customer Search</div>
              </div>
            </div>
          </button>

          <button onClick={dispatchScanRoute}>
            <div className='dash-card'>
              <div className='dash-card-content'>
                <img src={iScan} />
                <div className='dash-card-text'>Scan a QR code</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
