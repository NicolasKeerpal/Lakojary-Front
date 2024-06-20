import axios from 'axios';

const url = 'http://localhost:8000';

export const getFoodComposition = async (id) => {
  try {
    const response = await axios.get(`${url}/compositions/food/${id}`);
    return response.data.data.map(item => item.containIngredient);
  } catch (error) {
    return { success: false, message: "Une erreur est survenue" };
  }
};