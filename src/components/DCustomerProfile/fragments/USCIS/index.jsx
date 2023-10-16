import './index.css';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputAdornment,
  InputLabel,
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
import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CropIcon from '@mui/icons-material/Crop';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TranslateIcon from '@mui/icons-material/Translate';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import dayjs from 'dayjs';

import data from './api-uscisfragment.json';

export default function UscisFragment() {
  const [expanded, setExpanded] = React.useState(false);
  const { initialVerification, verificationHistory, visaTypeList, documentType, countryList, statusList } = data;

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

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
    <>
      <div className='d-row'>
        <div className='col col-md-8 col-sm-12'>
          <FormControl fullWidth variant='outlined' className='formControl'>
            <InputLabel id='verificationDocument'> Verification Request Document </InputLabel>
            <Select
              id='verificationDocument'
              value={data.verificationRequestDocument}
              label='Verification Request Document'
              disabled
            >
              {documentType &&
                documentType.map((item, index) => {
                  return (
                    <MenuItem key={`type${index}`} value={item.value}>
                      {' '}
                      {item.label}{' '}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
        <div className='col col-md-4 col-sm-12'>
          <FormControl fullWidth variant='outlined' className='formControl'>
            <InputLabel id='visaType'> Visa Type </InputLabel>
            <Select
              id='visaType'
              value={data.visaType}
              disabled
              label='Visa Type'
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

      </div>

      <div className='d-row'>
        <div className='col col-md-4 col-sm-12'>
          <TextField
            value={data.alienNumber}
            disabled
            label='A Number'
            fullWidth

          />
        </div>
        <div className='col col-md-4 col-sm-12'>
          <TextField
            value={data.receiptNumber}
            label='Receipt Number'
            disabled
            fullWidth
          />
        </div>
        <div className='col col-md-4 col-sm-12'>
          <div className='date-picker'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Document Expiration Date '
                fullWidth
                disabled
                value={data.documentExpirationDate && dayjs(data.documentExpirationDate)}

              />
            </LocalizationProvider>
          </div>
        </div>
      </div>

      <div className='d-row'>
        <div className='col col-md-4 col-sm-12'>
          <TextField
            value={data.i90Value}
            label='I-94'
            fullWidth
            disabled
          />
        </div>
        <div className='col col-md-4 col-sm-12'>
          <TextField
            value={data.sevisId}
            label='SEVIS ID'
            disabled
            fullWidth

          />
        </div>
      </div>

      <div className='d-row'>
        <div className='col col-md-4 col-sm-12'>
          <TextField
            value={data.lastName.value}
            disabled
            fullWidth
            label='Last Name'
            InputProps={{
              endAdornment: truncationIcon(data.lastName)
            }}
          />
        </div>
        <div className='col col-md-4 col-sm-12'>
          <TextField
            value={data.firstName.value}
            fullWidth
            disabled
            label='First Name'
            InputProps={{
              endAdornment: truncationIcon(data.firstName)
            }}
          />
        </div>

        <div className='col col-md-4 col-sm-12'>
          <TextField
            value={data.middleName.value}
            fullWidth
            disabled
            InputProps={{
              endAdornment: truncationIcon(data.middleName)
            }}
            label='Middle Name'
          />
        </div>
      </div>

      <div className='d-row'>
        <div className='col col-md-4 col-sm-12'>
          <TextField value={data.dateOfBirth} fullWidth disabled label='Date of Birth' />
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
                data.initialVerification && data.initialVerification.status === statusList[0]
                  ? 'varification-status warning-status'
                  : 'varification-status success-status'
              }
            >
              {data.initialVerification.status === statusList[0] && <WarningAmberIcon />}{' '}
              {data.initialVerification.status}
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
                <TextField
                  value={
                    initialVerification.dateOfBirth &&
                    dayjs(initialVerification.dateOfBirth)
                  }
                  label='Middle Name'
                  disabled
                  fullWidth
                  className='input-adornment'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        {' '}
                        <div className='input-adornment-text'> {calculateAge(initialVerification.dateOfBirth)} </div>{' '}
                      </InputAdornment>
                    )
                  }}
                />

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
              {data.initialVerification.status === statusList[1] && (
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
                        disabled
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
          </div>
        </AccordionDetails>
      </Accordion> 
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
              <div className='history-table-wrapper'>
                <Table stickyHeader className='history-table'>
                  <TableHead>
                    <TableRow>
                      {tableHeader.map((item, idx) => {
                        return (
                          <TableCell key={idx} style={{ width: `${item?.width}px` }}>
                            <TableSortLabel>
                              {item.label}
                            </TableSortLabel>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {verificationHistory &&
                      verificationHistory.map((row, index) => (
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
                </div>
            </AccordionDetails>
          </Accordion>
        
    </>
  );
}
