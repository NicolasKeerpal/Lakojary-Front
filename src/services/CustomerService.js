import axios from 'axios';

const url = 'http://localhost:8000';

export const addCustomer = async (mail, password, firstname, lastname, zipCode, address, town, departmentId) => {
  try {
    let intDepartmentId = +departmentId;
    let intZipCode = +zipCode;
    const data = {
      mail,
      password,
      firstname,
      lastname,
      zipCode: intZipCode,
      address,
      town,
      departmentId: intDepartmentId
    };
    const response = await axios.post(`${url}/customers`, data);
    return response.data; 
  } catch (error) {
    if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Une erreur est survenue" };
  }
};