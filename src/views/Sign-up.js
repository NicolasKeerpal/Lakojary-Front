import React from 'react';
import { Link } from 'react-router-dom';
import { getDepartments } from '../services/DepartmentService';
import { addCustomer } from '../services/CustomerService';

class SignUp extends React.Component {
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
    console.log(this.state.formData);
    try {
      const response = await addCustomer(mail, password, firstname, lastname, zipCode, address, town, departmentId);
      
      if (response.success) {
        alert("Votre compte a été crée avec succès, veuillez vous connecter");
        this.props.navigate('/connexion');
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
        <h1>Inscription</h1>
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
            Mot de passe:
            <input
              type="password"
              name="password"
              value={this.state.formData.password}
              onChange={this.handleChange}
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
          <p>Vous avez déjà compte ? <Link to="/connexion">Connexion</Link></p>
        </form>
      </div>
    );
  }
}

export default SignUp;