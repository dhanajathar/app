import './index.css';

import {
  Button,
  FormControl,
  InputAdornment,
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
import { isBelowAge } from '../../../../utils/dateUtils';

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
    previousCards
  } = data;
  const { status, birthDate, categoryType, duplicateCount, renewalNoticeDate, issueDate, cardMailDate } = idCardDetails
  const cardType = isBelowAge(birthDate, 21) ? cardTypeList[1] : cardTypeList[0]
  const [restrictionsRows, setRestrictionsRows] = useState([]);
  const [restrictionsCodeList, setRestrictionsCodeList] = useState(restrictionsLists);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [previousCardsData, setPreviousCardsData] = useState(previousCards);
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

  const handleStateChange = (e, rowIndex) => {
    const { value } = e.target;
    const rows = [...previousCardsData];
    rows[rowIndex].state = { value };
    setPreviousCardsData(rows);
  }

  const calculateExpiryDate = (issueDate, birthDate) => {
    issueDate = dayjs(issueDate);
    birthDate = dayjs(birthDate);
    let expiryDate = '';
    if (
      issueDate.month() > birthDate.month() ||
      (issueDate.month() === birthDate.month() && issueDate.date() > birthDate.date())
    ) {
      expiryDate = issueDate.add(8, 'year');
    } else {
      expiryDate = issueDate.add(7, 'year');
    }
    expiryDate = expiryDate.set('date', birthDate.date()).set('month', birthDate.month());

    return expiryDate;
  };

  return (
    <div className='d-container'>
      <form onSubmit={handleSubmit}>
        <div className='d-sub-title'> Identification Card Details </div>
        <div className='d-row'>
          <div className='col col-sm-12 col-md-4'>
            <TextField
              value={''}
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
                  cardTypeList.map((cardType) => {
                    return (
                      <MenuItem key={cardType} value={cardType}>
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
                  statusList.map((item) => {
                    return (
                      <MenuItem key={item} value={item}>
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
              <InputLabel id='categoryType'>Category Type</InputLabel>
              <Select
                labelId='categoryType'
                id='categoryType'
                value={categoryType}
                size="small"
                label='Category Type'
              >
                {categoryTypeList &&
                  categoryTypeList.map((categoryType) => {
                    return (
                      <MenuItem key={categoryType} value={categoryType}>
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
              value={duplicateCount ? duplicateCount : 0}
              fullWidth
              disabled
              label='Duplicate Count'
              size="small"
            />
          </div>
        </div>
        <div className='d-row'>
          <div className='col col-sm-12 col-md-2'>
            <div className={'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled
                  label='Original Issue Date'
                  value={dayjs(new Date())}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        endAdornment: (<></>)
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className='col col-sm-12 col-md-2'>
            <div className={'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Issue Date'
                  disabled
                  value={dayjs(new Date())}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        endAdornment: (<></>)
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className='col col-sm-12 col-md-2'>
            <div className={'date-picker'}>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Expiration Date'
                  disabled
                  value={calculateExpiryDate(new Date(), birthDate)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        endAdornment: (<></>)
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className='col col-sm-12 col-md-2'>
            <div className={'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Card Mail Date'
                  disabled
                  value={cardMailDate ? dayjs(cardMailDate) : null}
                  minDate={dayjs(issueDate)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        endAdornment: (<></>)
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className='col col-sm-12 col-md-4'>
            <div className={'date-picker'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Renewal Notice Sent Date'
                  disabled
                  value={renewalNoticeDate ? dayjs(renewalNoticeDate) : null}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        endAdornment: (<></>)
                      }
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
            <div className={'d-row'} key={row.code}>
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
              <div className='col  col-ms-12 col-md-6'>
                <TextField
                  value={row.restriction}
                  fullWidth
                  disabled
                  size="small"
                  label='Restriction'
                  onChange={event => handleInputChange(rowIndex, 'restriction', event.target.value)}
                />
              </div>
              <div className='col col-sm-12 col-md-4 pt-0'>
                <div className='d-row'>
                  <div className='col col-sm-12 col-md-6'>
                    <div className={'date-picker'}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label='Issue Date'
                          disabled
                          slotProps={{
                            textField: {
                              size: 'small',
                              fullWidth: true,
                              InputProps: {
                                endAdornment: (<></>)
                              }
                            },
                          }}
                          value={row.issueDate && dayjs(row.issueDate)}
                        />
                      </LocalizationProvider>{' '}
                    </div>
                  </div>
                  <div className='col col-sm-12 col-md-6'>
                    <div className='action-wrapper '>


                      <div className={'date-picker'}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label='Removal Date'
                            disabled
                            value={row.removalDate && dayjs(row.removalDate)}
                            slotProps={{
                              textField: {
                                size: 'small',
                                fullWidth: true,
                                InputProps: {
                                  endAdornment: (<></>)
                                }
                              }
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                      <div className='delete-btn'>
                        <Tooltip arrow className='d-tooltip' title='delete' placement='top'>
                          <div>
                            <DeleteOutlineOutlinedIcon onClick={() => handleDelete(row)} />{' '}
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}

        {restrictionsLists.length > restrictionsRows.length && (
          <Button className='add-btn' onClick={handleAddRestrictions}>
            + Add Another Restriction
          </Button>
        )}
        <div className='d-sub-title'> Previous Identification Card Details </div>

        {previousCardsData &&
          previousCardsData.map((row, rowIndex) => (
            <div key={rowIndex}>
              <div className='d-row' key={rowIndex} >
                <div className='col col-sm-12 col-md-4 pt-0'>
                  <div className='d-row'>
                    <div className='col col-sm-12 col-md-4'>
                      <FormControl fullWidth size="small" disabled>
                        <InputLabel id='state'>State</InputLabel>
                        <Select
                          labelId='state'
                          id='state'
                          value={row.state.value}
                          label='State'
                          onChange={(e) => handleStateChange(e, rowIndex)}
                        >
                          {states &&
                            states.map((state) => {
                              return (
                                <MenuItem key={state.value} value={state.value}>
                                  {' '}
                                  {state.value}{' '}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                    </div>
                    <div className='col col-sm-12 col-md-8'>
                      <TextField
                        value={row.cardNumber}
                        fullWidth
                        size="small"
                        label='Card Number'
                        disabled
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <div className='input-adornment-text'>  {isBelowAge(row.birthDate, 21) ? '>' : '<'} 21 Yrs  </div>
                            </InputAdornment>
                          )
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className='col col-sm-12 col-md-4'>
                  <FormControl fullWidth disabled>
                    <InputLabel id='categoryType'>Category Type</InputLabel>
                    <Select
                      labelId='categoryType'
                      id='categoryType'
                      value={row.categoryType}
                      size="small"
                      label='Category Type'
                    >
                      {categoryTypeList &&
                        categoryTypeList.map((categoryType) => {
                          return (
                            <MenuItem key={`row${categoryType}`} value={categoryType}>
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
                      <div className={'date-picker'}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label='Issue Date'
                            disabled
                            value={dayjs(row.issueDate)}
                            slotProps={{
                              textField: {
                                size: 'small',
                                fullWidth: true,
                                InputProps: {
                                  endAdornment: (<></>)
                                }
                              }
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>

                    <div className='col col-sm-12 col-md-6'>
                      <div className={'date-picker'}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label='Expiration Date'
                            disabled
                            value={dayjs(row.expirationDate)}
                            slotProps={{
                              textField: {
                                size: 'small',
                                fullWidth: true,
                                InputProps: {
                                  endAdornment: (<></>)
                                }
                              }
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {row.state.value === 'DC' && <Button>  View Card </Button>}
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