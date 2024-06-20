import axios from 'axios';

const url = 'http://localhost:8000';

export const getFoods = async () => {
  try {
    const response = await axios.get(`${url}/foods`);
    return response.data;
  } catch (error) {
    return { success: false, message: "Une erreur est survenue" };
  }
};

export const getFood = async (id) => {
  try {
    const response = await axios.get(`${url}/foods/${id}`);
    return response.data;
  } catch (error) {
    return { success: false, message: "Une erreur est survenue" };
  }
};

export const addFood = async (name, price, description, stock, image, composition) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('image', image);
      const response = await axios.post(`${url}/foods`, formData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      const foodId = response.data.food.id;
      await Promise.all(composition.map(async (ingredient) => {
        const compositionData = {
          foodId,
          ingredientId: ingredient.id
        };
        await axios.post(`${url}/compositions`, compositionData, {
          headers: {
            Authorization: token
          }
        });
      }));

      return response.data; 
    }
    return { success: false, message: "Une erreur est survenue" };
  } catch (error) {
    if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Une erreur est survenue" };
  }
};

export const delFood = async (id) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.delete(`${url}/foods/${id}`, {
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

export const putFood = async (id, name, price, description, addStock, image, composition) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('addStock', addStock);
      formData.append('image', image);
      const response = await axios.put(`${url}/foods/${id}`, formData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data'
        }
      });

      const idsComposition = composition.map(ingredient => ingredient.id);
      const compositionData = {
        composition: idsComposition
      };

      await axios.put(`${url}/compositions/food/${id}`, compositionData, {
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