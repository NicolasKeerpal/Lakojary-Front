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
      if (vacationsData.success && employeeData.success) {
        this.setState({
          vacations: vacationsData.data,
          firstname: employeeData.data.employeeId.firstname,
          lastname: employeeData.data.employeeId.lastname
        });
        const max = Math.ceil(this.state.vacations.length / this.state.numberDisplayed);
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

  async deleteVacations(event, vacationsId) {
    event.preventDefault();
    try {
      const { id } = this.state;
      const response = await delVacations(id, vacationsId);

      if (response.status == 204) {
        alert("Ces vacances ont bien été supprimées !");
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

    if (vacations.length === 0) {
      content = (
        <div className="text-white">
          <p>Pas de vacances posées pour cet employé</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed } = this.state;
      const displayedVacations = vacations.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (vacations.length > numberDisplayed) {
        pageBtn = (
          <div className="flex items-center justify-center mt-4">
            <button onClick={this.onClickPrev} className="px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-opacity-75">{"<"}</button>
            <span className="text-white text-lg mx-2">Page : {this.state.pageIndex}/{this.state.pageMax}</span>
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
                <th className="p-2 text-white">Début</th>
                <th className="p-2 text-white">Fin</th>
                <th className="p-2 text-white">Modifier</th>
                <th className="p-2 text-white">Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {displayedVacations.map((vacation, index) => (
                <tr key={vacation.id} className={index % 2 === 0 ? "bg-custom-secondary_color" : "bg-custom-primary_color"}>
                  <td className="p-2 text-white text-center">{this.formatDate(vacation.beginDate)}</td>
                  <td className="p-2 text-white text-center">{this.formatDate(vacation.endDate)}</td>
                  <td className="p-2 text-white text-center">
                    <Link to={`/employes/${id}/vacances/${vacation.id}/edit`}>
                      <button className="ml-4 bg-custom-hover_effect text-white hover:text-white hover:bg-custom-primary_color text-lg rounded px-4 py-1">Modifier</button>
                    </Link>
                  </td>
                  <td className="p-2 text-white text-center">
                    <button onClick={(event) => this.deleteVacations(event, vacation.id)} className="ml-4 bg-custom-hover_effect text-white hover:text-white hover:bg-custom-primary_color text-lg rounded px-4 py-1">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center mt-8 mb-2 text-white">
        <h1 className="text-3xl font-bold">Liste des vacances pour : {firstname} {lastname}</h1>
        <div className="mt-4">
          <Link to='/employes'>
            <button className="ml-2 px-4 py-2 bg-custom-secondary_color rounded hover:bg-custom-hover_effect">Retour</button>
          </Link>
          <Link to={`/employes/${id}/vacances/ajout`}>
            <button className="ml-2 px-4 py-2 bg-custom-secondary_color rounded hover:bg-custom-hover_effect">Ajouter</button>
          </Link>
        </div>
        {content}
      </div>
    );
  }
}

export default VacationsList;
