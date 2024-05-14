import axios from 'axios';

const url = 'http://localhost:8000';

export const getVacations = async (employeeId) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.get(`${url}/vacations/${employeeId}`, {
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

export const delVacations = async (employeeId, id) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.delete(`${url}/vacations/${employeeId}/${id}`, {
        headers: {
          Authorization: token
        }
      });

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

export const addVacations = async (employeeId, beginDate, endDate) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const data = {
        beginDate,
        endDate
      };
      const response = await axios.post(`${url}/vacations/${employeeId}`, data, {
        headers: {
          Authorization: token
        }
      });
      return response.data; 
    } else {
      return { success: false, message: "Une erreur est survenue" };
    }
  } catch (error) {
    if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Une erreur est survenue" };
  }
};

export const getVacationsById = async (employeeId, id) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.get(`${url}/vacations/${employeeId}/${id}`, {
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

export const putVacations = async (employeeId, id, beginDate, endDate) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const data = {
          beginDate,
          endDate
        };

      const response = await axios.put(`${url}/vacations/${employeeId}/${id}`, data, {
        headers: {
          Authorization: token
        }
      });
      return response; 
    } else {
      return { success: false, message: "Une erreur est survenue" };
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Une erreur est survenue" };
  }
};