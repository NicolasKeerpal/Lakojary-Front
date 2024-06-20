import React from 'react';
import { getFood, delFood } from '../services/FoodService';
import { getFoodComposition } from '../services/CompositionService';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: require('../images/loadingFoodImage.gif'),
      name: '',
      price: 0,
      description: '',
      role: null,
      ingredients: []
    };
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
                  this.setState({ image: require('../images/0.png') });
                }
              } catch (error) {
                this.setState({ image: require('../images/0.png') });
              }
        }
    } catch(error) {
        alert("Une erreur est survenue");
        this.props.navigate('/nos-produits');
    }
  }

  async deleteFood(event, id) {
    event.preventDefault();
    try {
      const response = await delFood(id);
      
      if (response.status == 204) {
        alert("Ce produit a bien été supprimé !");
        this.props.navigate('/nos-produits');
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    const { image, price, name, description, role, ingredients} = this.state;
    let buttons = (
        <div>
            <button>Ajouter au panier</button> <input type='number' min='0'/>
        </div>
    );
    if (role=="admin"||role=="boulanger") {
        buttons = (
          <div>
            <Link to={`/nos-produits/${this.props.id}/edit`}><button>Modifier</button></Link> <button onClick={(event) => this.deleteFood(event, this.props.id)}>Supprimer</button>
          </div>
        );
    }

    let composition = (
      <div>
        <strong>Composition :</strong>
        <p>Aucun ingrédients</p>
      </div>
    );
    if (ingredients.length!=0) {
      composition = (
        <div>
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
      <div>
        <table cellPadding={30}>
            <tr>
                <td><img src={image} alt="image" /></td>
                <td>
                    <h1>{name}</h1>
                    <p>Prix : <strong>{price} €</strong></p>
                    <strong><p>Description :</p></strong>
                    <p>{description}</p>
                    <p>{composition}</p>
                    {buttons}
                </td>
            </tr>
        </table>
      </div>
    );
  }
}

export default Product;
