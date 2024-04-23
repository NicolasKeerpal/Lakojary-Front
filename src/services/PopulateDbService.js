import axios from 'axios';

const url = 'http://localhost:8000';

export const populateDataBase = async () => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.post(`${url}/populate-db`, null, {
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