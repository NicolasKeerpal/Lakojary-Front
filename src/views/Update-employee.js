import React from 'react';
import { Link } from 'react-router-dom';
import { getDepartments } from '../services/DepartmentService';
import { getWeekend } from '../services/WeekendService';
import { putEmployee, getEmployee } from '../services/EmployeeService';

class UpdateEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      isEndContractEnabled: false,
      isPasswordEnabled: false,
      id: props.id,
      formData: {
        mail: '',
        password: '',
        firstname: '',
        lastname: '',
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

  formatDate(dateStr) {
    const dateObj = new Date(dateStr);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  async componentDidMount() {
    try {
      const departmentsData = await getDepartments();
      const employeeData = await getEmployee(this.state.id);
      if (departmentsData.success && employeeData.success) {
        let date = null;
        const weekend = await getWeekend(this.state.id);
        if (employeeData.data.endContract) {
          this.setState({
            isEndContractEnabled: true
          });
          date = this.formatDate(employeeData.data.endContract);
        }
        this.setState({
          departments: departmentsData.data,
          formData: {
            mail: employeeData.data.employeeId.mail,
            password: '',
            firstname: employeeData.data.employeeId.firstname,
            lastname: employeeData.data.employeeId.lastname,
            departmentId: employeeData.data.departmentId,
            salary: employeeData.data.salary,
            firstDayWeekend: weekend[0],
            endContract: date
          }
        });
      } else {
        alert('Une erreur est survenue');
      }
    } catch (error) {
      alert('Une erreur est survenue');
    }
  }

  handleCheckboxChange(event) {
    const { name, checked } = event.target;
    this.setState({
      [name]: checked,
    });
  }

  async submit(event) {
    event.preventDefault();
    const { mail, password, firstname, salary, lastname, firstDayWeekend, departmentId, endContract } = this.state.formData;
    try {
      const response = await putEmployee(this.state.id, mail, this.state.isPasswordEnabled ? password : null, firstname, lastname, salary, departmentId, firstDayWeekend, this.state.isEndContractEnabled ? endContract : null);

      if (response.status == 204) {
        alert("Cet employé a bien été modifié !");
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
      <div className="container mx-auto p-6 w-[50rem]">
        <form onSubmit={this.submit} className="bg-custom-secondary_color rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-white">Modification d'un employé</h1>
          <label className="block mb-2 text-white">
            Nom:
            <input
              type="text"
              name="lastname"
              value={this.state.formData.lastname}
              onChange={this.handleChange}
              required
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2 text-white">
            Prénom:
            <input
              type="text"
              name="firstname"
              value={this.state.formData.firstname}
              onChange={this.handleChange}
              required
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2 text-white">
            Mail:
            <input
              type="email"
              name="mail"
              value={this.state.formData.mail}
              onChange={this.handleChange}
              required
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2 text-white">
            <input
              type="checkbox"
              name="isPasswordEnabled"
              checked={this.state.isPasswordEnabled}
              onChange={this.handleCheckboxChange}
              className="mr-2"
            />
            Nouveau mot de passe:
            <input
              type="password"
              name="password"
              value={this.state.formData.password}
              onChange={this.handleChange}
              disabled={!this.state.isPasswordEnabled}
              required
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2 text-white">
            Salaire:
            <input
              type="number"
              name="salary"
              value={this.state.formData.salary}
              onChange={this.handleChange}
              min="0"
              required
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2 text-white">
            <input
              type="checkbox"
              name="isEndContractEnabled"
              checked={this.state.isEndContractEnabled}
              onChange={this.handleCheckboxChange}
              className="mr-2"
            />
            Fin de contrat:
            <input
              type="date"
              name="endContract"
              value={this.state.formData.endContract}
              onChange={this.handleChange}
              disabled={!this.state.isEndContractEnabled}
              required
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2 text-white">
            Département:
            <select
              name="departmentId"
              value={this.state.formData.departmentId}
              onChange={this.handleChange}
              className="text-black block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {this.state.departments.map(department => (
                <option key={department.id} value={department.id}>
                  {String(department.id).padStart(2, '0')} - {department.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-2 text-white">
            Weekend:<br />
            (Selectionnez le 1er jour et le 2ème sera automatiquement le jour suivant)<br />
            1er jour:
            <select
              name="firstDayWeekend"
              value={this.state.formData.firstDayWeekend}
              onChange={this.handleChange}
              className="text-black block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Lundi">Lundi</option>
              <option value="Mardi">Mardi</option>
              <option value="Mercredi">Mercredi</option>
              <option value="Jeudi">Jeudi</option>
              <option value="Vendredi">Vendredi</option>
              <option value="Samedi">Samedi</option>
              <option value="Dimanche">Dimanche</option>
            </select>
          </label>
          <button type="submit" className="w-full mt-4 bg-custom-primary_color text-white hover:text-white hover:bg-custom-hover_effect text-xl rounded-[0.5rem] px-[1rem] py-[0.5rem]">Modifier</button>
          <Link to="/employes">
            <button type="button" className="mt-4 w-full bg-custom-primary_color text-white hover:text-white hover:bg-custom-hover_effect text-xl rounded-[0.5rem] px-[1rem] py-[0.5rem]">Annuler</button>
          </Link>
        </form>
      </div>
    );
  }
}

export default UpdateEmployee;
