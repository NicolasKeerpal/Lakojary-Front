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

export const delIngredient = async (id) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.delete(`${url}/ingredients/${id}`, {
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

export const putIngredient = async (id, name, addStock) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      let data;
      if (addStock > 0) {
        let intAddStock = +addStock;
        data = {
          name,
          addStock: intAddStock 
        };
      } else {
        data = {
          name
        };
      }

      const response = await axios.put(`${url}/ingredients/${id}`, data, {
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

export const getIngredient = async (id) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.get(`${url}/ingredients/${id}`, {
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

export const addIngredient = async (name, stock) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      let intStock = +stock;
      const data = {
        name,
        stock: intStock
      };
      const response = await axios.post(`${url}/ingredients`, data, {
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