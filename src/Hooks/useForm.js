/*
 * Author: Sushree Dash
 * Created: 2023-12-18
 * Last Modified: 2023-12-19
 * Description: This custom hook will be used as a reusable form validation component.
 * Application Release Version:1.0.0
 */
import { useState } from 'react';

const useForm = () => {
  //Form Values
  const [values, setValues] = useState({});

  //Errors
  const [errors, setErrors] = useState({});

  //common omit to remove property

  const omitVal = (key, { [key]: _, ...obj }) => obj;

  //method to validate form inputs

  const validate = (e, name, value) => {
    switch (name) {
      case 'lastName':
        if (value.length <= 6) {
          console.log(value);
          //set the error state
          setErrors({
            ...errors,
            lastName: 'Last Name atleast have 5 letters'
          });
        } else {
          //set error state empty / remove the error for firstname input

          let newObj = omitVal('lastName', errors);
          setErrors(newObj);
        }
        break;
      case 'email':
        if (
          !new RegExp(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ).test(value)
        ) {
          setErrors({
            ...errors,
            email: 'Enter a valid email address'
          });
        } else {
          let newObj = omitVal('email', errors);
          setErrors(newObj);
        }
        break;
      default:
        break;
    }
  };

  //method to handle form inputs

  const handleChange = e => {
    e.persist();

    let name = e.target.name;
    let val = e.target.value;
    validate(e, name, val);
    setValues({
      ...values,
      [name]: val
    });
  };

  /**
   * TODO: add submit method later
   */

  return {
    values,
    errors,
    handleChange
  };
};
export default useForm;
