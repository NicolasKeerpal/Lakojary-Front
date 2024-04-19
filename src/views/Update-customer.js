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
      <div>
        <form onSubmit={this.submit}>
        <h1>Modification client</h1>
        <label>
            Nom:
            <input
              type="text"
              name="lastname"
              value={this.state.formData.lastname}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
        <label>
            Prénom:
            <input
              type="text"
              name="firstname"
              value={this.state.formData.firstname}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
          <label>
            Mail:
            <input
              type="email"
              name="mail"
              value={this.state.formData.mail}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={this.state.isPasswordEnabled}
              onChange={this.handleCheckboxChange}
            />
            Mot de passe:
            <input
              type="password"
              name="password"
              value={this.state.formData.password}
              onChange={this.handleChange}
              disabled={!this.state.isPasswordEnabled}
              required
            />
          </label>
          <br />
          <label>
            Adresse:
            <input
              type="text"
              name="address"
              value={this.state.formData.address}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
          <label>
            Code postal:
            <input
              type="number"
              name="zipCode"
              value={this.state.formData.zipCode}
              onChange={this.handleChange}
              min="1000"
              max="98999"
              required
            />
          </label>
          <br />
          <label>
            Ville:
            <input
              type="text"
              name="town"
              value={this.state.formData.town}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
          <label>
            Département:
            <select
              name="departmentId"
              value={this.state.formData.departmentId}
              onChange={this.handleChange}>
              {this.state.departments.map(department => (
                <option key={department.id} value={department.id}>
                  {String(department.id).padStart(2, '0')} - {department.name}
                </option>
              ))}
            </select>
          </label>
          <br />
          <button type="submit">Créer</button>
          <Link to="/clients"><button>Annuler</button></Link>
        </form>
      </div>
    );
  }
}

export default UpdateCustomer;