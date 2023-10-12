import React from 'react';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <div className='tab-content'>{children}</div>
    </div>
  );
};

export default TabPanel;
