import React, { useState } from 'react';
import {
  Container,
  Grid,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel
} from '@mui/material';

import data from './data/api-commercial-driver-licenseFragment-fragment.json';

import './DVisionTest.css';

const DVisionTest = () => {
  const { examiner, examTypeList, examinerTypeList, eyeReport } = data;
  const [examType, setExamType] = useState(data.examType);
  const [rightEye, setRightEye] = useState(data.rightEye);
  const [leftEye, setLeftEye] = useState(data.leftEye);
  const [bothEyes, setBothEyes] = useState(data.bothEyes);
  const [fieldOfVision, setFieldOfVision] = useState(data.fieldOfVision);
  const [visionCondition, setVsionCondition] = useState(data.visionCondition);
  const [remedyEyeCorrection, setRemedyEyeCorrection] = useState(data.remedyEyeCorrection);
  const [remedyDate, setRemedyDate] = useState(data.remedyDate);
  const [examinerType, setExaminerType] = useState(examiner.examinerType);
  const [DMV, setDMV] = useState(examiner.DMV);
  const [examDate, setExamDate] = useState(examiner.examDate);
  const [testResult, setTestResult] = useState(examiner.testResult);
  const [optometristRecommendation, setOptometristRecommendation] = useState(
    examiner.optometristRecommendation
  );
  const [interimEyeReportRequired, setInterimEyeReportRequired] = useState(
    examiner.interimEyeReportRequired
  );

  const checkValidNumber = (value, min, max) => {
    if (value >= min && value <= max) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <Container>
        <Grid container sx={{ mt: 2 }} spacing={1}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id='examType'>Exam Type</InputLabel>
              <Select
                labelId='examType'
                value={examType}
                label='Exam Type'
                onChange={e => setExamType(e.target.value)}
              >
                {examTypeList &&
                  examTypeList.map(item => {
                    return (
                      <MenuItem key={`${item}`} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 2 }} spacing={1}>
          <Grid item xs={4}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  value={rightEye}
                  fullWidth
                  label='Right Eye'
                  helperText={
                     'This Value should be between 1 and 140 '
                  }
                  error={checkValidNumber(rightEye, 1, 140)}
                  onChange={e => setRightEye(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        {' '}
                        <div className='input_adornment_text'> 20 </div>{' '}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  value={leftEye}
                  fullWidth
                  label='Left Eye'
                  helperText={
                     'This Value should be between 1 and 140 '
                  }
                  error={checkValidNumber(leftEye, 1, 140)}
                  onChange={e => setLeftEye(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        {' '}
                        <div className='input_adornment_text'> 20 </div>{' '}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  value={bothEyes}
                  fullWidth
                  label='Both Eye'
                  helperText={
                    'This Value should be between 1 and 140 '
                  }
                  error={checkValidNumber(bothEyes, 1, 140)}
                  onChange={e => setBothEyes(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        {' '}
                        <div className='input_adornment_text'> 20 </div>{' '}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  value={fieldOfVision}
                  fullWidth
                  label='Field Of Vision'
                  helperText={
                    'This Value should be between 110 and 180 '
                  }
                  error={checkValidNumber(fieldOfVision, 110, 180)}
                  onChange={e => setFieldOfVision(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id='visionCondition'>Vision Condition</InputLabel>
              <Select
                labelId='visionCondition'
                value={visionCondition}
                label='Vision Condition'
                onChange={e => setVsionCondition(e.target.value)}
              >
                <MenuItem value={'STABLE'}> STABLE </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={4}>
            <TextField
              value={remedyEyeCorrection}
              fullWidth
              label='Remedy to Eye Correction'
              inputProps={{ maxLength: 35 }}
              onChange={e => setRemedyEyeCorrection(e.target.value)}
              helperText={'max 35 characters allowed'}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              defaultValue={remedyDate}
              fullWidth
              type='date'
              label='Date of Remedy'
              onChange={e => setRemedyDate(e.target.value)}
            />{' '}
          </Grid>
        </Grid>
      </Container>
      <Container className='sub_title'> Examiner </Container>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id='examinerType'>Examiner Type</InputLabel>
            <Select
              labelId='examinerType'
              value={examinerType}
              label='Examiner Type'
              onChange={e => setExaminerType(e.target.value)}
            >
              {examinerTypeList &&
                examinerTypeList.map(item => {
                  return (
                    <MenuItem key={`${item}`} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField value={DMV} fullWidth label='DMV' onChange={e => setDMV(e.target.value)} />{' '}
        </Grid>
        <Grid item xs={4}>
          <TextField
            defaultValue={examDate}
            fullWidth
            type='date'
            label='Date of Exam'
            onChange={e => setExamDate(e.target.value)}
          />{' '}
        </Grid>
      </Grid>

      <Container className='highlight-row'>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id='testResult'>Test Result</InputLabel>
              <Select
                labelId='testResult'
                value={testResult}
                label='Test Result'
                onChange={e => setTestResult(e.target.value)}
              >
                <MenuItem value={'PASS'}> PASS </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id='optometristRecommendation'>
                Optometrist Recommendation Required
              </InputLabel>
              <Select
                labelId='optometristRecommendation'
                value={optometristRecommendation}
                label='Optometrist Recommendation Required'
                onChange={e => setOptometristRecommendation(e.target.value)}
              >
                {eyeReport &&
                  eyeReport.map(item => {
                    return (
                      <MenuItem key={`${item}`} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id='interimEyeReportRequired'>Interim Eye Report Required</InputLabel>
              <Select
                fullWidth
                labelId='interimEyeReportRequired'
                value={interimEyeReportRequired}
                label='Interim Eye Report Required'
                onChange={e => setInterimEyeReportRequired(e.target.value)}
              >
                {eyeReport &&
                  eyeReport.map(item => {
                    return (
                      <MenuItem key={`${item}`} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default DVisionTest;
