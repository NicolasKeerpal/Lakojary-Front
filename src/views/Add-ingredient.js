import React from 'react';
import { Link } from 'react-router-dom';
import { addIngredient } from '../services/IngredientService';

class AddIngredient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
          name: '',
          stock: 0
      }
    };

      this.handleChange = this.handleChange.bind(this);
      this.submit = this.submit.bind(this);
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

  async submit(event) {
    event.preventDefault();
    const { name, stock } = this.state.formData;
    try {
      const response = await addIngredient(name, stock);
      
      if (response.success) {
        alert("Cet ingrédient a bien été crée !");
        this.props.navigate('/ingredients');
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
        <h1>Ajout d'un ingrédient</h1>
        <label>
            Nom:
            <input
              type="text"
              name="name"
              value={this.state.formData.name}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={this.state.formData.stock}
              onChange={this.handleChange}
              min="0"
              required
            />
          </label>
          <br />
          <button type="submit">Créer</button>
          <Link to="/ingredients"><button>Annuler</button></Link>
        </form>
      </div>
    );
  }
}

export default AddIngredient;