# DTable component

## Props

```
/**
 * Description:
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

```

## Sample Code

```javascript
/* eslint-disable no-unused-vars */
import React from 'react';
import { orderBy as _orderBy } from 'lodash';
import DTable from '..';
import Button from '@mui/material';

const SampleDTable = () => {
  const data = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      age: 28,
      status: 'active',
      dob: '05/15/1994'
    },
    {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      age: 35,
      status: 'inactive',
      dob: '02/20/1987'
    },
    {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      age: 22,
      status: 'active',
      dob: '11/10/2000'
    },
    {
      firstName: 'Emily',
      lastName: 'Brown',
      email: 'emily.brown@example.com',
      age: 30,
      status: 'inactive',
      dob: '08/25/1991'
    },
    {
      firstName: 'David',
      lastName: 'Miller',
      email: 'david.miller@example.com',
      age: 40,
      status: 'active',
      dob: '03/18/1982'
    },
    {
      firstName: 'Sophia',
      lastName: 'Wilson',
      email: 'sophia.wilson@example.com',
      age: 25,
      status: 'inactive',
      dob: '06/30/1997'
    },
    {
      firstName: 'James',
      lastName: 'Anderson',
      email: 'james.anderson@example.com',
      age: 32,
      status: 'active',
      dob: '09/14/1989'
    },
    {
      firstName: 'Olivia',
      lastName: 'Davis',
      email: 'olivia.davis@example.com',
      age: 28,
      status: 'inactive',
      dob: '12/05/1993'
    },
    {
      firstName: 'Daniel',
      lastName: 'Thomas',
      email: 'daniel.thomas@example.com',
      age: 29,
      status: 'active',
      dob: '04/22/1992'
    },
    {
      firstName: 'Mia',
      lastName: 'Taylor',
      email: 'mia.taylor@example.com',
      age: 31,
      status: 'inactive',
      dob: '07/12/1990'
    }
  ];
  const columns = [
    {
      id: 'firstName',
      label: 'First Name'
    },
    {
      id: 'lastName',
      label: 'Last Name'
    },
    {
      id: 'email',
      label: 'Email'
    },
    {
      id: 'dob',
      label: 'Date Of Birth',
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
    }
  ];

  const customCells = {
    status: row => (
      <Button buttonText={row.status} color={row.status === 'active' ? 'success' : 'error'} />
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
      data={data.map((user, index) => ({ ...user, siNo: index + 1 }))} // Required
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
```
