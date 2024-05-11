import React from 'react';
import { getIngredients, delIngredient } from '../services/IngredientService';
import { Link } from 'react-router-dom';

class IngredientsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: [],
      startIndex: 0,
      pageIndex: 1,
      pageMax: 0,
      numberDisplayed: 10,
      searchQuery: ''
    };

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  async componentDidMount() {
    try {
      const ingredientsData = await getIngredients();

      if (ingredientsData.success) {
        this.setState({ ingredients: ingredientsData.data });
        const max = Math.ceil(this.state.ingredients.length/this.state.numberDisplayed);
        this.setState({ pageMax : max });
      }
    } catch (error) {
      alert('Une erreur est survenue');
    }
  }

  onClickNext() {
    const index = this.state.startIndex + this.state.numberDisplayed;
    const page = this.state.pageIndex + 1; 
    if (page > this.state.pageMax) {
      this.setState({ 
        startIndex: 0,
        pageIndex: 1 
      });
    }
    else {
      this.setState({ 
        startIndex: index,
        pageIndex : page
      });
    }
  }

  onClickPrev() {
    let index = this.state.startIndex - this.state.numberDisplayed;
    if (index < 0) {
      index = (this.state.pageMax - 1) * this.state.numberDisplayed;
      let max = this.state.pageMax;
      this.setState({ 
        startIndex: index,
        pageIndex : max
      });
    }
    else {
      const page = this.state.pageIndex - 1;
      this.setState({ 
        startIndex: index,
        pageIndex : page
      });
    }
  }

  handleSearchChange(event) {
    const value = event.target.value;
    this.setState({ 
      searchQuery: value,
      startIndex: 0,
      pageIndex: 1
    });
  }

  async deleteIngredient(event, id) {
    event.preventDefault();
    try {
      const response = await delIngredient(id);
      
      if (response.status == 204) {
        alert("Cet ingrédient a bien été supprimé !");
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    let { ingredients, searchQuery } = this.state;
    let content;

    if (searchQuery.trim() !== '') {
      ingredients = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    if (ingredients.length == 0) {
      content = (
        <div>
          <p>Aucun ingrédient trouvé</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed } = this.state;
      const displayedIngredients = ingredients.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (ingredients.length > numberDisplayed) {
        pageBtn = (
          <div>
            <button onClick={this.onClickPrev}>{"<"}</button> 
            Page : {this.state.pageIndex}/{this.state.pageMax} 
            <button onClick={this.onClickNext}>{">"}</button>
          </div>
        );
      }

      content = (
        <div>
          {pageBtn}
          <table>
            <tr>
              <th>Nom</th>
              <th>Stock</th>
              <th>Modifier</th>
              <th>Supprimer</th>
            </tr>

            {displayedIngredients.map(ingredient => (
                <tr key={ingredient.id}>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.stock}</td>
                  <td><Link to={`/ingredients/${ingredient.id}/edit`}><button>Modifier</button></Link></td>
                  <td><button onClick={(event) => this.deleteIngredient(event, ingredient.id)}>Supprimer</button></td>
                </tr>
              ))}
          </table>
        </div>
      );
    }

    return (
        <div>
          <h1>Liste des ingrédients</h1>
          Recherche <input type="search" placeholder="Rechercher un ingrédient" value={this.state.searchValue} onChange={this.handleSearchChange}/>
          <Link to={`/ingredients/ajout`}><button>Ajouter</button></Link>
          <br/><br/>
          {content}
        </div>
    );
  }
}

export default IngredientsList;
