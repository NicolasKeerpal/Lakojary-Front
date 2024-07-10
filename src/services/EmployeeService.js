import axios from 'axios';

const url = 'http://localhost:8000';

export const getEmployees = async () => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.get(`${url}/employees`, {
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

export const getDeliverymen = async () => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.get(`${url}/employees/deliverymen`, {
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

export const putBanEmployee = async (id, ban) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      let data = {
          ban
      };

      const response = await axios.put(`${url}/employees/${id}/ban`, data, {
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

export const delEmployee = async (id) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.delete(`${url}/employees/${id}`, {
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

export const addEmployee = async (mail, password, firstname, lastname, salary, roleId, departmentId, firstDayWeekend, endContract) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      let intDepartmentId = +departmentId;
      let intRoleId = +roleId;
      let intSalary = +salary;
      const data = {
        mail,
        password,
        firstname,
        lastname,
        role: intRoleId,
        salary: intSalary,
        firstDayWeekend,
        departmentId: intDepartmentId,
        endContract
      };
      const response = await axios.post(`${url}/employees`, data, {
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

export const getEmployee = async (id) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      const response = await axios.get(`${url}/employees/${id}`, {
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

export const putEmployee = async (id, mail, password, firstname, lastname, salary, departmentId, firstDayWeekend, endContract) => {
  const token = localStorage.getItem('token');
  try {
    if (token) {
      let intDepartmentId = +departmentId;
      let intSalary = +salary;
      let data;
      if (password) {
        data = {
          mail,
          password,
          firstname,
          lastname,
          salary: intSalary,
          firstDayWeekend,
          departmentId: intDepartmentId,
          endContract
        };
      } else {
        data = {
          mail,
          firstname,
          lastname,
          salary: intSalary,
          firstDayWeekend,
          departmentId: intDepartmentId,
          endContract
        };
      }

      const response = await axios.put(`${url}/employees/${id}`, data, {
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