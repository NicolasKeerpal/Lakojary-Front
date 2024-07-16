import axios from 'axios';

const url = 'http://localhost:8000';

export const getCart = async () => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.get(`${url}/orders/cart/all`, {
        headers: {
          Authorization: token
        }
      });
      return response.data;
    }
    return { success: false, message: "Une erreur est survenue" };

  } catch (error) {
    console.log(error);
    return { success: false, message: "Une erreur est survenue" };
  }
};

export const getPaidOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const response = await axios.get(`${url}/orders/paid/all`, {
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

export const getDeliveries = async () => {
const token = localStorage.getItem('token');
try {
    if (token) {
    const response = await axios.get(`${url}/orders/deliveries/all`, {
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

export const delOrder = async (id) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.delete(`${url}/orders/${id}`, {
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

export const addOrder = async (foodId, qty) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      let intFoodId = +foodId;
      let intQty = +qty;
      const data = {
        foodId: intFoodId,
        qty: intQty
      };
      const response = await axios.post(`${url}/orders`, data, {
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

export const buyOrder = async (id, hour) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const data = {
        hour,
      };
      const response = await axios.put(`${url}/orders/${id}`, data, {
        headers: {
          Authorization: token
        }
      });
      return response; 
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

export const finishOrder = async (id) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const data = {};
      const response = await axios.put(`${url}/orders/${id}`, data, {
        headers: {
          Authorization: token
        }
      });
      return response; 
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

export const validateDelivery = async (id) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const data = {};
      const response = await axios.put(`${url}/orders/${id}`, data, {
        headers: {
          Authorization: token
        }
      });
      return response; 
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