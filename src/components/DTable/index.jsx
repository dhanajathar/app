/*
 * Author: Swathi Kudikala
 * Created: 2023-12-29
 * Last Modified: 2024-01-02
 * Description: Reusable table component.
 * Application Release Version:1.0.0
 */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { orderBy as _orderBy } from 'lodash';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import './index.css';

import SORT from '../../assets/svg/sort.svg';
import SORT_ASC from '../../assets/svg/sort-asc.svg';
import SORT_DESC from '../../assets/svg/sort-desc.svg';

// Please refer to SampleDTable.jsx file for code reference

/**
 * A table component that displays data in a tabular format.
 * @prop {{Array}} data - The array of data to be displayed in the table.
 * @prop {{Array}} columns - The array of column configurations for the table.
 * @prop {{string}} defaultSortColumn - The default column to sort the table by.
 * @prop {{string}} defaultSortOrder - The default sort order for the table.
 * @prop {{Array}} [rowsPerPageOptions=[10, 25, 50, 100, { label: "All", value: -1 }]] - The options for the number of rows per page.
 * @prop {{function}} [onSortChange=()=>{}] - The callback function to
 * @prop {{function}} onPageChange - Callback function triggered when the page changes.
 * @prop {{object}} customCells - Custom cell components to be rendered in the table.
 * @prop {{string}} filterKey - The key used for filtering the data.
 * @prop {{function}} onBodyRowClick - Callback function triggered when a row is clicked.
 * @prop {{array}} data - The data to be displayed in the table.
 * @prop {{array}} columns - The columns to be displayed in the table.
 * @prop {{string}} defaultSortColumn - The default column to sort the table by.
 */
const DTable = ({
  data,
  columns,
  defaultSortColumn,
  defaultSortOrder = null,
  defaultPage = 0,
  rowsPerPageOptions = [10, 25, 50, 100, { label: 'All', value: -1 }],
  onSortChange = () => {},
  onPageChange = () => {},
  customCells = {},
  filterKey,
  onBodyRowClick = () => {}
}) => {
  const [sortedData, setSortedData] = useState(data);
  const [orderBy, setOrderBy] = useState(defaultSortColumn);
  const [order, setOrder] = useState(defaultSortOrder);
  const [page, setPage] = useState(defaultPage);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  useEffect(() => {
    setSortedData(data);
    setPage(0);
  }, [data]);

  const handleRequestSort = property => {
    let newOrder;
    if (orderBy === property) {
      switch (order) {
        case 'asc':
          newOrder = 'desc';
          break;
        case 'desc':
          newOrder = null;
          break;
        default:
          newOrder = 'asc';
      }
    } else {
      newOrder = 'asc';
    }

    setOrder(newOrder);
    setOrderBy(property);
    onSortChange(property, newOrder);

    if (!newOrder) {
      setSortedData([...data]);
      setPage(0);
      return;
    }

    const columnToSort = columns.find(column => column.id === property);
    if (!columnToSort?.sortingMethod) {
      let newData;
      setSortedData(currentData => {
        newData = newOrder ? _orderBy(currentData, [property], [newOrder]) : [...data];
        return newData;
      });
    } else {
      setSortedData(columnToSort.sortingMethod(data, newOrder));
    }
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    onPageChange(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = event => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    onPageChange(0, newRowsPerPage);
  };

  const getSortingIcon = sortOrder => {
    if (sortOrder === 'asc') {
      return SORT_ASC;
    } else if (sortOrder === 'desc') {
      return SORT_DESC;
    } else {
      return SORT;
    }
  };

  return (
    <Paper elevation={0}>
      <TableContainer>
        <Table stickyHeader className='d-table' size='small'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  className={`${column.stylingClassName ? column.stylingClassName : ''}`}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {/* disableLabel */}
                  {column.disableLabel ? (
                    ''
                  ) : (
                    <TableSortLabel
                      active={orderBy === column.id}
                      // direction={orderBy === column.id ? (order ? order : "") : "asc"}
                      onClick={() => handleRequestSort(column.id)}
                      IconComponent={() => (
                        <img
                          className='sorting-icon'
                          src={getSortingIcon(orderBy === column.id ? order : null)}
                          alt='Sort'
                        />
                      )}
                    >
                      {column.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : sortedData
            ).map((row, index) => (
              <TableRow key={index} onClick={() => onBodyRowClick(row)}>
                {columns.map(column => {
                  return (
                    <TableCell
                      key={column.id}
                      className={`${column.stylingClassName ? column.stylingClassName : ''}`}
                    >
                      {customCells[column.id] ? customCells[column.id](row) : row[column.id]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component='div'
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

/**
 * PropTypes for the DTable component.
 * @prop {{array}} data - The array of data to be displayed in the table. (Required)
 * @prop {{array}} columns - The array of column configurations. Each column configuration should be an object with the following properties:
 *   - id: The unique identifier for the column. (Required)
 *   - label: The label to be displayed for the column. (Required)
 *   - disableLabel: A boolean indicating whether to disable the label for the column. (Optional)
 *   - stylingClassName: The CSS class name to apply to the column. (Optional)
 *   - sortingMethod: The custom sorting method for the column. (Optional)
 * (Required)
 * @prop {{string}} defaultSortColumn - The default column to sort by.
 * @prop {{string}} defaultSortOrder - The default sort order. Can be "asc", "desc", or null.
 * @prop {{array}} rowsPerPageOptions - An array of options for the number of rows per page.
 * @prop {{number}} defaultPage - The default page number.
 * @prop {{function}} onSortChange - Callback function for when the sort column or order changes.
 * @prop {{function}} onPageChange - Callback function for when the page changes.
 * @prop {{function}} onBodyRowClick - Callback function for when a row in the body is clicked.
 * @prop {{objectOf(function)}} customCells - An object containing custom cell renderers.
 * @prop {{string}} filterKey - The key to use for filtering the table.
 * @prop {{string}} size - The size of the table, can be one of "small", "medium", or "large".
 */

DTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disableLabel: PropTypes.bool,
      stylingClassName: PropTypes.string,
      sortingMethod: PropTypes.func
    })
  ).isRequired,
  defaultSortColumn: PropTypes.string,
  defaultSortOrder: PropTypes.oneOf(['asc', 'desc', null]),
  rowsPerPageOptions: PropTypes.arrayOf(
    PropTypes.number,
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.number })
  ),
  defaultPage: PropTypes.number,
  onSortChange: PropTypes.func,
  onPageChange: PropTypes.func,
  onBodyRowClick: PropTypes.func,
  customCells: PropTypes.objectOf(PropTypes.func),
  filterKey: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default DTable;
