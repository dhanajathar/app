import '../DDialog.css';
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Data from '../data/api-sup-reasons-list.json';
import * as _ from 'lodash';
import { styled } from '@mui/material/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    Select,
    TextField
  } from '@mui/material';
  import {Close} from '@mui/icons-material';
  import userData from '../../DTransaction/pages/IndividualDetails/api-individual-details.json';

const SupReasonsDialog = (props) => {

  const { personalInformation } = userData;
  const [lastName, setLastName] = useState(personalInformation.lastName);
  const [firstName, setFirstName] = useState(personalInformation.firstName);

    const [sortData, setSortData] = useState({
        column: null,
        sorting: null
      });
      const [columns, setColumns] = useState(Data.columns);
      const [profileData, setProfileData] = useState([...Data.profileData]);
    
      const handleColumnSort = columnKey => {
        const selectedColumn = columns.find(column => column.key === columnKey);
    
        if (!selectedColumn['allowedToSort']) {
          return;
        }
        let _sortData;
        if (columnKey == sortData.column) {
          _sortData = {
            ...sortData,
            sorting: sortData.sorting === 'asc' ? 'desc' : !sortData.sorting ? 'asc' : null
          };
        } else {
          _sortData = { column: columnKey, sorting: 'asc' };
        }
    
        if (_sortData.column) {
          switch (_sortData.sorting) {
            case 'asc':
              if (selectedColumn['dataType'] === 'date') {
                setProfileData(profileData => _.orderBy(profileData, [_sortData.column], ['asc']));
              } else {
                setProfileData(profileData => _.orderBy(profileData, [_sortData.column]), ['asc']);
              }
              break;
            case 'desc':
              if (selectedColumn['dataType'] === 'date') {
                setProfileData(profileData => _.orderBy(profileData, [_sortData.column], ['desc']));
              } else {
                setProfileData(profileData => _.orderBy(profileData, [_sortData.column], ['desc']));
              }
    
              break;
            default:
              setProfileData([...Data.profileData]);
          }
        }
        setSortData({ ..._sortData });
      };

      const SupervisorReasonsDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialog-paper': { maxWidth: "100rem", maxHeight: "auto", padding: '1.5rem' }
      }));

  return (
    
    <SupervisorReasonsDialog className='dialog' open={props.open} >
      <div className='d-dialog-requester-container'>
        <div className='d-dialog-requester'>
          <span className='d-dialog-requester-title'> Requester </span>
          <div className='d-dialog-requester-user'>{`${firstName.value} ${lastName.value}`} </div>
        </div>
      </div>

      <IconButton
        className='close-icon'
        aria-label='close'
        component='span'
        onClick={props.close}
      >
      <p>Close</p>  <Close />
      </IconButton>

      <DialogTitle className="dialog-title"> Override Reasons</DialogTitle>
      <DialogContent>
        <TableContainer className='profile-list-table-container'>
              <Table
                aria-label='simple table'
                className='d-dialog-profile-list-table'
                size='small'
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => {
                      return (
                        <TableCell key={column.key} onClick={() => handleColumnSort(column.key)}>
                          {column.label}
                          <span className='d-dialog-sort-icon'>
                            {(sortData.column !== column.key ||
                              (sortData.column === column.key && !sortData.sorting)) && (
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='20'
                                viewBox='0 0 16 20'
                                fill='none'
                              >
                                <path
                                  d='M8 4L4 0L0 4H3L3 19H5L5 4H8ZM8 16L12 20L16 16H13L13 1H11L11 16H8Z'
                                  fill='black'
                                />
                              </svg>
                            )}
                            {sortData.column === column.key && sortData.sorting === 'asc' && (
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='20'
                                viewBox='0 0 16 20'
                                fill='none'
                              >
                                <g clip-path='url(#clip0_65_13)'>
                                  <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M4 0L8 4H5V19H3V4H0L4 0Z'
                                    fill='#CCCCCC'
                                  />
                                  <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M8 16L12 20L16 16H13V1H11V16H8Z'
                                    fill='black'
                                  />
                                </g>
                                <defs>
                                  <clipPath id='clip0_65_13'>
                                    <rect width='16' height='20' fill='white' />
                                  </clipPath>
                                </defs>
                              </svg>
                            )}
                            {sortData.column === column.key && sortData.sorting === 'desc' && (
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='20'
                                viewBox='0 0 16 20'
                                fill='none'
                              >
                                <g clip-path='url(#clip0_65_27)'>
                                  <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M4 0L8 4H5V19H3V4H0L4 0Z'
                                    fill='black'
                                  />
                                  <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M8 16L12 20L16 16H13V1H11V16H8Z'
                                    fill='#CCCCCC'
                                  />
                                </g>
                                <defs>
                                  <clipPath id='clip0_65_27'>
                                    <rect width='16' height='20' fill='white' />
                                  </clipPath>
                                </defs>
                              </svg>
                            )}
                          </span>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profileData.map((profile, index) => (
                    <TableRow key={profile + index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className='profile-name'>{profile.supervisor}</TableCell>
                      <TableCell>{profile.reason}</TableCell>
                      <TableCell>{profile.dateAndTime}</TableCell>                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        </TableContainer>     
    </DialogContent>    
  </SupervisorReasonsDialog>
  );
};

export default SupReasonsDialog;