import './index.css';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import data from './data.json';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';

export function NewIdDetails() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'ID Card Details', step: 'ID Card Details', flowId: flowId, substep: true }
    });
  }, 100);

  const newRestriction = {
    code: '',
    restriction: '',
    issueDate: new Date(),
    removalDate: null
  };
  const {
    idCardDetails,
    restrictionsLists,
    states,
    countryList,
    statusList,
    categoryTypeList,
    cardTypeList
  } = data;
  const [cardNumber, setCardNumber] = useState(idCardDetails.cardNumber);
  const [cardType, setCardType] = useState(idCardDetails.cardType);
  const [status, setStatus] = useState(idCardDetails.status);
  const [categoryType, setCategoryType] = useState(idCardDetails.categoryType);
  const [duplicateCount, setDuplicateCount] = useState(idCardDetails.duplicateCount);
  const [originalIssueDate, setOriginalIssueDate] = useState(idCardDetails.originalIssueDate);
  const [issueDate, setIssueDate] = useState(idCardDetails.issueDate);
  const [expirationDate, setExpirationDate] = useState(idCardDetails.expirationDate);
  const [cardMailDate, setCardMailDate] = useState(idCardDetails.cardMailDate);
  const [country, setCountry] = useState(idCardDetails.country);
  const [state, setState] = useState(idCardDetails.state);
  const [iDCardNumber, setiDCardNumber] = useState(idCardDetails.iDCardNumber);
  const [idStatus, setIdStatus] = useState(idCardDetails.idStatus);
  const [restrictionsRows, setRestrictionsRows] = useState([newRestriction]);
  const [restrictionsCodeList, setRestrictionsCodeList] = useState(restrictionsLists);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleInputChange = (rowIndex, inputName, value) => {
    const rows = [...restrictionsRows];
    rows[rowIndex][inputName] = value;
    setRestrictionsRows(rows);
  };

  const handleCodeChange = (rowIndex, inputName, value) => {
    const rows = [...restrictionsRows];
    let list = [];
    rows[rowIndex][inputName] = value;
    restrictionsLists.forEach(item => {
      if (rows.filter(r => r.code === item.code).length > 0) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
      list = [...list, item];
    });
    let tempList = list.filter(item => item.code === value);
    rows[rowIndex]['restriction'] = tempList[0].restriction;

    setRestrictionsCodeList(list);
    setRestrictionsRows(rows);
  };
  const handleSubmit = e => {
    e.preventDefault();
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleDelete = row => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleConfirmDelete = () => {
    setRestrictionsRows(restrictionsRows.filter(row => row !== selectedRow));
    setOpen(false);
    let list = [];
    restrictionsCodeList.forEach(item => {
      if (selectedRow.code === item.code) {
        item.isSelected = false;
      }
      list = [...list, item];
    });
    setRestrictionsCodeList(list);
  };

  const handleAddRestroctopms = () => {
    setRestrictionsRows([...restrictionsRows, newRestriction]);
  };

  const handleScanClick = e => {
    e.preventDefault();
    DEventService.dispatch(DEvents.ROUTE, { detail: { path: '/scan-document', payload: 'funk' } });
  };

  return (
    <div className='d-container'>
      <form onSubmit={handleSubmit}>
        <div className='d-sub-title'> Identification Card Details </div>
        <div className='d-row'>
          <div className='col col-sm-12 col-md-4'>
            <TextField
              value={cardNumber}
              fullWidth
              label='Card Number'
              onChange={e => setCardNumber(e.target.value)}
            />
          </div>

          <div className='col col-sm-12 col-md-4'>
            <FormControl fullWidth>
              <InputLabel id='cardType'>Card Type</InputLabel>
              <Select
                labelId='cardType'
                id='cardType'
                value={cardType}
                label='Card Type'
                onChange={e => setCardType(e.target.value)}
              >
                {cardTypeList &&
                  cardTypeList.map((cardType, index) => {
                    return (
                      <MenuItem key={index} value={cardType}>
                        {' '}
                        {cardType}{' '}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>

          <div className='col col-sm-12 col-md-4'>
            <TextField
              value={status}
              fullWidth
              disabled
              label='Status'
              onChange={e => setStatus(e.target.value)}
            />
          </div>
        </div>

        <div className='d-row'>
          <div className='col col-sm-12 col-md-4'>
            <FormControl fullWidth>
              <InputLabel id='cardType'>Category Type</InputLabel>
              <Select
                labelId='categoryType'
                id='categoryType'
                value={categoryType}
                label='Category Type'
                onChange={e => setCategoryType(e.target.value)}
              >
                {categoryTypeList &&
                  categoryTypeList.map((categoryType, index) => {
                    return (
                      <MenuItem key={index} value={categoryType}>
                        {' '}
                        {categoryType}{' '}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>

          <div className='col col-sm-12 col-md-4'>
            <TextField
              value={duplicateCount}
              fullWidth
              disabled
              label='Duplicate Count'
              onChange={e => setDuplicateCount(e.target.value)}
            />
          </div>
        </div>
        <div className='d-row'>
          <div className='col col-sm-12 col-md-2'>
            <div className={originalIssueDate ? 'date-picker has-date' : 'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled
                  label='Original Issue Date'
                  value={dayjs(new Date())}
                  onChange={originalIssueDate => setOriginalIssueDate(originalIssueDate)}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className='col col-sm-12 col-md-2'>
            <div className={issueDate ? 'date-picker has-date' : 'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Issue Date'
                  disabled
                  value={dayjs(new Date())}
                  minDate={dayjs(originalIssueDate)}
                  onChange={issueDate => setIssueDate(issueDate)}
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className='col col-sm-12 col-md-2'>
            <div className={expirationDate ? 'date-picker has-date' : 'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Expiration Date'
                  disabled
                  value={dayjs(expirationDate)}
                  onChange={expirdate => setExpirationDate(expirdate)}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className='col col-sm-12 col-md-2'>
            <div className={cardMailDate ? 'date-picker has-date' : 'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Card Mail Date'
                  disabled
                  value={cardMailDate ? dayjs(cardMailDate) : null}
                  minDate={dayjs(issueDate)}
                  onChange={cardMailDate => setCardMailDate(cardMailDate)}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>
        <div className='d-sub-title'> Previous Identification Card Details </div>
        <div className='d-row'>
          <div className='col col-sm-12 col-md-4 pt-0'>
            <div className='d-row'>
              <div className='col col-sm-12 col-md-6'>
                <FormControl fullWidth>
                  <InputLabel id='cardType'>Country</InputLabel>
                  <Select
                    labelId='country'
                    id='country'
                    value={country}
                    label='Country'
                    onChange={e => setCountry(e.target.value)}
                  >
                    {countryList &&
                      countryList.map((c, index) => {
                        return (
                          <MenuItem key={index} value={c.value}>
                            {' '}
                            {c.label}{' '}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </div>
              <div className='col col-sm-12 col-md-6'>
                <FormControl fullWidth>
                  <InputLabel id='state'>State</InputLabel>
                  <Select
                    labelId='state'
                    id='state'
                    value={state}
                    label='State'
                    onChange={e => setState(e.target.value)}
                  >
                    {states &&
                      states.map((state, index) => {
                        return (
                          <MenuItem key={index} value={state.value}>
                            {' '}
                            {state.label}{' '}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className='col col-sm-12 col-md-4'>
            <TextField
              value={iDCardNumber}
              fullWidth
              label='ID Card Number'
              onChange={e => setiDCardNumber(e.target.value)}
            />
          </div>
          <div className='col col-sm-12 col-md-4'>
            <FormControl fullWidth>
              <InputLabel id='idStatus'>Status</InputLabel>
              <Select
                labelId='idStatus'
                id='idStatus'
                value={idStatus}
                label='Status'
                onChange={e => setIdStatus(e.target.value)}
              >
                {statusList &&
                  statusList.map((status, index) => {
                    return (
                      <MenuItem key={index} value={status}>
                        {' '}
                        {status}{' '}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className='divider'> </div>
        <div className='d-sub-title'> Identification Card Restrictions </div>
        {restrictionsRows &&
          restrictionsRows.map((row, rowIndex) => (
            <div className={rowIndex === 0 ? 'mt-1 d-row' : 'd-row'} key={rowIndex}>
              <div className='col col-sm-12- col-md-2'>
                <FormControl fullWidth>
                  <InputLabel id='status'>Code</InputLabel>
                  <Select
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left'
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left'
                      },
                      getContentAnchorEl: null
                    }}
                    labelId='code'
                    id='code'
                    value={row.code}
                    label='Code'
                    onChange={event => handleCodeChange(rowIndex, 'code', event.target.value)}
                  >
                    {restrictionsCodeList &&
                      restrictionsCodeList.length > 0 &&
                      restrictionsCodeList.map(item => {
                        return (
                          <MenuItem disabled={item.isSelected} key={item.code} value={item.code}>
                            {' '}
                            {item.code} {item.restriction}{' '}
                          </MenuItem>
                        );
                      })}
                    {row.code && (
                      <MenuItem key={row.code} value={row.code} style={{ display: 'none' }}>
                        {row.code}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </div>
              <div className='col  col-ms-12 col-md-5'>
                <TextField
                  value={row.restriction}
                  fullWidth
                  disabled
                  label='Restriction'
                  onChange={event => handleInputChange(rowIndex, 'restriction', event.target.value)}
                />
              </div>
              <div className='col col-sm-12 col-md-5 pt-0'>
                <div className='d-row'>
                  <div className='col col-sm-12 col-md-6'>
                    <div className={row.issueDate ? 'date-picker has-date' : 'date-picker'}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label='Issue Date'
                          disabled
                          value={row.issueDate && dayjs(row.issueDate)}
                          onChange={issueDate =>
                            handleInputChange(rowIndex, 'issueDate', issueDate)
                          }
                        />
                      </LocalizationProvider>{' '}
                    </div>
                  </div>
                  <div className='col col-sm-12 col-md-5'>
                    <div className={row.removalDate ? 'date-picker has-date' : 'date-picker'}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label='Removal Date'
                          disabled
                          value={row.removalDate && dayjs(row.removalDate)}
                          onChange={removalDate =>
                            handleInputChange(rowIndex, 'removalDate', removalDate)
                          }
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div className='action-wrapper col col-md-1'>
                    <div className='delete-btn'>
                      <Tooltip arrow className='d-tooltip' title='delete' placement='top'>
                        <DeleteOutlineOutlinedIcon onClick={() => handleDelete(row)} />{' '}
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {restrictionsLists.length > restrictionsRows.length && (
          <Button className='add-btn' onClick={handleAddRestroctopms}>
            {' '}
            + Add Another Restriction{' '}
          </Button>
        )}
      </form>

      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth='xs'
        className='confirmation-dialog'
        open={open}
      >
        <DialogTitle> Confirm Deletion </DialogTitle>
        <DialogContent>Are you sure you want to delete ID Card restriction?</DialogContent>
        <DialogActions>
          <Button variant='outlined' autoFocus onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleConfirmDelete}>
            {' '}
            CONFIRM{' '}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
