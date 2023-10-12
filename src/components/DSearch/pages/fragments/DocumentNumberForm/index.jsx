import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

const DocumentNumberForm = ({ onButtonDisabled, formData, handleFormChange }) => {
  const formatSSN = value => {
    if (!value) return value;
    let ssnValue = '';
    const ssn = value.replace(/[^\d]/g, '');
    const ssnLength = ssn.length;
    if (ssnLength < 4) return ssn;
    if (ssnLength < 6) {
      ssnValue = `***-${ssn.slice(3)}`;
    }
    ssnValue = `***-***-${ssn.slice(5, 9)}`;
    return ssnValue;
  };

  useEffect(() => {
    if (formData.documentType === 'dlidcard') {
      onButtonDisabled(!formData.idCard, 0);
    }
    if (formData.documentType === 'disabilityPlacard') {
      onButtonDisabled(!formData.disabilityCard, 0);
    }
    if (formData.documentType === 'ssnumber') {
      onButtonDisabled(formData.ssnumber && formData.ssnumber.length >= 9 ? false : true, 0);
    }

    if (formData.ssnumber === '') {
      setFormattedSSN('');
    }
  }, [formData]);

  const [formattedSSN, setFormattedSSN] = useState(
    formData.ssnumber && formatSSN(formData.ssnumber)
  );

  const dnRadioButtons = [
    { id: 'dlidcard', label: 'DL / ID Card', val: 'dlidcard' },
    { id: 'ssnumber', label: 'SSN', val: 'ssnumber' },
    { id: 'disabilityPlacard', label: 'Disability Placard No.', val: 'disabilityPlacard' }
  ];

  const handleChange = e => {
    const regex = /^[a-zA-Z0-9 ]*$/;
    if (regex.test(e.target.value)) {
      handleFormChange(e);
    }
  };

  const handleSSNChange = e => {
    const value = e.target.value;
    const ssn = value.replace(/[^\d]/g, '');
    e.target.value = ssn;
    handleChange(e);
    setFormattedSSN(ssn);
  };

  const renderRadioButtonGroup = () => {
    return (
      <RadioGroup
        id='documentNumberRadioGroup'
        variant='text'
        name='documentType'
        aria-label='radio-button-text-group'
        onChange={handleFormChange}
        value={formData.documentType}
        sx={{ mb: '1.5rem' }}
      >
        <div className='document-radio-group no-top'>
          {dnRadioButtons.map(item => (
            <div className='radio' key={`${item.label}`}>
              <FormControlLabel
                control={<Radio />}
                id={item.id}
                value={item.val}
                label={item.label}
                sx={{ mr: '0.5rem' }}
              />
            </div>
          ))}
        </div>
      </RadioGroup>
    );
  };

  return (
    <>
      {renderRadioButtonGroup()}
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4 pt-0'>
          {formData.documentType === 'dlidcard' && (
            <TextField
              fullWidth
              type='text'
              id='idCard'
              name='idCard'
              size='small'
              label='DL / ID Card'
              variant='outlined'
              inputProps={{ maxLength: 25 }}
              value={formData.idCard}
              onChange={handleChange}
            />
          )}
          {formData.documentType === 'ssnumber' && (
            <TextField
              fullWidth
              type='text'
              id='ssnumber'
              name='ssnumber'
              size='small'
              inputProps={{ maxLength: 9 }}
              variant='outlined'
              value={formattedSSN}
              onChange={handleSSNChange}
              onBlur={() => setFormattedSSN(formatSSN(formData.ssnumber))}
              onFocus={() => setFormattedSSN(formData.ssnumber)}
            />
          )}
          {formData.documentType === 'disabilityPlacard' && (
            <TextField
              fullWidth
              type='text'
              id='disabilityCard'
              name='disabilityCard'
              size='small'
              inputProps={{ maxLength: 35 }}
              label='Disability Placard Number'
              value={formData.disabilityCard}
              onChange={handleChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentNumberForm;
