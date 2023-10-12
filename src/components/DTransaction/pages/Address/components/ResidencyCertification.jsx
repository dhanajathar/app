import React, { useState } from 'react';
import data from '../api-address.json';
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
  DialogActions,
  Checkbox,
  FormHelperText,
  DialogContentText,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function ResidencyCertification() {
  const {
    relationShipList,
    documentList,
    residencyCertification: { certifiedInfo, isCertification }
  } = data;
  const [residencyCertification, setResidencyCertification] = useState(isCertification);
  const [residencyCertificationStatus, setResidencyCertificationStatus] = useState();
  const [relationShip, setRelationsShip] = useState();
  const [primaryDocument, setPrimaryDocument] = useState();
  const [secondaryDocument, setSecondaryDocument] = useState();
  const [openSearchDialog, setOpenSearchDialog] = useState();
  const [relationShipError, setRelationShipError] = useState();
  const [primaryDocumentError, setpPrimaryDocumentError] = useState();
  const [secondaryDocumentError, setsecondaryDocumentError] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showAlert, setShowAlert] = useState();

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
    setResidencyCertificationStatus(false);
    setShowAlert(true)
  };

  const handleSubmit = async () => {
    setOpenSearchDialog(false);
    setResidencyCertificationStatus(true);
  };

  return (
    <>
      <div className='d-row certifications-wrapper'>
        <div className='col col-sm-12 col-md-4'>
          <FormControl fullWidth>
            <InputLabel id='residencyCertification'>Residency Certification</InputLabel>
            <Select
              labelId='residencyCertification'
              id='residencyCertification'
              value={residencyCertification}
              label='Residency Certification'
              onChange={e => setResidencyCertification(e.target.value)}
            >
              <MenuItem value={'YES'}>YES</MenuItem>
              <MenuItem value={'NO'}>NO</MenuItem>
            </Select>
          </FormControl>
        </div>
        {residencyCertification === 'YES' && (
          <div className='col col-sm-12 col-md-4'>
            <Button
              variant='contained'
              disabled={residencyCertificationStatus}
              onClick={() => setOpenSearchDialog(true)}
            >
              SEARCH CERTIFIER{' '}
            </Button>
          </div>
        )}
      </div>
      {residencyCertificationStatus && residencyCertification === 'YES' && (
        <div className='address-status certifications-status-wrapper'>
          <div className='certifier-header'>
            <div className='certifier-headr-text'> Certifier Information </div>
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
                defaultValue={certifiedInfo.driverLicense}
                label='Driver License'
              />
            </div>
            <div className='col col-sm-12 col-md-4'>
              <TextField
                disabled
                fullWidth
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
        maxWidth={'xl'}
        open={openSearchDialog}
        onClose={() => setOpenSearchDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'> Verify Certifier </DialogTitle>
        <DialogContent>
          <div className='certifier-wrapper'>
            <div className='certifier-title'> Certifier Information</div>
            <div className='d-row'>
              <div className='col col-sm-12 col-md-8'>
                <TextField value={'JONATHAN DOE'} label='Certifier Full Name' disabled fullWidth />
              </div>
              <div className='col col-sm-12 col-md-4'>
                <div className={'date-picker'}>
                  <TextField
                    fullWidth
                    name='dateOfBirth'
                    disabled
                    label='Date of Birth'
                    defaultValue={'12/29/1980'}
                  >
                    {' '}
                  </TextField>
                  <div className='date-helper-text'>{calculateAge('12/29/1980')}</div>
                </div>
              </div>
            </div>
            <div className='d-row'>
              <div className='col col-sm-12 col-md-4'>
                <TextField value={'200 I ST SE'} label='Address Line' disabled fullWidth />
              </div>
              <div className='col col-sm-12 col-md-2'>
                <TextField value={'WASHINGTON'} label='City' disabled fullWidth />
              </div>
              <div className='col col-sm-12 col-md-2'>
                <TextField value={'DC'} label='State' disabled fullWidth />
              </div>
              <div className='col col-sm-12 col-md-2'>
                <TextField value={'20003-3317'} label='ZIP Code' disabled fullWidth />
              </div>
              <div className='col col-sm-12 col-md-2'>
                <TextField value={'UNITED STATES'} label='Country' disabled fullWidth />
              </div>
            </div>
            <div className='d-row'>
              <div className='col col-sm-12 col-md-4'>
                <TextField value={'221122'} label='Driver License' disabled fullWidth />
              </div>
              <div className='col col-sm-12 col-md-4'>
                <TextField value={'04/21/2030'} label='Expiration Date' disabled fullWidth />
              </div>
            </div>

            <div className='certifier-additonal-details'>
              <div className='certifier-title'> Additional Details</div>
              <div className='d-row'>
                <div className='col col-sm-12 col-md-4'>
                  <FormControl fullWidth error={!!relationShipError}>
                    <InputLabel id='relationship'>Relationship</InputLabel>
                    <Select
                      labelId='relationship'
                      id='relationship'
                      value={relationShip}
                      label='Relationship'
                      onBlur={() =>
                        !relationShip
                          ? setRelationShipError('Please select a value for Relationship')
                          : setRelationShipError()
                      }
                      onChange={e => setRelationsShip(e.target.value)}
                    >
                      {relationShipList &&
                        relationShipList.map(item => {
                          return (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {relationShipError ? (
                      <FormHelperText> {relationShipError} </FormHelperText>
                    ) : (
                      <FormHelperText>
                        Certifier can certify unto 4 'OTHER' applicants in a year.{' '}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                {relationShip === 'Other' && (
                  <div className='col col-sm-12 col-md-4'>
                    <TextField fullWidth />
                  </div>
                )}
              </div>
              <div className='d-row'>
                <div className='col col-sm-12 col-md-4'>
                  <FormControl fullWidth error={!!primaryDocumentError}>
                    <InputLabel id='primaryDocument'>Primary Document</InputLabel>
                    <Select
                      labelId='primaryDocument'
                      id='primaryDocument'
                      value={primaryDocument}
                      label='Primary Document'
                      onBlur={() =>
                        !primaryDocument
                          ? setpPrimaryDocumentError('Please select a value for Primary Document')
                          : setpPrimaryDocumentError()
                      }
                      onChange={e => setPrimaryDocument(e.target.value)}
                    >
                      {documentList &&
                        documentList.map(item => {
                          return (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {primaryDocumentError && (
                      <FormHelperText> {primaryDocumentError} </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className='col col-sm-12 col-md-4'>
                  <FormControl fullWidth error={!!secondaryDocumentError}>
                    <InputLabel id='primaryDocument'>Secondary Document</InputLabel>
                    <Select
                      labelId='secondaryDocument'
                      id='secondaryDocument'
                      value={secondaryDocument}
                      label='Secondary Document'
                      onBlur={() =>
                        !primaryDocument
                          ? setsecondaryDocumentError(
                              'Please select a value for Secondary Document'
                            )
                          : setsecondaryDocumentError()
                      }
                      onChange={e => setSecondaryDocument(e.target.value)}
                    >
                      {documentList &&
                        documentList.map(item => {
                          return (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {secondaryDocumentError && (
                      <FormHelperText> {secondaryDocumentError} </FormHelperText>
                    )}
                  </FormControl>
                </div>
              </div>
              <div className='d-row'>
                <div className='col col-md-12'>
                  <Checkbox /> I acknowledge that the above information is verified as per the
                  Residency Certification application
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className='certifier-actions-button'>
          <Button variant='text' onClick={() => setOpenSearchDialog(false)}>
            {' '}
            cancel{' '}
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            autoFocus
            disabled={!relationShip || !primaryDocument || !secondaryDocument}
          >
            Confirm certifier
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete certifier information?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setOpenDeleteDialog(false)}>
            {' '}
            cancel{' '}
          </Button>
          <Button variant='contained' onClick={handleCertifierDelete} autoFocus>
            confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={showAlert} autoHideDuration={6000} anchorOrigin={{horizontal:'bottom', vertical:'center'}} onClose={() => setShowAlert(false)}>
        <Alert onClose={() => setShowAlert(false)} severity="success" sx={{ width: '60%' }}>
        Certifier information deleted successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default ResidencyCertification;
