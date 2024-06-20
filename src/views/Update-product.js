import React from 'react';
import { Link } from 'react-router-dom';
import { putFood, getFood } from '../services/FoodService';
import { getIngredients } from '../services/IngredientService';
import { getFoodComposition } from '../services/CompositionService';

class UpdateProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: [],
      isChangeImageEnabled: false,
      stock: 0,
      formData: {
          name: '',
          price: '',
          description: '',
          image: null ,
          addStock: 0
      },
      composition: [],
      selectedIngredientIndex: 0
    };

      this.handleChange = this.handleChange.bind(this);
      this.submit = this.submit.bind(this);
      this.handleImageChange = this.handleImageChange.bind(this);
      this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
      this.addComposition = this.addComposition.bind(this);
      this.delComposition = this.delComposition.bind(this);
      this.handleChangeSelectedIngredientIndex = this.handleChangeSelectedIngredientIndex.bind(this);
  }

  async componentDidMount() {
    try {
        const foodData = await getFood(this.props.id);
        const ingredientsData = await getIngredients();
        const compositionData = await getFoodComposition(this.props.id);
        if (foodData.success&&ingredientsData.success) {
          const food = foodData.data;
          const ingredients = ingredientsData.data;
          const composition = compositionData;
          this.setState({ 
            stock: food.stock,
            ingredients: ingredients,
            composition: composition,
            formData: { 
                name: food.name,
                price: food.price,
                description: food.description,
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

  handleCheckboxChange(event) {
    const { checked } = event.target;
    this.setState({
      isChangeImageEnabled: checked,
    });
  }

  handleChangeSelectedIngredientIndex(event) {
    const { value } = event.target;
    this.setState({ selectedIngredientIndex: value });
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

  async submit(event) {
    event.preventDefault();
    const { composition } = this.state;
    const { name, price, addStock, description, image } = this.state.formData;
    try {
      const response = await putFood(this.props.id, name, price, description, addStock, image, composition);
      
      if (response.status == 204) {
        alert("Le produit a bien été modifié !");
        this.props.navigate(`/nos-produits/${this.props.id}`);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
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
        <h1>Modification d'un produit</h1>
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
          <input
              type="checkbox"
              checked={this.state.isChangeImageEnabled}
              onChange={this.handleCheckboxChange}
          />
          Changer l'image:
          <input
            type="file"
            name="image"
            onChange={this.handleImageChange}
            required
            accept=".png"
            multiple={false}
            disabled={!this.state.isChangeImageEnabled}
          />
        </label>
        <br />
        <label>
          Prix:
          <input
            type="text" 
            pattern="[0-9]*[.,]?[0-9]+" 
            placeholder="Entrez un nombre décimal positif"
            value={this.state.formData.price}
            onChange={this.handleChange}
            required
          />
        </label>
        <br />
        <label>
          Stock à ajouter (stock actuel : {this.state.stock}):
          <br/>
          (Il faut qu'il y est assez de stock d'ingrédients pour pouvoir ajouter des stocks à ce produit)
          <br/>
          Ajout :
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
          <button type="submit">Modifier</button>
          <Link to={`/nos-produits/${this.props.id}`}><button>Retour</button></Link>
        </form>
      </div>
    );
  }
}

export default UpdateProduct;