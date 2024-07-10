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
        const max = Math.ceil(this.state.paidOrders.length/this.state.numberDisplayed);
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

  getDeliverymanName(deliverymanId) {
    const { deliverymen } = this.state;
    const deliveryman = deliverymen.find(dm => dm.userId === deliverymanId);
    console.log(deliveryman);
    return deliveryman.employeeId.firstname + " " + deliveryman.employeeId.lastname;
  }

  async deleteOrder(event, id) {
    event.preventDefault();
    try {
      const response = await delOrder(id);
      
      if (response.status == 204) {
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
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');;
    const day = String(dateObj.getDate()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  async validDelivery(event, id) {
    event.preventDefault();
    try {
        const response = await validateDelivery(id);
        
        if (response.status == 204) {
          alert("Livraison validé avec succès !");
          window.location.reload();
        } else {
          alert(response.message);
        }
      } catch (error) {
        alert("Une erreur est survenue");
      }
  }

  render() {
    let { paidOrders } = this.state;
    let content;

    if (paidOrders.length == 0) {
      content = (
        <div>
          <p>Aucune commande</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed, foods } = this.state;
      const displayedOrders = paidOrders.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (paidOrders.length > numberDisplayed) {
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
              <th>Prix</th>
              <th>Livreur</th>
              <th>Date d'arrivé</th>
              <th>Livré</th>
              <th>Valider</th>
            </tr>

            {displayedOrders.map(order => {
              let validBtn = (<div>
                <button onClick={(event) => this.validDelivery(event, order.id)}>Valider</button>
              </div>);
              if (order.validation) {
                validBtn = (<div>
                  <button>Validé</button>
                </div>);
              }
              return (
                <tr key={order.id}>
                  <td>{foods[order.foodId - 1].name}</td>
                  <td>{order.qty}</td>
                  <td>{foods[order.foodId - 1].price * order.qty} €</td>
                  <td>{this.getDeliverymanName(order.deliverymanId)}</td>
                  <td>{this.formatDate(order.dueDate)}</td>
                  <td>{order.deliveryDate ? this.formatDate(order.deliveryDate) : 'En cours...'}</td>
                  <td>{validBtn}</td>
                </tr>
              )
            })}
          </table>
        </div>
      );
    }

    return (
      <div>
      <h1>Mes commandes :</h1>
      <br/>
      {content}
    </div>
    );
  }
}

export default OrdersList;
