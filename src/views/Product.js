import React from 'react';
import { getFood, delFood } from '../services/FoodService';
import { getFoodComposition } from '../services/CompositionService';
import { addOrder } from '../services/OrderService';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: require('../assets/loadingFoodImage.gif'),
      name: '',
      price: 0,
      description: '',
      role: null,
      ingredients: [],
      qtyToAdd: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.setState({ role: decoded.role });
      } catch (error) {
        this.setState({ role: null });
      }
    }

    try {
      const foodData = await getFood(this.props.id);
      const ingredientsData = await getFoodComposition(this.props.id);
      if (foodData.success) {
        this.setState({ 
          name: foodData.data.name,
          price: foodData.data.price,
          description: foodData.data.description,
          ingredients: ingredientsData
        });
        try {
          const response = await fetch(foodData.data.image);
          if (response.ok) {
            this.setState({ image: foodData.data.image });
          } else {
            this.setState({ image: require('../assets/0.png') });
          }
        } catch (error) {
          this.setState({ image: require('../assets/0.png') });
        }
      }
    } catch (error) {
      alert("Une erreur est survenue");
      this.props.navigate('/nos-produits');
    }
  }

  async deleteFood(event, id) {
    event.preventDefault();
    try {
      const response = await delFood(id);
      if (response.status === 204) {
        alert("Ce produit a bien été supprimé !");
        this.props.navigate('/nos-produits');
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  async addOrder(event) {
    event.preventDefault();
    const { qtyToAdd } = this.state;
    try {
      const response = await addOrder(this.props.id, qtyToAdd);
      if (response.success) {
        this.props.navigate('/mon-panier');
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    const { image, price, name, description, role, ingredients } = this.state;

    let buttons = (
      <div className="mt-4">
        <button onClick={(event) => this.addOrder(event)} className="bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded">
          Ajouter au panier
        </button>
        <input
          type='number'
          name="qtyToAdd"
          value={this.state.qtyToAdd}
          onChange={this.handleChange}
          className="ml-2 border rounded px-2"
          min="1"
        />
      </div>
    );

    if (role === "admin") {
      buttons = (
        <div className="mt-4">
          <Link to={`/nos-produits/${this.props.id}/edit`}>
            <button className="bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded mr-2">
              Modifier
            </button>
          </Link>
          <button
            onClick={(event) => this.deleteFood(event, this.props.id)}
            className="bg-custom-primary_color hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Supprimer
          </button>
        </div>
      );
    }
    if (!role) {
      buttons = (
        <div>
          <p className="mt-4 text-white">
          Il faut vous connecter pour commander : <Link to="/connexion" className="text-custom-hover_effect hover:underline">Se connecter</Link>
          </p>
        </div>
      );
    }
    if (role === "livreur") {
      buttons = (
        <div>
          <p className="mt-4 text-white">
          Vous ne pouvez pas commander en tant qu'employé
          </p>
        </div>
      );
    }

    let composition = (
      <div className="mt-4 text-white">
        <strong>Composition :</strong>
        <p>Aucun ingrédients</p>
      </div>
    );

    if (ingredients.length !== 0) {
      composition = (
        <div className="mt-4 text-white">
          <strong>Composition :</strong>
          <ul>
            {ingredients.map(ingredient => (
              <li key={ingredient.id}>{ingredient.name}</li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="w-[80rem] mx-auto mt-8 p-6 bg-custom-secondary_color shadow-md rounded-lg flex">
        <div className="w-[30rem]">
          <img src={image} alt={name} className="w-full h-auto rounded" />
        </div>
        <div className="ml-[5rem] flex-1">
          <h1 className="text-[3rem] font-bold mb-4 text-center text-white">{name}</h1>
          <p className="text-[1.2rem] text-white">Prix : <strong>{price} €</strong></p>
          <strong><p className="mt-[0.5rem] text-[1.2rem] text-white">Description :</p></strong>
          <p className="text-white">{description}</p>
          {composition}
          {buttons}
        </div>
      </div>
    );
  }
}

export default Product;
