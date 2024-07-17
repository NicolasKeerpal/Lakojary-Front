import React from 'react';
import { Link } from 'react-router-dom';
import { getDepartments } from '../services/DepartmentService';
import { putCustomer, getCustomer } from '../services/CustomerService';

class UpdateCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      isPasswordEnabled: false,
      id: props.id,
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
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  async componentDidMount() {
    try {
      const departmentsData = await getDepartments();
      const customerData = await getCustomer(this.state.id);
      if (departmentsData.success && customerData.success) {
        this.setState({
          departments: departmentsData.data,
          formData: {
            mail: customerData.data.customerId.mail,
            password: '',
            firstname: customerData.data.customerId.firstname,
            lastname: customerData.data.customerId.lastname,
            zipCode: customerData.data.zipCode,
            address: customerData.data.address,
            town: customerData.data.town,
            departmentId: customerData.data.departmentId
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

  handleCheckboxChange(event) {
    const { checked } = event.target;
    this.setState({
      isPasswordEnabled: checked,
    });
  }

  async submit(event) {
    event.preventDefault();
    const { mail, password, firstname, lastname, zipCode, address, town, departmentId } = this.state.formData;
    try {
      const response = await putCustomer(this.state.id, mail, this.state.isPasswordEnabled ? password : null, firstname, lastname, zipCode, address, town, departmentId);

      if (response.status == 204) {
        alert("Ce client a bien été modifié !");
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
        <form onSubmit={this.submit} className="w-full max-w-lg bg-custom-secondary_color p-8 rounded shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6">Modification client</h1>
          <label className="block mb-4">
            <span className="text-white">Nom:</span>
            <input
              type="text"
              name="lastname"
              value={this.state.formData.lastname}
              onChange={this.handleChange}
              required
              className="text-black mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block mb-4">
            <span className="text-white">Prénom:</span>
            <input
              type="text"
              name="firstname"
              value={this.state.formData.firstname}
              onChange={this.handleChange}
              required
              className="text-black mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block mb-4">
            <span className="text-white">Mail:</span>
            <input
              type="email"
              name="mail"
              value={this.state.formData.mail}
              onChange={this.handleChange}
              required
              className="text-black mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block mb-4">
            <input
              type="checkbox"
              checked={this.state.isPasswordEnabled}
              onChange={this.handleCheckboxChange}
              className="mr-2"
            />
            <span className="text-white">Mot de passe:</span>
            <input
              type="password"
              name="password"
              value={this.state.formData.password}
              onChange={this.handleChange}
              disabled={!this.state.isPasswordEnabled}
              required
              className={`text-black mt-1 block w-full p-2 border border-gray-300 rounded ${!this.state.isPasswordEnabled && 'bg-gray-200'}`}
            />
          </label>
          <label className="block mb-4">
            <span className="text-white">Adresse:</span>
            <input
              type="text"
              name="address"
              value={this.state.formData.address}
              onChange={this.handleChange}
              required
              className="text-black mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block mb-4">
            <span className="text-white">Code postal:</span>
            <input
              type="number"
              name="zipCode"
              value={this.state.formData.zipCode}
              onChange={this.handleChange}
              min="1000"
              max="98999"
              required
              className="text-black mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block mb-4">
            <span className="text-white">Ville:</span>
            <input
              type="text"
              name="town"
              value={this.state.formData.town}
              onChange={this.handleChange}
              required
              className="text-black mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block mb-6">
            <span className="text-white">Département:</span>
            <select
              name="departmentId"
              value={this.state.formData.departmentId}
              onChange={this.handleChange}
              className="text-black mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              {this.state.departments.map(department => (
                <option key={department.id} value={department.id}>
                  {String(department.id).padStart(2, '0')} - {department.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Modifier</button>
            <Link to="/clients">
              <button className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Annuler</button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default UpdateCustomer;
