import './index.css';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip
} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CropIcon from '@mui/icons-material/Crop';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TranslateIcon from '@mui/icons-material/Translate';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import dayjs from 'dayjs';
import mockData from './data.json';
import DAlertBox from '../../../DAlertBox';

export default function ProofOfIdentity() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: {
        label: 'Proof of Identity',
        step: 'Proof of Identity',
        flowId: flowId,
        substep: true
      }
    });
  }, 100);

  const { citizen } = useParams();
  const {
    verificationHistory,
    documentType,
    initialVerification,
    countryList,
    statusList,
    visaTypeList,
    lastName,
    firstName,
    middleName
  } = mockData;

  const initialData = {
    verificationRequestDocument: null,
    visaType: null,
    alienNumber: '',
    receiptNumber: '',
    documentExpirationDate: mockData.documentExpirationDate,
    i90Value: '',
    sevisId: '',
    dateOfBirth: mockData.dateOfBirth
  }

  const [formData, setFormData] = useState(initialData);
  const [focusedField, setFocusedField] = useState(null);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [expanded, setExpanded] = React.useState(false);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [passportNumber, setPassportNumber] = useState();
  const [issueDate, setIssueDate] = useState();
  const [expirationDate, setExpirationDate] = useState();
  const [verifiedDate, setVerifiedDate] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [initialVerifiedStatus, setInitialVerifiedStatus] = useState(initialVerification.status);
  const visaTypeDisabledList = [4, 6, 7, 9, 10, 41, 42, 43, 44, 45, 46, 47];
  const [open, setOpen] = useState(false);

  const handleSort = column => {
    if (sortedColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortDirection('asc');
    }
  };
  const handleSecondaryVerification = () => {
    setOpen(false);
    setInitialVerifiedStatus(statusList[1]);
  };

  const tableHeader = [
    {
      key: 'srNo',
      label: 'Sl No.',
      width: 30
    },
    {
      key: 'documentType',
      label: 'Document Type',
      width: 250
    },
    {
      key: 'alien',
      label: 'Alien # / I94 #',
      width: 100
    },
    {
      key: 'receipt',
      label: 'Receipt # / Visa #',
      width: 110
    },
    {
      key: 'uSCISDate',
      label: 'USCIS Date',
      width: 100
    },
    {
      key: 'destinyDate',
      label: 'Destiny Date',
      width: 100
    },
    {
      key: 'verificationStatus',
      label: 'Verification Status',
      width: 100
    },
    {
      key: 'processedDate',
      label: 'Processed Date',
      width: 100
    },
    {
      key: 'caseNumber',
      label: 'Case Number',
      width: 150
    },
    {
      key: 'caseCloseDate',
      label: 'Case Close Date',
      width: 100
    }
  ];

  const sortedData = verificationHistory.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortedColumn] - b[sortedColumn];
    } else {
      return b[sortedColumn] - a[sortedColumn];
    }
  });



  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleAccordionChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const disabledVisaType = () => {
    return visaTypeDisabledList.includes(formData.visaType?.value);
  };

  const isDisabledField = values => {
    if (!formData.verificationRequestDocument?.value) {
      return true;
    } else {
      return values.includes(formData.verificationRequestDocument?.value);
    }
  };

  // mm/dd/yyyy
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
  const validateFiled = (name, value) => {
    let error = '';
    const selectedDocType = formData.verificationRequestDocument?.value;
    switch (name) {

      case 'verificationRequestDocument':
        if (!value) {
          error = 'Invalid Verification Request Document';
        }
        break;
      case 'visaType':
        if (!value) {
          error = 'Invalid Visa Type';
        }
        break;
      case 'alienNumber':
        if (!/^\d{9}$/.test(value)) {
          error = 'A Number must be 9 digits';
        }
        if (
          selectedDocType === documentType[0].value ||
          selectedDocType === documentType[4].value ||
          selectedDocType === documentType[8].value ||
          selectedDocType === documentType[2].value ||
          selectedDocType === documentType[6].value ||
          selectedDocType === documentType[7].value
        ) {
          if (!value) {
            error = 'Invalid Document Expiration Date';
          }
        }

        break;
      case 'documentExpirationDate':
        if (!dayjs(value, 'MM/DD/YYYY', true).isValid()) {
          error = 'Invalid Document Expiration Date';
        }
        break;
      case 'sevisId':
        if (!/^\d{10}$/.test(value)) {
          error = 'SEVIS ID must be 10 digits';
        }
        if (!value) {
          error = 'Invalid SEVIS ID';
        }
        break;
      case 'i90Value':
        if (!/^[0-9a-zA-Z]{10}[0-9a-zA-Z]$/.test(value)) {
          error = 'Invalid I-94 Number. This field should have all digits except on the 10th position. 10th position should be a digit or an alphabet. 11th position should be a digit. Please correct and continue';
        }
        break;
      case 'receiptNumber':
        if (!/^[A-Za-z]{3}\d{10}$/.test(value)) {
          error = 'Invalid Receipt Number. First three characters must be alphabets and next 10 must be numbers. Please correct and continue';
        }
        if (
          selectedDocType === documentType[0].value ||
          selectedDocType === documentType[4].value ||
          selectedDocType === documentType[8].value ||
          selectedDocType === documentType[2].value ||
          selectedDocType === documentType[6].value ||
          selectedDocType === documentType[7].value
        ) {
          if (!value) {
            error = 'Invalid Document Expiration Date';
          }
        }
        break;
      default:
    }
    return error;
  }
  const handleError = (name, value) => {
    const error = validateFiled(name, value);
    const errors = { ...validationError, [name]: error };
    if (error === '') {
      delete errors[name];
    }
    setFocusedField(error !== '' ? name : '');
    setValidationError(errors);
    setIsFormDisabled(Object.values(errors).some(error => error !== ''));
  };




  const truncationIcon = input => {
    return (
      <InputAdornment className='truncated_icons' position='end'>
        {input.isTruncated && (
          <Tooltip arrow title='Truncated' placement='top'>
            <CropIcon />
          </Tooltip>
        )}
        {input.isTransliterated && (
          <Tooltip title='Transliterated' arrow placement='top'>
            <TranslateIcon />
          </Tooltip>
        )}
      </InputAdornment>
    );
  };

  const handleChange = (name, value) => {
    const newValues = name === "verificationRequestDocument" || name === "visaType"
      ? { ...initialData }
      : { ...formData };

    newValues[name] = value;
    setFormData(newValues);
    handleError(name, value);
  };

  const setFocusOnInput = (e, fieldName) => {
    if (fieldName === focusedField) {
      if (e) {
        e.focus();
      }
    }
  }



  return (
    <div className='d-container'>
      <form onSubmit={handleSubmit}>
        {citizen === 'yes' ? (
          <>
            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  size='small'
                  value={passportNumber}
                  label='Passport Number'
                  fullWidth
                  onChange={e => setPassportNumber(e.target.value)}
                />
              </div>
              <div className='col col-md-4 col-sm-12'>
                <div className='date-picker'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Issue  Date '
                      fullWidth
                      value={issueDate && dayjs(issueDate)}
                      onChange={issueDate => setIssueDate(issueDate)}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className='col col-md-4 col-sm-12'>
                <div className='date-picker'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Expiration Date '
                      fullWidth
                      value={expirationDate && dayjs(expirationDate)}
                      onChange={expirationDate => setExpirationDate(expirationDate)}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>
            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <div className='status-label'> Status </div>
                <div className='status-wrapper'>
                  <span className='status-text'> {isVerified ? 'VERIFIED' : 'NOT VERIFIED'} </span>

                  {!isVerified && (
                    <span className='status-description'>
                      {' '}
                      <Link href='#' onClick={() => setIsVerified(!isVerified)}>
                        Verify
                      </Link>{' '}
                    </span>
                  )}
                </div>
              </div>
              <div className='col col-md-4 col-sm-12'>
                <div className='date-picker'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Verify Date '
                      fullWidth
                      value={verifiedDate && dayjs(verifiedDate)}
                      onChange={verifiedDate => setVerifiedDate(verifiedDate)}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='d-sub-title'> Proof of Identity</div>
            <div className='d-row'>
              <div className='col col-md-8 col-sm-12'>
                <Autocomplete
                  options={documentType}
                  fullWidth
                  size='small'
                  name='verificationRequestDocument'
                  value={formData.verificationRequestDocument}
                  disableClearable={true}
                  disabled={isFormDisabled && focusedField !== 'verificationRequestDocument'}
                  onChange={(e, v) => {
                    handleChange('verificationRequestDocument', v)
                  }
                  }
                  onBlur={e => handleError('verificationRequestDocument', e.target.value)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      inputRef={(e) => setFocusOnInput(e, 'verificationRequestDocument')}
                      label='Verification Request Document '
                      error={!!validationError?.verificationRequestDocument}
                      helperText={<DAlertBox errorText={validationError?.verificationRequestDocument} />}
                    />
                  )}
                />

              </div>
              {formData.verificationRequestDocument && (
                <div className='col col-md-4 col-sm-12'>
                  <Autocomplete
                    options={visaTypeList}
                    fullWidth
                    size='small'
                    value={formData.visaType}
                    name={'visaType'}
                    disableClearable={true}
                    disabled={isDisabledField([1, 2, 4, 5, 6, 8, 9, 11]) || (isFormDisabled && focusedField !== 'visaType')}
                    onChange={(e, v) => {
                      handleChange('visaType', v)
                    }
                    }
                    onBlur={e => handleError('visaType', e.target.value)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        inputRef={(e) => setFocusOnInput(e, 'visaType')}
                        label='Visa Type'
                        error={!!validationError.visaType}
                        helperText={<DAlertBox errorText={validationError?.visaType} />}
                      />
                    )}
                  />
                </div>
              )}
            </div>

            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={formData.alienNumber}
                  name='alienNumber'
                  label='A Number'
                  inputProps={{ max: 20 }}
                  disabled={isDisabledField([4, 10, 11]) || disabledVisaType() || (isFormDisabled && focusedField !== 'alienNumber')}
                  fullWidth
                  size="small"
                  helperText={<DAlertBox errorText={validationError?.alienNumber} />}
                  error={!!validationError?.alienNumber}
                  onBlur={e => handleError('alienNumber', e.target.value)}
                  inputRef={(e) => setFocusOnInput(e, 'alienNumber')}
                  onChange={e => handleChange(e.target.name, e.target.value)}
                />
              </div>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={formData.receiptNumber}
                  label='Receipt Number'
                  name='receiptNumber'
                  disabled={isDisabledField([1, 3, 4, 5, 6, 7, 9, 10, 11]) || disabledVisaType() || (isFormDisabled && focusedField !== 'receiptNumber')}
                  fullWidth
                  size="small"
                  inputRef={(e) => setFocusOnInput(e, 'receiptNumber')}
                  onBlur={e => handleError('receiptNumber', e.target.value)}
                  helperText={<DAlertBox errorText={validationError?.receiptNumber} />}
                  error={!!validationError?.receiptNumber}
                  onChange={e => handleChange(e.target.name, e.target.value)}
                />
              </div>
              <div className='col col-md-4 col-sm-12'>
                <div className='date-picker'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      minDate={dayjs(new Date())}
                      label='Document Expiration Date '
                      fullWidth
                      disabled={disabledVisaType() || (isFormDisabled && focusedField !== 'documentExpirationDate')}
                      value={formData.documentExpirationDate && dayjs(formData.documentExpirationDate)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          error: !!validationError?.documentExpirationDate,
                          helperText: <DAlertBox errorText={validationError?.documentExpirationDate} />,
                          inputRef: focusedField === 'documentExpirationDate' ? (input) => input?.focus() : null,
                          onBlur: e => handleError('documentExpirationDate', e.target.value),
                        }
                      }}
                      onChange={documentExpirationDate =>
                        handleChange('documentExpirationDate', documentExpirationDate)

                      }
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>

            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={formData.i90Value}
                  label='I-94'
                  name='i90Value'
                  size="small"
                  error={!!validationError?.i90Value}
                  helperText={<DAlertBox errorText={validationError?.i90Value} />}
                  disabled={isDisabledField([2, 5, 6, 8, 9]) || disabledVisaType() || (isFormDisabled && focusedField !== 'i90Value')}
                  fullWidth
                  inputRef={(e) => setFocusOnInput(e, 'i90Value')}
                  onBlur={e => handleError('i90Value', e.target.value)}
                  onChange={e => handleChange(e.target.name, e.target.value)}
                />
              </div>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={formData.sevisId}
                  label='SEVIS ID'
                  type='number'
                  size="small"
                  name='sevisId'
                  error={!!validationError?.sevisId}
                  helperText={<DAlertBox errorText={validationError?.sevisId} />}
                  onBlur={e => handleError('sevisId', e.target.value)}
                  inputRef={(e) => setFocusOnInput(e, 'sevisId')}
                  disabled={isDisabledField([2, 5, 6, 8, 9, 10]) || disabledVisaType() || (isFormDisabled && focusedField !== 'sevisId')}
                  fullWidth
                  onChange={e => handleChange(e.target.name, e.target.value)}
                />
              </div>
            </div>

            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={lastName.value}
                  name='lName'
                  disabled
                  size="small"
                  fullWidth
                  label='Last Name'
                  autoComplete='off'
                  InputProps={{
                    endAdornment: truncationIcon(lastName)
                  }}
                />
              </div>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={firstName.value}
                  name='firstName'
                  fullWidth
                  disabled
                  size="small"
                  label='First Name'
                  InputProps={{
                    endAdornment: truncationIcon(firstName)
                  }}
                />
              </div>

              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={middleName.value}
                  fullWidth
                  disabled
                  size="small"
                  InputProps={{
                    endAdornment: truncationIcon(middleName)
                  }}
                  label='Middle Name'
                />
              </div>
            </div>

            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <TextField size="small" value={formData.dateOfBirth} fullWidth disabled label='Date of Birth' />
              </div>
            </div>

            <Accordion
              className='initial-verification'
              expanded={expanded === 'verificationPannel'}
              onChange={handleAccordionChange('verificationPannel')}
            >
              <AccordionSummary
                expandIcon={
                  <Tooltip arrow title='Expand' placement='top'>
                    <ExpandMoreIcon />
                  </Tooltip>
                }
                aria-controls='panel1bh-content'
                id='panel1bh-header'
              >
                <div className='initial-verification-header'>
                  <div> Initial Verification Result</div>

                  <div
                    className={
                      initialVerifiedStatus && initialVerifiedStatus === statusList[0]
                        ? 'verification-status warning-status'
                        : 'verification-status success-status'
                    }
                  >
                    {initialVerifiedStatus === statusList[0] && <WarningAmberIcon />}{' '}
                    {initialVerifiedStatus}
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <div className='d-row'>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        value={initialVerification.lastName}
                        label='Last Name'
                        disabled
                        size="small"
                        fullWidth
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        value={initialVerification.firstName}
                        label='First Name'
                        disabled
                        size="small"
                        fullWidth
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        value={initialVerification.middleName}
                        label='Middle Name'
                        disabled
                        size="small"
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className='d-row'>
                    <div className='col col-sm-12 col-md-4'>
                      <div
                        className={
                          initialVerification.dateOfBirth ? 'date-picker has-date' : 'date-picker'
                        }
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label='Date of Birth'
                            fullWidth
                            disabled
                            value={
                              initialVerification.dateOfBirth &&
                              dayjs(initialVerification.dateOfBirth)
                            }
                            slotProps={{
                              textField: {
                                size: 'small'

                              }
                            }}
                          />
                        </LocalizationProvider>
                        {initialVerification.dateOfBirth && (
                          <div className='date-helper-text'>
                            {calculateAge(initialVerification.dateOfBirth)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <FormControl size="small" fullWidth>
                        <InputLabel id='country'>Country</InputLabel>
                        <Select
                          labelId='country'
                          id='country'
                          disabled
                          value={initialVerification.country}
                          label='Country'
                        >
                          {countryList &&
                            countryList.map(c => {
                              return (
                                <MenuItem key={c.label} value={c.value}>
                                  {' '}
                                  {c.label}{' '}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        value={initialVerification.caseNumber}
                        label='Case Number'
                        disabled
                        size="small"
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className='d-row'>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        value={initialVerification.dateOfEntry}
                        label='Date of Entry'
                        disabled
                        fullWidth
                        size="small"
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        value={initialVerification.admittedTo}
                        label='Admitted  To'
                        disabled
                        size="small"
                        fullWidth
                      />
                    </div>
                    {initialVerifiedStatus === statusList[1] && (
                      <div className='col col-sm-12 col-md-4'>
                        <div
                          className={
                            initialVerification.expirationDate
                              ? 'date-picker has-date'
                              : 'date-picker'
                          }
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label='Expiration Date'
                              fullWidth
                              value={
                                initialVerification.expirationDate &&
                                dayjs(initialVerification.expirationDate)
                              }
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='d-row'>
                    <div className='col col-sm-12 col-md-4'>
                      {initialVerifiedStatus === statusList[0] && (
                        <Button variant='outlined' color='primary' onClick={() => setOpen(true)}>
                          {' '}
                          SECONDARY VERIFICATION{' '}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <div className='d-row'>
              <div className='col col-sm-12'>
                <Accordion
                  className='verification-history-accordion'
                  expanded={expanded === 'panel1'}
                  onChange={handleAccordionChange('panel1')}
                >
                  <AccordionSummary
                    expandIcon={
                      <Tooltip arrow title='Expand' placement='top'>
                        <ExpandMoreIcon />
                      </Tooltip>
                    }
                    aria-controls='panel1bh-content'
                    id='panel1bh-header'
                  >
                    {' '}
                    Verification History
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer sx={{ maxHeight: 200 }} component={Paper}>
                      <Table stickyHeader className='history-table'>
                        <TableHead>
                          <TableRow>
                            {tableHeader.map((item, idx) => {
                              return (
                                <TableCell key={idx} style={{ width: `${item?.width}px` }}>
                                  <TableSortLabel
                                    active={sortedColumn === item.key}
                                    direction={sortDirection}
                                    onClick={() => handleSort(item.key)}
                                  >
                                    {item.label}
                                  </TableSortLabel>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sortedData &&
                            sortedData.map((row, index) => (
                              <TableRow
                                key={`row${index}`}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell>{row.srNo}</TableCell>
                                <TableCell>{row.documentType}</TableCell>
                                <TableCell>{row.alien}</TableCell>
                                <TableCell>{row.receipt}</TableCell>
                                <TableCell>{row.uSCISDate}</TableCell>
                                <TableCell>{row.destinyDate}</TableCell>
                                <TableCell>{row.verificationStatus}</TableCell>
                                <TableCell>{row.processedDate}</TableCell>
                                <TableCell>{row.caseNumber}</TableCell>
                                <TableCell>{row.caseCloseDate}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          </>
        )}
        {/* <Button type='submit'> validate </Button> */}
      </form>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth='xs'
        className='override-dialog'
        open={open}
      >
        <div className='requester-container'>
          <div className='requester'>
            <span className='requester-title'> Requester </span>
            <div className='requester-user'> JOHN </div> {/* username POI */}
          </div>
        </div>

        <DialogTitle> Supervisor Override </DialogTitle>
        <DialogContent>
          Supervisor Override is necessary to skip document scans.
          <div className='d-row'>
            <div className='col col-md-6'>
              <TextField label='Login ID' fullWidth />
            </div>
            <div className='col col-md-6'>
              <TextField label='Password' fullWidth />
            </div>
            <div className='col'>
              <FormControl fullWidth size="small">
                <InputLabel id='ReasonOverride'>Reason for Override </InputLabel>
                <Select labelId='ReasonOverride' id='ReasonOverride' label='Reason for Override'>
                  <option>To be decided</option>
                </Select>
              </FormControl>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            autoFocus
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSecondaryVerification}>
            {' '}
            submit{' '}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
