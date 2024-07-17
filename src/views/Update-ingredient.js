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
      
      if (response.status === 204) {
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
      <div className="container mx-auto p-6 w-[40rem]">
        <form onSubmit={this.submit} className="bg-custom-secondary_color rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-white">Modification ingrédient</h1>
          <label className="block mb-2 text-white">
            Nom:
            <input
              type="text"
              name="name"
              value={this.state.formData.name}
              onChange={this.handleChange}
              required
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2 text-white">
            Stock à ajouter (actuel : {this.state.stock}):
            <input
              type="number"
              name="addStock"
              value={this.state.formData.addStock}
              onChange={this.handleChange}
              min="0"
              required
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </label>
          
          <button type="submit" className="mt-5 w-full bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">Modifier</button>
          <Link to="/ingredients">
            <button type="button" className="mt-5 w-full bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">Annuler</button>
          </Link>
        </form>
      </div>
    );
  }
}

export default UpdateIngredient;
