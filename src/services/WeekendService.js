import axios from 'axios';

const url = 'http://localhost:8000';

function compareDays(day1, day2) {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return days.indexOf(day1) - days.indexOf(day2);
}

export const getWeekend = async (id) => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const response = await axios.get(`${url}/weekend/${id}`, {
          headers: {
            Authorization: token
          }
        });

        let weekend = [];
        weekend.push(response.data.data[0].dayId);
        weekend.push(response.data.data[1].dayId);
        return weekend.sort(compareDays);
      }
      return { success: false, message: "Une erreur est survenue" };
  
    } catch (error) {
        console.log(error);
      return { success: false, message: "Une erreur est survenue" };
    }
  };