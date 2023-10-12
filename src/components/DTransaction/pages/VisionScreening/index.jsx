import './index.css';

import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';

const VisionScreen = () => {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'Vision Screening', step: 'Vision Screening', flowId: flowId, substep: true }
    });
  }, 100);

  const [visionCondition, setVisionCondition] = useState('');
  const [ExamType, setExamType] = useState('');
  const [ExaminerType, setExaminerType] = useState('');
  const [RightEye, setRightEye] = useState('20');
  const [LeftEye, setLeftEye] = useState('20');
  const [BothEyes, setBothEyes] = useState('20');
  const [FieldVision, setFieldVision] = useState('180');
  const [RemedyCortn, setRemedyCortn] = useState('');

  const [TestResult, setTestResult] = useState('');
  const [Optometrist, setOptometrist] = useState('');
  const [Interim, setInterim] = useState('');
  const [DMV, setDMV] = useState('');
  const [open, setOpen] = useState(false);
  const currentDate = dayjs().endOf('day');
  const [RemedyDate, setRemedyDate] = useState(dayjs(currentDate));
  // Define the options for the vision condition
  const visionConditionOptions = ['stable', 'progressive'];
  const visionExamType = ['Without Correction', 'With Correction'];
  const visionOptometrist = ['Yes', 'No'];
  const visionTestResult = ['Pass', 'Fail'];
  const visionDMV = ['Test1', 'Test2', 'Test3'];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className='vs-all-tag'>
        <FormControl variant='outlined'>
          <InputLabel id='vision-Exam-Type'>Exam Type</InputLabel>
          <Select
            labelId='Exam-Type'
            id='Exam-Type'
            value={ExamType}
            onChange={e => setExamType(e.target.value)}
            label='Exam Type'
            className='vs-exam-type'
          >
            {visionExamType.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className='vs-all-tag'>
        <TextField
          label='Right Eye'
          variant='outlined'
          className='vs-text-right-left-both'
          value={RightEye}
          onChange={e => setRightEye(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment disableTypography position='start'>
                {' '}
                <div className='vs-text-right-left-both-start'>20 /</div>
              </InputAdornment>
            )
          }}
        />
        <TextField
          label='Left Eye'
          variant='outlined'
          className='vs-text-right-left-both'
          value={LeftEye}
          onChange={e => setLeftEye(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment disableTypography position='start'>
                {' '}
                <div className='vs-text-right-left-both-start'>20 /</div>
              </InputAdornment>
            )
          }}
        />
        <TextField
          label='Both Eyes'
          variant='outlined'
          className='vs-text-right-left-both'
          value={BothEyes}
          onChange={e => setBothEyes(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment disableTypography position='start'>
                {' '}
                <div className='vs-text-right-left-both-start'>20 /</div>
              </InputAdornment>
            )
          }}
        />
        <TextField
          label='Field of Vision'
          variant='outlined'
          value={FieldVision}
          onChange={e => setFieldVision(e.target.value)}
          className='vs-text-field-vision'
        />
        <FormControl variant='outlined'>
          <InputLabel id='vision-condition-label'>Vision Condition</InputLabel>
          <Select
            labelId='vision-condition-label'
            id='vision-condition'
            value={visionCondition}
            onChange={e => setVisionCondition(e.target.value)}
            label='Vision Condition'
            className='vs-text-vision-cond'
          >
            {visionConditionOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className='vs-all-tag'>
        <TextField
          label='Remedy to Eye Correction'
          variant='outlined'
          className='vs-remedy-text'
          value={RemedyCortn}
          onChange={e => setRemedyCortn(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className='usp-datepick'
            label='Date of Remedy'
            maxDate={currentDate}
            value={RemedyDate}
            onChange={e => setRemedyDate(e.target.value)}
          />
        </LocalizationProvider>
      </div>
      <div className='vs-examiner'>Examiner</div>
      <div className='vs-all-tag-examiner'>
        <FormControl variant='outlined'>
          <InputLabel id='Vision-Examiner-Type'>Examiner Type</InputLabel>
          <Select
            labelId='Examiner Type'
            id='Examiner-Type'
            value={ExaminerType}
            onChange={e => setExaminerType(e.target.value)}
            label='Examiner Type'
            className='vs-examiner-type'
          >
            {visionExamType.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel id='vision-Exam-Type'>DMV</InputLabel>
          <Select
            labelId='DMV'
            id='DMV'
            value={DMV}
            onChange={e => setDMV(e.target.value)}
            label='DMV'
            className='vs-exam-type'
          >
            {visionDMV.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            label='Date of Exam'
            className='vs-date-exam'
            defaultValue={dayjs('2022-04-17')}
          />
        </LocalizationProvider>
      </div>
      <div className='vs-test-result'>
        <FormControl variant='outlined'>
          <InputLabel id='vision-Test-Result'>Test Result</InputLabel>
          <Select
            label='Test Result'
            id='test-result'
            value={TestResult}
            onChange={e => setTestResult(e.target.value)}
            className='vs-test-result-Optometrist'
          >
            {visionTestResult.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel id='vision-Optometrist'>Optometrist Recommendation Required</InputLabel>
          <Select
            labelId='Optometrist-Recommendation-Required'
            id='Optometrist-Recommendation-Required'
            value={Optometrist}
            onChange={e => setOptometrist(e.target.value)}
            label='Optometrist Recommendation Required'
            className='vs-test-result-Optometrist'
          >
            {visionOptometrist.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel id='vision-Interim'>Interim Eye Report Required</InputLabel>
          <Select
            labelId='Interim-EyeReport-Required'
            id='Interim-EyeReport-Required'
            value={Interim}
            onChange={e => setInterim(e.target.value)}
            label='Interim Eye ReportRequired'
            className='vs-test-result-Optometrist'
          >
            {visionOptometrist.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className='vs-comment-section'>
        <div className='vs-comment-icon'>
          <Button className='vs-comment-text' onClick={handleClickOpen}>
            <AddCommentOutlinedIcon color='primary' className='vs-icon-com' />
            Comment
          </Button>
        </div>
        <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
          <DialogContent>
            <CommentsSection />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default VisionScreen;

//Function for dialog comment section
const CommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = event => {
    setNewComment(event.target.value);
  };

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      const newCommentObject = {
        name: 'John Doe',
        text: newComment,
        time: new Date().toLocaleString()
      };
      setComments([newCommentObject, ...comments]); // Add the new comment to the beginning of the array
      setNewComment('');
    }
  };

  // Sort comments based on the time property in descending order (latest first)
  const sortedComments = comments.slice().sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div>
      {/* Comment Input Field */}
      <TextField
        label='Comment'
        placeholder='Add a comment'
        variant='outlined'
        value={newComment}
        onChange={handleCommentChange}
        fullWidth
        multiline
        rows={3}
      />
      <div
        style={{
          display: 'inline-block',
          float: 'right',
          marginTop: '1rem'
        }}
      >
        <Button variant='contained' color='primary' onClick={handleAddComment}>
          Add Comment
        </Button>
      </div>
      <div className='comment-item-parent'>
        {/* Render Comments */}
        {sortedComments.map((comment, index) => (
          <div className='comment-item' key={index}>
            <img
              alt='User Avatar'
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6vjzwZaBf6bKmbl7I00WbZ9RPOlriawksgQ&usqp=CAU'
              style={{
                width: '40px',
                height: '40px',
                marginRight: '8px',
                borderRadius: '50%',
                marginBottom: '10%'
              }}
            />
            <div className='comment-details'>
              <div>{comment.name}</div>
              <div>{comment.text}</div>
              <div>{comment.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
