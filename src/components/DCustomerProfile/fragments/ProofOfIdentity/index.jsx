import './ProofOfIdentity.css';
 
import React from 'react'; 
import UscisFragment from '../USCIS';
import UspassportFragment from '../Uspassport';

export default function ProofOfIdentityFragment(props) {
 
  return (
    <>
      {props.citizen ? (
        <>

<div className='sub_title'> US Passport </div>
          <UspassportFragment />
 
        </>
      ) : (
        <>
          <div className='sub_title'> USCIS </div>
          <UscisFragment />
        </>
      )}
    </>
  );
}
