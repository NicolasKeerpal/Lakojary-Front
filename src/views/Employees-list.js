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
        const max = Math.ceil(this.state.employees.length/this.state.numberDisplayed);
        this.setState({ pageMax : max });
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
    }
    else {
      this.setState({ 
        startIndex: index,
        pageIndex : page
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
        pageIndex : max
      });
    }
    else {
      const page = this.state.pageIndex - 1;
      this.setState({ 
        startIndex: index,
        pageIndex : page
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
      
      if (response.status == 204) {
        if (ban) {
          alert("Cet employé a bien été banni !");
        }
        else {
          alert("Cet employé a bien été débanni !");
        }
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
      
      if (response.status == 204) {
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
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');;
    const day = String(dateObj.getDate()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  render() {
    let { employees, searchQuery } = this.state;
    let content;

    if (searchQuery.trim() !== '') {
      employees = employees.filter(employee =>
        employee.employeeId.lastname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    if (employees.length == 0) {
      content = (
        <div>
          <p>Aucun employé trouvé</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed } = this.state;
      const displayedEmployees = employees.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (employees.length > numberDisplayed) {
        pageBtn = (
          <div>
            <button onClick={this.onClickPrev}>{"<"}</button> 
            Page : {this.state.pageIndex}/{this.state.pageMax} 
            <button onClick={this.onClickNext}>{">"}</button>
          </div>
        );
      }

      content = (
        <div>
          {pageBtn}
          <table>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Mail</th>
              <th>Rôle</th>
              <th>Salaire</th>
              <th>Fin de contrat</th>
              <th>Vacances</th>
              <th>Modifier</th>
              <th>Supprimer</th>
              <th>Ban</th>
            </tr>

            {displayedEmployees.map(employee => (
                <tr key={employee.userId}>
                  <td>{employee.employeeId.lastname}</td>
                  <td>{employee.employeeId.firstname}</td>
                  <td>{employee.employeeId.mail}</td>
                  <td>{employee.employeeRole.name}</td>
                  <td>{employee.salary} €</td>
                  <td>{employee.endContract ? this.formatDate(employee.endContract) : 'indeterminé'}</td>
                  <td><Link to={`/employes/${employee.userId}/vacances`}><button>Voir</button></Link></td>
                  <td><Link to={`/employes/${employee.userId}/edit`}><button>Modifier</button></Link></td>
                  <td><button onClick={(event) => this.deleteEmployee(event, employee.userId)}>Supprimer</button></td>
                  <td><button onClick={(event) => this.updBan(event, employee.userId, !employee.employeeId.ban)}>{employee.employeeId.ban ? 'Déban' : 'Ban'}</button></td>
                </tr>
              ))}
          </table>
        </div>
      );
    }

    return (
      <div>
      <h1>Liste des employés</h1>
      Recherche <input type="search" placeholder="Rechercher un nom" value={this.state.searchValue} onChange={this.handleSearchChange}/>
      <Link to={`/employes/ajout`}><button>Ajouter</button></Link>
      <br/><br/>
      {content}
    </div>
    );
  }
}

export default EmployeesList;
