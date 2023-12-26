import { useState } from 'react';
import PropTypes from 'prop-types';
import '../DDialog.css';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField
} from '@mui/material';

import options from '../data/api-reasons-list.json';
import userData from '../../DTransaction/pages/IndividualDetails/api-individual-details.json';

const SupOverrideDialog = props => {
  const { open, close, data, onSubmitClick } = props;

  SupOverrideDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    data: PropTypes.string.isRequired,
    onSubmitClick: PropTypes.func.isRequired
  };

  const { personalInformation } = userData;
  const [lastName, setLastName] = useState(personalInformation.lastName);
  const [firstName, setFirstName] = useState(personalInformation.firstName);
  const [showComments, setShowComments] = useState(false);
  const [loginID, setLoginID] = useState(null);
  const [password, setPassword] = useState(null);
  const [reason, setReason] = useState(null);
  const [comments, setComments] = useState(null);

  const onHandleCancel = () => {
    close();
    setShowComments(false);
  };

  const onHandleSubmit = () => {
    close();
    onSubmitClick();
    setShowComments(false);
  };

  return (
    <Dialog maxWidth='xs' className='dialog supervisor-dialog' open={open}>
      <div className='d-dialog-requester-container'>
        <div className='d-dialog-requester'>
          <span className='d-dialog-requester-title'> Requester </span>
          <div className='d-dialog-requester-user'>{`${firstName.value} ${lastName.value}`} </div>
        </div>
      </div>

      <DialogTitle> Supervisor Override </DialogTitle>
      <DialogContent>
        Supervisor Override is necessary to {data}.
        <div className='d-row'>
          <div className='col col-md-6'>
            <TextField
              id='login-input'
              value={loginID}
              label='Login ID'
              fullWidth
              onChange={e => setLoginID(e.target.value)}
            />
          </div>
          <div className='col col-md-6'>
            <TextField
              id='password-input'
              value={password}
              label='Password'
              type='password'
              fullWidth
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className='col col-md-12'>
            <FormControl fullWidth>
              <Autocomplete
                id='cReasonOverride'
                value={reason}
                options={options}
                renderInput={params => <TextField {...params} label='Reason for Override' />}
                onChange={(e, value) => {
                  setReason(value);
                  value === 'OTHER' ? setShowComments(true) : setShowComments(false);
                }}
              />
            </FormControl>
          </div>
          {showComments && (
            <div className='col col-md-12' fullWidth>
              <TextField
                id='comment-input'
                value={comments}
                label='Comment'
                multiline
                rows={3}
                fullWidth
                onChenge={e => setComments(e.target.value)}
              />
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' autoFocus onClick={onHandleCancel}>
          Cancel
        </Button>
        <Button variant='contained' onClick={onHandleSubmit}>
          submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupOverrideDialog;
