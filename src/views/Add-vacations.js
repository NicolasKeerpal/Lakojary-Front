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
      <div className="flex flex-col items-center mt-8">
        <form onSubmit={this.submit} className="w-full max-w-lg bg-custom-secondary_color p-8 rounded shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6">Ajout de vacances</h1>
          <label className="block mb-4">
            <span className="text-white">Début:</span>
            <input
              type="date"
              name="beginDate"
              value={this.state.formData.beginDate}
              onChange={this.handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block mb-6">
            <span className="text-white">Fin:</span>
            <input
              type="date"
              name="endDate"
              value={this.state.formData.endDate}
              onChange={this.handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Créer</button>
            <Link to={`/employes/${id}/vacances`}>
              <button className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Annuler</button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default AddVacations;
