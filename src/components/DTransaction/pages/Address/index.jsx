import './index.css';

import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
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
import DNotification from '../../../DNotification';

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
  const [showAlert, setShowAlert] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [warningText, setWarningText] = useState();
  const [selectedStreetName, setSelectedStreetName] = useState('')
  const PRIMARY = 'PRIMARY';
  const initialData = {
    addressType: 'PRIMARY',
    fromDate: new Date(),
    toDate: null,
    addressDetails: {
      addressLine: '',
      city: '',
      state: null,
      zipCode: '',
      country: null,
      isValidate: null,
      additionalAddress: {
        preDirectionalCode: null,
        streetNumber: '',
        streetName: '',
        streetNameSuffix: null,
        postDirectionalCode: null,
        apartmentNumber: ''
      },
      overRide: 0,
      ignoreAddressVerification: null
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
  const primaryDefaultAddress = {
    ...initialData,
    addressDetails: {
      ...initialData.addressDetails,
      state: 'DISTRICT OF COLUMBIA',
      city: 'WA',
      country: 'UNITED STATES'
    }
  };
  const [addresses, setAddresses] = useState([primaryDefaultAddress]);

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index][field] = value;
    setAddresses(newAddresses);
  };

  const handleAddressDetailsChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index].addressDetails[field] = value;
    setAddresses(newAddresses);
    if (field === 'addressLine') {
      if (value.length > 35) {
        setIsFormDisabled(true)
        setWarningText('Address is more than 35 characters')
      } else {
        setWarningText('')
      }
    }
  };

  const handleAdditionalAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index].addressDetails.additionalAddress[field] = value;
    setAddresses(newAddresses);
  };

  const handleValidateAddress = index => {
    handleAllErrors(addresses[index], index);
    if (Object.keys(addresses[index].validationErrors).length === 0) {
      const newAddresses = [...addresses];
      // setting temp is validate flg
      if (newAddresses[index].addressDetails.overRide > 0) {
        newAddresses[index].addressDetails.isValidate = null;
      } else {
        newAddresses[index].addressDetails.isValidate = addresses.length === 1 ? true : false;
      }
      addresses.length > 1 && setOpenStreetDialog(true);
      setSelectedAddress(index)
      setAddresses(newAddresses);
    }
  };

  const handleExpand = index => {
    if(!isFormDisabled) {
    const newAddresses = [...addresses];
    newAddresses[index].isExpand = !newAddresses[index].isExpand;
    setAddresses(newAddresses);
    }
  };

  const selectStreetName = () => {
    setOpenStreetDialog(false);
    const newAddresses = [...addresses];
    newAddresses[selectedAddress].addressDetails.isValidate = null;
    if (addresses[selectedAddress]?.addressDetails.overRide > 0) {
      //temp street name, it wil replace after street name api integration 
      newAddresses[selectedAddress].addressDetails.additionalAddress.streetName = 'SOUTH DAKOTA'
      newAddresses[selectedAddress].addressDetails.additionalAddress.streetNameSuffix = 'AVE'
      newAddresses[selectedAddress].addressDetails.additionalAddress.postDirectionalCode = 'SE'
    } else {
      newAddresses[selectedAddress].addressDetails.addressLine = selectedStreetName
    }


    setAddresses(newAddresses);
  }

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
        ...initialData,
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

  const handleOverRide = () => {
    setOpenOverrideDialog(false);
    const newAddresses = [...addresses];
    const updatedAddress = { ...newAddresses[selectedAddress] };
    updatedAddress.addressDetails = {
      ...updatedAddress.addressDetails,
      isValidate: null,
      overRide: updatedAddress.addressDetails.overRide + 1
    }; 
    if (updatedAddress.addressDetails.overRide > 1 &&
      updatedAddress.addressDetails.ignoreAddressVerification) {
      setShowAlert(true);
      updatedAddress.addressDetails.isValidate = true;
    }


    newAddresses[selectedAddress] = updatedAddress;
    setAddresses(newAddresses);
  };

  const handleIgnoreVerification = () => {
    const newAddresses = [...addresses];
    const updatedAddress = { ...newAddresses[selectedAddress] };
    updatedAddress.addressDetails = {
      ...updatedAddress.addressDetails,
      ignoreAddressVerification: true
    };
    newAddresses[selectedAddress] = updatedAddress;
    setAddresses(newAddresses);
    setOpenStreetDialog(false);
    setOpenOverrideDialog(true);
  };

  const handleClearWarning = () => {
    setWarningText('')
    setIsFormDisabled(false)
    setFocusedField('addressLine');
    setTimeout(() => { setFocusedField() }, 50)
  }

  const handleError = (name, value, index) => {
    const error = validateFiled(name, value, index);
    const errors = { ...addresses[index].validationErrors, [name]: error };
    if (error === '') {
      delete errors[name];
    }
    const updatedAddresses = [...addresses];
    updatedAddresses[index].validationErrors = errors;
    setAddresses(updatedAddresses);
    setIsFormDisabled(Object.values(errors).some(error => error !== ''));
    setFocusedField(error !== '' ? name : '');
  };


  const validateFiled = (name, value, index) => {
    const specialCharacterPattern = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
    let error = '';
    const dateErrorMsg =
      'More than one temporary address cannot be valid at one time The dates for the temporary addresses were altered to remove an overlap. Please check the new dates';
    switch (name) {
      case 'fromDate':
        addresses.forEach((e, i) => {
          if (i !== 0 && i !== index) {
            if (
              dayjs(value).isBefore(e.fromDate) ||
              new Date(e.fromDate).toDateString() === new Date(value).toDateString()
            ) {
              error = dateErrorMsg;
            }
          }
        });
        break;
      case 'toDate':
        addresses.forEach((e, i) => {
          if (i !== 0 && i !== index) {

            if (
              dayjs(value).isBefore(e.toDate) ||
              new Date(e.toDate).toDateString() === new Date(value).toDateString()
            ) {
              error = dateErrorMsg;
            }
          }
        });
        break;
      case 'addressLine':
        if (value === '') {
          error = 'Invalid Address Line';
        }
        break;
      case 'city':
        if (value === '' || specialCharacterPattern.test(value)) {
          error = 'Invalid City';
        }
        break;
      case 'state':
        if (!value) {
          error = 'Invalid State';
        }
        break;
      case 'country':
        if (!value) {
          error = 'Invalid Country';
        }
        break;
      case 'zipCode':
        if (value && value.length < 9) {
          error = 'Invalid ZIP Code';
        }
        break;
      case 'streetNumber':
        if (addresses[index].addressDetails.overRide > 0 && (!value || specialCharacterPattern.test(value))) {
          error = 'Invalid Street Number';
        }
        break;
      case 'streetName':
        if (addresses[index].addressDetails.overRide > 0 && (!value || specialCharacterPattern.test(value))) {
          error = 'Invalid Street Name';
        }
        break;
      case 'streetNameSuffix':
        if (addresses[index].addressDetails.overRide > 0 && !value) {
          error = 'Invalid Street Name Suffix';
        }
        break;
      case 'postDirectionalCode':
        if (addresses[index].addressDetails.overRide > 0 && !value) {
          error = 'Invalid Post-Directional Code';
        }
        break;
      case 'apartmentNumber':
        if (addresses[index].addressDetails.overRide > 0 && value === '') {
          error = 'Invalid Apartment Number';
        }
        break;
      default:
    }
    return error;
  }


  const handleAllErrors = (data, index) => {
    for (const key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        const errorFound = handleAllErrors(data[key], index);
        if (errorFound) {
          return true;
        }
      } else {
        const error = validateFiled(key, data[key], index);
        if (error !== '') {
          handleError(key, data[key], index);
          return true;
        }
      }
    }

    return false;
  };

  const setFocusOnInput = (e, fieldName) => {
    if (fieldName === focusedField) {
      if (e) {
        e.focus();
      }
    }
  };

  return (
    <div className='d-container'>
      {addresses.map((address, index) => (
        <React.Fragment key={`address-${index}`}>
          <div>
            <div
              className={`address-header ${addresses && addresses.length === 1 && 'primary-address-header'
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
              <div className='accordion-right'>
                {' '}
                {address.addressDetails.isValidate && (
                  <div className='address-duration'>
                    {`${dayjs(address.fromDate).format('MM/DD/YYYY')} - To ${address.addressType === PRIMARY
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
            {address.isExpand && <div className={address.isExpand ? 'address-content' : 'address-content collapsed'}>
              <div className='d-row'>
                <div className='col col-sm-12 col-md-4'>




                  <FormControl fullWidth size='small'>
                    <InputLabel id='addressType'>Address Type</InputLabel>
                    <Select
                      labelId='addressType'
                      id='addressType'
                      disabled
                      value={address.addressType}
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
                        disabled={(address.addressType === 'PRIMARY' || (isFormDisabled && focusedField !== 'fromDate'))}
                        minDate={dayjs(new Date())}
                        slotProps={{
                          textField: {
                            size: 'small',
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
                        disabled={(address.addressType === 'PRIMARY' || (isFormDisabled && focusedField !== 'toDate'))}
                        value={address.toDate && dayjs(address.toDate)}
                        minDate={dayjs(new Date())}
                        name="toDate"
                        slotProps={{
                          textField: {
                            size: 'small',
                            error: !!address.validationErrors?.toDate,
                            helperText: <DAlertBox errorText={address.validationErrors?.toDate} />
                          }
                        }}
                        onBlur={(e) => handleError(e.target.name, e.target.value, index)}
                        onChange={date => handleAddressChange(index, 'toDate', date)}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <fieldset className='address-details'>
                <legend className='legend'>  Address Details </legend>
                <form>
                  <div className='d-row'>
                    {address.addressDetails?.overRide > 0 ? (
                      <AdditionalAddressDetails
                        key={`address-details-${index}`}
                        focusedField={focusedField}
                        isFormDisabled={isFormDisabled}
                        validationErrors={address.validationErrors}
                        additionalAddress={address.addressDetails.additionalAddress}
                        handleAdditionalAddressChange={(field, value) =>
                          handleAdditionalAddressChange(index, field, value)
                        }
                        handleOnbBlur={(name, value) => {
                          handleError(name, value, index)
                        }}
                      />
                    ) : (
                      <div className='col col-sm-12 col-md-8'>
                        <TextField
                          fullWidth
                          name='addressLine'
                          label='Address Line'
                          size='small'
                          disabled={isFormDisabled && focusedField !== 'addressLine'}
                          error={!!address.validationErrors?.addressLine}
                          helperText={
                            <DAlertBox
                              errorText={address.validationErrors?.addressLine}
                              onClearWarning={handleClearWarning}
                              warningText={warningText}
                            />
                          }
                          onBlur={(e) => handleError(e.target.name, e.target.value, index)}
                          value={address.addressDetails.addressLine}
                          inputRef={focusedField === 'addressLine' ? (input) => input?.focus() : null}
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
                        size='small'
                        disabled={address.addressType === PRIMARY || (isFormDisabled && focusedField !== 'city')}
                        inputProps={{ maxLength: 20 }}
                        value={address.addressDetails.city}
                        helperText={<DAlertBox errorText={address.validationErrors?.city} />}
                        error={!!address.validationErrors?.city}
                        onChange={e => handleAddressDetailsChange(index, 'city', e.target.value)}
                        inputRef={focusedField === 'city' ? (input) => input?.focus() : null}
                        onBlur={(e) => handleError(e.target.name, e.target.value, index)}
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>

                      <Autocomplete
                        options={stateList}
                        fullWidth
                        size='small'
                        name='state'
                        value={address.addressDetails.state}
                        disableClearable={true}
                        onChange={(e, v) => handleAddressDetailsChange(index, 'state', v)}
                        disabled={address.addressType === PRIMARY || (isFormDisabled && focusedField !== 'state')}
                        onBlur={(e) => handleError('state', e.target.value, index)}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={!!address.validationErrors?.state}
                            inputRef={e => setFocusOnInput(e, 'state')}
                            helperText={<DAlertBox errorText={address.validationErrors?.state} />}
                            label='State'
                          />
                        )}
                      />

                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        fullWidth
                        name='zipCode'
                        size='small'
                        inputProps={{ inputMode: 'numeric', maxLength: 9 }}
                        helperText={<DAlertBox errorText={address.validationErrors?.zipCode} />}
                        disabled={isFormDisabled && focusedField !== 'zipCode'}
                        error={!!address.validationErrors?.zipCode}
                        label='Zip Code'
                        inputRef={focusedField === 'zipCode' ? (input) => input?.focus() : null}
                        onBlur={(e) => handleError(e.target.name, e.target.value, index)}
                        onChange={e => handleAddressDetailsChange(index, 'zipCode', e.target.value)}
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>

                      <Autocomplete
                        options={countryList}
                        fullWidth
                        size='small'
                        name='country'
                        value={address.addressDetails.country}
                        disableClearable={true}
                        onChange={(e, v) => handleAddressDetailsChange(index, 'country', v)}
                        disabled={address.addressType === PRIMARY || (isFormDisabled && focusedField !== 'country')}
                        onBlur={(e) => handleError('country', e.target.value, index)}
                        renderInput={params => (
                          <TextField
                            {...params}
                            inputRef={e => setFocusOnInput(e, 'country')}
                            error={!!address.validationErrors?.country}
                            helperText={<DAlertBox errorText={address.validationErrors?.country} />}
                            label='Country'
                          />
                        )}
                      />



                    </div>
                  </div>
                  <div className='address-status-wrapper'>
                    {address.addressDetails.isValidate === null ? (
                      <>
                        {address.addressDetails.ignoreAddressVerification === null && (
                          <Button variant='outlined' disabled={isFormDisabled} onClick={() => handleValidateAddress(index)}>
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
              {address.addressType === PRIMARY && <ResidencyCertification isFormDisabled={isFormDisabled} />}
            </div>}
          </div>
          {addresses.length === index + 1 && (
            <div className='add-address-btn'>
              <Button
                variant='text'
                disabled={!addresses[index]?.addressDetails.isValidate}
                onClick={addAnotherAddress}
              >
                {' '}
                + Add Another Address{' '}
              </Button>{' '}
            </div>
          )}
        </React.Fragment>
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
              {streetNames?.map((street, index) => (
                <li className={street.value === selectedStreetName && 'selected'} onClick={() => setSelectedStreetName(street.value)} key={`street-${index}`}> {street?.value} </li>
              ))}
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={selectStreetName}>
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
                > <MenuItem> </MenuItem> </Select>
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
      <DNotification open={showAlert} autoHideDuration={6000} severity='success' message='New street address added successfully!' onClose={() => setShowAlert(false)} > </DNotification>
    </div>
  );
}