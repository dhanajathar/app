import './index.css';

import {
  Autocomplete,
  FormControlLabel,
  TextField,
  Checkbox
} from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useEffect, useState } from 'react';

import mockData from './data.json';
import { json, useSearchParams } from 'react-router-dom';
import DAlertBox from '../../../DAlertBox';
import BOEAddress from './component/BOEAddress';
import * as _ from 'lodash';
import Test from './component/test/test';

export default function BoardOfElections() {
  const { optionList, reasonForFormList, languageList, partyList, primaryAddresses, initialData, defaultAddress } = mockData;
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');
  const [validationError, setValidationError] = useState({});
  const [copyData, setCopyData] = useState(false);
  const [copyMailingData, setCopyMailingData] = useState(false);
  const [formData, setFormData] = useState({ ...initialData });
  const [focusedField, setFocusedField] = useState(null);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const isDemoPage = true;




  const sortedList = (list) => {
    const sortedList = list.slice().sort((a, b) => a.localeCompare(b));
    const selectIndex = sortedList.findIndex(item => (item === "--SELECT--") || (item === "ENGLISH") || (item === "BLACK"));
    if (selectIndex !== -1) {
      const selectItem = sortedList[selectIndex];
      sortedList.splice(selectIndex, 1);
      sortedList.unshift(selectItem);
    }
    return sortedList;
  };


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
    handleError(name, value);
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
    setFocusedField(error !== '' ? name : '');
    setValidationError(errors);
    setIsFormDisabled(Object.values(errors).some(error => error !== ''));
  };


  const handleAddressError = (name, value, addressType) => {
    const error = validateFiled(name, value);
    const updatedAddressError = { ...validationError[addressType], [name]: error };
    const updatedErrors = { ...validationError, [addressType]: updatedAddressError };
    if (Object.keys(updatedAddressError).length === 0) {
      delete updatedErrors[addressType];
    }
    if (error === '') {
      delete updatedErrors[addressType][name]
    }
    setValidationError(updatedErrors);
    setIsFormDisabled(error !== '' ? true : false);
  };



  const copyPrimaryAddress = (isChecked) => {
    setCopyData(isChecked)
    const newValues = { ...formData };
    if (isChecked) {
      newValues.mailingAddress = primaryAddresses;
    } else {
      newValues.mailingAddress = { ...defaultAddress };
    }
    setFormData(newValues);

  }

  const copyMailingAddress = (isChecked) => {
    setCopyMailingData(isChecked)
    const newValues = { ...formData };
    if (isChecked) {
      newValues.lastAddress = { ...newValues.mailingAddress }
    } else {
      newValues.lastAddress = { ...defaultAddress };
    }
    setFormData(newValues);

  }



  const handleUserConditions = (e, index) => {
    const newValues = { ...formData };
    newValues.userConditions[index].value = e.target.checked;
    setFormData(newValues)
  }

  useEffect(() => {
    if (formData.disableAssistanceReason !== "") {
      const newValues = { ...formData };
      newValues.disableAssistanceReason = "";
      setFormData(newValues)
    }
  }, [formData.disableAssistanceRequired])


  useEffect(() => {
    if (formData.otherParty !== "") {
      const newValues = { ...formData };
      newValues.otherParty = "";
      setFormData(newValues)
    }
  }, [formData.partyAffiliation])


  useEffect(() => {
    if (formData.registerToVoteColumbia === 'YES') {
      const newValues = { ...formData };
      newValues.mailingAddress = { ...defaultAddress };
      newValues.lastAddress = { ...defaultAddress };
      setFormData(newValues);
    } else {
      initialData.registerToVoteColumbia = formData.registerToVoteColumbia;
      setFormData(_.cloneDeep(initialData));
      setCopyMailingData(false);
      setCopyData(false)
    }
  }, [formData.registerToVoteColumbia])

  const validateFiled = (name, value) => {
    let error = '';
    switch (name) {
      case 'registerToVoteColumbia':
        if (!value) {
          error = 'Invalid Register to Vote in DC';
        }
        break;
      case 'reasonForForm':
        if (!value && formData.registerToVoteColumbia === 'YES') {
          error = 'Invalid Reason for Form';
        }
        break;
      case 'pollWorker':
        if (!value && formData.registerToVoteColumbia === 'YES') {
          error = 'Invalid Poll Worker';
        }
        break;
      case 'language':
        if (!value && formData.registerToVoteColumbia === 'YES') {
          error = 'Invalid Language';
        }
        break;
      case 'partyAffiliation':
        if (!value && formData.registerToVoteColumbia === 'YES') {
          error = 'Invalid Party Affiliation';
        }
        break;
      case 'otherParty':
        if (!value && (formData.registerToVoteColumbia === 'YES' || formData.partyAffiliation !== 'Other')) {
          error = 'Invalid Other Party';
        }
        break;
      case 'disableAssistanceReason':
        if (!value && (formData.registerToVoteColumbia === 'YES' || formData.partyAffiliation !== 'Other')) {
          error = 'Invalid Disabled Assistance Reason';
        }
        break;
      case 'addressLine':
        if (!value && (formData.registerToVoteColumbia === 'YES')) {
          error = 'Invalid Address Line';
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

        if (value && !(value.replace(/[^0-9]/g, '').length === 5 || value.replace(/[^0-9]/g, '').length === 9)) {
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
          error = 'Invalid Disabled Assistance Reason';
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

  const setFocusOnInput = (e, fieldName) => {
    if (fieldName === focusedField) {
      if (e) {
        e.focus();
      }
    }
  }

  return (<div className='d-container'>  
    {isDemoPage ? <> 
    <Test  address={{
        city: "",
        state: "",
        country: "UNITED STATES",
        addressLine: "",
        zipCode: ""
    }} />
    </> :
    <form onSubmit={handleSubmit}>
      <div className='d-sub-title'> Board of Elections </div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <Autocomplete
            options={sortedList(optionList)}
            fullWidth
            size='small'
            disabled={isFormDisabled && focusedField !== 'registerToVoteColumbia'}
            disableClearable={true}
            name='registerToVoteColumbia'
            value={formData.registerToVoteColumbia}
            onChange={(e, v) => handleChange('registerToVoteColumbia', v)}
            onBlur={e => handleError('registerToVoteColumbia', e.target.value)}
            renderInput={params => (
              <TextField
                {...params}
                inputRef={(e) => setFocusOnInput(e, 'registerToVoteColumbia')}
                error={!!validationError?.registerToVoteColumbia}
                helperText={<DAlertBox errorText={validationError?.registerToVoteColumbia} />}
                label='Register to Vote in DC'
              />
            )}
          />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <Autocomplete
            options={sortedList(reasonForFormList)}
            fullWidth
            size='small'
            disableClearable={true}
            name='reasonForForm'
            value={formData.reasonForForm}
            onChange={(e, v) => handleChange('reasonForForm', v)}
            disabled={formData.registerToVoteColumbia !== 'YES' || (isFormDisabled && focusedField !== 'reasonForForm')}
            onBlur={e => handleError('reasonForForm', e.target.value)}
            renderInput={params => (
              <TextField
                {...params}
                inputRef={(e) => setFocusOnInput(e, 'reasonForForm')}
                error={!!validationError?.reasonForForm}
                helperText={<DAlertBox errorText={validationError?.reasonForForm} />}
                label='Reason for Form'
              />
            )}
          />
        </div>
        <div className='col col-sm-12 col-md-4'>
          <Autocomplete
            options={sortedList(languageList)}
            fullWidth
            size='small'
            name='language'
            disableClearable={true}
            value={formData.language}
            disabled={formData.registerToVoteColumbia !== 'YES' || (isFormDisabled && focusedField !== 'language')}
            onChange={(e, v) => handleChange('language', v)}
            onBlur={e => handleError('language', e.target.value)}
            renderInput={params => (
              <TextField
                {...params}
                inputRef={(e) => setFocusOnInput(e, 'language')}
                error={!!validationError?.language}
                helperText={<DAlertBox errorText={validationError?.language} />}
                label='Language'
              />
            )}
          />
        </div>
      </div>
      <div className='d-row'>
        <div className='col col-sm-12 col-md-4'>
          <Autocomplete
            options={sortedList(optionList)}
            fullWidth
            size='small'
            name='pollWorker'
            disableClearable={true}
            value={formData.pollWorker}
            disabled={formData.registerToVoteColumbia !== 'YES' || (isFormDisabled && focusedField !== 'pollWorker')}
            onChange={(e, v) => handleChange('pollWorker', v)}
            onBlur={e => handleError('pollWorker', e.target.value)}
            renderInput={params => (
              <TextField
                {...params}
                inputRef={(e) => setFocusOnInput(e, 'pollWorker')}
                error={!!validationError?.pollWorker}
                helperText={<DAlertBox errorText={validationError?.pollWorker} />}
                label='Poll Worker'
              />
            )}
          />
        </div>

        <div className='col col-sm-12 col-md-4'>
          <Autocomplete
            options={sortedList(partyList)}
            fullWidth
            name='partyAffiliation'
            size='small'
            disableClearable={true}
            value={formData.partyAffiliation}
            getOptionDisabled={(option) => option === 'Unknown'}
            disabled={formData.registerToVoteColumbia !== 'YES' || (isFormDisabled && focusedField !== 'partyAffiliation')}
            onChange={(e, v) => handleChange('partyAffiliation', v)}
            onBlur={e => handleError('partyAffiliation', e.target.value)}
            renderInput={params => (
              <TextField
                {...params}
                inputRef={(e) => setFocusOnInput(e, 'partyAffiliation')}
                error={!!validationError?.partyAffiliation}
                helperText={<DAlertBox errorText={validationError?.partyAffiliation} />}
                label='Party Affiliation'
              />
            )}
          />
        </div>

        {formData.partyAffiliation === 'OTHER' && <div className='col col-sm-12 col-md-4'>
          <TextField
            fullWidth
            label='Other Party'
            size='small'
            disabled={formData.registerToVoteColumbia !== 'YES' || (isFormDisabled && focusedField !== 'otherParty')}
            value={formData.otherParty}
            name='otherParty'
            inputProps={{ maxLength: 50 }}
            onChange={(e) => handleChange('otherParty', e.target.value)}
            onBlur={e => handleError('otherParty', e.target.value)}
            inputRef={(e) => setFocusOnInput(e, 'otherParty')}
            error={!!validationError?.otherParty}
            helperText={<DAlertBox errorText={validationError?.otherParty} />}
          />
        </div>}
      </div>
      <div className='d-row'>


        <div className='col col-sm-12 col-md-4'>
          <TextField
            fullWidth
            size='small'
            label='Last Used Name '
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

          <Autocomplete
            options={sortedList(optionList)}
            fullWidth
            name='disableAssistanceRequired'
            size='small'
            disableClearable={true}
            value={formData.disableAssistanceRequired}
            disabled={formData.registerToVoteColumbia !== 'YES' || (isFormDisabled && focusedField !== 'disableAssistanceRequired')}
            onChange={(e, v) => handleChange('disableAssistanceRequired', v)}
            onBlur={e => handleError('disableAssistanceRequired', e.target.value)}
            renderInput={params => (
              <TextField
                {...params}
                inputRef={(e) => setFocusOnInput(e, 'disableAssistanceRequired')}
                error={!!validationError?.disableAssistanceRequired}
                helperText={<DAlertBox errorText={validationError?.disableAssistanceRequired} />}
                label='Disabled Assistance Required'
              />
            )}
          />
        </div>
        {formData.disableAssistanceRequired === "YES" && <div className='col col-sm-12 col-md-4'>
          <TextField
            fullWidth
            size='small'
            label='Disabled Assistance Reason'
            value={formData.disableAssistanceReason}
            name='disableAssistanceReason'
            disabled={(isFormDisabled && focusedField !== 'disableAssistanceReason')}
            inputProps={{ maxLength: 150 }}
            autoComplete='off'
            onChange={(e) => handleChange('disableAssistanceReason', e.target.value)}
            onBlur={e => handleError(e.target.name, e.target.value)}
            inputRef={(e) => setFocusOnInput(e, 'disableAssistanceReason')}
            error={!!validationError?.disableAssistanceReason}
            helperText={<DAlertBox errorText={validationError?.disableAssistanceReason} />}
          />

        </div>}
      </div>
      <div className='d-sub-title address-title'> Mailing Address Details  <FormControlLabel className='last-address-checkbox'
        control={<Checkbox size='small' checked={copyData} disabled={formData.registerToVoteColumbia !== "YES" || isFormDisabled} onChange={(e) => copyPrimaryAddress(e.target.checked)} />}
        label={'Copy Primary Address'}
        labelPlacement='end'
      /> </div>

      <BOEAddress
        key={'mailingAddress'}
        validationErrors={validationError?.mailingAddress}
        address={formData.mailingAddress}
        isFormDisabled={isFormDisabled || copyData}
        disabledFields={formData.registerToVoteColumbia !== 'YES'}
        handleAddressChange={(name, value) =>
          handleAddressChange(name, value, 'mailingAddress')
        }
        handleAddressError={(name, value) =>
          handleAddressError(name, value, 'mailingAddress')
        }
      />
      <div className='d-sub-title address-title'> Last Address Details  <FormControlLabel className='mailing-checkbox' disabled={!checkAllValues(formData.mailingAddress) || isFormDisabled}
        control={<Checkbox size='small' checked={copyMailingData} disabled={formData.registerToVoteColumbia !== "YES" || isFormDisabled} onChange={(e) => copyMailingAddress(e.target.checked)} />}
        label={'Copy Mailing Address'}

        labelPlacement='end'
      />  </div>

      <BOEAddress
        key={'lastAddress'}
        validationErrors={validationError?.lastAddress}
        address={formData.lastAddress}
        isFormDisabled={isFormDisabled || copyMailingData}
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
          <div key={item.name} className='col col-sm-12 col-md-6 pt-0'>
            <FormControlLabel
              control={<Checkbox className={'invalid-checkbox'} size='small' disabled={formData.registerToVoteColumbia !== 'YES' || isFormDisabled} onChange={e => handleUserConditions(e, index)} checked={item.value} />}
              label={item.name}
              labelPlacement='end'
            />
          </div>
        ))}
      </div>
    </form>}
  </div>
  );
}
