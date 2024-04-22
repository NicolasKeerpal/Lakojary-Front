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
        const max = Math.ceil(this.state.customers.length/this.state.numberDisplayed);
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
      const response = await putBanCustomer(id, ban);
      
      if (response.status == 204) {
        if (ban) {
          alert("Ce client a bien été banni !");
        }
        else {
          alert("Ce client a bien été débanni !");
        }
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
      
      if (response.status == 204) {
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

    if (searchQuery.trim() !== '') {
      customers = customers.filter(customer =>
        customer.customerId.lastname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    if (customers.length == 0) {
      return (
        <div>
          <h1>Liste des clients</h1>
          Recherche <input type="search" placeholder="Rechercher un nom" value={this.state.searchValue} onChange={this.handleSearchChange}/>
          <br/><br/>
          <p>Aucun client trouvé</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed } = this.state;
      const displayedCustomers = customers.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (customers.length > numberDisplayed) {
        pageBtn = (
          <div>
            <button onClick={this.onClickPrev}>{"<"}</button> 
            Page : {this.state.pageIndex}/{this.state.pageMax} 
            <button onClick={this.onClickNext}>{">"}</button>
          </div>
        );
      }

      return (
        <div>
          <h1>Liste des clients</h1>
          Recherche <input type="search" placeholder="Rechercher un nom" value={this.state.searchValue} onChange={this.handleSearchChange}/>
          <br/><br/>
          {pageBtn}
          <table>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Mail</th>
              <th>CP</th>
              <th>Adresse</th>
              <th>Ville</th>
              <th>Modifier</th>
              <th>Supprimer</th>
              <th>Ban</th>
            </tr>

            {displayedCustomers.map(customer => (
                <tr key={customer.userId}>
                  <td>{customer.customerId.lastname}</td>
                  <td>{customer.customerId.firstname}</td>
                  <td>{customer.customerId.mail}</td>
                  <td>{String(customer.zipCode).padStart(5, '0')}</td>
                  <td>{customer.address}</td>
                  <td>{customer.town}</td>
                  <td><Link to={`/clients/${customer.userId}/edit`}><button>Modifier</button></Link></td>
                  <td><button onClick={(event) => this.deleteCustomer(event, customer.userId)}>Supprimer</button></td>
                  <td><button onClick={(event) => this.updBan(event, customer.userId, !customer.customerId.ban)}>{customer.customerId.ban ? 'Déban' : 'Ban'}</button></td>
                </tr>
              ))}
          </table>
        </div>
      );
    }
  }
}

export default CustomersList;
