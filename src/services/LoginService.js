import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const url = 'http://localhost:8000';

export const login = async (mail, password, role) => {
  try {
    const data = {
      mail: mail,
      password: password,
      role: role
    };

    const response = await axios.post(`${url}/login`, data);
    return response.data; 
  } catch (error) {
    if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Une erreur est survenue" };
  }
};

export const refreshToken = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const data = {
        userId: decoded.id
      };

      const response = await axios.post(`${url}/login/refresh-token`, data);
      return response.data; 

    } catch (error) {
      if (error.response && error.response.data) {
          return error.response.data;
        }
        return { success: false, message: "Une erreur est survenue" };
    }
  } else {
    return { success: false, message: "Une erreur est survenue" };
  }
};
