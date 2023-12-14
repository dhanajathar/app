import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from '@mui/material';
import { DEventService, DEvents } from '../../../services/DEventService';
import React, { useState } from 'react';

import PropTypes from 'prop-types';
import historyData from '../assets/searchHistory.json';
import img from '../assets/tempImage.png';
import { useNavigate } from 'react-router-dom';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className='search-result-table-head'>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            id={headCell.id}
            align={headCell.align}
            padding='none'
            sortDirection={orderBy === headCell.id ? order : false}
            className='search-result-table-head'
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className='visually-hidden'>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              <span>{headCell.label}</span>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired
};

export function SearchHistory({isSearchCertifier, onBackPage, onUserDetails}) {
  const navigate = useNavigate();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  let data = historyData;

  const headCells = data.schema;
  const rows = data.results;
  const resultLength = data.results.length;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      rows
        .slice()
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );

  const handleClick = (e, data) => {
    if(isSearchCertifier){
      onUserDetails()
    }else {
    DEventService.dispatch(DEvents.ROUTE, {
      detail: { path: `/customer-profile/?${data.customerId}`, body: `${data.customerId}` }
    });
  }
  };

  const handleNewCustomerClick = () => {
  
    DEventService.dispatch(DEvents.ROUTE, {
      detail: { path: `/edit-customer` }
    });

  };

  const getRowItem = myItem => {
    return <TableCell>{myItem}</TableCell>;
  };

  if (resultLength === 0) {
    return (
      <div className='page-container'>
        <div className='search-result-neg'>
          <img src={img} alt='no search results graphic' width='150' height='164' />
          <div className='search-result-title'>No results Found</div>
          <div className='search-result-subtitle'>
            Sorry, we couldn't find what you are looking for.
          </div>
          <div onClick={() => navigate('/')} className='inline-link'>
            Try searching again
          </div>
          <Button onClick={() => handleNewCustomerClick()} color='primary' variant='contained'>
            {' '}
            CREATE A NEW CUSTOMER RECORD{' '}
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className='page-container'>
        <div className='search-title-text'> Search History</div>
        <div className='search-result-card'>
          <TableContainer className='search-result-container'>
            <Table
              stickyHeader
              className='search-result-table'
              aria-labelledby='tableTitle'
              size='small'
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={headCells}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row)}
                      role='checkbox'
                      tabIndex={-1}
                      key={index}
                      sx={{ cursor: 'pointer' }}
                      className={
                        index % 2 == 0
                          ? 'search-result-row'
                          : 'search-result-row search-result-table-even'
                      }
                    >
                      {Object.entries(row).map((item, idx) => {
                        return (
                          <TableCell key={idx} align={headCells[idx]?.align}>
                            {headCells[idx].id === 'superStatus' ||
                            headCells[idx].id === 'transactionStatus' ? (
                              <span className={`search-${item[1]}`}> {item[1]} </span>
                            ) : (
                              <>{item[1]}</>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 33 * emptyRows
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
        <div>
          <Button
            className='back-button'
            color='primary'
            variant='outlined'
            onClick={() => isSearchCertifier ? onBackPage(): navigate('/search')}
          >
            Back
          </Button>
        </div>
      </div>
    );
  }
}
