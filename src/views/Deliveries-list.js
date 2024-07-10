import React from 'react';
import { getDeliveries, finishOrder } from '../services/OrderService';
import { getFoods } from '../services/FoodService';
import { getCustomers } from '../services/CustomerService';

class DeliveriesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveries: [],
      foods: [],
      customers: [],
      startIndex: 0,
      pageIndex: 1,
      pageMax: 0,
      numberDisplayed: 5
    };

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.getCustomerName = this.getCustomerName.bind(this);
  }

  async componentDidMount() {
    try {
      const deliveriesData = await getDeliveries();
      const foodsData = await getFoods();
      const customersData = await getCustomers();

      if (deliveriesData.success && foodsData.success && customersData) {
        this.setState({ 
          deliveries: deliveriesData.data,
          foods: foodsData.data,
          customers: customersData.data
        });
        const max = Math.ceil(this.state.deliveries.length/this.state.numberDisplayed);
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

  getCustomerName(customerId) {
    const { customers } = this.state;
    const customer = customers.find(customer => customer.userId === customerId);
    console.log(customer);
    return customer.customerId.firstname + " " + customer.customerId.lastname;
  }

  formatDate(dateStr) {
    const dateObj = new Date(dateStr);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');;
    const day = String(dateObj.getDate()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  async finishOrder(event, id) {
    event.preventDefault();
    try {
      const response = await finishOrder(id);
      
      if (response.status == 204) {
        alert("Livraison fini avec succès !");
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    let { deliveries } = this.state;
    let content;

    if (deliveries.length == 0) {
      content = (
        <div>
          <p>Aucune commande</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed, foods } = this.state;
      const displayedOrders = deliveries.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (deliveries.length > numberDisplayed) {
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
              <th>Qte</th>
              <th>Client</th>
              <th>Date à livrer</th>
              <th>Validation client</th>
              <th>Terminer</th>
            </tr>

            {displayedOrders.map(order => {
              let finishBtn = (<div>
                <button onClick={(event) => this.finishOrder(event, order.id)}>Terminer</button>
              </div>);
              if (order.deliveryDate) {
                finishBtn = (<div>
                  <button>Terminé</button>
                </div>);
              }
              return (
                <tr key={order.id}>
                  <td>{foods[order.foodId - 1].name}</td>
                  <td>{order.qty}</td>
                  <td>{this.getCustomerName(order.customerId)}</td>
                  <td>{this.formatDate(order.dueDate)}</td>
                  <td><button>{order.validation ? 'Validé' : 'Non validé'}</button></td>
                  <td>{finishBtn}</td>
                </tr>
              )
            })}
          </table>
        </div>
      );
    }

    return (
        <div>
            <h1>Livraisons</h1>
            <br/>
            {content}
        </div>
    );
  }
}

export default DeliveriesList;
