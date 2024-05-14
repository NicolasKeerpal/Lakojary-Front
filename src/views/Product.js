import React from 'react';
import { getFood } from '../services/FoodService';
import { jwtDecode } from 'jwt-decode';

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: require('../images/loadingFoodImage.gif'),
      name: '',
      price: 0,
      description: '',
      role: null
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
        if (foodData.success) {
            this.setState({ 
                name: foodData.data.name,
                price: foodData.data.price,
                description: foodData.data.description
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

  render() {
    const { image, price, name, description, role} = this.state;
    let buttons = (
        <div>
            <button>Ajouter au panier</button> <input type='number' min='0'/>
        </div>
    );
    if (role=="admin"||role=="boulanger") {
        buttons = (
            <div>
            <button>Modifier</button> <button>Supprimer</button>
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
                    <p>Prix : <strong>{price}</strong></p>
                    <strong><p>Description :</p></strong>
                    <p>{description}</p>
                    <p>
                        <strong>Composition :</strong>
                        <ul>
                            <li>Élément 1</li>
                            <li>Élément 2</li>
                            <li>Élément 3</li>
                        </ul>
                    </p>
                    {buttons}
                </td>
            </tr>
        </table>
      </div>
    );
  }
}

export default Product;
