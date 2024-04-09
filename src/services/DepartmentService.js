import axios from 'axios';

const url = 'http://localhost:8000';

export const getDepartments = async () => {
    try {
      const response = await axios.get(`${url}/departments`);
      return response.data;
    } catch (error) {
      return { success: false, message: "Une erreur est survenue" };
    }
  };
