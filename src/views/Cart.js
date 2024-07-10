import React from 'react';
import { getCart, delOrder } from '../services/OrderService';
import { getFoods } from '../services/FoodService';
import BuyDialog from '../components/BuyDialog';

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      foods: [],
      startIndex: 0,
      pageIndex: 1,
      pageMax: 0,
      numberDisplayed: 5,
      showBuyDialog: false,
      purchasedFoodName: '',
      purchasedFoodPrice: '',
      payementId: 0
    };

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.closeBuyDialog = this.closeBuyDialog.bind(this);
  }

  async componentDidMount() {
    try {
      const cartData = await getCart();
      const foodsData = await getFoods();

      if (cartData.success && foodsData.success) {
        this.setState({ 
          foods: foodsData.data,
          cart: cartData.data
        });
        const max = Math.ceil(this.state.cart.length/this.state.numberDisplayed);
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

  async openBuyDialog(event, orderId, foodName, foodPrice) {
    event.preventDefault();
    this.setState({ 
      payementId: orderId,
      purchasedFoodName: foodName,
      purchasedFoodPrice: foodPrice,
      showBuyDialog: true
    });
  }

  closeBuyDialog() {
    this.setState({ showBuyDialog: false });
  }

  render() {
    let { cart, foods, purchasedFoodName, purchasedFoodPrice, payementId } = this.state;
    let content;

    if (cart.length == 0) {
      content = (
        <div>
          <p>Aucun produit ajouté</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed } = this.state;
      const displayedOrders = cart.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (cart.length > numberDisplayed) {
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
              <th>Acheter</th>
              <th>Supprimer</th>
            </tr>

            {displayedOrders.map(order => (
                <tr key={order.id}>
                  <td>{foods[order.foodId - 1].name}</td>
                  <td>{order.qty}</td>
                  <td>{foods[order.foodId - 1].price * order.qty} €</td>
                  <td><button onClick={(event) => this.openBuyDialog(event, order.id, foods[order.foodId - 1].name, foods[order.foodId - 1].price)}>Acheter</button></td>
                  <td><button onClick={(event) => this.deleteOrder(event, order.id)}>Supprimer</button></td>
                </tr>
              ))}
          </table>
        </div>
      );
    }

    return (
      <div>
      {this.state.showBuyDialog && <BuyDialog orderId={payementId} foodName={purchasedFoodName} foodPrice={purchasedFoodPrice} onClose={this.closeBuyDialog} navigate={this.props.navigate}/>}

      <h1>Mon panier</h1>
      <br/>
      {content}
    </div>
    );
  }
}

export default Cart;
