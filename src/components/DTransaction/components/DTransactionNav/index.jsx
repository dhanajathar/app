import './index.css';

import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

export default function DTransactionNav({ steps = [] }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleReason = event => {
    setReason(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const reasons = ['Boredom', 'Indifference', 'Funk', 'Better Things To Do', 'Spite'];

  const isButtonDisabled = () => {
    return reason === '';
  };

  const handleConfirm = e => {
    DEventService.dispatch(DEvents.ROUTE, {
      detail: { path: '/dashboard' }
    });
  };

  let currentStep = 0;
  let currentSub = 0;

  const [showBack, setShowBack] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const [backText, setBackText] = useState('Back');
  useEffect(() => {
    setBackText(backText);
  }, [backText]);

  const [backPath, setBackPath] = useState('');
  useEffect(() => {
    setBackPath(backPath);
  }, [backPath]);

  const [nextText, setNextText] = useState('Next');
  useEffect(() => {
    setNextText(nextText);
  }, [nextText]);

  const [nextPath, setNextPath] = useState('');
  useEffect(() => {
    setNextPath(nextPath);
  }, [nextPath]);

  const [nextRoot, setNextRoot] = useState(false);
  useEffect(() => {
    setNextRoot(nextRoot);
  }, [nextRoot]);

  const updateNav = e => {
    steps.forEach((item, index) => {
      if (!e.detail.substep) {
        if (
          item.label === e.detail.label &&
          (e.detail.flowId === null || Number(e.detail.flowId) === item.flowId)
        ) {
          currentStep = index;
          if (currentStep !== 0) {
            setShowBack(true);
            setBackPath(steps[currentStep - 1].path);
            setBackText(steps[currentStep - 1].label);
          } else {
            setShowBack(false);
          }
          if (currentStep !== steps.length - 1) {
            setShowNext(true);
            setNextRoot(true);
            setNextText(steps[currentStep + 1].label);
            setNextPath(steps[currentStep + 1].path);
          } else {
            setShowNext(false);
            setNextRoot(false);
          }
          return;
        }
      }
      if (e.detail.substep) {
        if (item.subSteps) {
          item.subSteps.forEach((i, idx) => {
            if (
              i.label === e.detail.label &&
              (e.detail.flowId === null || Number(e.detail.flowId) === i.flowId)
            ) {
              currentStep = index;
              currentSub = idx;
              if (currentSub !== 0) {
                setBackPath(steps[currentStep].subSteps[currentSub - 1].path);
                setBackText(steps[currentStep].subSteps[currentSub - 1].label);
                setShowBack(true);
              } else {
                if (currentStep === 0) {
                  setShowBack(false);
                } else {
                  setBackPath(steps[currentStep - 1].path);
                }
              }
              if (currentSub !== steps[currentStep].subSteps.length - 1) {
                setNextRoot(false);
                setNextPath(steps[currentStep].subSteps[currentSub + 1].path);
                setNextText(steps[currentStep].subSteps[currentSub + 1].label);
              } else if (currentStep !== steps.length) {
                setNextRoot(true);
                setNextText(steps[currentStep + 1].label);
                setNextPath(steps[currentStep + 1].path);
              }
            }
          });
        }
      }
    });
  };

  useEffect(() => {
    DEventService.subscribe(DEvents.PROGRESS, updateNav);
    return () => {
      DEventService.unsubscribe(DEvents.PROGRESS, updateNav);
    };
  }, [updateNav]);

  return (
    <div className='transaction-nav'>
      <div className='transaction-nav-left'>
        <Button onClick={handleClickOpen}>Interrupt Transaction</Button>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className=''>Interrupt Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText className='dialog-text'>
            Please Provide a Reason for interrupting the transaction.
          </DialogContentText>
          <FormControl fullWidth className='dialog-form'>
            <InputLabel id='reason-select-label'>Reason</InputLabel>
            <Select
              labelId='reason-select-label'
              id='reason-select'
              value={reason}
              label='Reason'
              onChange={handleReason}
            >
              {reasons.map((item, idx) => (
                <MenuItem key={idx} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            className='page-title-text dialog-form'
            id='comment-field'
            label='Comment'
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={isButtonDisabled()} variant='contained' onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <div className='transaction-nav-right'>
        {showBack && (
          <>
            <Button id='backButton' startIcon={<ArrowBackIos />} onClick={() => navigate(backPath)}>
              {backText}
            </Button>
            <span className='transaction-nav-divider'>|</span>
          </>
        )}
        <Button
          endIcon={<ArrowForwardIos />}
          variant={nextRoot ? 'contained' : 'text'}
          className={nextRoot ? 'next-root-button' : ''}
          id='nextButton'
          onClick={() => navigate(nextPath)}
        >
          {nextText}
        </Button>
      </div>
    </div>
  );
}
