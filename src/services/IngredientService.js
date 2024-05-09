import axios from 'axios';

const url = 'http://localhost:8000';

export const getIngredients = async () => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
        const response = await axios.get(`${url}/ingredients`, {
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