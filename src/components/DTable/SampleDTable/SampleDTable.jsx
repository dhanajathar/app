/*
 * Author: Swathi Kudikala
 * Created: 2023-12-29
 * Last Modified: 2024-01-02
 * Description: Sample component for DTable.
 * Application Release Version:1.0.0
 */
/* eslint-disable no-unused-vars */
import React from 'react';
import { orderBy as _orderBy } from 'lodash';
import DTable from '..';
import { Button } from '@mui/material';

const SampleDTable = () => {
  const data = [
    {
      siNo: '01',
      location_name: 'BRENTWOOD ROAD TEST/CDL',
      location_type: 'BRANCH',
      main_phone: '(202) 762 1221',
      customer_service_phone: '(202) 762 1233',
      status: 'active',
      date: '01/26/1970'
    },
    {
      siNo: '02',
      location_name: 'C STREET SERVICE CENTER',
      location_type: 'BRANCH',
      main_phone: '(202) 762 1121',
      customer_service_phone: '(202) 762 1111',
      status: 'active',
      date: '02/26/1969'
    },
    {
      siNo: '03',
      location_name: 'COMMERCIAL DRIVER ROAD TEST',
      location_type: 'BRANCH',
      main_phone: '(202) 762 1342',
      customer_service_phone: '(202) 762 1243',
      status: 'inactive',
      date: '12/10/1980'
    },
    {
      siNo: '04',
      location_name: 'DESTINY PROJECT SITE',
      location_type: 'BRANCH',
      main_phone: '(202) 762 1457',
      customer_service_phone: '(202) 762 1134',
      status: 'active',
      date: '10/22/1985'
    },
    {
      siNo: '05',
      location_name: 'DMV WAREHOUSE',
      location_type: 'WAREHOUSE',
      main_phone: '(202) 762 1786',
      customer_service_phone: '(202) 762 1764',
      status: 'active',
      date: '05/10/1968'
    },
    {
      siNo: '06',
      location_name: 'DPW',
      location_type: 'BRANCH',
      main_phone: '(202) 762 6746',
      customer_service_phone: '(202) 762 1367',
      status: 'active',
      date: '05/20/1850'
    },
    {
      siNo: '07',
      location_name: 'DRIVING SCHOOL',
      location_type: 'BRANCH',
      main_phone: '(202) 762 5666',
      customer_service_phone: '(202) 762 1688',
      status: 'active',
      date: '01/26/1970'
    },
    {
      siNo: '08',
      location_name: 'GEORGETOWN SERVICE CENTER',
      location_type: 'BRANCH',
      main_phone: '(202) 762 4345',
      customer_service_phone: '(202) 762 1566',
      status: 'active',
      date: '01/26/1970'
    },
    {
      siNo: '09',
      location_name: 'BENNING RIDGE SERVICE CENTER',
      location_type: 'BRANCH',
      main_phone: '(202) 762 4346',
      customer_service_phone: '(202) 762 1567',
      status: 'active',
      date: '01/26/1970'
    },
    {
      siNo: '10',
      location_name: 'K STREET SERVICE CENTER',
      location_type: 'BRANCH',
      main_phone: '(202) 762 4347',
      customer_service_phone: '(202) 762 1568',
      status: 'active',
      date: '01/26/1970'
    },
    {
      siNo: '11',
      location_name: 'DEANWOOD ROAD TEST/CDL',
      location_type: 'BRANCH',
      main_phone: '(202) 762 4348',
      customer_service_phone: '(202) 762 1569',
      status: 'active',
      date: '01/26/1970'
    },
    {
      siNo: '12',
      location_name: 'INSPECTION STATION, NE',
      location_type: 'BRANCH',
      main_phone: '(202) 762 4349',
      customer_service_phone: '(202) 762 1570',
      status: 'active',
      date: '01/26/1970'
    }
  ];
  const columns = [
    {
      id: 'siNo',
      label: 'SI No'
    },
    {
      id: 'location_name',
      label: 'Location Name'
    },
    {
      id: 'location_type',
      label: 'Location Type'
    },
    {
      id: 'main_phone',
      label: 'Main Phone#'
    },
    {
      id: 'customer_service_phone',
      label: 'Customer Service Phone#'
    },
    {
      id: 'date',
      label: 'Date',
      sortingMethod: (rows, order) => {
        console.log({ rows, order });
        const updatedRows = rows.map(row => ({
          ...row,
          flatDate: new Date(row['date']).getTime()
        }));
        const sortedRows = _orderBy(updatedRows, ['flatDate'], [order]);
        return sortedRows;
      }
    },
    {
      id: 'status',
      label: 'Status'
    },
    {
      id: 'actionIcon',
      label: '',
      disableLabel: true,
      stylingClassName: 'locations-action-cell'
    }
  ];

  const customCells = {
    status: row => (
      <Button variant='contained' className={` location-status ${row.status}`}>
        {row.status}
      </Button>
    )
  };

  const handleColumnSort = event => {
    // Write your logic for column sort event here
  };

  const handleRowClick = row => {
    // Write your logic for row click event here
  };

  const handlePageChange = page => {
    // Write your logic for page change event here
  };

  return (
    <DTable
      columns={columns} // Required
      data={data.map((location, index) => ({ ...location, siNo: index + 1 }))} // Required
      onSortChange={handleColumnSort} // Optional
      customCells={customCells} // Optional
      onBodyRowClick={handleRowClick} // Optional
      defaultPage={0} // Optional
      onPageChange={handlePageChange} // Optional
      rowsPerPageOptions={[5, 10, 15, { value: -1, label: 'All' }]} // Optional
    />
  );
};

export default SampleDTable;
