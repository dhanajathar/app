/*
 * Component Name: Height Reusable Component
 * Author: Priyanka Pandey
 * Created: 2023-11-17
 * Last Modified: 2023-11-20
 * Description: 
 * Application Release Version:1.0.0
 */
import React, { useRef, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import './index.css'
import PropTypes from 'prop-types';
import DAlertBox from '../DAlertBox';

const DHeight = ({ values, validationError, handleChange, handleError, disabledOtherInfo, isFormDisabled, focusedField }) => {
  const [focus, setFocus] = useState(false)
  const heightInputRef = useRef(null);

  const handleFocus = () => {
    setFocus(true);
  }

  const handleOnBlur = (e) => {
    setFocus(false);
    handleError(e.target.name, e.target.value)
  }


  return (
    <TextField
      label="Height"
      size='small'
      InputLabelProps={{
        shrink: focus || !!values.heightFeet || !!values.heightInches,
      }}
      focused={focus}
      disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'heightInch' && focusedField !== 'heightFeet')}
      error={!!validationError?.heightFeet}
      className='wrapper-input'
      fullWidth
      ref={heightInputRef}
      helperText={<DAlertBox errorText={validationError?.heightFeet || validationError?.heightInch} />}
      InputProps={{
        endAdornment: (
          <div className='input-group'>
            <TextField
              type="number"
              value={values.heightFeet}
              size='small'
              onFocus={handleFocus}
              onChange={e => handleChange(e, 1, 9)}
              inputRef={focusedField === 'heightFeet' ? (input) => input?.focus() : null}
              disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'heightFeet')}
              className={'remove-border'}
              name='heightFeet'
              onBlur={handleOnBlur}
              InputProps={{
                endAdornment: (focus || values.heightFeet || values.heightInch) && (
                  <InputAdornment position='end'>
                    <div className='input-adornment-text'>Ft</div>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              type="number"
              value={values.heightInches}
              size='small'
              name='heightInch'
              className={'remove-border'}
              onFocus={handleFocus}
              onChange={e => handleChange(e, 0, 11)}
              inputRef={focusedField === 'heightInch' ? (input) => input?.focus() : null}
              disabled={disabledOtherInfo || (isFormDisabled && focusedField !== 'heightInch')}
              onBlur={handleOnBlur}
              InputProps={{
                endAdornment: (focus || values.heightInch || values.heightFeet) && (
                  <InputAdornment position='end'>
                    <div className='input-adornment-text'>In</div>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        ),
      }}
    />
  );
};

DHeight.propTypes = {
  values: PropTypes.object.isRequired,
  validationError: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  disabledOtherInfo: PropTypes.bool.isRequired,
  isFormDisabled: PropTypes.bool.isRequired,
  focusedField: PropTypes.string.isRequired,
};

export default DHeight;
