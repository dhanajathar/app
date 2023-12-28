import React from 'react';
import { Dialog, DialogContent, CircularProgress } from '@mui/material';
import './DLoaderDialog.css'
const DLoaderDialog = ({ showLoader, loadingText }) => {
  return (
    <Dialog open={showLoader}>
      <DialogContent>
        <div className='loader-wrapper'>
        <CircularProgress size={60} thickness={6} color="primary" /> 
          <div className='loading-text'>{loadingText}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
 
export default React.memo(DLoaderDialog);
