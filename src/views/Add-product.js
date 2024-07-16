import React from 'react';
import { Link } from 'react-router-dom';
import { getIngredients } from '../services/IngredientService';
import { addFood } from '../services/FoodService';

class AddProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: [],
      formData: {
        name: '',
        price: '',
        stock: '',
        description: '',
        image: null 
      },
      composition: [],
      selectedIngredientIndex: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.addComposition = this.addComposition.bind(this);
    this.delComposition = this.delComposition.bind(this);
    this.handleChangeSelectedIngredientIndex = this.handleChangeSelectedIngredientIndex.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  async componentDidMount() {
    try {
      const ingredientsData = await getIngredients();
      if (ingredientsData.success) {
        this.setState({ ingredients: ingredientsData.data });
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

  handleChangeSelectedIngredientIndex(event) {
    const { value } = event.target;
    this.setState({ selectedIngredientIndex: value });
  }

  async submit(event) {
    event.preventDefault();
    const { name, price, stock, description, image } = this.state.formData;
    const { composition } = this.state;

    try {
      if (composition.length === 0) {
        alert("Vous devez ajouter au moins un ingrédient dans la composition");
        return;
      }
      const response = await addFood(name, price, description, stock, image, composition);
      
      if (response.success) {
        alert("Le produit a bien été ajouté !");
        this.props.navigate(`/nos-produits/${response.food.id}`);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.log(error);
      alert("Une erreur est survenue");
    }
  }

  addComposition() {
    const { selectedIngredientIndex, ingredients, composition } = this.state;
    const ingredientToAdd = ingredients[selectedIngredientIndex];

    const isAlreadyAdded = composition.some(ingredient => ingredient.id === ingredientToAdd.id);
  
    if (!isAlreadyAdded) {
      this.setState(prevState => ({
        composition: [...prevState.composition, ingredientToAdd]
      }));
    } else {
      alert("Cet ingrédient est déjà dans la composition");
    }
  }

  delComposition(id) {
    let { composition } = this.state;
    composition = composition.filter(ingredient => ingredient.id !== id);
    this.setState({ composition });
  }

  handleImageChange(event) {
    const file = event.target.files[0];
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        image: file
      }
    }));
  }
  
  render() {
    let { composition, ingredients } = this.state;
    let compositionContent = (
      <p className='text-white'>Aucun ingrédients (veuillez en sélectionner au moins un)</p>
    );

    if (composition.length > 0) {
      compositionContent = (
        <div>
          {composition.map(ingredient => (
            <div key={ingredient.id} className="flex items-center mb-2">
            <span className="flex-1 text-white">{ingredient.name}</span>
            <button
              type="button"
              onClick={() => this.delComposition(ingredient.id)}
              className="ml-2 w-8 h-8 bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold rounded-[0.5rem] flex items-center justify-center focus:outline-none"
              aria-label={`Remove ${ingredient.name}`}
            >
              -
            </button>
          </div>
          ))}
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center mt-12 mb-12">
        <div className="bg-[#533619] rounded-lg p-6 w-[30rem]">
          <h1 className="text-2xl font-bold text-center text-white mb-4">Ajouter un produit</h1>

          <form onSubmit={this.submit} className="max-w-sm mx-auto">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 text-white">Nom (*):</label>
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

            <div className="mb-4">
              <label htmlFor="image" className="block mb-1 text-white">Image (*):</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={this.handleImageChange}
                required
                accept=".png"
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block mb-1 text-white">Prix (*):</label>
              <input
                type="number"
                id="price"
                name="price"
                value={this.state.formData.price}
                onChange={this.handleChange}
                required
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="stock" className="block mb-1 text-white">Stock (*):</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={this.state.formData.stock}
                onChange={this.handleChange}
                required
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block mb-1 text-white">Description (*):</label>
              <textarea
                id="description"
                name="description"
                value={this.state.formData.description}
                onChange={this.handleChange}
                required
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-white">Composition (*):</label>
              <select 
                name="ingredients"
                value={this.state.selectedIngredientIndex}
                onChange={this.handleChangeSelectedIngredientIndex}
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              >
                {ingredients.map((ingredient, index) => (
                  <option key={ingredient.id} value={index}>
                    {ingredient.name}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={this.addComposition} 
                className="w-full mt-4 bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded-md focus:outline-none">Ajouter</button>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg text-white">Liste des ingrédients dans la composition :</h3>
              {compositionContent}
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded-md focus:outline-none">
              Créer
            </button>
            <Link to="/nos-produits">
              <button type="button" className="w-full mt-4 bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded-md focus:outline-none">
                Retour
              </button>
            </Link>
          </form>
        </div>
      </div>
    );
  }
}

export default AddProduct;
