import React from 'react';
import { Link } from 'react-router-dom';
import { putIngredient, getIngredient } from '../services/IngredientService';

class UpdateIngredient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: 0,
      id: props.id,
      formData: {
          name: '',
          addStock: 0
      }
    };

      this.handleChange = this.handleChange.bind(this);
      this.submit = this.submit.bind(this);
  }

  async componentDidMount() {
    try {
      const ingredientData = await getIngredient(this.state.id);
      if (ingredientData.success) {
        this.setState({ 
          stock: ingredientData.data.stock,
          formData: { 
            name: ingredientData.data.name,
            addStock: 0
          }
        });
      } else {
        alert('Une erreur est survenue');
      }
    } catch (error) {
      alert('Une erreur est survenue');
    }
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
    const { name, addStock } = this.state.formData;
    try {
      const response = await putIngredient(this.state.id, name, addStock);
      
      if (response.status == 204) {
        alert("Cet ingrédient a bien été modifié !");
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
        <h1>Modification ingrédient</h1>
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
            Stock à ajouter (actuel : {this.state.stock}):
            <input
              type="number"
              name="addStock"
              value={this.state.formData.addStock}
              onChange={this.handleChange}
              min="0"
              required
            />
          </label>
          <br />
          <button type="submit">Modifier</button>
          <Link to="/ingredients"><button>Annuler</button></Link>
        </form>
      </div>
    );
  }
}

export default UpdateIngredient;