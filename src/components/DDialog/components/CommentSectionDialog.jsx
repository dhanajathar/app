/*
 * Author: Rupesh Allu
 * Created: 2023-12-14
 * Last Modified:
 * Description: This page show diaplog box which we can add comments
 * Application Release Version:1.0.0
 */

import { useState } from 'react';
import { Button, IconButton, TextField, Dialog, DialogTitle, DialogContent } from '@mui/material';
import PropTypes from 'prop-types';
import { Close } from '@mui/icons-material';

//Function for dialog comment section
const CommentSectionDialog = props => {
  const { open, onClose, getCommentsDetails } = props;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  CommentSectionDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    getCommentsDetails: PropTypes.func.isRequired
  };

  const handleCommentChange = event => {
    setNewComment(event.target.value.toUpperCase());
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
      getCommentsDetails([newCommentObject, ...comments]);
    }
  };

  // Sort comments based on the time property in descending order (latest first)
  const sortedComments = comments.slice().sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle className='DDialog-title d-dialog-font-bold'>Comments</DialogTitle>
      <IconButton
        className='DDialog-close close-icon'
        aria-label='close'
        component='span'
        onClick={onClose}
      >
        <Close />
      </IconButton>
      <DialogContent className='DDialog-comment-textfield'>
        <div>
          {/* Comment Input Field */}
          <TextField
            label='Enter your Comment'
            placeholder='Add a comment'
            variant='outlined'
            value={newComment}
            onChange={handleCommentChange}
            fullWidth
            multiline
            rows={3}
          />
          <div className='DDialog-comment-AddComment'>
            <Button variant='contained' color='primary' onClick={handleAddComment}>
              Add Comment
            </Button>
          </div>
          <div className='DDialog-comment-item-parent'>
            {/* Render Comments */}
            {sortedComments.map((comment, index) => (
              <div className='DDialog-comment-item' key={index}>
                <img
                  alt='User Avatar'
                  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6vjzwZaBf6bKmbl7I00WbZ9RPOlriawksgQ&usqp=CAU'
                  className='DDialog-comment-item-image'
                />
                <div className='DDialog-comment-details'>
                  <div>{comment.name}</div>
                  <div>{comment.text}</div>
                  <div>{comment.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentSectionDialog;
