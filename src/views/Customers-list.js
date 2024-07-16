import React from 'react';
import { getCustomers, putBanCustomer, delCustomer } from '../services/CustomerService';
import { Link } from 'react-router-dom';

class CustomersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      startIndex: 0,
      pageIndex: 1,
      pageMax: 0,
      numberDisplayed: 5,
      searchQuery: ''
    };

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  async componentDidMount() {
    try {
      const customersData = await getCustomers();
      if (customersData.success) {
        this.setState({ customers: customersData.data });
        const max = Math.ceil(customersData.data.length / this.state.numberDisplayed);
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
      const response = await putBanCustomer(id, ban);
      if (response.status === 204) {
        alert(ban ? "Ce client a bien été banni !" : "Ce client a bien été débanni !");
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  async deleteCustomer(event, id) {
    event.preventDefault();
    try {
      const response = await delCustomer(id);
      if (response.status === 204) {
        alert("Ce client a bien été supprimé !");
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    let { customers, searchQuery } = this.state;
    let content;

    if (searchQuery.trim() !== '') {
      customers = customers.filter(customer =>
        customer.customerId.lastname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    if (customers.length === 0) {
      content = (
        <div className="text-white">
          <p>Aucun client trouvé</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed } = this.state;
      const displayedCustomers = customers.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (customers.length > numberDisplayed) {
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
                <th className="p-2 text-white text-[1.5rem]">CP</th>
                <th className="p-2 text-white text-[1.5rem]">Adresse</th>
                <th className="p-2 text-white text-[1.5rem]">Ville</th>
                <th className="p-2 text-white text-[1.5rem]">Modifier</th>
                <th className="p-2 text-white text-[1.5rem]">Supprimer</th>
                <th className="p-2 text-white text-[1.5rem]">Ban</th>
              </tr>
            </thead>
            <tbody>
              {displayedCustomers.map((customer, index) => (
                <tr key={customer.userId} className={index % 2 === 0 ? "bg-custom-secondary_color" : "bg-custom-primary_color"}>
                  <td className="p-2 text-white text-center">{customer.customerId.lastname}</td>
                  <td className="p-2 text-white text-center">{customer.customerId.firstname}</td>
                  <td className="p-2 text-white text-center">{customer.customerId.mail}</td>
                  <td className="p-2 text-white text-center">{String(customer.zipCode).padStart(5, '0')}</td>
                  <td className="p-2 text-white text-center">{customer.address}</td>
                  <td className="p-2 text-white text-center">{customer.town}</td>
                  <td className="p-2 text-white text-center">
                    <Link to={`/clients/${customer.userId}/edit`}>
                      <button className="ml-4 bg-custom-hover_effect text-white hover:text-white hover:bg-custom-primary_color text-xl rounded-[0.5rem] px-[1rem] py-[0.2rem]">Modifier</button>
                    </Link>
                  </td>
                  <td className="p-2 text-white text-center">
                    <button onClick={(event) => this.deleteCustomer(event, customer.userId)} className="ml-4 bg-custom-hover_effect text-white hover:text-white hover:bg-custom-primary_color text-xl rounded-[0.5rem] px-[1rem] py-[0.2rem]">Supprimer</button>
                  </td>
                  <td className="p-2 text-white text-center">
                    <button onClick={(event) => this.updBan(event, customer.userId, !customer.customerId.ban)} className="ml-4 bg-custom-hover_effect text-white hover:text-white hover:bg-custom-primary_color text-xl rounded-[0.5rem] px-[1rem] py-[0.2rem]">
                      {customer.customerId.ban ? 'Déban' : 'Ban'}
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
          <h1 className="text-3xl font-bold text-white pl-2">Liste des clients</h1>
          <div className="mt-4 pl-2 text-white">
            Recherche <input
              className="w-80 h-10 border-2 border-custom-secondary_color rounded bg-transparent text-white placeholder-custom-secondary_color focus:outline-none px-2"
              type="search"
              placeholder="Rechercher un nom"
              value={this.state.searchQuery}
              onChange={this.handleSearchChange}
            />
            <Link to={`/clients/ajout`}>
              <button className="ml-2 px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-opacity-75">Ajouter</button>
            </Link>
          </div>
          {content}
        </div>
      </div>
    );
  }
}

export default CustomersList;
