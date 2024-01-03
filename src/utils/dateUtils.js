export const calculateAge = dob => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  let month = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    month = 12 + month;
    age--;
  }
  if (month === 0 && age === 0) {
    return `${days} Day(s)`;
  }
  return `${isNaN(age) ? '00' : age} Year(s) ${isNaN(month) ? '00' : month} Month(s)`;
};