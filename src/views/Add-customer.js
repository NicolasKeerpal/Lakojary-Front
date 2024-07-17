import React from 'react';
import { Link } from 'react-router-dom';
import { getDepartments } from '../services/DepartmentService';
import { addCustomer } from '../services/CustomerService';

class AddCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      formData: {
        mail: '',
        password: '',
        firstname: '',
        lastname: '',
        zipCode: '',
        address: '',
        town: '',
        departmentId: '1'
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  async componentDidMount() {
    try {
      const departmentsData = await getDepartments();
      if (departmentsData.success) {
        this.setState({ departments: departmentsData.data });
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
    const { mail, password, firstname, lastname, zipCode, address, town, departmentId } = this.state.formData;
    try {
      const response = await addCustomer(mail, password, firstname, lastname, zipCode, address, town, departmentId);
      
      if (response.success) {
        alert("Le client a été créé avec succès");
        this.props.navigate('/clients');
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    return (
      <div className="flex flex-col items-center mt-8 mb-8">
        <form onSubmit={this.submit} className="w-full max-w-lg bg-custom-secondary_color p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-white">Ajout d'un client</h1>
          <div className="mb-4">
            <label className="block font-medium text-white">Nom:</label>
            <input
              type="text"
              name="lastname"
              value={this.state.formData.lastname}
              onChange={this.handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-white">Prénom:</label>
            <input
              type="text"
              name="firstname"
              value={this.state.formData.firstname}
              onChange={this.handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-white">Mail:</label>
            <input
              type="email"
              name="mail"
              value={this.state.formData.mail}
              onChange={this.handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-white">Mot de passe:</label>
            <input
              type="password"
              name="password"
              value={this.state.formData.password}
              onChange={this.handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-white">Adresse:</label>
            <input
              type="text"
              name="address"
              value={this.state.formData.address}
              onChange={this.handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-white">Code postal:</label>
            <input
              type="number"
              name="zipCode"
              value={this.state.formData.zipCode}
              onChange={this.handleChange}
              min="1000"
              max="98999"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-white">Ville:</label>
            <input
              type="text"
              name="town"
              value={this.state.formData.town}
              onChange={this.handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-white">Département:</label>
            <select
              name="departmentId"
              value={this.state.formData.departmentId}
              onChange={this.handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {this.state.departments.map(department => (
                <option key={department.id} value={department.id}>
                  {String(department.id).padStart(2, '0')} - {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Créer</button>
            <Link to="/clients">
              <button className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Annuler</button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default AddCustomer;
