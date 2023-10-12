import { Button, Card, CardContent, Container, Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import DoneIcon from '@mui/icons-material/Done';
import ImgPageBtm from '../assets/dcgov.png';
import ImgPageTop from '../assets/dcdmv.png';
import data from '../data/api-response';
import { useNavigate } from 'react-router-dom';

function isValidOtp(otp) {
  // Check if the OTP is numeric and has 6 digits
  return /^\d{6}$/.test(otp);
}

function validateForm(otp) {
  return isValidOtp(otp) && otp === data.OTP;
}

function getCardOpacity(selectedCard, cardType) {
  if (selectedCard && selectedCard !== cardType) {
    return 0.5;
  }
  return 1;
}

function Copyright() {
  return (
    <div className='ecode-footertext'>
      {' © '}
      2022 District of Columbia, Department of Motor Vehicles <br></br> All Rights Reserved.
    </div>
  );
}

function CardInput({ onChange, value, index }) {
  const inputRef = useRef(null);

  const handleInputChange = e => {
    const numericValue = e.target.value.replace(/\D/g, '');
    onChange(numericValue);
    if (numericValue && index < 5) {
      inputRef.current.nextSibling.focus();
    }
  };

  const handleInputKeyDown = e => {
    if (e.key === 'Backspace' && !value && index > 0) {
      inputRef.current.previousSibling.focus();
    }
  };

  return (
    <input
      ref={inputRef}
      type='text'
      pattern='[0-9]*'
      inputMode='numeric'
      value={value}
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      maxLength={1}
      className='validation-code-input'
      
    />
  );
}

function EmailMask({ email }) {
  const convertedEmail = email.replace(/^(\w).*(\w)@(.*)$/, '$1***$2') + '@dc.gov';
  return <div className='ecode-cardcontent-subtext'>{convertedEmail}</div>;
}

const theme = createTheme({ palette: { background: { default: 'rgb(30,50,128)' } } });

export function EnterCode() {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const cardData = data.cardData;

  function handleSubmit(event, otp, navigate) {
    event.preventDefault();

    const joinedOtp = otp.join('');

    if (validateForm(joinedOtp)) {
      // Valid form, proceed to verification or further action
      navigate('/welcome');
    } else {
      setIsOtpValid(false); // Set OTP validity to false
      setCounter(null); // Stop the counter immediately
    }
  }

  const handleCardClick = type => {
    if (counter !== null) {
      return;
    }
    setSelectedCard(type);
    setCounter(20); // Start the counter
  };

  const handleResend = type => {
    setSelectedCard(type);
    setCounter(20); // Start the counter
    setIsOtpValid(true); // Reset the OTP validity
    setOtp(['', '', '', '', '', '']); // Clear the OTP input field
  };

  const handleTrouble = () => {
    setSelectedCard(null); // Reset selected card
    setCounter(null); // Reset counter
    setIsOtpValid(true); // Reset the OTP validity
    setOtp(['', '', '', '', '', '']); // Clear the OTP input field
  };

  useEffect(() => {
    if (counter == 0) {
      setCounter(null); // Reset selected card
    }
    if (counter !== null && counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleOtpChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
  };

  return (
    <React.Fragment>
      <div className='d-login'>
        <div className='logo-container'>
          <div className='logo-circle'>
            <img className='logo-header' src={ImgPageTop} alt='Logo' />
          </div>
        </div>
        <ThemeProvider theme={theme}>
          <Container component='main' maxWidth='xs' className='ecode-container'>
            <CssBaseline />
            <div className='ecode-box'>
              <div className='login-destext'>Destiny</div>
              <Grid container direction='row' justifyContent={'center'} gap={1}>
                <Grid item xs={12}>
                  <div className='selectopt-optiontext'>SELECT AN OPTION</div>
                  <div className='selectopt-optiontext-subtext'>to login to your account</div>
                </Grid>
                {cardData.map(card => (
                  <Card
                    key={card.type}
                    onClick={() => handleCardClick(card.type)}
                    className={`ecode-card ${selectedCard === card.type ? 'selected' : ''} ${
                      getCardOpacity(selectedCard, card.type) === 0.5 ? 'disabled' : ''
                    }`}
                  >
                    {selectedCard == card.type && (
                      <div className='ecode-doneIcon'>
                        <DoneIcon />
                      </div>
                    )}
                    <CardContent className='ecode-cardcontent'>
                      <div className='ecode-cardcontent-text'>{card.type}</div>
                      {card.type === 'Email' ? (
                        <EmailMask email={card.content} />
                      ) : (
                        <div className='ecode-cardcontent-subtext'>{card.content}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Grid>

              <form
                onSubmit={event => handleSubmit(event, otp, navigate)}
                noValidate
                style={{ marginTop: '1rem' }}
              >
                <Grid item>
                  {/* <div className='ecode-codetext'>Code</div> */}
                  <div className='ecode-validcodetext'>ENTER VALIDATION CODE</div>
                  {otp.map((value, index) => (
                    <CardInput
                      key={index}
                      value={value}
                      onChange={newValue => handleOtpChange(index, newValue)}
                      index={index}
                    />
                  ))}
                  <div
                    className={`ecode-helper-text ${isOtpValid ? 'ecode-helpertext-hidden' : ''}`}
                  >
                    Invalid Code
                  </div>
                </Grid>

                <Grid item xs={12} textAlign={'end'} >
                  <Button
                    type='submit'
                    variant='contained'
                    className='ecode-verifybtn'
                    disabled={!isValidOtp(otp.join('')) || selectedCard === null}
                  >
                    VERIFY
                  </Button>
                </Grid>
                <Grid item xs={12} className='ecode-codevalid'>
                  {counter > 0 ? (
                    <div className='ecode-valid-counter'>Time remaining: {counter}</div>
                  ) : selectedCard ? (
                    <div className='ecode-resend-box'>
                      {/* <span className='ecode-resend' onClick={() => handleTrouble(selectedCard)}>
                        Having trouble? Sign in another way
                      </span> */}
                      <span className='ecode-resend' onClick={() => handleTrouble()}>
                        Try another validation method
                      </span>
                      <span className='ecode-resend' onClick={() => handleResend(selectedCard)}>
                        Resend code
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                </Grid>
              </form>
            </div>
          </Container>
          <div className='logofooter-container'>
            <div className='logofooter-circle'>
              <img className='logofooter' src={ImgPageBtm} alt='Footer Logo' />
            </div>
          </div>
        </ThemeProvider>
        <Grid container spacing={2} className='ecode-legacy' justifyContent='center'>
          <Grid item>PRIVACY POLICY</Grid>
          <Grid item>LEGAL NOTICES</Grid>
          <Grid item>SITEMAP</Grid>
        </Grid>
        <Copyright sx={{ pb: 4 }} />
      </div>
    </React.Fragment>
  );
}
