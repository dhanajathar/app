import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Tab, Tabs } from '@mui/material';

import TabPanel from './TabPanel';

const MuiTabs = forwardRef((props, ref) => {
  const { profileContent, tabs, selectedTab } = props;
  const [value, setValue] = useState(selectedTab ? selectedTab : 0);

  const handleChange = (event, newValue) => setValue(newValue);

  useImperativeHandle(ref, () => ({
    getSelectedTabIndex() {
      return value;
    }
  }));

  return (
    <div className='search-box'>
      {profileContent && <div className='search-box-tabs'>{profileContent}</div>}
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor='primary'
        textColor='primary'
        variant='scrollable'
        scrollButtons='auto'
        aria-label='scrollable auto tabs example'
        className='tab-border'
      >
        {tabs.map((tab, idx) => {
          return <Tab key={`${idx}-tab`} label={tab.tabName} wrapped />;
        })}
      </Tabs>
      {tabs.map((tab, idx) => {
        return (
          <span key={tab.tabName}>
            {value === idx && (
              <TabPanel index={idx} value={value}>
                {tab.tabContent}
              </TabPanel>
            )}
          </span>
        );
      })}
    </div>
  );
});

export default MuiTabs;
