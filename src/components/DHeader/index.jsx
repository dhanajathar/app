import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import {
  Logout,
  NotificationsNoneOutlined as NotificationsIcon,
  PersonAdd,
  SearchOutlined as SearchIcon,
  Settings
} from '@mui/icons-material';
import { dashboardRoutingPrefix, searchRoutingPrefix } from '../../routing/constants';

import { Link } from 'react-router-dom';
import React from 'react';
import avatar from '../../assets/img/profile.jpg';

const DHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className='d-header'>
      <div className='d-header-left'></div>
      <div className='d-header-right'>
        <Link to={`/${searchRoutingPrefix}/`} className='d-header-menu-button'>
          <div className='d-header-icon-container'>
            <SearchIcon className='d-header-icon' sx={{ fontSize: 30 }} />
          </div>
        </Link>
        <Link to={`/${dashboardRoutingPrefix}/`} className='d-header-menu-button'>
          <div className='d-header-icon-container'>
            <NotificationsIcon className='d-header-icon' sx={{ fontSize: 30 }} />
          </div>
        </Link>
        <Tooltip arrow title='Account settings'>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar src={avatar} sx={{ width: 32, height: 32 }}></Avatar>
          </IconButton>
        </Tooltip>
      </div>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize='small' />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </header>
  );
};

export default DHeader;
