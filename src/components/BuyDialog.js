import React from 'react';
import { buyOrder } from '../services/OrderService';

class BuyDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
          hour: '',
      }
    };

      this.handleChange = this.handleChange.bind(this);
      this.submit = this.submit.bind(this);
      this.handleClose = this.handleClose.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  }

  handleClose(event) {
    event.preventDefault();
    this.props.onClose();
  }

  async submit(event) {
    event.preventDefault();
    const { hour } = this.state.formData;
    try {
      const response = await buyOrder(this.props.orderId, hour);
      
      if (response.status == 204) {
        alert("Achat effectué avec succès !");
        this.props.navigate('/mes-commandes');
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.submit}>
        <h1>Achat</h1>
        <label>
            Produit: {this.props.foodName}
            <br />
            Prix: {this.props.foodPrice}
        </label>
        <br />
        <label>
            Heure de livraison souhaité:
            <input
              type="text"
              name="hour"
              value={this.state.formData.hour}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
          <button type="submit">Acheter</button>
          <button onClick={this.handleClose}>Annuler</button>
        </form>
      </div>
    );
  }
}

export default BuyDialog;