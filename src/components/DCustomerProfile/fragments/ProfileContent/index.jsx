
import React from 'react';
import { Divider } from '@mui/material';
const SIGNATURE_IMAGE_URL =
  'https://www.signwell.com/assets/vip-signatures/muhammad-ali-signature-6a40cd5a6c27559411db066f62d64886c42bbeb03b347237ffae98b0b15e0005.svg';
const PROFILE_IMAGE_URL =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsCLee74cvs75AeZ9dLnG_SDjKbJXEWjMGVQ&usqp=CAU';
const SIGNATURE_TEXT = 'SIGNATURE';
const CAPTURED_ON = 'CAPTURED ON';

const ProfileContent = () => {
  const calculateDateTime = d => {
    const date = d ? d : new Date();
    return date.toLocaleString();
  };

  return (
    <>
      <div className={'img-wrapper'}>
        <img src={PROFILE_IMAGE_URL} alt={'profileImage'} loading='lazy' />
        <div className='img-badge'> VIP </div>
      </div>

      <Divider sx={{ m: '1.5rem 0' }}>{SIGNATURE_TEXT}</Divider>
      <img
        src={SIGNATURE_IMAGE_URL}
        alt={'signatureImage'}
        loading='lazy'
        className='signature-img'
      />

      <div className='profile-date'>
        <div className='date-label'>
          {' '}
          <Divider> {CAPTURED_ON} </Divider>{' '}
        </div>
        <div className='date-value'> {calculateDateTime()} </div>
      </div>
    </>
  );
};

export default ProfileContent;
