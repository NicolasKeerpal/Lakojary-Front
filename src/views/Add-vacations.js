import React from 'react';
import { Link } from 'react-router-dom';
import { addVacations } from '../services/VacationsService';

class AddVacations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        id: props.id,
        formData: {
            beginDate: null,
            endDate: null
        }
    };

      this.handleChange = this.handleChange.bind(this);
      this.submit = this.submit.bind(this);
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
    const { id } = this.state;
    try {
      const response = await addVacations(id, beginDate, endDate);
      
      if (response.success) {
        alert("Les vacances ont bien été crées !");
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
        <h1>Ajout de vacances</h1>
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
          <button type="submit">Créer</button>
          <Link to={`/employes/${id}/vacances`}><button>Annuler</button></Link>
        </form>
      </div>
    );
  }
}

export default AddVacations;