import './index.css';

import {
  Button, 
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
import DeleteConfirmDialog from '../../../DDialog/components/DeleteConfirmDialog';

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
    statusList,
    categoryTypeList,
    cardTypeList,
    previousCardRestrictions
  } = data;

  const { cardNumber, cardType, status, categoryType, duplicateCount, originalIssueDate, issueDate, expirationDate, cardMailDate } = idCardDetails

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

  const handleAddRestrictions = () => {
    setRestrictionsRows([...restrictionsRows, newRestriction]);
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
              size="small"
              label='Card Number'
              disabled
            />
          </div>
          <div className='col col-sm-12 col-md-4'>
            <FormControl fullWidth disabled>
              <InputLabel id='cardType'>Card Type</InputLabel>
              <Select
                labelId='cardType'
                id='cardType'
                value={cardType}
                label='Card Type'
                size="small"
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
            <FormControl fullWidth disabled>
              <InputLabel id='status'>Status </InputLabel>
              <Select
                labelId='status'
                id='status'
                value={status}
                label='Status'
                size="small"
              >
                {statusList &&
                  statusList.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item}>
                        {' '}
                        {item}{' '}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className='d-row'>
          <div className='col col-sm-12 col-md-4'>
            <FormControl fullWidth disabled>
              <InputLabel id='cardType'>Category Type</InputLabel>
              <Select
                labelId='categoryType'
                id='categoryType'
                value={categoryType}
                size="small"
                label='Category Type'
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
              size="small"
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
                  slotProps={{
                    textField: {
                      size: 'small'
                    }
                  }}
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
                  slotProps={{
                    textField: {
                      size: 'small'
                    }
                  }}
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
                  slotProps={{
                    textField: {
                      size: 'small'
                    }
                  }}
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
                  slotProps={{
                    textField: {
                      size: 'small'
                    }
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>

        <div className='d-sub-title'> Identification Card Restrictions </div>
        {restrictionsRows &&
          restrictionsRows.map((row, rowIndex) => (
            <div className={rowIndex === 0 ? 'mt-1 d-row' : 'd-row'} key={rowIndex}>
              <div className='col col-sm-12- col-md-2'>
                <FormControl fullWidth size="small">
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
                  size="small"
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
                          slotProps={{
                            textField: {
                              size: 'small'
                            }
                          }}
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
                          slotProps={{
                            textField: {
                              size: 'small'
                            }
                          }}
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
          <Button className='add-btn' onClick={handleAddRestrictions}>
            {' '}
            + Add Another Restriction{' '}
          </Button>
        )}
        <div className='d-sub-title'> Previous Identification Card Details </div>

        {previousCardRestrictions &&
          previousCardRestrictions.map((row, rowIndex) => (
            <div className='d-row' key={`previous-id-card${rowIndex}`} >
              <div className='col col-sm-12 col-md-4 pt-0'>
                <div className='d-row'>
                  <div className='col col-sm-12 col-md-6'>
                    <FormControl fullWidth size="small">
                      <InputLabel id='state'>State</InputLabel>
                      <Select
                        labelId='state'
                        id='state'
                        value={row.state}
                        label='State'
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
                  <div className='col col-sm-12 col-md-6'>
                    <TextField
                      value={row.cardNumber}
                      fullWidth
                      size="small"
                      label='Card Number'
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className='col col-sm-12 col-md-4'>
                <FormControl fullWidth disabled>
                  <InputLabel id='cardType'>Category Type</InputLabel>
                  <Select
                    labelId='categoryType'
                    id='categoryType'
                    value={row.categoryType}
                    size="small"
                    label='Category Type'
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
              <div className='col col-sm-12 col-md-4 pt-0'>
                <div className='d-row'>
                  <div className='col col-sm-12 col-md-6'>
                    <div className={row.issueDate ? 'date-picker has-date' : 'date-picker'}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label='Issue Date'
                          disabled
                          value={dayjs(new Date())}
                          slotProps={{
                            textField: {
                              size: 'small'
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>

                  <div className='col col-sm-12 col-md-6'>
                    <div className={row.expirationDate ? 'date-picker has-date' : 'date-picker'}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label='Expiration Date'
                          disabled
                          value={dayjs(row.expirationDate)}
                          slotProps={{
                            textField: {
                              size: 'small'
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}


      </form>
      <DeleteConfirmDialog
        open={open}
        close={handleCancel}
        data={' Are you sure you want to delete ID Card restriction?'}
        onCloseButtonClick={handleCancel}
        onConfirmClick={handleConfirmDelete}
      />
    </div>
  );
}
