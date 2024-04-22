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

export const getCustomers = async () => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.get(`${url}/customers`, {
        headers: {
          Authorization: token
        }
      });
      return response.data;
    }
    return { success: false, message: "Une erreur est survenue" };

  } catch (error) {
    return { success: false, message: "Une erreur est survenue" };
  }
};

export const getCustomer = async (id) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.get(`${url}/customers/${id}`, {
        headers: {
          Authorization: token
        }
      });
      return response.data;
    }
    return { success: false, message: "Une erreur est survenue" };

  } catch (error) {
    return { success: false, message: "Une erreur est survenue" };
  }
};

export const putCustomer = async (id, mail, password, firstname, lastname, zipCode, address, town, departmentId) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      let intDepartmentId = +departmentId;
      let intZipCode = +zipCode;
      let data;
      if (password) {
        data = {
          mail,
          password,
          firstname,
          lastname,
          zipCode: intZipCode,
          address,
          town,
          departmentId: intDepartmentId
        };
      } else {
        data = {
          mail,
          firstname,
          lastname,
          zipCode: intZipCode,
          address,
          town,
          departmentId: intDepartmentId
        };
      }

      const response = await axios.put(`${url}/customers/${id}`, data, {
        headers: {
          Authorization: token
        }
      });
      console.log(response);
      return response; 
    }
    return { success: false, message: "Une erreur est survenue" };
  } catch (error) {
    if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Une erreur est survenue" };
  }
};

export const putBanCustomer = async (id, ban) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      let data = {
          ban
      };

      const response = await axios.put(`${url}/customers/${id}/ban`, data, {
        headers: {
          Authorization: token
        }
      });
      console.log(response);
      return response; 
    }
    return { success: false, message: "Une erreur est survenue" };
  } catch (error) {
    if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Une erreur est survenue" };
  }
};