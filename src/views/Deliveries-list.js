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

      if (deliveriesData.success && foodsData.success && customersData.success) {
        this.setState({ 
          deliveries: deliveriesData.data,
          foods: foodsData.data,
          customers: customersData.data
        });
        const max = Math.ceil(this.state.deliveries.length / this.state.numberDisplayed);
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

  getCustomerName(customerId) {
    const { customers } = this.state;
    const customer = customers.find(customer => customer.userId === customerId);
    return customer ? `${customer.customerId.firstname} ${customer.customerId.lastname}` : 'Unknown';
  }

  formatDate(dateStr) {
    const dateObj = new Date(dateStr);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  async finishOrder(event, id) {
    event.preventDefault();
    try {
      const response = await finishOrder(id);
      if (response.status === 204) {
        alert("Livraison finie avec succès !");
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    const { deliveries, startIndex, numberDisplayed, foods, pageIndex, pageMax } = this.state;
    const displayedOrders = deliveries.slice(startIndex, startIndex + numberDisplayed);
    const pageBtn = deliveries.length > numberDisplayed && (
      <div className="flex items-center justify-center mt-4">
        <button className="px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-opacity-75" onClick={this.onClickPrev}>{"<"}</button>
        <span className="text-white text-[1.5rem] mx-2">Page : {pageIndex}/{pageMax}</span>
        <button className="px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-opacity-75" onClick={this.onClickNext}>{">"}</button>
      </div>
    );

    return (
      <div className="flex items-center justify-center mt-8 mb-10">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-white pl-2">Livraisons :</h1>
          {deliveries.length === 0 ? (
            <div>
              <p className="text-white">Aucune commande</p>
            </div>
          ) : (
            <div>
              {pageBtn}
              <table className="w-full mt-4 border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-white text-[1.5rem]">Nom</th>
                    <th className="p-2 text-white text-[1.5rem]">Qte</th>
                    <th className="p-2 text-white text-[1.5rem]">Client</th>
                    <th className="p-2 text-white text-[1.5rem]">Date à livrer</th>
                    <th className="p-2 text-white text-[1.5rem]">Validation client</th>
                    <th className="p-2 text-white text-[1.5rem]">Terminer</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.map((order, index) => {
                    const finishBtn = order.deliveryDate ? (
                      <button className="px-4 py-2 bg-custom-primary_color text-white rounded cursor-not-allowed" disabled>Terminé</button>
                    ) : (
                      <button className="px-4 py-2 bg-hover_effect text-white rounded hover:bg-custom-primary_color" onClick={(event) => this.finishOrder(event, order.id)}>Terminer</button>
                    );
                    return (
                      <tr key={order.id} className={index % 2 === 0 ? "bg-custom-secondary_color" : "bg-custom-primary_color"}>
                        <td className="p-2 text-white text-center">{foods[order.foodId - 1]?.name}</td>
                        <td className="p-2 text-white text-center">{order.qty}</td>
                        <td className="p-2 text-white text-center">{this.getCustomerName(order.customerId)}</td>
                        <td className="p-2 text-white text-center">{this.formatDate(order.dueDate)}</td>
                        <td className="p-2 text-white text-center">
                          <button className={`px-4 py-2 ${order.validation ? 'bg-custom-primary_color' : 'bg-custom-hover_effect'} text-white rounded`}>
                            {order.validation ? 'Validé' : 'Non validé'}
                          </button>
                        </td>
                        <td className="p-2 text-white text-center">{finishBtn}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DeliveriesList;
