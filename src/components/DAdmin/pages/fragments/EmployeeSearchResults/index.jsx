/*
 * Author: Swathi Kudikala
 * Created:
 * Last Modified: 2023-12-01
 * Description: This file shows the read-only information of employee search results.
 * Application Release Version:1.0.0
 */
import React, { useState, useEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Data from './api-search-results-list.json';
import './index.css';
import '../../../index.css';
import * as _ from 'lodash';
import { Button, TableFooter, TablePagination, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIos } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

const EmployeeSearchResults = props => {
  const [sortData, setSortData] = useState({
    column: null,
    sorting: null
  });
  const [columns, setColumns] = useState(Data.columns);
  const [searchResults, setSearchResults] = useState([...Data.searchResults]);
  const [filteredResults, setFilteredResults] = useState([...Data.searchResults]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      const firstRow = tableRef.current.querySelector('tbody > tr');
      if (firstRow) {
        setTimeout(() => {
          firstRow.focus();
        }, 500);
      }
    }

    applyInitialSearchFilter();
  }, []);

  const handleColumnSort = columnKey => {
    const selectedColumn = columns.find(column => column.key === columnKey);
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
            setFilteredResults(employee => _.orderBy(employee, [_sortData.column], ['asc']));
          } else {
            setFilteredResults(employee => _.orderBy(employee, [_sortData.column]), ['asc']);
          }
          break;
        case 'desc':
          if (selectedColumn['dataType'] === 'date') {
            setFilteredResults(employee => _.orderBy(employee, [_sortData.column], ['desc']));
          } else {
            setFilteredResults(employee => _.orderBy(employee, [_sortData.column], ['desc']));
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

  const applyInitialSearchFilter = () => {
    const empSearchData = props.empSearchData;

    if (!empSearchData) {
      return;
    }

    if (empSearchData['location']?.toLowerCase() === 'all locations') {
      delete empSearchData.location;
    }

    for (let key of Object.keys(empSearchData)) {
      if (!empSearchData[key] || empSearchData[key].trim() === '') {
        delete empSearchData[key];
      }
    }

    const employeeSearchKeys = Object.keys(empSearchData);
    employeeSearchKeys.forEach(key => {
      if (typeof empSearchData[key] === 'string') {
        empSearchData[key] = empSearchData[key].toLowerCase();
      }
    });

    const mappedSearchResults = searchResults.map(result => {
      const _result = { ...result };
      Object.keys(empSearchData).forEach(key => {
        if (typeof _result[key] === 'string') {
          _result[key] = _result[key].toLowerCase();
        }
      });
      return _result;
    });

    let filterKeys = Object.keys(empSearchData);

    if (!filterKeys.length) {
      return;
    }
    const matched = [];
    if (filterKeys.length === 1) {
      const filterKey = filterKeys[0];
      for (let result of mappedSearchResults) {
        if (!!result[filterKey] && !!empSearchData[filterKey]) {
          switch (filterKey) {
            case 'jobTitle':
            case 'location':
            case 'loginId':
              if (result[filterKey] === empSearchData[filterKey]) {
                matched.push(result);
              }
              break;
            case 'employeeId':
              if (result[filterKey] == empSearchData[filterKey]) {
                matched.push(result);
              }
              break;
            default:
              if (result[filterKey].includes(empSearchData[filterKey])) {
                matched.push(result);
              }
          }
        }
      }
    } else {
      const _matched = _.filter(mappedSearchResults, empSearchData);
      if (_matched.length) {
        matched.push(..._matched);
      }
    }

    if (matched.length) {
      setSearchResults(matched);
      setFilteredResults(matched);
      setPage(0);
    } else {
      props.onResults(matched);
    }
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

    const newResults = searchResults.filter(employee =>
      JSON.stringify(employee).toLowerCase().includes(filterKey.toLowerCase())
    );

    setFilteredResults(newResults);
    setPage(0);
  };

  return (
    <React.Fragment>
      <div className='title'>
        Employee Maintenance / <span>Search Results</span>
      </div>

      <div className='admin-container d-container'>
        <div className='d-row '>
          <div className='col-12 sub_title create-new-button'>
            <div>
              <div className='serach-results-length'>Employees ({searchResults.length})</div>
              <Button
                className='create-button'
                size='small'
                variant='contained'
                onClick={() => {
                  navigate('/admin/new-employee/');
                }}
              >
                Create A New Employee Record
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
                  {columns.map(column => {
                    return (
                      <TableCell key={column.key} onClick={() => handleColumnSort(column.key)}>
                        {column.label}
                        <span className='sort-icon'>
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
                              <g clipPath='url(#clip0_65_13)'>
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
                              <g clipPath='url(#clip0_65_27)'>
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
                {(rowsPerPage > 0
                  ? filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredResults
                ).map(employee => (
                  <TableRow className='search-result-row' key={employee.employeeId}>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.loginId}</TableCell>
                    <TableCell className='profile-name'>{employee.employeeName}</TableCell>
                    <TableCell>{employee.location}</TableCell>
                    <TableCell>{employee.jobTitle}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <span className={`employee-status ${employee.status}`}>
                        {employee.status}
                      </span>
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

export default EmployeeSearchResults;
