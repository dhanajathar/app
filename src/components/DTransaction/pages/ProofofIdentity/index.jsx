import './index.css';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
    docuementType,
    initialVerification,
    countryList,
    statusList,
    visaTypeList,
    lastName,
    firstName,
    middleName
  } = mockData;
  const [expanded, setExpanded] = React.useState(false);
  const [verificationRequestDocument, setVerificationRequestDocument] = useState('');
  const [visaType, setvisaType] = useState('');
  const [alienNumber, setAlienNumber] = useState();
  const [receiptNumber, setReceiptNumber] = useState();
  const [documentExpirationDate, setDocumentExpirationDate] = useState(
    mockData.documentExpirationDate
  );
  const [dateOfBirth, setdateOfBirth] = useState(mockData.dateOfBirth);
  const [i90Value, setI90Value] = useState();
  const [sevisId, setSevisId] = useState();
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const [passportNumber, setpassportNumber] = useState();
  const [issueDate, setIssueDate] = useState();
  const [expirationDate, setExpirationDate] = useState();
  const [verifiedDate, setVerifiedDate] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [initialverifiedStatus, setInitialverifiedStatus] = useState(initialVerification.status);
  const visatypeDisabledList = [4, 6, 7, 9, 10, 41, 42, 43, 44, 45, 46, 47];

  const [alienNumberError, setAlienNumberError] = useState('');
  const [visaTypeError, setvisaTypeError] = useState('');
  const [receiptNumberError, setReceiptNumberError] = useState('');
  const [sevisIdError, setSevisIdError] = useState('');
  const [i90ValueError, setI90ValueError] = useState('');
  const [documentExDateError, setDocumentExDateError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSort = column => {
    if (sortedColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortDirection('asc');
    }
  };
  const handleSecondaryVarificaton = () => {
    setOpen(false);
    setInitialverifiedStatus(statusList[1]);
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

  const validateForm = () => {
    const selectedDocType = verificationRequestDocument?.value;
    setAlienNumberError('');
    setvisaTypeError('');
    if (selectedDocType === docuementType[2].value || selectedDocType === docuementType[6].value) {
      if (!visaType) {
        setvisaTypeError('Invalid Visa Type');
      }
    }
    if (
      selectedDocType === docuementType[0].value ||
      selectedDocType === docuementType[2].value ||
      selectedDocType === docuementType[6].value
    ) {
      if (!alienNumber && !i90Value) {
        setAlienNumberError('Invalid A Number');
      }
    }
    if (selectedDocType === docuementType[1].value || selectedDocType === docuementType[7].value) {
      if (!receiptNumber) {
        setReceiptNumberError('Invalid Receipt Number');
      }
    }

    if (
      selectedDocType === docuementType[0].value ||
      selectedDocType === docuementType[4].value ||
      selectedDocType === docuementType[8].value ||
      selectedDocType === docuementType[2].value ||
      selectedDocType === docuementType[6].value ||
      selectedDocType === docuementType[7].value
    ) {
      if (!receiptNumber) {
        setDocumentExDateError('Invalid Document Expiration Date');
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    validateForm();
  };

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const disabledVisaType = () => {
    return visatypeDisabledList.includes(visaType);
  };

  const isdisabledField = values => {
    if (!verificationRequestDocument?.value) {
      return true;
    } else {
      return values.includes(verificationRequestDocument?.value);
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

  const handleNumberValidation = e => {
    if (e.target.name === 'alienNumber') {
      if (!/^\d{9}$/.test(e.target.value)) {
        setAlienNumberError('A Number must be 9 digits');
      } else {
        setAlienNumberError('');
      }
    }
    if (e.target.name === 'savisId') {
      if (!/^\d{10}$/.test(e.target.value)) {
        setSevisIdError('SEVIS ID must be 10 digits');
      } else {
        setSevisIdError('');
      }
    }
    if (e.target.name === 'i90Value') {
      if (!/^[0-9a-zA-Z]{10}[0-9a-zA-Z]$/.test(e.target.value)) {
        setI90ValueError(
          'Invalid I-94 Number. This field should have all digits except on the 10th position. 10th position should be a digit or an alphabet. 11th position should be a digit. Please correct and continue'
        );
      } else {
        setI90ValueError('');
      }
    }
    if (e.target.name === 'receiptNumber') {
      if (!/^[A-Za-z]{3}\d{10}$/.test(e.target.value)) {
        setReceiptNumberError(
          'Invalid Receipt Number. First three characters must be alphabets and next 10 must be numbers. Please correct and continue'
        );
      } else {
        setReceiptNumberError('');
      }
    }
  };

  const clearFileds = () => {
    setAlienNumber('');
    setReceiptNumber('');
    setSevisId('');
    setI90Value('');

    setAlienNumberError('');
    setReceiptNumberError('');
    setSevisIdError('');
    setDocumentExDateError('');
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

  return (
    <div className='d-container'>
      <form onSubmit={handleSubmit}>
        {citizen === 'yes' ? (
          <>
            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={passportNumber}
                  label='Passport Number'
                  fullWidth
                  onChange={e => setpassportNumber(e.target.value)}
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
                <FormControl fullWidth variant='outlined' className='formControl'>
                  <InputLabel id='verificationDocument'> Verification Request Document </InputLabel>
                  <Select
                    id='verificationDocument'
                    value={verificationRequestDocument}
                    label='Verification Request Document'
                    onChange={e => {
                      clearFileds();
                      setVerificationRequestDocument(e.target.value);
                    }}
                  >
                    {docuementType &&
                      docuementType.map((item, index) => {
                        return (
                          <MenuItem key={`type${index}`} value={item}>
                            {' '}
                            {item.label}{' '}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </div>
              {verificationRequestDocument && (
                <div className='col col-md-4 col-sm-12'>
                  <FormControl fullWidth variant='outlined' className='formControl'>
                    <InputLabel id='visaType'> Visa Type </InputLabel>
                    <Select
                      id='visaType'
                      value={visaType}
                      error={!!visaTypeError}
                      helperText={visaTypeError}
                      label='Visa Type'
                      disabled={isdisabledField([1, 2, 4, 5, 6, 8, 9, 11])}
                      onChange={e => {
                        clearFileds();
                        setvisaType(e.target.value);
                      }}
                    >
                      {visaTypeList &&
                        visaTypeList.map(v => {
                          return (
                            <MenuItem key={v.label} value={v.value}>
                              {' '}
                              {v.label}{' '}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </div>
              )}
            </div>

            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={alienNumber}
                  name='alienNumber'
                  label='A Number'
                  inputProps={{ max: 20 }}
                  disabled={isdisabledField([4, 10, 11]) || disabledVisaType()}
                  fullWidth
                  InputLabelProps={{ shrink: alienNumber ? true : false }}
                  helperText={alienNumberError}
                  error={!!alienNumberError}
                  onBlur={handleNumberValidation}
                  onChange={e => setAlienNumber(e.target.value)}
                />
              </div>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={receiptNumber}
                  label='Receipt Number'
                  name='receiptNumber'
                  disabled={isdisabledField([1, 3, 4, 5, 6, 7, 9, 10, 11]) || disabledVisaType()}
                  fullWidth
                  InputLabelProps={{ shrink: receiptNumber ? true : false }}
                  onBlur={handleNumberValidation}
                  helperText={receiptNumberError}
                  error={!!receiptNumberError}
                  onChange={e => setReceiptNumber(e.target.value)}
                />
              </div>
              <div className='col col-md-4 col-sm-12'>
                <div className='date-picker'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      minDate={dayjs(new Date())}
                      label='Document Expiration Date '
                      fullWidth
                      error={!!documentExDateError}
                      helperText={documentExDateError}
                      disabled={disabledVisaType()}
                      value={documentExpirationDate && dayjs(documentExpirationDate)}
                      onChange={documentExpirationDate =>
                        setDocumentExpirationDate(documentExpirationDate)
                      }
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>

            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={i90Value}
                  label='I-94'
                  name='i90Value'
                  InputLabelProps={{ shrink: i90Value ? true : false }}
                  error={!!i90ValueError}
                  helperText={i90ValueError}
                  disabled={isdisabledField([2, 5, 6, 8, 9]) || disabledVisaType()}
                  fullWidth
                  onBlur={handleNumberValidation}
                  onChange={e => setI90Value(e.target.value)}
                />
              </div>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={sevisId}
                  label='SEVIS ID'
                  type='number'
                  InputLabelProps={{ shrink: sevisId ? true : false }}
                  name='savisId'
                  error={!!sevisIdError}
                  helperText={sevisIdError}
                  onBlur={handleNumberValidation}
                  disabled={isdisabledField([2, 5, 6, 8, 9, 10]) || disabledVisaType()}
                  fullWidth
                  onChange={e => setSevisId(e.target.value)}
                />
              </div>
            </div>

            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <TextField
                  value={lastName.value}
                  name='lName'
                  disabled
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
                  InputProps={{
                    endAdornment: truncationIcon(middleName)
                  }}
                  label='Middle Name'
                />
              </div>
            </div>

            <div className='d-row'>
              <div className='col col-md-4 col-sm-12'>
                <TextField value={dateOfBirth} fullWidth disabled label='Date of Birth' />
              </div>
            </div>

            <Accordion
              className='initial-verification'
              expanded={expanded === 'verificationPannel'}
              onChange={handleChange('verificationPannel')}
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
                      initialverifiedStatus && initialverifiedStatus === statusList[0]
                        ? 'varification-status warning-status'
                        : 'varification-status success-status'
                    }
                  >
                    {initialverifiedStatus === statusList[0] && <WarningAmberIcon />}{' '}
                    {initialverifiedStatus}
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <div className='d-row'>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        value={initialVerification.lastname}
                        label='Last Name'
                        disabled
                        fullWidth
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        value={initialVerification.firstName}
                        label='First Name'
                        disabled
                        fullWidth
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        value={initialVerification.middleName}
                        label='Middle Name'
                        disabled
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
                      <FormControl fullWidth>
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
                      />
                    </div>
                    <div className='col col-sm-12 col-md-4'>
                      <TextField
                        value={initialVerification.admittedTo}
                        label='Admitted  To'
                        disabled
                        fullWidth
                      />
                    </div>
                    {initialverifiedStatus === statusList[1] && (
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
                      {initialverifiedStatus === statusList[0] && (
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
                  onChange={handleChange('panel1')}
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
              <FormControl fullWidth>
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
          <Button variant='contained' onClick={handleSecondaryVarificaton}>
            {' '}
            submit{' '}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
