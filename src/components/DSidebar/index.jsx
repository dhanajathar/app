import {
  Airlines as AirlineIcon,
  DashboardOutlined as DashboardIcon,
  LoginOutlined as LoginIcon,
  SettingsOutlined as SettingsIcon,
  ShoppingCartOutlined as ShoppingCartIcon,
  PersonOutlined as UserIcon
} from '@mui/icons-material';
import React, { useState } from 'react';
import {
  adminRoutingPrefix,
  customerProfileRoutingPrefix,
  dashboardRoutingPrefix,
  loginRoutingPrefix,
  selectTransactionRoutingPrefix,
  transactionRoutingPrefix
} from '../../routing/constants';

import { Drawer } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/dc-dmv-logo.png';

const DSidebar = () => {
  const [open, setOpen] = useState(false);
  //   const toggleDrawer =
  //     (open: boolean) =>
  //     (event: React.KeyboardEvent | React.MouseEvent) => {
  //       if (
  //         event.type === 'keydown' &&
  //         ((event as React.KeyboardEvent).key === 'Tab' ||
  //           (event as React.KeyboardEvent).key === 'Shift')
  //       ) {
  //         return;
  //       }

  //       setState({ ...state, [anchor]: open });
  //     };

  return (
    <div className='d-sidebar'>
      <nav className='d-sidebar-menu'>
        <div className='d-sidebar-logo-container'>
          <img src={logo} className='d-sidebar-logo' />
        </div>
        <Link to={`/${dashboardRoutingPrefix}`} className='d-sidebar-menu-button'>
          <div className='d-sidebar-icon-container'>
            <DashboardIcon className='d-sidebar-icon' />
          </div>
        </Link>
        <Link to={`/${adminRoutingPrefix}/`} className='d-sidebar-menu-button'>
          <div className='d-sidebar-icon-container'>
            <SettingsIcon className='d-sidebar-icon' />
          </div>
        </Link>
        <Link to={`/${selectTransactionRoutingPrefix}/`} className='d-sidebar-menu-button'>
          <div className='d-sidebar-icon-container'>
            <ShoppingCartIcon className='d-sidebar-icon' />
          </div>
        </Link>
        <Link to={`/${customerProfileRoutingPrefix}/`} className='d-sidebar-menu-button'>
          <div className='d-sidebar-icon-container'>
            <UserIcon className='d-sidebar-icon' />
          </div>
        </Link>
        <Link to={`/${transactionRoutingPrefix}/`} className='d-sidebar-menu-button'>
          <div className='d-sidebar-icon-container'>
            <AirlineIcon className='d-sidebar-icon' />
          </div>
        </Link>
        <Link to={`/${loginRoutingPrefix}`} className='d-sidebar-menu-button'>
          <div className='d-sidebar-icon-container'>
            <LoginIcon className='d-sidebar-icon' />
          </div>
        </Link>
        <Link to={`/${loginRoutingPrefix}/welcome`} className='d-sidebar-menu-button'>
          <div className='d-sidebar-icon-container'>
            <AirlineIcon className='d-sidebar-icon' />
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default DSidebar;
