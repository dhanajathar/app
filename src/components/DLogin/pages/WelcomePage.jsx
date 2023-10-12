import { Container, Grid } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CssBaseline from '@mui/material/CssBaseline';
import DcircleLoader from '../../DCircleLoader';
import ImgPageBtm from '../assets/dcgov.png';
import ImgPageTop from '../assets/dcdmv.png';
import React from 'react';

function Copyright() {
  return (
    <div className='welcome-footertext'>
      {' © '}
      2022 District of Columbia, Department of Motor Vehicles <br></br> All Rights Reserved.
    </div>
  );
}

const theme = createTheme({ palette: { background: { default: 'rgb(30,50,128)' } } });

const handleSubmit = event => {
  event.preventDefault();
  window.location.assign('http://localhost:3000');
};

export function WelcomePage() {
  return (
    <React.Fragment>
      <div className='d-login'>
        <div className='logo-container'>
          <div className='logo-circle'>
            <img className='logo-header' src={ImgPageTop} />
          </div>
        </div>
        <ThemeProvider theme={theme}>
          <Container component='main' maxWidth='xs' className='welcome-container'>
            <CssBaseline />
            <div className='welcome-box'>
              <div className='login-destext'>Destiny</div>
              <div className='welcome-user'>Welcome User!</div>
              <div onSubmit={handleSubmit} noValidate>
                <div className='welcome-logintext'>You're now logged in</div>
                <CheckCircleOutlineIcon
                  className='welcome-circleicon'
                  onClick={handleSubmit}
                ></CheckCircleOutlineIcon>
                <div className='welcome-loadprofiletext'>Loading Profile</div>
                <div className='welcome-loader'>
                  <DcircleLoader />
                </div>
              </div>
            </div>
          </Container>
          <div className='logofooter-container'>
            <div className='logofooter-circle'>
              <img className='logofooter' src={ImgPageBtm} />
            </div>
          </div>
        </ThemeProvider>
        <Grid container spacing={2} className='welcome-legacy' justifyContent='center'>
          <Grid item>PRIVACY POLICY</Grid>
          <Grid item>LEGAL NOTICES</Grid>
          <Grid item>SITEMAP</Grid>
        </Grid>
        <Copyright sx={{ pb: 4 }} />
      </div>
    </React.Fragment>
  );
}
