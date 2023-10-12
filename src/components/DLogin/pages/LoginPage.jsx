import { Alert, Button, Container, Divider, Grid, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import DAlertBox from '../../DAlertBox';
import ImgPageBtm from '../assets/dcgov.png';
import ImgPageTop from '../assets/dcdmv.png';
import data from '../data/api-response';

function Copyright() {
  return (
    <div className='login-footertext'>
      {` © ${new Date().getFullYear()} District of Columbia, Department of Motor Vehicles`}
      <br />
      All Rights Reserved.
    </div>
  );
}

const theme = createTheme({ palette: { background: { default: 'rgb(30,50,128)' } } });

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [checkEmail, setCheckEmail] = useState(true);
  const [checkPassword, setCheckPassword] = useState(true);
  const [isEmailRevoke, setisEmailRevoke] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'email':
        if (!value) {
          setEmailError('Email is required');
          setCheckEmail(false);
        } else if (/^[a-z0-9]+$/i.test(value)) {
          setEmailError('');
          setCheckEmail(false);
          return;
        } else if (!/^[a-z0-9._%+-]+@dc\.gov$/i.test(value)) {
          setEmailError('Invalid Email');
          setCheckEmail(true);
        } else {
          setEmailError('');
          setCheckEmail(false);
        }
        break;
      case 'password':
        if (!value || value.length < 8) {
          setPasswordError('Invalid Password');
          setCheckPassword(true);
        } else if (value !== data.password) {
          setPasswordError('Invalid Password');
          setCheckPassword(true);
          return;
        } else {
          setPasswordError('');
          setCheckPassword(false);
        }
        break;
      default:
        break;
    }
  };

  const handleEmailChange = event => {
    const loginEmail = event.target.value;
    setEmail(loginEmail);
  };

  const handlePasswordChange = event => {
    const value = event.target.value;
    setPassword(value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    validateField('email', email);
    validateField('password', password);

    if (!checkEmail && !checkPassword) {
      if (email.toUpperCase().includes(data.revokedemail.toUpperCase())) {
        setShowAlert(true);
        setisEmailRevoke(true);
      } else {
        navigate('/entercode');
      }
    }
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      if (event.target.name === 'email') {
        validateField('email', email);
        if (!checkEmail) {
          document.getElementById('password').focus();
        }
      } else if (event.target.name === 'password') {
        validateField('password', password);
        if (!checkPassword && !checkEmail) {
          navigate('/entercode');
        }
      }
    }
  };

  return (
    <React.Fragment>
      <div className='d-login'>
        <div className='logo-container'>
          <div className='logo-circle'>
            <img className='logo-header' src={ImgPageTop} />
          </div>
        </div>
        <ThemeProvider theme={theme}>
          <Container component='main' maxWidth='xs' className='login-container'>
            <CssBaseline />
            <div className='login-box'>
              <div className='login-destext'>Destiny</div>
              <div onSubmit={handleSubmit} noValidate>
                {showAlert && isEmailRevoke && (
                  <Alert
                    className='logo-alert-error'
                    variant='filled'
                    severity='error'
                    onClose={() => setShowAlert(false)}
                  >
                    Account is not Active, please contact DMV IT Helpdesk for further assistance.
                  </Alert>
                )}
                <TextField
                  margin='normal'
                  autoComplete='off'
                  fullWidth
                  id='email'
                  label='DC Gov email address'
                  name='email'
                  variant='standard'
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={event => validateField('email', event.target.value)}
                  onKeyDown={handleKeyDown}
                  helperText={<DAlertBox errorText={emailError} />}
                  error={Boolean(emailError && (checkEmail || checkPassword))}
                  InputLabelProps={{
                    className: 'login-InputLabel' // Apply the CSS class to the label
                  }}
                />
                <TextField
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  variant='standard'
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={event => validateField('password', event.target.value)}
                  onKeyDown={handleKeyDown}
                  helperText={<DAlertBox errorText={passwordError} />}
                  error={Boolean(passwordError && (checkEmail || checkPassword))}
                  disabled={Boolean(emailError)} // Disable the password field if there is an error in the email field
                  InputLabelProps={{
                    className: 'login-InputLabel' // Apply the CSS class to the label
                  }}
                />
                <Grid
                  container
                  spacing={8}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  className='login-gridforgotp'
                >
                  <Grid item>
                    <Link href='#' variant='body2' className='login-forgotpass' tabIndex={-1}>
                      {'Forgot Email ID / Password?'}
                    </Link>
                  </Grid>
                  <Grid item>
                    <Button
                      type='submit'
                      variant='contained'
                      size='large'
                      color='primary'
                      border='none'
                      disabled={checkEmail || checkPassword}
                      onClick={handleSubmit}
                    >
                      LOGIN
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>

            <Divider className='login-divderlog'>Login with</Divider>

            <Grid
              container
              spacing={4}
              justifyContent='space-evenly'
              className='login-footer-container'
            >
              <Grid item style={{ display: 'block' }}>
                <img src='https://img.icons8.com/ios/50/null/face-id--v1.png' alt='image' />
                <div className='login-facetouch'>FACE ID</div>
              </Grid>
              <Grid item style={{ display: 'block' }}>
                <img src='https://img.icons8.com/ios/50/null/fingerprint--v1.png' alt='image' />
                <div className='login-facetouch'>TOUCH ID</div>
              </Grid>
            </Grid>
          </Container>
          <div className='logofooter-container'>
            <div className='logofooter-circle'>
              <img className='logofooter' src={ImgPageBtm} />
            </div>
          </div>
        </ThemeProvider>
        <Grid container spacing={2} className='login-legacy' justifyContent='center'>
          <Grid item>PRIVACY POLICY</Grid>
          <Grid item>LEGAL NOTICES</Grid>
          <Grid item>SITEMAP</Grid>
        </Grid>
        <Copyright sx={{ pb: 4 }} />
      </div>
    </React.Fragment>
  );
}
