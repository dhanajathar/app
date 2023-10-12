import './index.css';

import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Tooltip
} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import AdditionalAddressDetails from './components/AdditionalAddressDetails';
import CheckIcon from '@mui/icons-material/Check';
import DAlertBox from '../../../DAlertBox';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DialogActions from '@mui/material/DialogActions';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ResidencyCertification from './components/ResidencyCertification';
import WarningAmber from '@mui/icons-material/WarningAmber';
import data from './api-address.json';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';

export default function Address() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');
  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: {
        label: 'Address',
        step: 'Address',
        flowId: flowId,
        substep: true
      }
    });
  }, 100);

  const { streetNames, stateList, countryList } = data;
  const [openDialog, setOpenDialog] = useState(false);
  const [openOverrideDialog, setOpenOverrideDialog] = useState(false);
  const [openStreetDialog, setOpenStreetDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [showAlert, setShowAlert] = useState();
  const PRIMARY = 'PRIMARY';
  const intialData = {
    addressType: 'PRIMARY',
    fromDate: new Date(),
    toDate: null,
    addressDetails: {
      addressLine: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isValidate: null,
      aditionalAddress: {
        preDirectionalCode: '',
        streetnumber: '',
        streetName: '',
        streetNameSuffix: '',
        postDirectionalCode: '',
        apartmentNumber: ''
      },
      overRide: 0,
      ignorAddressVerification: null
    },
    residencyCertification: {
      isCertification: null,
      certifiedInfo: {
        certifierFullName: '',
        dateOfBirth: '',
        driverLicense: '',
        expirationDate: ''
      }
    },
    isExpand: true
  };
  const primaryDefultAddress = {
    ...intialData,
    addressDetails: {
      ...intialData.addressDetails,
      state: 'DC',
      city: 'WA',
      country: 'US'
    }
  };
  const [addresses, setAddresses] = useState([primaryDefultAddress]);

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index][field] = value;
    setAddresses(newAddresses);
  };

  const handleAddressDetailsChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index].addressDetails[field] = value;
    setAddresses(newAddresses);
  };

  const handleAdditionalAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index].addressDetails.aditionalAddress[field] = value;
    setAddresses(newAddresses);
  };

  const handleValidateAddress = index => {
    handleValidation(index);
    if (Object.keys(addresses[index].validationErrors).length === 0) {
      const newAddresses = [...addresses];
      // setting temp is validate flg
      if (newAddresses[index].addressDetails.overRide > 0) {
        newAddresses[index].addressDetails.isValidate = null;
      } else {
        newAddresses[index].addressDetails.isValidate = addresses.length === 1 ? true : false;
      }
      addresses.length > 1 && setOpenStreetDialog(true);
      setAddresses(newAddresses);
    }
  };

  const handleExpand = index => {
    const newAddresses = [...addresses];
    newAddresses[index].isExpand = !newAddresses[index].isExpand;
    setAddresses(newAddresses);
  };

  const handleDeleteAddress = index => {
    setSelectedAddress(index);
    setOpenDialog(true);
  };

  const addAnotherAddress = () => {
    const newAddresses = addresses.map(add => ({ ...add, isExpand: false }));
    const todayDate = new Date();
    const fromDate =
      addresses[0].fromDate?.toDateString() === todayDate?.toDateString()
        ? dayjs(todayDate).add(1, 'day')
        : todayDate;

    setAddresses([
      ...newAddresses,
      {
        ...intialData,
        addressType: 'TEMPORARY',
        fromDate: fromDate,
        toDate: dayjs(todayDate).add(30, 'day')
      }
    ]);
  };

  const handleDelete = () => {
    setOpenDialog(false);
    const updatedAddresses = addresses.filter((address, index) => index !== selectedAddress);
    if (updatedAddresses.length === 1) {
      updatedAddresses[0].isExpand = true;
    }
    setAddresses(updatedAddresses);
    setSelectedAddress(null);
  };

  const getAddressValidate = () => {
    addresses.forEach(e => {
      if (!e.addressDetails.isValidate) {
        return true;
      }
    });
    return false;
  };

  const handleOverRide = () => {
    setOpenOverrideDialog(false);
    const newAddresses = [...addresses];
    const updatedAddress = { ...newAddresses[selectedAddress] };
    updatedAddress.addressDetails = {
      ...updatedAddress.addressDetails,
      isValidate: null,
      overRide: updatedAddress.addressDetails.overRide + 1
    };
    updatedAddress.addressDetails.overRide > 1 &&
      updatedAddress.addressDetails.ignorAddressVerification &&
      setShowAlert(true);
    newAddresses[selectedAddress] = updatedAddress;
    setAddresses(newAddresses);
  };

  const handleIgnoreVerification = () => {
    const newAddresses = [...addresses];
    const updatedAddress = { ...newAddresses[selectedAddress] };
    updatedAddress.addressDetails = {
      ...updatedAddress.addressDetails,
      ignorAddressVerification: true
    };
    newAddresses[selectedAddress] = updatedAddress;
    setAddresses(newAddresses);
    setOpenStreetDialog(false);
    setOpenOverrideDialog(true);
  };

  const handleValidation = index => {
    const specialCharacterPattern = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
    setSelectedAddress(index);
    const updatedAddresses = [...addresses];
    const address = addresses[index];
    const errors = {};
    // Validation logic for each field in the address

    if (!address.addressDetails.addressLine) {
      errors.addressLine = 'Invalid Address Line';
    }

    addresses.forEach((e, i) => {
      if (i !== 0 && i !== index) {
        const errorMsg =
          'More than one temporary address cannot be valid at one time The dates for the temporary addresses were altered to remove an overlap. Please check the new dates';
        if (
          dayjs(address.fromDate).isBefore(e.fromDate) ||
          new Date(e.fromDate).toDateString() === new Date(address.fromDate).toDateString()
        ) {
          errors.fromDate = errorMsg;
        }
        if (
          dayjs(address.toDate).isBefore(e.toDate) ||
          new Date(e.toDate).toDateString() === new Date(address.toDate).toDateString()
        ) {
          errors.toDate = errorMsg;
        }
      }
    });

    if (!address.addressDetails.city || specialCharacterPattern.test(address.addressDetails.city)) {
      errors.city = 'Invalid City';
    }
    if (!address.addressDetails.state) {
      errors.state = 'Invalid State';
    }
    if (!address.addressDetails.country) {
      errors.country = 'Invalid Country';
    }
    if (address.addressDetails.zipCode && address.addressDetails.zipCode.length < 9) {
      errors.zipCode = 'Invalid ZIP Code';
    }
    if (address.addressDetails.overRide > 0) {
      const addtioanlAddress = address.addressDetails.aditionalAddress;
      if (
        !addtioanlAddress.streetnumber ||
        specialCharacterPattern.test(addtioanlAddress.streetnumber)
      ) {
        errors.streetnumber = 'Invalid Street Number';
      }
      if (
        !addtioanlAddress.streetName ||
        specialCharacterPattern.test(addtioanlAddress.streetName)
      ) {
        errors.streetName = 'Invalid Street Name';
      }
      if (!addtioanlAddress.streetNameSuffix) {
        errors.streetNameSuffix = 'Invalid Street Name Suffix';
      }
      if (!addtioanlAddress.postDirectionalCode) {
        errors.postDirectionalCode = 'Invalid Post-Directional Code’';
      }
      if (
        !addtioanlAddress.apartmentNumber ||
        specialCharacterPattern.test(addtioanlAddress.apartmentNumber)
      ) {
        errors.apartmentNumber = 'Invalid Apartment Number';
      }
    }

    updatedAddresses[index].validationErrors = errors;
    setAddresses(updatedAddresses);
  };

  return (
    <div className='d-container'>
      {addresses.map((address, index) => (
        <>
          <div key={`address-${index}`}>
            <div
              className={`address-header ${
                addresses && addresses.length === 1 && 'primary-address-header'
              }`}
            >
              <div className='address-title'>
                {' '}
                {address.addressDetails.addressLine && address.addressDetails.isValidate
                  ? address.addressDetails.addressLine
                  : `${index + 1}. Address`}{' '}
              </div>
              {address.addressType !== PRIMARY && (
                <Tooltip arrow className='d-tooltip' title='Delete' placement='top'>
                  <DeleteOutlineIcon
                    onClick={() => handleDeleteAddress(index)}
                    className='delete-address'
                  />
                </Tooltip>
              )}
              <div className='accordian-right'>
                {' '}
                {address.addressDetails.isValidate && (
                  <div className='address-duration'>
                    {`${dayjs(address.fromDate).format('MM/DD/YYYY')} - To ${
                      address.addressType === PRIMARY
                        ? 'TILL Date'
                        : dayjs(address.toDate).format('MM/DD/YYYY')
                    }`}
                  </div>
                )}
                {addresses && addresses.length !== 1 && (
                  <div onClick={() => handleExpand(index)}>
                    {address.isExpand ? (
                      <Tooltip arrow title='Collapse' placement='top'>
                        <ExpandLessIcon />
                      </Tooltip>
                    ) : (
                      <Tooltip arrow title='Expand' placement='top'>
                        <ExpandMoreIcon />
                      </Tooltip>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={address.isExpand ? 'address-content' : 'address-content collapsed'}>
              <div className='d-row'>
                <div className='col col-sm-12 col-md-4'>
                  <FormControl fullWidth>
                    <InputLabel id='addressType'>Address Type</InputLabel>
                    <Select
                      labelId='addressType'
                      id='addressType'
                      disabled
                      value={address.addressType}
                      className='addr-selectfield'
                      label='Address Type'
                    >
                      {index === 0 && <MenuItem value={'PRIMARY'}>PRIMARY</MenuItem>}
                      {index !== 0 && <MenuItem value={'TEMPORARY'}>TEMPORARY</MenuItem>}
                    </Select>
                  </FormControl>
                </div>
                <div className='col col-sm-12 col-md-4'>
                  <div className='date-picker'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label='From Date'
                        value={address.fromDate ? dayjs(address.fromDate) : null}
                        disabled={address.addressType === PRIMARY}
                        minDate={dayjs(new Date())}
                        slotProps={{
                          textField: {
                            error: !!address.validationErrors?.fromDate,
                            helperText: <DAlertBox errorText={address.validationErrors?.fromDate} />
                          }
                        }}
                        onChange={date => handleAddressChange(index, 'fromDate', date)}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className='col col-sm-12 col-md-4'>
                  <div className='date-picker'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label='To Date'
                        disabled={address.addressType === 'PRIMARY'}
                        value={address.toDate && dayjs(address.toDate)}
                        minDate={dayjs(new Date())}
                        slotProps={{
                          textField: {
                            error: !!address.validationErrors?.toDate,
                            helperText: <DAlertBox errorText={address.validationErrors?.toDate} />
                          }
                        }}
                        onChange={date => handleAddressChange(index, 'toDate', date)}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <fieldset className='address-details'>
                <legend> Address Details </legend>
                <form>
                  <div className='d-row'>
                    {address.addressDetails?.overRide > 0 ? (
                      <AdditionalAddressDetails
                        key={`address-${index}`}
                        validationErrors={address.validationErrors}
                        additionalAddress={address.addressDetails.aditionalAddress}
                        handleAdditionalAddressChange={(field, value) =>
                          handleAdditionalAddressChange(index, field, value)
                        }
                      />
                    ) : (
                      <div className='col col-sm-12 col-md-8'>
                        <TextField
                          fullWidth
                          name='addressLine'
                          label='Address Line'
                          error={!!address.validationErrors?.addressLine}
                          helperText={
                            <DAlertBox
                              errorText={address.validationErrors?.addressLine}
                              warningText={
                                address.addressDetails.addressLine.length > 35 &&
                                'Address is more than 35 characters'
                              }
                            />
                          }
                          value={address.addressDetails.addressLine}
                          inputProps={{ maxLength: 150 }}
                          onChange={e =>
                            handleAddressDetailsChange(index, 'addressLine', e.target.value)
                          }
                        />
                      </div>
                    )}
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        fullWidth
                        name='city'
                        label='City'
                        inputProps={{ maxLength: 20 }}
                        disabled={address.addressType === PRIMARY}
                        value={address.addressDetails.city}
                        helperText={<DAlertBox errorText={address.validationErrors?.city} />}
                        error={!!address.validationErrors?.city}
                        onChange={e => handleAddressDetailsChange(index, 'city', e.target.value)}
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <FormControl fullWidth error={!!address.validationErrors?.state}>
                        <InputLabel id='state'>State</InputLabel>
                        <Select
                          labelId='state'
                          id='state'
                          value={address.addressDetails.state}
                          disabled={address.addressType === PRIMARY}
                          label='State'
                          onChange={e => handleAddressDetailsChange(index, 'state', e.target.value)}
                        >
                          {stateList &&
                            stateList.map(item => {
                              return (
                                <MenuItem key={`state-name${item.code}`} value={item.code}>
                                  {' '}
                                  {item.value}{' '}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        {address.validationErrors?.state && (
                          <FormHelperText>
                            {' '}
                            <DAlertBox errorText={address.validationErrors?.state} />{' '}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        fullWidth
                        name='zipCode'
                        inputProps={{ inputMode: 'numeric', maxLength: 9 }}
                        helperText={<DAlertBox errorText={address.validationErrors?.zipCode} />}
                        error={!!address.validationErrors?.zipCode}
                        label='Zip Code'
                        onChange={e => handleAddressDetailsChange(index, 'zipCode', e.target.value)}
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <FormControl fullWidth error={!!address.validationErrors?.country}>
                        <InputLabel id='country'>Country</InputLabel>
                        <Select
                          labelId='country'
                          id='country'
                          disabled={address.addressType === PRIMARY}
                          value={address.addressDetails.country}
                          label='Country'
                          onChange={e =>
                            handleAddressDetailsChange(index, 'country', e.target.value)
                          }
                        >
                          {countryList &&
                            countryList.map(item => {
                              return (
                                <MenuItem key={`country-name${item.code}`} value={item.code}>
                                  {' '}
                                  {item.value}{' '}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        {address.validationErrors?.country && (
                          <FormHelperText>
                            {' '}
                            <DAlertBox errorText={address.validationErrors?.country} />{' '}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className='address-status-wrapper'>
                    {address.addressDetails.isValidate === null ? (
                      <>
                        {address.addressDetails.ignorAddressVerification === null && (
                          <Button variant='outlined' onClick={() => handleValidateAddress(index)}>
                            {' '}
                            Validate Address{' '}
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className='address-status'>
                        {address.addressDetails.isValidate ? (
                          <div className='valid-address'>
                            <div className='address-line'>
                              {' '}
                              200 I ST SE
                              <br />
                              WASHINGTON DC 20003-3317
                            </div>
                            <div>Parking Zone: 2</div>
                            <div className='address-status-text'>
                              <CheckIcon /> USPS Validated Address
                            </div>
                          </div>
                        ) : (
                          <div className='invalid-address'>
                            <WarningAmber />{' '}
                            <span>
                              {' '}
                              STREET NAME WAS NOT FOUND IN THE POSTAL DIRECTORY. PLEASE VERIFY AND
                              RE-SUBMIT.
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {address.addressDetails.overRide > 0 && (
                    <div className='override-text'>
                      <AddCommentOutlinedIcon /> Override ({address.addressDetails.overRide}){' '}
                    </div>
                  )}
                </form>
              </fieldset>
              {address.addressType === PRIMARY && <ResidencyCertification />}
            </div>
          </div>
          {addresses.length === index + 1 && (
            <div className='add-address-btn'>
              <Button
                variant='text'
                disabled={!addresses[0]?.addressDetails.isValidate}
                onClick={addAnotherAddress}
              >
                {' '}
                + Add Another Address{' '}
              </Button>{' '}
            </div>
          )}
        </>
      ))}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete the Temporary Address?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setOpenDialog(false)}>
            {' '}
            cancel{' '}
          </Button>
          <Button variant='contained' onClick={handleDelete} autoFocus>
            confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openStreetDialog}
        onClose={() => setOpenStreetDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>DC Street Names</DialogTitle>
        <DialogContent>
          <div>You did not enter a valid street name. Please choose from the list below. </div>
          <div className='street-list'>
            <ul>
              {streetNames &&
                streetNames.map((street, index) => {
                  return <li key={`street-${index}`}> {street.value} </li>;
                })}
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setOpenStreetDialog(false)}>
            SELECT
          </Button>
          {addresses && addresses[selectedAddress]?.addressDetails.overRide > 0 ? (
            <Button variant='contained' onClick={handleIgnoreVerification} autoFocus>
              {' '}
              IGNORE
            </Button>
          ) : (
            <Button
              variant='contained'
              onClick={() => {
                setOpenStreetDialog(false);
                setOpenOverrideDialog(true);
              }}
              autoFocus
            >
              OVERRIDE
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth='xs'
        className='override-dialog'
        open={openOverrideDialog}
      >
        <div className='requester-container'>
          <div className='requester'>
            <span className='requester-title'> Requester </span>
            <div className='requester-user'> JOHN DOE </div>
          </div>
        </div>

        <DialogTitle> Supervisor Override </DialogTitle>
        <DialogContent>
          Supervisor Override is required to allow an address not found in our database.
          <div className='d-row'>
            <div className='col col-md-6 col-sm-12'>
              <TextField label='Login ID' fullWidth />
            </div>
            <div className='col col-md-6 col-sm-12'>
              <TextField label='Password' fullWidth />
            </div>
          </div>
          <div className='d-row'>
            <div className='col col-md-12 col-sm-12'>
              <FormControl fullWidth>
                <InputLabel id='ReasonOverride'>Reason for Override </InputLabel>
                <Select
                  labelId='ReasonOverride'
                  id='ReasonOverride'
                  label='Reason for Override'
                ></Select>
              </FormControl>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            autoFocus
            onClick={() => {
              setOpenOverrideDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button variant='contained' onClick={handleOverRide}>
            {' '}
            submit{' '}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={() => setShowAlert(false)}>
        <Alert onClose={() => setShowAlert(false)} severity='success' sx={{ width: '100%' }}>
          New street address added successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}
