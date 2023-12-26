/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import * as _ from 'lodash';
import {
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  TableFooter,
  TablePagination,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIos } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import SORT from '../../../../assets/svg/sort.svg';
import SORT_ASC from '../../../../assets/svg/sort-desc.svg';
import SORT_DESC from '../../../../assets/svg/sort-desc.svg';

const gridColumns = [
  {
    key: 'siNo',
    label: 'SI No'
  },
  {
    key: 'location_name',
    label: 'Location Name'
  },
  {
    key: 'location_type',
    label: 'Location Type'
  },
  {
    key: 'main_phone',
    label: 'Main Phone'
  },
  {
    key: 'customer_service_phone',
    label: 'Customer Service Phone'
  },
  {
    key: 'status',
    label: 'Status'
  }
];

const Locations = props => {
  const [anchorEl, setAnchorEl] = useState(false);
  const [anchorSiNo, setAnchorSiNo] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event, siNo) => {
    setAnchorEl(event.currentTarget);
    setAnchorSiNo(siNo);
  };
  const handleClose = () => {
    setAnchorEl(false);
    setAnchorSiNo(false);
  };
  const [sortData, setSortData] = useState({
    column: null,
    sorting: null
  });

  const [searchResults, setSearchResults] = useState();
  const [filteredResults, setFilteredResults] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const anchorRef = React.useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      const firstRow = tableRef.current.querySelector('tbody > tr');
      if (firstRow) {
        setTimeout(() => {
          firstRow.focus();
        }, 500);
      }
    }

    const options = {
      url: '/src/components/DLocation/pages/Locations/locations-list-api-response.json',
      method: 'GET'
    };

    axios(options)
      .then(({ data }) => {
        if (data) {
          setSearchResults(data);
          setFilteredResults(data);
        }
      })
      .catch(error => {
        console.error({ error });
      });
  }, []);

  const handleColumnSort = columnKey => {
    const selectedColumn = gridColumns.find(column => column.key === columnKey);
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
            setFilteredResults(result => _.orderBy(result, [_sortData.column], ['asc']));
          } else {
            setFilteredResults(result => _.orderBy(result, [_sortData.column]), ['asc']);
          }
          break;
        case 'desc':
          if (selectedColumn['dataType'] === 'date') {
            setFilteredResults(result => _.orderBy(result, [_sortData.column], ['desc']));
          } else {
            setFilteredResults(result => _.orderBy(result, [_sortData.column], ['desc']));
          }
          break;
        default:
          setFilteredResults([...searchResults]);
      }
    }
    setSortData({ ..._sortData });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filterResults = filterKey => {
    if (!filterKey) {
      setFilteredResults(searchResults);
      setPage(0);
      return;
    }

    if (filterKey.length < 3) {
      return;
    }

    const newResults = searchResults.filter(location =>
      JSON.stringify(Object.values(location).join(', '))
        .toLowerCase()
        .includes(filterKey.toLowerCase())
    );

    setFilteredResults(newResults);
    setPage(0);
  };

  if (!searchResults || !searchResults.length) {
    return <></>;
  }

  const handleIconClick = () => {};

  return (
    <React.Fragment>
      <div className='title'>
        Location Maintenance / <span>Locations</span>
      </div>

      <div className='admin-container d-container'>
        <div className='d-row '>
          <div className='col-12 sub_title create-new-button'>
            <div>
              <div className='serach-results-length'>Locations ({searchResults.length})</div>
              <Button
                className='create-button'
                size='small'
                variant='contained'
                // onClick={() => {
                //   navigate("/admin/new-employee/");
                // }}
              >
                Add a new Location
              </Button>
            </div>
            <TextField
              className='search-filter'
              placeholder='Search'
              size='small'
              InputProps={{
                startAdornment: <SearchIcon fontSize='small' />
              }}
              onChange={e => filterResults(e.target.value)}
            />
          </div>
        </div>
        <div className=' list-view'>
          <TableContainer className='search-result-container'>
            <Table
              ref={tableRef}
              aria-label='simple table'
              className='search-results-table'
              size='small'
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  {gridColumns.map(column => {
                    return (
                      <TableCell key={column.key} onClick={() => handleColumnSort(column.key)}>
                        {column.label}
                        <span className='sort-icon'>
                          {(sortData.column !== column.key ||
                            (sortData.column === column.key && !sortData.sorting)) && (
                            <img src={SORT} alt='Sort' />
                          )}
                          {sortData.column === column.key && sortData.sorting === 'asc' && (
                            <img src={SORT_ASC} alt='Sort' />
                          )}
                          {sortData.column === column.key && sortData.sorting === 'desc' && (
                            <img src={SORT_DESC} alt='Sort' />
                          )}
                        </span>
                      </TableCell>
                    );
                  })}
                  <TableCell key='actions'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredResults
                ).map(location => (
                  <TableRow className='search-result-row' key={location.siNo}>
                    <TableCell>{location.siNo}</TableCell>
                    <TableCell className='profile-name'>{location.location_name}</TableCell>
                    <TableCell>{location.location_type}</TableCell>
                    <TableCell>{location.main_phone}</TableCell>
                    <TableCell>{location.customer_service_phone}</TableCell>
                    <TableCell>
                      <span className={`location-status ${location.status}`}>
                        {location.status}
                      </span>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton
                        aria-label='more'
                        id='demo-positioned-button'
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={e => handleClick(e, location.siNo)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Popover
                        open={anchorSiNo && anchorSiNo == location.siNo}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'center',
                          horizontal: 'left'
                        }}
                      >
                        <List
                          subheader={
                            <ListSubheader component='div' id='nested-list-subheader'>
                              OPTIONS
                            </ListSubheader>
                          }
                        >
                          <ListItemButton>
                            <ListItemIcon className='menu-list-item-icon'>
                              <SearchIcon />
                            </ListItemIcon>
                            <ListItemText primary='View Details' />
                          </ListItemButton>
                          <ListItemButton>
                            <ListItemIcon className='menu-list-item-icon'>
                              <CreateOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary='Edit' />
                          </ListItemButton>
                          {location.status === 'active' && (
                            <ListItemButton>
                              <ListItemIcon className='menu-list-item-icon'>
                                <PowerSettingsNewOutlinedIcon />
                              </ListItemIcon>
                              <ListItemText primary='Mark as Inactive' />
                            </ListItemButton>
                          )}
                        </List>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className='table-footer'>
                <TableRow>
                  <TablePagination
                    labelRowsPerPage='Items per page'
                    rowsPerPageOptions={[10, 25, 50, 100, { label: 'All', value: -1 }]}
                    colSpan={7}
                    count={filteredResults.length}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'Items per page'
                      },
                      native: false
                    }}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div className='navigation-footer'>
        <Button
          className='back-to-search-button'
          variant='text'
          color='primary'
          size='small'
          startIcon={<ArrowBackIos />}
          onClick={() => navigate('/search')}
        >
          Back To Search
        </Button>
      </div>
    </React.Fragment>
  );
};

Locations.propTypes = {};

export default Locations;
