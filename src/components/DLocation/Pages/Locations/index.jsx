/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import * as _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SampleDTable from '../../../DTable/SampleDTable/SampleDTable';

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

  // This code will be used in future

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

  return <SampleDTable />;
};

Locations.propTypes = {};

export default Locations;
