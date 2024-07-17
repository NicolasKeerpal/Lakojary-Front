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
      <div className="flex flex-col items-center mt-8">
        <form onSubmit={this.submit} className="w-full max-w-lg bg-custom-primary_color p-8 rounded shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6">Modification de vacances</h1>
          <label className="block mb-4">
            <span className="text-white">Début:</span>
            <input
              type="date"
              name="beginDate"
              value={this.state.formData.beginDate}
              onChange={this.handleChange}
              required
              className="text-black mt-1 block w-full p-2 border border-gray-300 rounded"
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
              className="text-black mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-opacity-75">Modifier</button>
            <Link to={`/employes/${id}/vacances`}>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">Annuler</button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default UpdateVacations;
