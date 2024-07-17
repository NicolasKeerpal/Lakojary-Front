import React from 'react';
import { getEmployees, putBanEmployee, delEmployee } from '../services/EmployeeService';
import { Link } from 'react-router-dom';

class EmployeesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      startIndex: 0,
      pageIndex: 1,
      pageMax: 0,
      numberDisplayed: 5,
      searchQuery: ''
    };

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.formatDate = this.formatDate.bind(this);
  }

  async componentDidMount() {
    try {
      const employeesData = await getEmployees();
      if (employeesData.success) {
        this.setState({ employees: employeesData.data });
        const max = Math.ceil(employeesData.data.length / this.state.numberDisplayed);
        this.setState({ pageMax: max });
      }
    } catch (error) {
      alert('Une erreur est survenue');
    }
  }

  onClickNext() {
    const index = this.state.startIndex + this.state.numberDisplayed;
    const page = this.state.pageIndex + 1;
    if (page > this.state.pageMax) {
      this.setState({
        startIndex: 0,
        pageIndex: 1
      });
    } else {
      this.setState({
        startIndex: index,
        pageIndex: page
      });
    }
  }

  onClickPrev() {
    let index = this.state.startIndex - this.state.numberDisplayed;
    if (index < 0) {
      index = (this.state.pageMax - 1) * this.state.numberDisplayed;
      let max = this.state.pageMax;
      this.setState({
        startIndex: index,
        pageIndex: max
      });
    } else {
      const page = this.state.pageIndex - 1;
      this.setState({
        startIndex: index,
        pageIndex: page
      });
    }
  }

  handleSearchChange(event) {
    const value = event.target.value;
    this.setState({
      searchQuery: value,
      startIndex: 0,
      pageIndex: 1
    });
  }

  async updBan(event, id, ban) {
    event.preventDefault();
    try {
      const response = await putBanEmployee(id, ban);
      if (response.status === 204) {
        alert(ban ? "Cet employé a bien été banni !" : "Cet employé a bien été débanni !");
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  async deleteEmployee(event, id) {
    event.preventDefault();
    try {
      const response = await delEmployee(id);
      if (response.status === 204) {
        alert("Cet employé a bien été supprimé !");
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  formatDate(dateStr) {
    const dateObj = new Date(dateStr);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  render() {
    let { employees, searchQuery } = this.state;
    let content;

    if (searchQuery.trim() !== '') {
      employees = employees.filter(employee =>
        employee.employeeId.lastname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    if (employees.length === 0) {
      content = (
        <div className="text-white">
          <p>Aucun employé trouvé</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed } = this.state;
      const displayedEmployees = employees.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (employees.length > numberDisplayed) {
        pageBtn = (
          <div className="flex items-center justify-center mt-4">
            <button onClick={this.onClickPrev} className="px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-opacity-75">{"<"}</button>
            <span className="text-white text-[1.5rem] mx-2">Page : {this.state.pageIndex}/{this.state.pageMax}</span>
            <button onClick={this.onClickNext} className="px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-opacity-75">{">"}</button>
          </div>
        );
      }

      content = (
        <div className="mt-4">
          {pageBtn}
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-white text-[1.5rem]">Nom</th>
                <th className="p-2 text-white text-[1.5rem]">Prénom</th>
                <th className="p-2 text-white text-[1.5rem]">Mail</th>
                <th className="p-2 text-white text-[1.5rem]">Rôle</th>
                <th className="p-2 text-white text-[1.5rem]">Salaire</th>
                <th className="p-2 text-white text-[1.5rem]">Fin de contrat</th>
                <th className="p-2 text-white text-[1.5rem]">Vacances</th>
                <th className="p-2 text-white text-[1.5rem]">Modifier</th>
                <th className="p-2 text-white text-[1.5rem]">Supprimer</th>
                <th className="p-2 text-white text-[1.5rem]">Ban</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.map((employee, index) => (
                <tr key={employee.userId} className={index % 2 === 0 ? "bg-custom-secondary_color" : "bg-custom-primary_color"}>
                  <td className="p-2 text-white text-center">{employee.employeeId.lastname}</td>
                  <td className="p-2 text-white text-center">{employee.employeeId.firstname}</td>
                  <td className="p-2 text-white text-center">{employee.employeeId.mail}</td>
                  <td className="p-2 text-white text-center">{employee.employeeRole.name}</td>
                  <td className="p-2 text-white text-center">{employee.salary} €</td>
                  <td className="p-2 text-white text-center">{employee.endContract ? this.formatDate(employee.endContract) : 'indeterminé'}</td>
                  <td className="p-2 text-white text-center">
                    <Link to={`/employes/${employee.userId}/vacances`}>
                      <button className="ml-4 bg-custom-hover_effect text-white hover:text-white hover:bg-custom-primary_color text-xl rounded-[0.5rem] px-[1rem] py-[0.2rem]">Voir</button>
                    </Link>
                  </td>
                  <td className="p-2 text-white text-center">
                    <Link to={`/employes/${employee.userId}/edit`}>
                      <button className="ml-4 bg-custom-hover_effect text-white hover:text-white hover:bg-custom-primary_color text-xl rounded-[0.5rem] px-[1rem] py-[0.2rem]">Modifier</button>
                    </Link>
                  </td>
                  <td className="p-2 text-white text-center">
                    <button onClick={(event) => this.deleteEmployee(event, employee.userId)} className="ml-4 bg-custom-hover_effect text-white hover:text-white hover:bg-custom-primary_color text-xl rounded-[0.5rem] px-[1rem] py-[0.2rem]">Supprimer</button>
                  </td>
                  <td className="p-2 text-white text-center">
                    <button onClick={(event) => this.updBan(event, employee.userId, !employee.employeeId.ban)} className="ml-4 bg-custom-hover_effect text-white hover:text-white hover:bg-custom-primary_color text-xl rounded-[0.5rem] px-[1rem] py-[0.2rem]">
                      {employee.employeeId.ban ? 'Déban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center mt-8 mb-2">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-white pl-2">Liste des employés</h1>
          <div className="mt-4 pl-2 text-white">
            Recherche <input 
              className="w-80 h-10 border-2 border-custom-secondary_color rounded bg-transparent text-white placeholder-custom-secondary_color focus:outline-none px-2"
              type="search"
              placeholder="Rechercher un nom"
              value={this.state.searchQuery}
              onChange={this.handleSearchChange}
            />
            <Link to={`/employes/ajout`}>
              <button className="ml-2 px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-opacity-75">Ajouter</button>
            </Link>
          </div>
          {content}
        </div>
      </div>
    );
  }
}

export default EmployeesList;
