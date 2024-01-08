import dayjs from "dayjs";

export const calculateAge = dob => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      month = 12 + month;
      age--;
    }
    return `${isNaN(age) ? '00' : age} Year(s) ${isNaN(month) ? '00' : month} Month(s)`;
  };


  export const isBelowAge = (birthDate, ageLimit) => {
  const today = dayjs();
  const date = dayjs(birthDate);
  const age = today.diff(date, 'year');
  
  return age < ageLimit;
};