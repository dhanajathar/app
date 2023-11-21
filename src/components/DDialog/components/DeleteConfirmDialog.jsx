import {useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { styled } from '@mui/material/styles';
import '../DDialog.css';


const DeleteConfirmDialog = (props) => {
  const onHandleClose = () => {
    props.close();
    props.onConfirmClick();
  };

  const onCancelClose = () => {
    props.close();
    props.onCloseButtonClick();
  };

  const DeleteConfirmationDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": { maxWidth: "auto", maxHeight: "auto", padding: '1.5rem' }
  }));

  return (
    <>
      <DeleteConfirmationDialog className='dialog' open={props.open} >

          <DialogTitle className="d-dialog-data-center d-dialog-font-bold"> Confirm Deletion </DialogTitle>
          <DialogContent className="data-center">
            Are you sure you want to {props.data}?
          </DialogContent>
          <DialogActions className="d-dialog-btn-center">
            <Button
              variant="outlined"
              autoFocus
              onClick={onCancelClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onHandleClose}
            >
              Confirm
            </Button>
          </DialogActions>
        </DeleteConfirmationDialog>
    </>
  );
}

export default DeleteConfirmDialog;
