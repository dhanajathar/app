/*
 * Author: Priyanka Pandey
 * Created: 2023-12-05
 * Last Modified: 
 * Description: This is reusable component for displaying all four types of notification i.e. Success, Error, Warning, Info
 * Application Release Version:1.0.0
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import prop-types library
import './DNotification.css';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DNotification = ({ open, onClose, severity, message, autoHideDuration }) => { 
  const [showNotification, setShowNotification] = useState(open);

  useEffect(() => {
    setShowNotification(open)
  },[open]);

  useEffect(() => {
    if (open) { 
      const timeoutId = setTimeout(() => {
        setShowNotification(false);
        if (onClose) {
          onClose();
        }
      }, autoHideDuration);

      return () => clearTimeout(timeoutId);
    }
  }, [open, autoHideDuration, onClose]);

  const handleClose = () => {
    setShowNotification(false);
    if (onClose) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningAmberIcon />;
      case 'info':
        return <ErrorIcon />;
      default:
        return null;
    }
  };

  return (
    <div className={`d-notification ${showNotification ? 'show' : 'hide'} ${severity}`}>
      <div className="notification-content">
        <div className="icon">{getIcon()}</div>
        <div className="message">{message}</div>
        <button className="close-button" onClick={handleClose}>
          &#x2715;
        </button>
      </div>
    </div>
  );
};

DNotification.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  severity: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  message: PropTypes.string.isRequired,
  autoHideDuration: PropTypes.number,
};

export default DNotification;
