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
        alert("Cet ingrédient a bien été créé !");
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
      <div className="flex flex-col items-center mt-8">
        <form onSubmit={this.submit} className="w-full max-w-lg bg-custom-secondary_color p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-white">Ajout d'un ingrédient</h1>
          <div className="mb-4">
            <label className="block font-medium text-white">Nom:</label>
            <input
              type="text"
              name="name"
              value={this.state.formData.name}
              onChange={this.handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-white">Stock:</label>
            <input
              type="number"
              name="stock"
              value={this.state.formData.stock}
              onChange={this.handleChange}
              min="0"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Créer</button>
            <Link to="/ingredients">
              <button type="button" className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Annuler</button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default AddIngredient;
