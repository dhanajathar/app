import React, { useState, useMemo } from 'react';
import './DAlertBox.css';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const DAlertBox = ({ errorText, warningText }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const divStyle = useMemo(
    () => ({
      overflow: expanded ? 'visible' : 'hidden',
      textOverflow: expanded ? 'clip' : 'ellipsis',
      whiteSpace: expanded ? 'normal' : 'nowrap'
    }),
    [expanded]
  );

  return (
    <>
      {' '}
      {(errorText || warningText) && (
        <div className={warningText ? 'warning-box arrow-box' : 'error-box arrow-box'}>
          <ErrorOutlineOutlinedIcon className='error-icon' />
          <div style={divStyle} onClick={toggleExpansion}>
            <span>{errorText ? errorText : warningText}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default DAlertBox;
