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
          const ingredients = ingredientsData.data;
          this.setState({ ingredients: ingredients });
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
      if (composition.length==0) {
        alert("Vous devez ajouter au moins un ingrédient dans la composition");
        return;
      }
      const response = await addFood(name, price, description, stock, image, composition);
      
      if (response.success) {
        alert("Le produit a bien été ajouté !");
        //this.props.navigate('/nos-produits/${response.data.food.id}');
      } else {
        alert(response.message);
      }
    } catch (error) {
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
    composition = composition.filter(ingredient => ingredient.id!=id);
    this.setState({
      composition
    });
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
      <p>Aucun ingrédients (veuillez en sélectionner au moins un)</p>
    );

    if (composition.length>0) {
      compositionContent = (
        <div>
          {composition.map(ingredient => (
            <div key={ingredient.id}>{ingredient.name} <button type="button" onClick={() => this.delComposition(ingredient.id)}>-</button></div>
          ))}
        </div>
      )
    }

    return (
      <div>
        <form onSubmit={this.submit}>
        <h1>Ajouter un produit</h1>
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
          Image:
          <input
            type="file"
            name="image"
            onChange={this.handleImageChange}
            required
            accept=".png"
            multiple={false}
          />
        </label>
        <br />
        <label>
          Prix:
          <input
            type="number"
            name="price"
            value={this.state.formData.price}
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
            required
          />
        </label>
        <br />
        <label>
          Description: <br />
          <textarea
            name="description"
            value={this.state.formData.description}
            onChange={this.handleChange}
            required
          />
        </label>
        <br />
        Composition :
        <br />
          <select 
          name="ingredients"
          value={this.state.selectedIngredientIndex}
          onChange={this.handleChangeSelectedIngredientIndex}
          >
            {ingredients.map((ingredient, index) => {
              return (
                <option key={ingredient.id} value={index}>
                  {ingredient.name}
                </option>
              );
            })}
          </select>
        <button type="button" onClick={this.addComposition}>Ajouter</button>
        <br /><br />
        Liste des ingrédients dans la composition :
        <br />
          {compositionContent}
        <br />
          <button type="submit">Créer</button>
          <Link to="/nos-produits"><button>Retour</button></Link>
        </form>
      </div>
    );
  }
}

export default AddProduct;