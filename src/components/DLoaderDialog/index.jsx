/*
 * Component Name: DLoaderDialog
 * Author: Priyanka Pandey
 * Created: 2023-09-01
 * Last Modified: 2023-12-28
 * Description: this is reusable component for Loader inside the dialog box..
 * Application Release Version:1.0.0
 */
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
