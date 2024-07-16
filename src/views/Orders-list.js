import React from 'react';
import { getPaidOrders, delOrder, validateDelivery } from '../services/OrderService';
import { getFoods } from '../services/FoodService';
import { getDeliverymen } from '../services/EmployeeService';

class OrdersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paidOrders: [],
      foods: [],
      deliverymen: [],
      startIndex: 0,
      pageIndex: 1,
      pageMax: 0,
      numberDisplayed: 5
    };

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.getDeliverymanName = this.getDeliverymanName.bind(this);
  }

  async componentDidMount() {
    try {
      const paidOrdersData = await getPaidOrders();
      const foodsData = await getFoods();
      const deliverymenData = await getDeliverymen();

      if (paidOrdersData.success && foodsData.success && deliverymenData) {
        this.setState({ 
          paidOrders: paidOrdersData.data,
          foods: foodsData.data,
          deliverymen: deliverymenData.data
        });
        const max = Math.ceil(this.state.paidOrders.length / this.state.numberDisplayed);
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

  getDeliverymanName(deliverymanId) {
    const { deliverymen } = this.state;
    const deliveryman = deliverymen.find(dm => dm.userId === deliverymanId);
    return deliveryman ? `${deliveryman.employeeId.firstname} ${deliveryman.employeeId.lastname}` : 'Unknown';
  }

  async deleteOrder(event, id) {
    event.preventDefault();
    try {
      const response = await delOrder(id);
      if (response.status === 204) {
        alert("Cet article a bien été supprimé !");
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

  async validDelivery(event, id) {
    event.preventDefault();
    try {
      const response = await validateDelivery(id);
      if (response.status === 204) {
        alert("Livraison validée avec succès !");
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    const { paidOrders, startIndex, numberDisplayed, foods, pageIndex, pageMax } = this.state;
    const displayedOrders = paidOrders.slice(startIndex, startIndex + numberDisplayed);
    const pageBtn = paidOrders.length > numberDisplayed && (
      <div className="flex justify-between items-center mb-4">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={this.onClickPrev}>{"<"}</button>
        <span className="text-white">Page: {pageIndex}/{pageMax}</span>
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={this.onClickNext}>{">"}</button>
      </div>
    );

    return (
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold text-white mb-4">Mes commandes :</h1>
        {paidOrders.length === 0 ? (
          <div>
            <p className="text-white">Aucune commande</p>
          </div>
        ) : (
          <div>
            {pageBtn}
            <table className="w-full table-auto bg-gray-800 text-white">
              <thead>
                <tr className="bg-gray-900">
                  <th className="p-2">Nom</th>
                  <th className="p-2">Qte</th>
                  <th className="p-2">Prix</th>
                  <th className="p-2">Livreur</th>
                  <th className="p-2">Date d'arrivée</th>
                  <th className="p-2">Livré</th>
                  <th className="p-2">Valider</th>
                </tr>
              </thead>
              <tbody>
                {displayedOrders.map(order => {
                  const validBtn = order.validation ? (
                    <button className="px-4 py-2 bg-green-600 text-white rounded cursor-not-allowed" disabled>Validé</button>
                  ) : (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={(event) => this.validDelivery(event, order.id)}>Valider</button>
                  );
                  return (
                    <tr key={order.id} className="border-t border-gray-700">
                      <td className="p-2 text-center">{foods[order.foodId - 1].name}</td>
                      <td className="p-2 text-center">{order.qty}</td>
                      <td className="p-2 text-center">{(foods[order.foodId - 1].price * order.qty).toFixed(2)} €</td>
                      <td className="p-2 text-center">{this.getDeliverymanName(order.deliverymanId)}</td>
                      <td className="p-2 text-center">{this.formatDate(order.dueDate)}</td>
                      <td className="p-2 text-center">{order.deliveryDate ? this.formatDate(order.deliveryDate) : 'En cours...'}</td>
                      <td className="p-2 text-center">{validBtn}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default OrdersList;
