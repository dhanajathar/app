import '../DDialog.css';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Data from '../data/api-sup-reasons-list.json';
import * as _ from 'lodash';
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
import { Close } from '@mui/icons-material';
import userData from '../../DTransaction/pages/IndividualDetails/api-individual-details.json';
import SortSvg from '../../../assets/svg/sort.svg';
import AscSortSvg from '../../../assets/svg/sort-asc.svg';
import DescSortSvg from '../../../assets/svg/sort-desc.svg';

const SupReasonsDialog = props => {
  const { open, close } = props;

  SupReasonsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
  };

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

  return (
    <Dialog className='dialog supervisor-reasons-dialog' open={open}>
      <div className='d-dialog-requester-container'>
        <div className='d-dialog-requester'>
          <span className='d-dialog-requester-title'> Requester </span>
          <div className='d-dialog-requester-user'>{`${firstName.value} ${lastName.value}`} </div>
        </div>
      </div>

      <IconButton className='close-icon' aria-label='close' component='span' onClick={close}>
        <p>Close</p> <Close />
      </IconButton>

      <DialogTitle className='dialog-title'> Override Reasons</DialogTitle>
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
                          <img src={SortSvg} alt='My Sort SVG' />
                        )}
                        {sortData.column === column.key && sortData.sorting === 'asc' && (
                          <img src={AscSortSvg} alt='My Asc SVG' />
                        )}
                        {sortData.column === column.key && sortData.sorting === 'desc' && (
                          <img src={DescSortSvg} alt='My Desc SVG' />
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
    </Dialog>
  );
};

export default SupReasonsDialog;
