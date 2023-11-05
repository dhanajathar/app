import './index.css';

import {
  Autocomplete,
  FormControlLabel,
  FormHelperText,
  TextField,
  Checkbox
} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useEffect, useState } from 'react';

import mockData from './data.json';
import { useSearchParams } from 'react-router-dom';
import DAlertBox from '../../../DAlertBox';
import BOEAddress from './component/BOEAddress';

export default function BoardOfElections() {
  const { optionList, reasonForFormList, languageList, partyList, primaryAddresses, initialData, defaultAddress } = mockData;
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');
  const [validationError, setValidationError] = useState();
  const [copyData, setCopyData] = useState(false);
  const [copyMailingData, setCopyMailingData] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [focusedField, setFocusedField] = useState(null);
  const [isFormDisabled, setIsFormDisabled] = useState(false);



  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: {
        label: 'Board of Elections',
        step: 'Board of Elections',
        flowId: flowId,
        substep: true
      }
    });
  }, 100);

  const handleLastName = e => {
    const { name, value } = e?.target ?? {};
    if (validateTransliterated(value) && !(/^\s/.test(value) || /\s\s/.test(value))) {
      handleChange(name, value)
    }

  };


  const validateTransliterated = value => {
    const regex = /^[a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@\\_`{|}~]*$/;
    return regex.test(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleChange = (name, value) => {
    const newValues = { ...formData };
    newValues[name] = value;
    setFormData(newValues);
  };

  const handleAddressChange = (name, value, addressType) => {
    const newValues = { ...formData };
    newValues[addressType][name] = value;
    setFormData(newValues);
  };


  const handleError = (name, value) => {
    const error = validateFiled(name, value);
    const errors = { ...validationError, [name]: error };
    if (error === '') {
      delete errors[name];
    }
    setValidationError(errors);
    setIsFormDisabled(Object.values(errors).some(error => error !== ''));
    setFocusedField(error !== '' ? name : '');
  };


  const handleAddressError = (name, value, addressType) => {
    const error = validateFiled(name, value);
    const updatedAddress = { ...validationError[addressType], [name]: error };
    const updatedErrors = { ...validationError, [addressType]: updatedAddress };

    if (Object.keys(updatedAddress).length === 0) {
      delete updatedErrors[addressType];
    }
    if (error === '') {
      delete updatedErrors[addressType][name]
    }
    setValidationError(updatedErrors);
    setIsFormDisabled(error !== '' ? true : false);

  };





  const copyPrimaryAddress = () => {
    setCopyData(true)
    const newValues = { ...formData };
    newValues.mailingAddress = primaryAddresses;
    setFormData(newValues);
  }

  const copyMailingAddress = () => {
    setCopyMailingData(true)
    const newValues = { ...formData };
    newValues.lastAddress = { ...newValues.mailingAddress }
    setFormData(newValues);
  }

  const handleUserConditions = (e, index) => {
    const newValues = { ...formData };
    newValues.userConditions[index].value = e.target.checked
  }

  useEffect(() => {
    if (formData.registerToVoteColumbia === 'YES') {

      const newValues = { ...formData };
      newValues.mailingAddress = { ...defaultAddress };
      newValues.lastAddress = { ...defaultAddress };
      setFormData(newValues);
    } else {
      initialData.registerToVoteColumbia = formData.registerToVoteColumbia
      setFormData(initialData)
    }
  }, [formData.registerToVoteColumbia])

  const validateFiled = (name, value) => {
    let error = '';
    switch (name) {
      case 'registerToVoteColumbia':
        if (!value) {
          error = 'Must select a value for Register to Vote in District of Columbia';
        }
        break;
      case 'reasonForForm':
        if (!value && formData.registerToVoteColumbia === 'YES') {
          error = 'Must select a value for Reason for Form';
        }
        break;
      case 'pollWorker':
        if (!value && formData.registerToVoteColumbia === 'YES') {
          error = 'Must select a value for Poll Worker';
        }
        break;
      case 'language':
        if (!value && formData.registerToVoteColumbia === 'YES') {
          error = 'Must select a value for Language';
        }
        break;
      case 'partyAffiliation':
        if (!value && formData.registerToVoteColumbia === 'YES') {
          error = 'Please specify the Other Party Affiliation';
        }
        break;
      case 'otherParty':
        if (!value && (formData.registerToVoteColumbia === 'YES' || formData.partyAffiliation !== 'Other')) {
          error = 'Please specify the Other Party Affiliation';
        }
        break;
      case 'disableAssistanceReason':
        if (!value && (formData.registerToVoteColumbia === 'YES' || formData.partyAffiliation !== 'Other')) {
          error = 'Must enter Disabled Assistance Reason';
        }
        break;
      case 'addressLine':
        if (!value && (formData.registerToVoteColumbia === 'YES')) {
          error = 'InValid Address Line';
        }
        break;
      case 'city':
        if (!value && (formData.registerToVoteColumbia === 'YES')) {
          error = 'Invalid city';
        }
        break;
      case 'state':
        if (!value && (formData.registerToVoteColumbia === 'YES')) {
          error = 'Invalid State';
        }
        break;
      case 'zipCode':
        if (!value && (formData.registerToVoteColumbia === 'YES')) {
          error = 'Invalid Zip Code';
        }
        break;
      case 'country':
        if (!value && (formData.registerToVoteColumbia === 'YES')) {
          error = 'Invalid Zip Country';
        }
        break;
      case 'disableAssistanceRequired':
        if (!value && (formData.registerToVoteColumbia === 'YES')) {
          error = 'Must select a value for Disabled Assistance Required';
        }
        break;
      default:
    }
    return error;
  };

  function checkAllValues(obj) {
    for (let key in obj) {
      if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
        return false;
      }
    }
    return true;
  }

  return (<div className='d-container'>
    <form onSubmit={handleSubmit}>
      <div className='d-sub-title'> Board of Elections </div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <Autocomplete
            options={optionList}
            fullWidth
            size='small'
            name='registerToVoteColumbia'
            value={formData.registerToVoteColumbia}
            onChange={(e, v) => handleChange('registerToVoteColumbia', v)}
            onBlur={e => handleError('registerToVoteColumbia', e.target.value)}
            renderInput={params => (
              <TextField
                {...params}
                error={!!validationError?.registerToVoteColumbia}
                helperText={<DAlertBox errorText={validationError?.registerToVoteColumbia} />}
                label='Registered to Vote in District of Columbia'
              />
            )}
          />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <Autocomplete
            options={reasonForFormList}
            fullWidth
            size='small'
            name='reasonForForm'
            value={formData.reasonForForm}
            onChange={(e, v) => handleChange('reasonForForm', v)}
            getOptionDisabled={(option) => option === 'Unknown'}
            disabled={formData.registerToVoteColumbia !== 'YES' || (isFormDisabled && focusedField !== 'reasonForForm')}
            onBlur={e => handleError('reasonForForm', e.target.value)}
            renderInput={params => (
              <TextField
                {...params}
                inputRef={focusedField === 'reasonForForm' ? (input) => input && input.focus() : null}
                error={!!validationError?.reasonForForm}
                helperText={<DAlertBox errorText={validationError?.reasonForForm} />}
                label='Reason for Form'
              />
            )}
          />

        </div>


      </div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>

          <Autocomplete
            options={optionList}
            fullWidth
            size='small'
            name='pollWorker'
            value={formData.pollWorker}
            disabled={formData.registerToVoteColumbia !== 'YES' || (isFormDisabled && focusedField !== 'pollWorker')}
            onChange={(e, v) => handleChange('pollWorker', v)}
            onBlur={e => handleError('pollWorker', e.target.value)}
            renderInput={params => (
              <TextField
                {...params}
                inputRef={focusedField === 'pollWorker' ? (input) => input && input.focus() : null}
                error={!!validationError?.pollWorker}
                helperText={<DAlertBox errorText={validationError?.pollWorker} />}
                label='Poll Worker'
              />
            )}
          />
        </div>
        <div className='col col-sm-12 col-md-4'>

          <Autocomplete
            options={languageList}
            fullWidth
            size='small'
            name='pollWorker'
            value={formData.language}
            disabled={formData.registerToVoteColumbia !== 'YES' || (isFormDisabled && focusedField !== 'language')}
            onChange={(e, v) => handleChange('language', v)}
            onBlur={e => handleError('language', e.target.value)}
            renderInput={params => (
              <TextField
                {...params}
                inputRef={focusedField === 'language' ? (input) => input && input.focus() : null}
                error={!!validationError?.language}
                helperText={<DAlertBox errorText={validationError?.language} />}
                label='Language'
              />
            )}
          />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <Autocomplete
            options={partyList}
            fullWidth
            name='partyAffiliation'
            size='small'
            value={formData.partyAffiliation}
            disabled={formData.registerToVoteColumbia !== 'YES' || (isFormDisabled && focusedField !== 'partyAffiliation')}
            onChange={(e, v) => handleChange('partyAffiliation', v)}
            onBlur={e => handleError('partyAffiliation', e.target.value)}
            renderInput={params => (
              <TextField
                {...params}
                inputRef={focusedField === 'partyAffiliation' ? (input) => input && input.focus() : null}
                error={!!validationError?.partyAffiliation}
                helperText={<DAlertBox errorText={validationError?.partyAffiliation} />}
                label='Party Affiliation'
              />
            )}
          />
        </div>
      </div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <TextField
            fullWidth
            label='Other Party'
            size='small'
            disabled={formData.registerToVoteColumbia !== 'YES' || formData.partyAffiliation !== 'Other' || (isFormDisabled && focusedField !== 'otherParty')}
            value={formData.otherParty}
            name='otherParty'
            inputProps={{ maxLength: 50 }}
            onChange={(e) => handleChange('otherParty', e.target.value)}
            onBlur={e => handleError('otherParty', e.target.value)}
            inputRef={focusedField === 'otherParty' ? (input) => input && input.focus() : null}
            error={!!validationError?.otherParty}
            helperText={<DAlertBox errorText={validationError?.otherParty} />}
          />
        </div>

        <div className='col col-sm-12 col-md-4'>
          <TextField
            fullWidth
            size='small'
            label='Last Name Used'
            value={formData.lastNameUsed}
            name='lastNameUsed'
            disabled={formData.registerToVoteColumbia !== 'YES' || isFormDisabled}
            inputProps={{ maxLength: 33 }}
            autoComplete='off'
            onChange={handleLastName}
            onBlur={e => handleError(e.target.name, e.target.value)}
          />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <FormControlLabel disabled={formData.registerToVoteColumbia !== 'YES' || isFormDisabled}
            control={<Checkbox size='small'
              onBlur={e => handleError('disableAssistanceRequired', e.target.value)} onChange={e => handleChange('disableAssistanceRequired', e.target.checked)} checked={formData.disableAssistanceRequired} />}
            label='Disabled Assistance Required'
            labelPlacement='end'
          />
          <FormHelperText > <DAlertBox errorText={validationError?.disableAssistanceRequired} /> </FormHelperText>
        </div>
        <div className='col col-sm-12 col-md-4'>
          <TextField
            fullWidth
            size='small'
            label='Disabled Assistance Reason'
            value={formData.disableAssistanceReason}
            name='disableAssistanceReason'
            disabled={formData.disableAssistanceRequired !== true || (isFormDisabled && focusedField !== 'disableAssistanceReason')}
            inputProps={{ maxLength: 150 }}
            autoComplete='off'
            onChange={(e) => handleChange('disableAssistanceReason', e.target.value)}
            onBlur={e => handleError(e.target.name, e.target.value)}

            inputRef={focusedField === 'disableAssistanceReason' ? (input) => input && input.focus() : null}
            error={!!validationError?.disableAssistanceReason}
            helperText={<DAlertBox errorText={validationError?.disableAssistanceReason} />}
          />

        </div>
      </div>
      <div className='d-sub-title'> Mailing Address Details  </div>
      <FormControlLabel
        control={<Checkbox size='small' value={copyData} disabled={formData.registerToVoteColumbia !== "YES" || isFormDisabled} onChange={copyPrimaryAddress} />}
        label={'Copy Primary Address'}
        labelPlacement='end'
      />
      <BOEAddress
        key={'mailingAddress'}
        validationErrors={validationError?.mailingAddress}
        address={formData.mailingAddress}
        isFormDisabled={isFormDisabled}
        disabledFields={formData.registerToVoteColumbia !== 'YES'}
        handleAddressChange={(name, value) =>
          handleAddressChange(name, value, 'mailingAddress')
        }
        handleAddressError={(name, value) =>
          handleAddressError(name, value, 'mailingAddress')
        }
      />
      <div className='d-sub-title'> Last Address Details  </div>
      <FormControlLabel disabled={!checkAllValues(formData.mailingAddress)}
        control={<Checkbox size='small' value={copyMailingData} disabled={formData.registerToVoteColumbia !== "YES" || isFormDisabled} onChange={copyMailingAddress} />}
        label={'Copy Mailing Address'}

        labelPlacement='end'
      />
      <BOEAddress
        key={'lastAddress'}
        validationErrors={validationError?.lastAddress}
        address={formData.lastAddress}
        isFormDisabled={isFormDisabled}
        disabledFields={formData.registerToVoteColumbia !== 'YES'}
        handleAddressChange={(name, value) =>
          handleAddressChange(name, value, 'lastAddress')
        }
        handleAddressError={(name, value) =>
          handleAddressError(name, value, 'lastAddress')
        }
      />
      <div className='d-row mt-1'>
        {formData.userConditions.map((item, index) => (
          <div key={item.name} className='col col-sm-12 col-md-6'>
            <FormControlLabel
              control={<Checkbox size='small' disabled={formData.registerToVoteColumbia !== 'YES' || isFormDisabled} onChange={e => handleUserConditions(e, index)} checked={item.value} />}
              label={item.name}
              labelPlacement='end'
            />
          </div>
        ))}
      </div>
    </form>
  </div>
  );
}
