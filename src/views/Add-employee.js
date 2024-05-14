import React from 'react';
import { Link } from 'react-router-dom';
import { getDepartments } from '../services/DepartmentService';
import { addEmployee } from '../services/EmployeeService';

class AddEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        departments: [],
        isEndContractEnabled: false,
        formData: {
            mail: '',
            password: '',
            firstname: '',
            lastname: '',
            roleId: '1',
            salary: 0,
            firstDayWeekend: 'Lundi',
            departmentId: '1',
            endContract: null
        }
    };

      this.handleChange = this.handleChange.bind(this);
      this.submit = this.submit.bind(this);
      this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
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

  handleCheckboxChange(event) {
    const { checked } = event.target;
    this.setState({
      isEndContractEnabled: checked,
    });
  }


  async submit(event) {
    event.preventDefault();
    const { mail, password, firstname, salary, lastname, roleId, firstDayWeekend, departmentId, endContract } = this.state.formData;
    try {
      const response = await addEmployee(mail, password, firstname, lastname, salary, roleId, departmentId, firstDayWeekend, this.state.isEndContractEnabled ? endContract : null);
      
      if (response.success) {
        alert("Cet employé a bien été crée !");
        this.props.navigate('/employes');
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
        <h1>Ajout d'un employé</h1>
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
            Salaire:
            <input
              type="number"
              name="salary"
              value={this.state.formData.salary}
              onChange={this.handleChange}
              min="0"
              required
            />
          </label>
          <br />
          <label>
            Rôle:
            <select
              name="roleId"
              value={this.state.formData.roleId}
              onChange={this.handleChange}>
                <option value={1}>
                  Admin
                </option>
                <option value={2}>
                  Livreur
                </option>
                <option value={3}>
                  Boulanger
                </option>
            </select>
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={this.state.isEndContractEnabled}
              onChange={this.handleCheckboxChange}
            />
            Fin de contrat:
            <input
              type="date"
              name="endContract"
              value={this.state.formData.endContract}
              onChange={this.handleChange}
              disabled={!this.state.isEndContractEnabled}
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
          <label>
            Weekend:<br/>
            (Selectionnez le 1er jour et le 2ème sera automatiquement le jour suivant)<br/>
            1er jour: 
            <select
              name="firstDayWeekend"
              value={this.state.formData.firstDayWeekend}
              onChange={this.handleChange}>
              <option value="Lundi">Lundi</option>
              <option value="Mardi">Mardi</option>
              <option value="Mercredi">Mercredi</option>
              <option value="Jeudi">Jeudi</option>
              <option value="Vendredi">Vendredi</option>
              <option value="Samedi">Samedi</option>
              <option value="Dimanche">Dimanche</option>
            </select>
          </label>
          <br />
          <button type="submit">Créer</button>
          <Link to="/employes"><button>Annuler</button></Link>
        </form>
      </div>
    );
  }
}

export default AddEmployee;