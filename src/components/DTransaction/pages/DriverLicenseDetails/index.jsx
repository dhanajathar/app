import './index.css';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import data from './data.json';
import dayjs from 'dayjs';
import front from '../../assets/Front.jpg';
import { useSearchParams } from 'react-router-dom';
import CommentSection from '../../../DDialog/components/CommentSectionDialog';

const DriverLicenseDetails = () => {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: {
        label: 'Driver License Details',
        step: 'Driver License Details',
        flowId: flowId,
        substep: true
      }
    });
  }, 100);
  // const currentDate = dayjs().endOf('day')
  const newRestriction = {
    code: '',
    restriction: '',
    issueDate: new Date(),
    removalDate: null
  };

  const newEndorement = {
    code: '',
    endorsement: '',
    issueDate: new Date(),
    removalDate: null
  };
  const [open, setOpen] = useState(false);
  const [licenseClass, setLicenseClass] = useState('');
  const [licenseType, setLicenseType] = useState(data.licensetype.value);
  const [drivLic, setDrivLic] = useState('');
  const [oosDriver, setOosDriver] = useState('');
  const [parentDln, setParentDln] = useState('');
  const [renewalNotice, setRenewalNotice] = useState('');
  const [medicalCert, setMedicalCert] = useState('');
  const [specialPrivilege, setSpecialPrivilege] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState(data.idCardDetails.status);
  const [goodPoints, setGoodPoints] = useState('0');
  const [points, setPoints] = useState('0');
  const [originalIssueDate, setOriginalIssueDate] = useState(data.idCardDetails.originalIssueDate);
  const [issueDate, setIssueDate] = useState(data.idCardDetails.issueDate);
  const [expirationDate, setExpirationDate] = useState(data.idCardDetails.expirationDate);
  const [categoryType, setCategoryType] = useState(data.categoryTypeList.value);
  const [country, setCountry] = useState(data.idCardDetails.country);
  const [state, setState] = useState(data.idCardDetails.state);
  const [cardNumber, setCardNumber] = useState(data.idCardDetails.cardNumber);
  const [restrictionsRows, setRestrictionsRows] = useState([newRestriction]);
  const [endorementRows, setEndorementRows] = useState([newEndorement]);
  const [restrictionsCodeList, setRestrictionsCodeList] = useState(data.restrictionsLists);
  const [endorsementCodeList, setEndorsementCodeList] = useState(data.endorsementLists);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedEndRow, setSelectedEndRow] = useState(null);
  const [openRes, setOpenRes] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [openViewCard, setOpenViewCard] = useState(false);
  const [comments, setComments] = useState([]);

  const handleViewCardOpen = () => {
    setOpenViewCard(true);
  };

  const handleViewCardClose = () => {
    setOpenViewCard(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (rowIndex, inputName, value) => {
    const rows = [...restrictionsRows];
    rows[rowIndex][inputName] = value;
    setRestrictionsRows(rows);
  };

  const handleEndoreInputChange = (rowIndex, inputName, value) => {
    const rows = [...endorementRows];
    rows[rowIndex][inputName] = value;
    setEndorementRows(rows);
  };

  const handleCodeChange = (rowIndex, inputName, value) => {
    const rows = [...restrictionsRows];
    let list = [];
    rows[rowIndex][inputName] = value;
    data.restrictionsLists.forEach(item => {
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

  const handleEndoreCodeChange = (rowIndex, inputName, value) => {
    const rows = [...endorementRows];
    let list = [];
    rows[rowIndex][inputName] = value;

    data.endorsementLists.forEach(item => {
      if (rows.filter(r => r.code === item.code).length > 0) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
      list = [...list, item];
    });
    let tempList = list.filter(item => item.code === value);
    rows[rowIndex]['endorsement'] = tempList[0].endorsement;

    setEndorsementCodeList(list);
    setEndorementRows(rows);
  };

  const handleCancel = () => {
    setOpenRes(false);
  };

  const handleEndorCancel = () => {
    setOpenEnd(false);
  };

  const handleDelete = row => {
    setSelectedRow(row);
    setOpenRes(true);
  };

  const handleEndDelete = row => {
    setSelectedEndRow(row);
    setOpenEnd(true);
  };

  const handleConfirmDelete = () => {
    setRestrictionsRows(restrictionsRows.filter(row => row !== selectedRow));
    setOpenRes(false);
    let list = [];
    restrictionsCodeList.forEach(item => {
      if (selectedRow.code === item.code) {
        item.isSelected = false;
      }
      list = [...list, item];
    });
    setRestrictionsCodeList(list);
  };

  const handleEndorseConfirmDelete = () => {
    setEndorementRows(endorementRows.filter(row => row !== selectedEndRow));
    setOpenEnd(false);
    let list = [];
    endorsementCodeList.forEach(item => {
      if (selectedEndRow.code === item.code) {
        item.isSelected = false;
      }
      list = [...list, item];
    });
    setEndorsementCodeList(list);
  };

  const handleAddRestroctopms = () => {
    setRestrictionsRows([...restrictionsRows, newRestriction]);
  };

  const handleAddEndorroctopms = () => {
    setEndorementRows([...endorementRows, newEndorement]);
  };

  return (
    <div>
      <div className='dl-all-tag'>
        <TextField
          label='Driver License Number'
          variant='outlined'
          className='dl-text-driver-license'
          value={drivLic}
          onChange={e => setDrivLic(e.target.value)}
        />
        <FormControl variant='outlined'>
          <InputLabel id='license-class'>License Class</InputLabel>
          <Select
            labelId='license-class'
            id='license-class'
            value={licenseClass}
            onChange={e => setLicenseClass(e.target.value)}
            label='License Class'
            className='dl-text-vision-cond'
          >
            {data.licenseclass.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label='Type'
          variant='outlined'
          className='dl-text-vision-cond'
          value={type}
          onChange={e => setType(e.target.value)}
        />
      </div>
      <div className='dl-all-tag'>
        <FormControl variant='outlined'>
          <InputLabel id='license-type'>License Type</InputLabel>
          <Select
            labelId='license-type'
            id='license-type'
            value={licenseType}
            onChange={e => setLicenseType(e.target.value)}
            label='License Type'
            className='dl-text-vision-cond'
          >
            {data.licensetype.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id='cardType'>Category Type</InputLabel>
          <Select
            labelId='categoryType'
            id='categoryType'
            value={categoryType}
            label='Category Type'
            className='dl-text-vision-cond'
            onChange={e => setCategoryType(e.target.value)}
          >
            {data.categoryTypeList &&
              data.categoryTypeList.map((categoryType, index) => {
                return (
                  <MenuItem key={index} value={categoryType}>
                    {' '}
                    {categoryType}{' '}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel id='status'>Status</InputLabel>
          <Select
            labelId='status'
            id='status'
            value={status}
            disabled
            onChange={e => setStatus(e.target.value)}
            label='setStatus'
            className='dl-text-vision-cond'
          >
            {data.idCardDetails.status.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className='dl-all-tag'>
        <TextField
          label='OOS Driver'
          variant='outlined'
          className='dl-text-driver-license'
          value={oosDriver}
          onChange={e => setOosDriver(e.target.value)}
        />
        <FormControl variant='outlined'>
          <InputLabel id='special-privilege'>Special Privilege</InputLabel>
          <Select
            labelId='special-privilege'
            id='special-privilege'
            value={specialPrivilege}
            onChange={e => setSpecialPrivilege(e.target.value)}
            label='Special Privilege'
            className='dl-text-vision-cond'
          >
            {data.specialprivilege.map(sprivilege => (
              <MenuItem key={sprivilege} value={sprivilege}>
                {sprivilege}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label='Good Points'
          variant='outlined'
          className='dl-datepick'
          value={goodPoints}
          onChange={e => setGoodPoints(e.target.value)}
        />
        <TextField
          label='Points'
          variant='outlined'
          className='dl-datepick'
          value={points}
          onChange={e => setPoints(e.target.value)}
        />
      </div>
      <div className='dl-all-tag'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Original Issue Date'
            className='dl-datepick'
            value={dayjs(originalIssueDate)}
            onChange={originalIssueDate => setOriginalIssueDate(originalIssueDate)}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Issue Date'
            className='dl-datepick'
            value={dayjs(issueDate)}
            minDate={dayjs(originalIssueDate)}
            onChange={issueDate => setIssueDate(issueDate)}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Expiration Date'
            className='dl-datepick'
            value={dayjs(expirationDate)}
            minDate={dayjs(issueDate)}
            onChange={expirdate => setExpirationDate(expirdate)}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label='Card Mail Date' className='dl-datepick' />
        </LocalizationProvider>
      </div>
      <div className='dl-examiner'>Previous DL Card Info</div>
      <div className='dl-all-tag'>
        <FormControl>
          <InputLabel id='cardType'>Country</InputLabel>
          <Select
            labelId='country'
            id='country'
            className='dl-previous-DL'
            value={country}
            label='Country'
            onChange={e => setCountry(e.target.value)}
          >
            {data.countryList &&
              data.countryList.map((c, index) => {
                return (
                  <MenuItem key={index} value={c.value}>
                    {' '}
                    {c.label}{' '}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id='state'>State</InputLabel>
          <Select
            labelId='state'
            id='state'
            value={state}
            label='State'
            className='dl-previous-state'
            onChange={e => setState(e.target.value)}
          >
            {data.states &&
              data.states.map((state, index) => {
                return (
                  <MenuItem key={index} value={state.value}>
                    {' '}
                    {state.value}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <TextField
          value={cardNumber}
          label='DL Card Number'
          className='dl-previous-cardnum'
          onChange={e => setCardNumber(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Original Issue Date'
            className='dl-datepick'
            value={dayjs(originalIssueDate)}
            onChange={originalIssueDate => setOriginalIssueDate(originalIssueDate)}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Issue Date'
            className='dl-datepick'
            value={dayjs(issueDate)}
            minDate={dayjs(originalIssueDate)}
            onChange={issueDate => setIssueDate(issueDate)}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Expiration Date'
            className='dl-datepick'
            value={dayjs(expirationDate)}
            minDate={dayjs(issueDate)}
            onChange={expirdate => setExpirationDate(expirdate)}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label='Card Mail Date' className='dl-datepick' />
        </LocalizationProvider>
      </div>

      <div className='dl-all-tag'>
        <Button variant='text' color='primary' onClick={handleViewCardOpen}>
          View Card
        </Button>
        <Dialog
          open={openViewCard}
          onClose={handleViewCardClose}
          fullWidth
          maxWidth='md' // You can adjust this value to control the maximum width
          PaperProps={{
            style: { overflow: 'hidden' } // This prevents the scrollbar
          }}
        >
          <DialogTitle>ID Card Images</DialogTitle>
          <DialogActions>
            <Button variant='text' onClick={handleViewCardClose}>
              <CloseIcon />
              Close
            </Button>
          </DialogActions>
          <DialogContent>
            <DialogContentText>
              <div style={{ display: 'flex' }}>
                {/* <h1 style={{ position: 'relative' }}>ID Card Front</h1> */}
                <img
                  src={front}
                  alt='ID Card Front'
                  style={{ flex: 1, width: '50%', marginRight: '10px' }}
                />
                {/* <h1 style={{ position: 'relative' }}>ID Card Front</h1> */}
                <img
                  src={front}
                  alt='ID Card Back'
                  style={{ flex: 1, width: '50%', marginRight: '10px' }}
                />
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>

      <div className='dl-examiner'>Parent Details</div>
      <div className='dl-all-tag'>
        <TextField
          label='Parent DLN/ID'
          variant='outlined'
          className='dl-text-driver-license'
          value={parentDln}
          onChange={e => setParentDln(e.target.value)}
        />
        <TextField
          label='Renewal Notice Date'
          variant='outlined'
          className='dl-text-driver-license'
          value={renewalNotice}
          onChange={e => setRenewalNotice(e.target.value)}
        />
        <TextField
          label='Medical Certificate'
          variant='outlined'
          className='dl-text-driver-license'
          value={medicalCert}
          onChange={e => setMedicalCert(e.target.value)}
        />
      </div>

      <div className='dl-examiner'> Driver License Card Restrictions </div>
      <div className='dl-all-tag'>
        {restrictionsRows &&
          restrictionsRows.map((row, rowIndex) => (
            <div key={rowIndex} className='dl-restriction'>
              <div className='dl-text-driver-license'>
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
                      getcontentanchorel: null
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
              <div className='dl-text-driver-license'>
                <TextField
                  value={row.restriction}
                  fullWidth
                  disabled
                  label='Restriction'
                  onChange={event => handleInputChange(rowIndex, 'restriction', event.target.value)}
                />
              </div>
              <div className='dl-datepick-restriction'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Issue Date'
                    disabled
                    value={row.issueDate && dayjs(row.issueDate)}
                    onChange={issueDate => handleInputChange(rowIndex, 'issueDate', issueDate)}
                  />
                </LocalizationProvider>{' '}
              </div>
              <div className='dl-datepick-restriction'>
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
              <div className='action-wrapper'>
                {' '}
                <div className='delete-btn'>
                  <Tooltip arrow title='Delete' className='d-tooltip' placement='top'>
                    <DeleteOutlineOutlinedIcon onClick={() => handleDelete(row)} />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}

        {data.restrictionsLists.length > restrictionsRows.length && (
          <Button className='add-btn' onClick={handleAddRestroctopms}>
            {' '}
            + Add Another Restrictions{' '}
          </Button>
        )}
      </div>

      <div className='dl-all-tag'>
        {endorementRows &&
          endorementRows.map((row, rowIndex) => (
            <div key={rowIndex} className='dl-restriction'>
              <div className='dl-text-driver-license'>
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
                      getcontentanchorel: null
                    }}
                    labelId='code'
                    id='code'
                    value={row.code}
                    label='Code'
                    onChange={event => handleEndoreCodeChange(rowIndex, 'code', event.target.value)}
                  >
                    {endorsementCodeList &&
                      endorsementCodeList.length > 0 &&
                      endorsementCodeList.map(item => {
                        return (
                          <MenuItem disabled={item.isSelected} key={item.code} value={item.code}>
                            {' '}
                            {item.code} {item.endorsement}{' '}
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
              <div className='dl-text-driver-license'>
                <TextField
                  value={row.endorsement}
                  fullWidth
                  disabled
                  label='Endorsement'
                  onChange={event =>
                    handleEndoreInputChange(rowIndex, 'endorsement', event.target.value)
                  }
                />
              </div>
              <div className='dl-datepick-restriction'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Issue Date'
                    disabled
                    value={row.issueDate && dayjs(row.issueDate)}
                    onChange={issueDate =>
                      handleEndoreInputChange(rowIndex, 'issueDate', issueDate)
                    }
                  />
                </LocalizationProvider>{' '}
              </div>
              <div className='dl-datepick-restriction'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Removal Date'
                    disabled
                    value={row.removalDate && dayjs(row.removalDate)}
                    onChange={removalDate =>
                      handleEndoreInputChange(rowIndex, 'removalDate', removalDate)
                    }
                  />
                </LocalizationProvider>
              </div>
              <div className='action-wrapper'>
                <div className='delete-btn'>
                  <Tooltip title='Delete' arrow placement='top'>
                    <DeleteOutlineOutlinedIcon onClick={() => handleEndDelete(row)} />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}

        {data.endorsementLists.length > endorementRows.length && (
          <Button className='add-btn' onClick={handleAddEndorroctopms}>
            {' '}
            + Add Another Endorsements{' '}
          </Button>
        )}
      </div>

      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth='xs'
        className='confirmation-dialog'
        open={openRes}
      >
        <DialogTitle> Confirm Deletion </DialogTitle>
        <DialogContent>
          Are you sure you want to delete Driver License card restriction?
        </DialogContent>
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

      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth='xs'
        className='confirmation-dialog'
        open={openEnd}
      >
        <DialogTitle> Confirm Deletion </DialogTitle>
        <DialogContent>
          Are you sure you want to delete Driver License card Endorsement?
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' autoFocus onClick={handleEndorCancel}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleEndorseConfirmDelete}>
            {' '}
            CONFIRM{' '}
          </Button>
        </DialogActions>
      </Dialog>

      <div className='vs-comment-section'>
        <div className='vs-comment-icon'>
          <Button className='vs-comment-text' onClick={handleClickOpen}>
            <AddCommentOutlinedIcon color='primary' className='vs-icon-com' />
            Comment
          </Button>
        </div>
        <CommentSection
          open={open}
          onClose={handleClose}
          getCommentsDetails={setComments}
        ></CommentSection>
      </div>
    </div>
  );
};

export default DriverLicenseDetails;
