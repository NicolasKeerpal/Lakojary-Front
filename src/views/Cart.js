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
        const max = Math.ceil(this.state.cart.length / this.state.numberDisplayed);
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

    if (cart.length === 0) {
      content = (
        <div>
          <p className="text-white mt-4">Vous n'avez rien ajouté à votre panier.</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed } = this.state;
      const displayedOrders = cart.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (cart.length > numberDisplayed) {
        pageBtn = (
          <div className="flex items-center justify-between mt-4">
            <button onClick={this.onClickPrev} className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-opacity-75 focus:outline-none">&lt;</button>
            <span className="text-white">Page : {this.state.pageIndex}/{this.state.pageMax}</span>
            <button onClick={this.onClickNext} className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-opacity-75 focus:outline-none">&gt;</button>
          </div>
        );
      }

      content = (
        <div>
          {pageBtn}
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-white">Nom</th>
                <th className="p-2 text-white">Qte</th>
                <th className="p-2 text-white">Prix</th>
                <th className="p-2 text-white">Acheter</th>
                <th className="p-2 text-white">Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order, index) => (
                <tr key={order.id} className={index % 2 === 0 ? 'bg-custom-secondary_color' : 'bg-custom-primary'}>
                  <td className="p-2 text-white text-center">{foods[order.foodId - 1].name}</td>
                  <td className="p-2 text-white text-center">{order.qty}</td>
                  <td className="p-2 text-white text-center">{foods[order.foodId - 1].price * order.qty} €</td>
                  <td className="p-2 text-white text-center">
                    <button onClick={(event) => this.openBuyDialog(event, order.id, foods[order.foodId - 1].name, foods[order.foodId - 1].price)} className="px-4 py-2 bg-[#533619] text-white rounded hover:bg-opacity-75 focus:outline-none">Acheter</button>
                  </td>
                  <td className="p-2 text-white text-center">
                    <button onClick={(event) => this.deleteOrder(event, order.id)} className="px-4 py-2 bg-[#533619] text-white rounded hover:bg-opacity-75 focus:outline-none">Supprimer</button>
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
          <h1 className="text-3xl font-bold text-white pl-2">Mon panier :</h1>
          {this.state.showBuyDialog && <BuyDialog orderId={payementId} foodName={purchasedFoodName} foodPrice={purchasedFoodPrice} onClose={this.closeBuyDialog} navigate={this.props.navigate} />}
          {content}
        </div>
      </div>
    );
  }
}

export default Cart;
