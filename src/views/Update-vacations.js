import React from 'react';
import { Link } from 'react-router-dom';
import { putVacations, getVacationsById } from '../services/VacationsService';

class UpdateVacations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        vacationsId: props.vacationsId,
        id: props.id,
        formData: {
            beginDate: null,
            endDate: null
        }
    };

      this.handleChange = this.handleChange.bind(this);
      this.submit = this.submit.bind(this);
  }

  formatDate(dateStr) {
    const dateObj = new Date(dateStr);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  async componentDidMount() {
    const { vacationsId, id } = this.state;
    try {
      const vacationsData = await getVacationsById(id, vacationsId);
      if (vacationsData.success) {
        let beginDate = this.formatDate(vacationsData.data.beginDate);
        let endDate = this.formatDate(vacationsData.data.endDate);
        this.setState({ 
          formData: { 
            beginDate,
            endDate
          }
        });
      } else {
        alert('Une erreur est survenue');
      }
    } catch (error) {
      alert('Une erreur est survenue');
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  }

  async submit(event) {
    event.preventDefault();
    const { beginDate, endDate } = this.state.formData;
    const { vacationsId, id } = this.state;
    try {
      const response = await putVacations(id, vacationsId, beginDate, endDate);
      
      if (response.status == 204) {
        alert("Les vacances ont bien été modifiées !");
        this.props.navigate(`/employes/${id}/vacances`);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    const { id } = this.state;
    return (
      <div>
        <form onSubmit={this.submit}>
        <h1>Modification de vacances</h1>
        <label>
            Début:
            <input
              type="date"
              name="beginDate"
              value={this.state.formData.beginDate}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
        <label>
            Fin:
            <input
              type="date"
              name="endDate"
              value={this.state.formData.endDate}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
          <button type="submit">Modifier</button>
          <Link to={`/employes/${id}/vacances`}><button>Annuler</button></Link>
        </form>
      </div>
    );
  }
}

export default UpdateVacations;