import React, { Suspense, lazy } from 'react';
import {
  adminRoutingPrefix,
  customerProfileRoutingPrefix,
  dashboardRoutingPrefix,
  loginRoutingPrefix,
  searchRoutingPrefix,
  selectTransactionRoutingPrefix,
  surrenderTagRoutingPrefix,
  transactionRoutingPrefix
} from './constants';

import { DLayout } from '../components/DLayout';

const SearchLazy = lazy(() => import('../components/DSearchPage'));
const LoginLazy = lazy(() => import('../components/DLogin'));
const DashboardLazy = lazy(() => import('../components/DDashboard'));
const CustomerProfileLazy = lazy(() => import('../components/DCustomerProfile'));
const SelectTransactionLazy = lazy(() => import('../components/DSelectTransaction'));
const TransactionLazy = lazy(() => import('../components/DTransaction'));
const SurrenderTagLazy = lazy(() => import('../components/DSurrenderTag'));
const AdminLazy = lazy(() => import('../components/DAdmin'));

export const routes = [
  {
    path: '/',
    element: <DLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback='Loading Dashboard...'>
            <DashboardLazy />
          </Suspense>
        )
      },
      {
        path: `/${dashboardRoutingPrefix}/*`,
        element: (
          <Suspense fallback='Loading Dashboard...'>
            <DashboardLazy />
          </Suspense>
        )
      },
      {
        path: `/${searchRoutingPrefix}/*`,
        element: (
          <Suspense fallback='Loading Search...'>
            <SearchLazy />
          </Suspense>
        )
      },
      {
        path: `/${customerProfileRoutingPrefix}/*`,
        element: (
          <Suspense fallback='Loading Customer Profile...'>
            <CustomerProfileLazy />
          </Suspense>
        )
      },
      {
        path: `/${loginRoutingPrefix}/*`,
        element: (
          <Suspense fallback='Loading Login...'>
            <LoginLazy />
          </Suspense>
        )
      },
      {
        path: `/${selectTransactionRoutingPrefix}/*`,
        element: (
          <Suspense fallback='Loading Select Transaction...'>
            <SelectTransactionLazy />
          </Suspense>
        )
      },
      {
        path: `/${transactionRoutingPrefix}/*`,
        element: (
          <Suspense fallback='Loading Transaction Orchestrator...'>
            <TransactionLazy />
          </Suspense>
        )
      },
      {
        path: `/${surrenderTagRoutingPrefix}/*`,
        element: (
          <Suspense fallback='Loading Surrender Tag Orchestrator...'>
            <SurrenderTagLazy />
          </Suspense>
        )
      },
      {
        path: `/${adminRoutingPrefix}/*`,
        element: (
          <Suspense fallback='Loading Administration Pages...'>
            <AdminLazy />
          </Suspense>
        )
      },
      {
        path: `*`,
        element: (
          <Suspense fallback='Loading Login...'>
            <LoginLazy />
          </Suspense>
        )
      }
    ]
  }
];
