import React, { useState, useMemo, useEffect } from 'react';
import './DAlertBox.css';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';

const DAlertBox = ({ errorText, warningText, onClearWarning }) => {
    const [expanded, setExpanded] = useState(false);
   // const [clearWarning, setClearWarning] = useState(false);
    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    const divStyle = useMemo(() => ({
        overflow: expanded ? 'visible' : 'hidden',
        textOverflow: expanded ? 'clip' : 'ellipsis',
        whiteSpace: expanded ? 'normal' : 'nowrap'
    }), [expanded]);

    /*useEffect(() => {
        setClearWarning(false)
    }, [warningText])*/

    return (<> {errorText ? <span className={'error-box alert-box'} >
        <ErrorOutlineOutlinedIcon className='error-icon' />
        <span style={divStyle} onClick={toggleExpansion}>
            <span>
                {errorText}
            </span>
        </span>
    </span> : <>
        {warningText && <span className={'warning-box alert-box'} >
            <WarningAmberIcon className='warning-icon' />
            <span>
                <span>
                    {warningText}
                </span>
            </span>
            <CloseIcon className='alert-close-icon' onClick={() => onClearWarning(warningText)} />
        </span>}
    </>
    }
    </>
    );
};

export default DAlertBox;
