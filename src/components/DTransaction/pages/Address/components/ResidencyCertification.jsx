import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Search } from '../../../../DSearch/pages/Search';
import VerifyCertifier from './VerifyCertifier';
import DCustomerProfile from '../../../../DCustomerProfile';
import { CertifierResult } from './CertifierResult';
import DNotification from '../../../../DNotification';
import { SearchHistory } from '../../../../DSearch/pages/SearchHistory';
import DeleteConfirmDialog from '../../../../DDialog/components/DeleteConfirmDialog';

function ResidencyCertification({ isFormDisabled, formData, onResidencyCertification, onResidencyCertificationStatus }) {
  const {
    residencyCertification: { certifiedInfo, isCertification, residencyCertificationStatus }
  } = formData;
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dialogState, setDialogState] = useState('search');
  const [showAlert, setShowAlert] = useState(false);

  const calculateAge = dob => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      month = 12 + month;
      age--;
    }
    return `${age} year(s) ${month} months`;
  };

  const handleCertifierDelete = () => {
    setOpenDeleteDialog(false);
    onResidencyCertificationStatus(false);
    setShowAlert(true);
  };

  const handleSubmit = async () => {
    setOpenSearchDialog(false);
    onResidencyCertificationStatus(true);
  };

  const handleSearch = data => {
    const options = {
      url: '/src/components/DTransaction/pages/Address/api-address.json',
      method: 'GET'
    };

    axios(options)
      .then(response => {
        const searchData = response.data?.SearchResult?.results; // Updated path
        const searchQuery = data.individual.documentNumber.idCard;
        const filteredResults = searchData.filter(result => {
          return result.DLCard.includes(searchQuery);
        });
        if (filteredResults.length == 0) {
          setDialogState('userNotFound');
        } else {
          setDialogState('result');
        }
      })
      .catch(() => {
        setDialogState('userFound');
      });
  };

  const handleRowClick = () => {
    setDialogState('userFound');
  };

  const renderDialogContent = () => {
    switch (dialogState) {
      case 'search':
        return (
          <Search
            isSearchCertifier
            onCancel={() => setOpenSearchDialog(false)}
            onSearchHistory={() => setDialogState('searchHistory')}
            onSearch={data => handleSearch(data)}
          />
        );
      case 'searchHistory':
        return (
          <SearchHistory
            isSearchCertifier
            onBackPage={() => setDialogState('search')}
            onUserDetails={() => handleRowClick()}
          />
        );
      case 'result':
        return (
          <CertifierResult
            onUserDetails={() => handleRowClick()}
            onBackPage={() => setDialogState('search')}
            onCancel={() => setOpenSearchDialog(false)}
          />
        );
      case 'userNotFound':
        return (
          <div className='not-found'>
            <img
              src={'/src/components/DSearch/assets/tempImage.png'}
              alt='no search results graphic'
              width='150'
              height='164'
            />
            <div className='search-found-title'>No results Found</div>
            <div className='search-found-subtitle'>
              Sorry, we couldn't find what you are looking for.
            </div>
            <div onClick={() => setDialogState('search')} className='search-found-link'>
              Try searching again
            </div>
            <Button onClick={() => setOpenSearchDialog(false)} variant='text'>
              Cancel
            </Button>
          </div>
        );
      case 'userFound':
        return (
          <DCustomerProfile
            isSearchCertifier
            onCancel={() => setOpenSearchDialog(false)}
            onBackPage={() => setDialogState('search')}
            onSelectUser={() => setDialogState('userSelected')}
          />
        );
      case 'userSelected':
        return (
          <VerifyCertifier onCancel={() => setOpenSearchDialog(false)} onSubmit={handleSubmit} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className='d-row certifications-wrapper'>
        <div className='col col-sm-12 col-md-4'>
          <FormControl disabled={isFormDisabled} fullWidth size='small'>
            <InputLabel id='residencyCertification'>Residency Certification</InputLabel>
            <Select
              labelId='residencyCertification'
              id='residencyCertification'
              value={isCertification}
              label='Residency Certification'
              onChange={e => onResidencyCertification(e.target.value)}
            >
              <MenuItem value={'YES'}>YES</MenuItem>
              <MenuItem value={'NO'}>NO</MenuItem>
            </Select>
          </FormControl>
        </div>
        {isCertification === 'YES' && (
          <div className='col col-sm-12 col-md-4'>
            <Button
              variant='contained'
              disabled={residencyCertificationStatus}
              onClick={() => {
                setOpenSearchDialog(true);
                setDialogState('search');
              }}
            >
              SEARCH CERTIFIER{' '}
            </Button>
          </div>
        )}
      </div>
      {residencyCertificationStatus && isCertification === 'YES' && (
        <div className='address-status certifications-status-wrapper'>
          <div className='certifier-header'>
            <div className='certifier-header-text'> Certifier Information </div>
            <DeleteOutlineIcon
              onClick={() => setOpenDeleteDialog(true)}
              className='delete-address'
            />
          </div>
          <div className='d-row'>
            <div className='col col-sm-12 col-md-8'>
              <TextField
                fullWidth
                name='certifier'
                disabled
                size='small'
                defaultValue={certifiedInfo.certifierFullName}
                label='Certifier Full Name'
              />
            </div>
            <div className='col col-sm-12 col-md-4'>
              <div className={'date-picker'}>
                <TextField
                  fullWidth
                  name='dateOfBirth'
                  disabled
                  size='small'
                  label='Date of Birth'
                  defaultValue={certifiedInfo.dateOfBirth}
                >
                  {' '}
                </TextField>
                {certifiedInfo.dateOfBirth && (
                  <div className='date-helper-text'>{calculateAge(certifiedInfo.dateOfBirth)}</div>
                )}
              </div>
            </div>
          </div>
          <div className='d-row'>
            <div className='col col-sm-12 col-md-4'>
              <TextField
                fullWidth
                name='driverLicense'
                disabled
                size='small'
                defaultValue={certifiedInfo.driverLicense}
                label='Driver License'
              />
            </div>
            <div className='col col-sm-12 col-md-4'>
              <TextField
                disabled
                fullWidth
                size='small'
                label='Expiration Date'
                defaultValue={certifiedInfo.expirationDate}
              >
                {' '}
              </TextField>
            </div>
          </div>
        </div>
      )}
      <Dialog
        className='search-dialog'
        open={openSearchDialog}
        onClose={() => setOpenSearchDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {dialogState == 'userSelected' && (
          <DialogTitle id='alert-dialog-title'> Verify Certifier </DialogTitle>
        )}
        <DialogContent>{renderDialogContent()}</DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={openDeleteDialog}
        close={() => setOpenDeleteDialog(false)}
        data={' Are you sure you want to delete certifier information?'}
        onCloseButtonClick={() => setOpenDeleteDialog(false)}
        onConfirmClick={handleCertifierDelete}
      />






      <DNotification
        open={showAlert}
        autoHideDuration={6000}
        severity='success'
        message=' Certifier information deleted successfully!'
        onClose={() => setShowAlert(false)}
      >
        {' '}
      </DNotification>
    </>
  );
}

export default ResidencyCertification;
ResidencyCertification.propTypes = {
  isFormDisabled: PropTypes.bool,
  formData: PropTypes.shape({
    residencyCertification: PropTypes.shape({
      certifiedInfo: PropTypes.object,
      isCertification: PropTypes.string,
      residencyCertificationStatus: PropTypes.bool
    })
  }),
  onResidencyCertification: PropTypes.func,
  onResidencyCertificationStatus: PropTypes.func
};
