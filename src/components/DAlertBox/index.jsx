import React, { useState, useMemo, useEffect } from 'react';
import './DAlertBox.css';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';

const DAlertBox = ({ errorText, warningText }) => {
    const [expanded, setExpanded] = useState(false);
    const [clearWarning, setClearWarning] = useState(false);
    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    const divStyle = useMemo(() => ({
        overflow: expanded ? 'visible' : 'hidden',
        textOverflow: expanded ? 'clip' : 'ellipsis',
        whiteSpace: expanded ? 'normal' : 'nowrap'
    }), [expanded]);

    useEffect(() => {
        setClearWarning(false)
    }, [warningText])

    return (<> {errorText ? <div className={'error-box alert-box'} >
        <ErrorOutlineOutlinedIcon className='error-icon' />
        <div style={divStyle} onClick={toggleExpansion}>
            <span>
                {errorText}
            </span>
        </div>
    </div> : <>
        {warningText && !clearWarning && <div className={'warning-box alert-box'} >
            <WarningAmberIcon className='warning-icon' />
            <div>
                <span>
                    {warningText}
                </span>
            </div>
            <CloseIcon className='alert-close-icon' onClick={() => setClearWarning(true)} />
        </div>}
    </>
    }
    </>
    );
};

export default DAlertBox;
