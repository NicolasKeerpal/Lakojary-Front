import React from 'react';
import { Link } from 'react-router-dom';
import { getCustomer, putCustomer } from '../services/CustomerService';
import { getEmployee, putEmployee } from '../services/EmployeeService';
import { getDepartments } from '../services/DepartmentService';
import { jwtDecode } from 'jwt-decode';
import { getWeekend } from '../services/WeekendService';

class UpdateProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChangePasswordEnabled: false,
      role: null,
      id: null,
      departments: [],
      formData: {
        firstname: '',
        lastname: '',
        mail: '',
        zipCode: '',
        town: '',
        address: '',
        endContract: '',
        salary: '',
        departmentId: '',
        firstDayWeekend: 'Lundi',
        password: ''
      }
    };

      this.handleChange = this.handleChange.bind(this);
      this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
      this.submit = this.submit.bind(this);
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    let decoded;
    if (token) {
      try {
        decoded = jwtDecode(token);
        this.setState({ 
          role: decoded.role, 
          id: decoded.id
        });
      } catch (error) {
        alert("Une erreur est survenue");
        this.props.navigate('/home');
      }
    }

    try {
        let userData, firstname, lastname, mail, address, town, zipCode, salary, endContract, departmentId, firstDayWeekend;
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
        
        if (decoded.role == 'client') {
          userData = await getCustomer(decoded.id);
          firstname = userData.data.customerId.firstname;
          lastname = userData.data.customerId.lastname;
          mail = userData.data.customerId.mail;
          address = userData.data.address;
          town = userData.data.town;
          zipCode = userData.data.zipCode;
          departmentId = userData.data.departmentId;
        } else {
          const weekend = await getWeekend(this.state.id);
          userData = await getEmployee(decoded.id);
          firstname = userData.data.employeeId.firstname;
          lastname = userData.data.employeeId.lastname;
          mail = userData.data.employeeId.mail;
          salary = userData.data.salary;
          endContract = userData.data.endConract;
          departmentId = userData.data.departmentId;
          firstDayWeekend = weekend[0];
        }
        
        if (userData.success) {
            this.setState({ 
                formData: { 
                    firstname,
                    lastname,
                    mail,
                    salary,
                    endContract,
                    address,
                    town,
                    zipCode,
                    departmentId,
                    firstDayWeekend,
                }
            });
        }
    } catch(error) {
        alert("Une erreur est survenue");
        this.props.navigate('/');
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
    const { name, checked } = event.target;
    this.setState({
      [name]: checked,
    });
  }

  async submit(event) {
    event.preventDefault();
    const { role, id } = this.state;
    const { mail, password, firstname, salary, lastname, firstDayWeekend, departmentId, zipCode, address, town } = this.state.formData;
    try {
      let response;
      if (role=="client") { 
        response = await putCustomer(id, mail, this.state.isPasswordEnabled ? password : null, firstname, lastname, zipCode, address, town, departmentId);
      } else {
        response = await putEmployee(id , mail, this.state.isPasswordEnabled ? password : null, firstname, lastname, salary, departmentId, firstDayWeekend, null);
      }

      if (response.status == 204) {
        alert("Le profil a bien été modifié !");
        this.props.navigate('/profil');
      } else {
        console.log(response);
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }
  
  render() {
    const { role } = this.state;
    let infoContent;

    if (role=="client") {
      infoContent = ( <div>
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
      </div> );
    }

    if (role=="admin") {
      infoContent = ( <div>
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
      </div> );
    }

    return (
      <div>
        <form onSubmit={this.submit}>
        <h1>Modification du profil</h1>
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
              name="isPasswordEnabled"
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
          {infoContent}
          <button type="submit">Modifier</button>
          <Link to={'/profil'}><button>Retour</button></Link>
        </form>
      </div>
    );
  }
}

export default UpdateProfile;