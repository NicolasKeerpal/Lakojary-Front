import React from 'react';
import { getVacations, delVacations } from '../services/VacationsService';
import { getEmployee } from '../services/EmployeeService';
import { Link } from 'react-router-dom';

class VacationsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vacations: [],
      id: props.id,
      firstname: '',
      lastname: '',
      startIndex: 0,
      pageIndex: 1,
      pageMax: 0,
      numberDisplayed: 5
    };

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.formatDate = this.formatDate.bind(this);
  }

  async componentDidMount() {
    try {
      const vacationsData = await getVacations(this.state.id);
      const employeeData = await getEmployee(this.state.id);
      if (vacationsData.success&&employeeData.success) {
        this.setState({ 
            vacations: vacationsData.data,
            firstname: employeeData.data.employeeId.firstname,
            lastname: employeeData.data.employeeId.lastname
        });
        const max = Math.ceil(this.state.vacations.length/this.state.numberDisplayed);
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

  async deleteVacations(event, vacationsId) {
    event.preventDefault();
    try {
      const { id } = this.state;
      const response = await delVacations(id, vacationsId);
      
      if (response.status == 204) {
        alert("Ces vacances a bien été supprimé !");
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
    let { vacations, id, firstname, lastname } = this.state;
    let content;

    if (vacations.length == 0) {
      content = (
        <div>
          <p>Pas de vacances posées pour cet employé</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed } = this.state;
      const displayedVacations = vacations.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (vacations.length > numberDisplayed) {
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
              <th>Début</th>
              <th>Fin</th>
              <th>Modifier</th>
              <th>Supprimer</th>
            </tr>

            {displayedVacations.map(vacation => (
                <tr key={vacation.id}>
                  <td>{this.formatDate(vacation.beginDate)}</td>
                  <td>{this.formatDate(vacation.endDate)}</td>
                  <td><Link to={`/employes/${id}/vacances/${vacation.id}/edit`}><button>Modifier</button></Link></td>
                  <td><button onClick={(event) => this.deleteVacations(event, vacation.id)}>Supprimer</button></td>
                </tr>
              ))}
          </table>
        </div>
      );
    }

    return (
      <div>
      <h1>Liste des vacances pour : {firstname} {lastname}</h1>
      <Link to='/employes'><button>Retour</button></Link>  
      <Link to={`/employes/${id}/vacances/ajout`}><button>Ajouter</button></Link>
      <br/><br/>
      {content}
    </div>
    );
  }
}

export default VacationsList;
