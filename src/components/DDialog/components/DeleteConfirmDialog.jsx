import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import '../DDialog.css';

const DeleteConfirmDialog = props => {
  const { open, close, data, onConfirmClick, onCloseButtonClick } = props;

  DeleteConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    data: PropTypes.string.isRequired,
    onConfirmClick: PropTypes.func.isRequired,
    onCloseButtonClick: PropTypes.func.isRequired
  };

  const onHandleClose = () => {
    close();
    onConfirmClick();
  };

  const onCancelClose = () => {
    close();
    onCloseButtonClick();
  };

  return (
    <>
      <Dialog className='dialog confirmation-dialog' open={open}>
        <DialogTitle className='d-dialog-data-center d-dialog-font-bold'>
          {' '}
          Confirm Deletion{' '}
        </DialogTitle>
        <DialogContent className='data-center'>Are you sure you want to {data}?</DialogContent>
        <DialogActions className='d-dialog-btn-center'>
          <Button variant='outlined' autoFocus onClick={onCancelClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={onHandleClose}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteConfirmDialog;
