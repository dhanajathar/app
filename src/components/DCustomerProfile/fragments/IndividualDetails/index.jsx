import './IndividualDetailsFragment.css';

import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from '@mui/material';
import CropIcon from '@mui/icons-material/Crop';
import TranslateIcon from '@mui/icons-material/Translate';
import React, { useEffect, useState } from 'react';

import data from './api-individual-details-fragment.json';

const ADDITIONALL_INFORMATION = 'Personal Information';
const PHYSICAL_INFORMATION = 'Physical Information';

const IndividualDetailsFragment = ({ citizenType }) => {
  function formatSSN(value) {
    if (!value) return value;
    let ssnValue = '';
    const ssn = value.replace(/[^\d]/g, '');
    const ssnLength = ssn.length;
    if (ssnLength < 4) return ssn;
    if (ssnLength < 6) {
      ssnValue = `***-${ssn.slice(3)}`;
    }
    ssnValue = `***-**-${ssn.slice(5, 9)}`;
    return ssnValue;
  }

  const { personalInformation, physicalInformation, genderList } = data;
  const [lastName, setLastName] = useState(personalInformation.lastName);
  const [firstName, setFirstName] = useState(personalInformation.firstName);
  const [middleName, setMiddleName] = useState(personalInformation.middleName);
  const [suffix, setSuffix] = useState(personalInformation.suffix);
  const [birthDate, setBirthDate] = useState(personalInformation.birthDate);
  const [citizen, setCitizen] = useState(personalInformation.citizen);
  const [veteran, setVeteran] = useState(personalInformation.veteran);
  const [organDonor, setorganDonor] = useState(personalInformation.organDonor);
  const [language, setLanguage] = useState(personalInformation.language);
  const [gender, setGender] = useState(physicalInformation.gender);
  const [weight, setWeight] = useState(physicalInformation.weight);
  const [heightFeet, setHeightFeet] = useState(physicalInformation.height.feet);
  const [heightInch, setHeightInch] = useState(physicalInformation.height.inch);
  const [hairColor, setHairColor] = useState(physicalInformation.hairColor);
  const [eyeColor, setEyeColor] = useState(physicalInformation.eyeColor);
  const [military, setMilitary] = useState(personalInformation.military);
  const [vip, setVip] = useState(personalInformation.vip);

  // mm/dd/yyyy
  const calculateAge = dob => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      month = 12 + month;
      age--;
    }
    return `${age} year(s) ${month} month(s)`;
  };

  useEffect(() => {
    citizen === 'YES' ? citizenType(true) : citizenType(false);
  });
  const truncationIcon = (input) => {
    return <InputAdornment className='truncated_icons' position='end'>
      {input.isTruncated &&
        <Tooltip arrow title='Truncated' placement='top'>
          <CropIcon />
        </Tooltip>
      }
      {input.isTransliterated &&
        <Tooltip title='Transliterated' arrow placement='top'>
          <TranslateIcon />
        </Tooltip>
      }
    </InputAdornment>
  }


  return (
    <>
      <div className='d-sub-title'> {ADDITIONALL_INFORMATION} </div>
      <div className='d-row'>
        <div className='col col-md-4 col-sm-12'>
          <TextField
            value={lastName.value}
            name='lName'
            fullWidth
            label='Last Name'
            onChange={e => setLastName({ ...lastName, value: e.target.value })}
            InputProps={{
              endAdornment: (truncationIcon(lastName)
              )
            }}
            disabled
          />
        </div>
        <div className='col col-md-4 col-sm-12'>
          <TextField
            value={firstName.value}
            name='lName'
            fullWidth
            label='First Name'
            onChange={e => setFirstName({ ...firstName, value: e.target.value })}
            disabled
            InputProps={{
              endAdornment: (truncationIcon(firstName)
              )
            }}

          />
        </div>
        <div className='col col-md-4 col-sm-12'>
          <TextField
            value={middleName.value}
            fullWidth
            label='Middle Name'
            onChange={e => setMiddleName({ ...middleName, value: e.target.value })}
            disabled
            InputProps={{
              endAdornment: (truncationIcon(middleName)
              )
            }}
          />
        </div>
      </div>

      <div className='d-row'>
        <div className='col col-md-4 col-sm-12'>
          <FormControl fullWidth>
            <InputLabel id='suffix'>Name Suffix</InputLabel>
            <Select
              labelId='suffix'
              id='suffix'
              defaultValue={suffix}
              disabled
              label='Suffix'
              onChange={e => setSuffix(e.target.value)}
            >
              <MenuItem value={suffix}> {suffix} </MenuItem>;
            </Select>
          </FormControl>
        </div>

        <div className='col col-md-4 col-sm-12'>
          <TextField
            defaultValue={birthDate}
            fullWidth
            type='date'
            label='Date of Birth'
            onChange={e => setBirthDate(e.target.value)}
            disabled
            className='input_adornment'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {' '}
                  <div className='input_adornment_text'> {calculateAge(birthDate)} </div>{' '}
                </InputAdornment>
              )
            }}
          />
        </div>
      </div>
      <div className='d-sub-title'> Additional Details </div>
      <div className='d-row'>
        <div className='col col-md-4 col-sm-12'>
          <TextField
            value={formatSSN(personalInformation.socialSecurityNumber)}
            fullWidth
            label='Social Security Number'
            disabled
            className='input-adornment'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <div className='input-adornment-text verified-text'> &#10004; Verified </div>{' '}
                </InputAdornment>
              )
            }}
          />
        </div>
        <div className='col col-md-4 col-sm-12 pt-0'>
          <div className='d-row'>
            <div className='col col-md-6 col-sm-12'>
              <FormControl fullWidth>
                <InputLabel id='citizen'>Citizen</InputLabel>
                <Select
                  labelId='citizen'
                  id='citizen'
                  defaultValue={citizen}
                  disabled
                  label='Citizen'
                  onChange={e => setCitizen(e.target.value)}
                >
                  <MenuItem value={citizen}> {citizen} </MenuItem>;
                </Select>
              </FormControl>
            </div>
            <div className='col col-md-6 col-sm-12'>
              <FormControl fullWidth>
                <InputLabel id='organDonor'>Organ Donor</InputLabel>
                <Select
                  labelId='organDonor'
                  id='organDonor'
                  defaultValue={organDonor}
                  disabled
                  label='Organ Donor'
                  onChange={e => setorganDonor(e.target.value)}
                >
                  <MenuItem value={organDonor}> {organDonor} </MenuItem>;
                </Select>
              </FormControl>
            </div>

          </div>
        </div>
        <div className='col col-md-4 col-sm-12'>
          <FormControl fullWidth>
            <InputLabel id='language'>Language</InputLabel>
            <Select
              labelId='language'
              id='language'
              defaultValue={language}
              disabled
              label='Language'
              onChange={e => setLanguage(e.target.value)}
            >
              <MenuItem value={language}> {language} </MenuItem>;
            </Select>
          </FormControl>
        </div>

      </div>

      <div className='d-row'>
        <div className='col col-md-2 col-sm-12'>
          <FormControl fullWidth>
            <InputLabel id='vip'>VIP</InputLabel>
            <Select
              labelId='vip'
              id='vip'
              defaultValue={vip}
              disabled
              label='VIP'
              onChange={e => setVip(e.target.value)}
            >
              <MenuItem value={vip}> {vip} </MenuItem>;
            </Select>
          </FormControl>
        </div>
        <div className='col col-md-2 col-sm-12'>
          <FormControl fullWidth>
            <InputLabel id='military'>Military</InputLabel>
            <Select
              labelId='military'
              id='military'
              defaultValue={military}
              disabled
              label='Military'
              onChange={e => setMilitary(e.target.value)}
            >
              <MenuItem value={military}> {military} </MenuItem>;
            </Select>
          </FormControl>
        </div>

        <div className='col col-md-2 col-sm-12'>
          <FormControl fullWidth>
            <InputLabel id='veteran'>Veteran</InputLabel>
            <Select
              labelId='veteran'
              id='veteran'
              defaultValue={veteran}
              disabled
              label='Veteran'
              onChange={e => setVeteran(e.target.value)}
            >
              <MenuItem value={veteran}> {veteran} </MenuItem>;
            </Select>
          </FormControl>
        </div>
      </div>
      <div className='d-sub-title'> {PHYSICAL_INFORMATION} </div>
      <div className='d-row'>
        <div className='col col-md-4 col-sm-12'>
          <FormControl fullWidth>
            <InputLabel id='gender'>Gender</InputLabel>
            <Select
              labelId='gender'
              id='gender'
              defaultValue={gender}
              disabled
              label='Gender'
              onChange={e => setGender(e.target.value)}
            >
              {genderList &&
                genderList.map(item => {
                  return (
                    <MenuItem key={item} value={item}>
                      {' '}
                      {item}{' '}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
        <div className='col col-md-4 col-sm-12'>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <TextField
                value={weight}
                label='Weight'
                fullWidth
                onChange={e => setWeight(e.target.value)}
                disabled
                className='input_adornment'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      {' '}
                      <div className='input_adornment_text'>LBs </div>{' '}
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={7}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    value={heightFeet}
                    label='Height'
                    fullWidth
                    disabled
                    className='input_adornment'
                    onChange={e => setHeightFeet(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          {' '}
                          <div className='input_adornment_text'>Ft</div>{' '}
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    value={heightInch}
                    label=''
                    fullWidth
                    disabled
                    className='input_adornment'
                    onChange={e => setHeightInch(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          {' '}
                          <div className='input_adornment_text'>In</div>{' '}
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div className='col col-md-4 col-sm-12'>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id='hairColor'>Hair Color</InputLabel>
                <Select
                  labelId='hairColor'
                  id='hairColor'
                  defaultValue={hairColor}
                  disabled
                  label='Hair Color'
                  onChange={e => setHairColor(e.target.value)}
                >
                  <MenuItem value={hairColor}> {hairColor} </MenuItem>;
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id='eyeColor'>Eye Color</InputLabel>
                <Select
                  labelId='eyeColor'
                  id='eyeColor'
                  defaultValue={eyeColor}
                  disabled
                  label='Eye Color'
                  onChange={e => setEyeColor(e.target.value)}
                >
                  <MenuItem value={eyeColor}> {eyeColor} </MenuItem>;
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default IndividualDetailsFragment;
