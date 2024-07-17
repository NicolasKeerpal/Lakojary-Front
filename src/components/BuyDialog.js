import React from 'react';
import { buyOrder } from '../services/OrderService';

class BuyDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        hour: '',
        number: '',
        name: '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  }

  handleClose(event) {
    event.preventDefault();
    this.props.onClose();
  }

  async submit(event) {
    event.preventDefault();
    const { hour, number, name } = this.state.formData;
    try {
      const response = await buyOrder(this.props.orderId, hour, number, name);

      if (response.status === 204) {
        alert('Achat effectué avec succès !');
        this.props.navigate('/mes-commandes');
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert('Une erreur est survenue');
    }
  }

  render() {
    return (
      <div className="flex items-center justify-center z-20 fixed inset-0 bg-black bg-opacity-50 w-auto h-full">
        <div className="bg-custom-secondary_color rounded-lg p-6 w-[40rem] relative">
          <h1 className="text-2xl font-bold pt-4 pb-2 text-center text-white">Achat</h1>
          <form onSubmit={this.submit} className="max-w-sm mx-auto">
            <div className="mb-4">
              <label htmlFor="hour" className="block mb-1 text-white">Heure de livraison souhaitée (*):</label>
              <input
                type="text"
                id="hour"
                name="hour"
                value={this.state.formData.hour}
                onChange={this.handleChange}
                required
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="number" className="block mb-1 text-white">Numéro sur la carte (*):</label>
              <input
                type="text"
                id="number"
                name="number"
                value={this.state.formData.number}
                onChange={this.handleChange}
                required
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 text-white">Nom sur la carte (*):</label>
              <input
                type="text"
                id="name"
                name="name"
                value={this.state.formData.name}
                onChange={this.handleChange}
                required
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mb-[1rem]"
            >
              Acheter
            </button>
            <button
              onClick={this.handleClose}
              className="w-full mt-1 bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mb-[2rem]"
            >
              Annuler
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default BuyDialog;
