
import React from 'react';
import BOEAddress from '../BOEAddress';
import './test.css'
import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';

const Test = ({ address }) => {
    return <>
        <div className='d-sub-title'> Current disabled Color  </div>
        <BOEAddress address={address} isFormDisabled={true} />
        <div className='option1'>
            <div className='d-sub-title'> Option 1 disabled Color  </div>
            <BOEAddress address={address} isFormDisabled={true} />
        </div>
        <div className='option2'>
            <div className='d-sub-title'> Option 2 disabled Color  </div>
            <BOEAddress address={address} isFormDisabled={true} />
        </div>

        <div className='option3'>
            <div className='d-sub-title'> Option 3 disabled Color  </div>
            <BOEAddress address={address} isFormDisabled={true} />
        </div>

        <br /><br /><div className='option1-checkbox' >
            <FormControlLabel
                control={<Checkbox className={'invalid-checkbox'} size='small' />}
                label={'demo checkbox'}
                labelPlacement='end'
            />
        </div>

        <div className='option2-checkbox' >
            <FormControlLabel
                control={<Checkbox className={'invalid-checkbox'} size='small' />}
                label={'demo checkbox'}
                labelPlacement='end'
            />
            <FormHelperText>  Placeholder for error </FormHelperText>
        </div>
    </>
}

export default Test;