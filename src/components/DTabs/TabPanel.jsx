import React from 'react';

const TabPanel = ({ children, value, contentClass = null, index, ...other }) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {' '}
      {children}
    </div>
  );
};

export default TabPanel;
