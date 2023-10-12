import React, { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox
} from '@mui/material';

const TransformNameFields = ({
  isTruncated,
  isTransliterated,
  onTruncation = () => {},
  onTransliterated = () => {}
}) => {
  return (
    <FormGroup aria-label='position' row>
      <FormControlLabel
        control={<Checkbox checked={isTruncated} onChange={e => onTruncation(e.target.checked)} />}
        label='Truncated'
        labelPlacement='end'
      />
      <FormControlLabel
        control={<Checkbox onChange={e => onTransliterated(e.target.checked)} />}
        label='Transliterated'
        labelPlacement='end'
      />
    </FormGroup>
  );
};

export default TransformNameFields;
