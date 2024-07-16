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
        const max = Math.ceil(ingredientsData.data.length / this.state.numberDisplayed);
        this.setState({ pageMax: max });
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
    } else {
      this.setState({
        startIndex: index,
        pageIndex: page
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
        pageIndex: max
      });
    } else {
      const page = this.state.pageIndex - 1;
      this.setState({
        startIndex: index,
        pageIndex: page
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
      if (response.status === 204) {
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

    if (ingredients.length === 0) {
      content = (
        <div>
          <p className="text-white">Aucun ingrédient trouvé</p>
        </div>
      );
    } else {
      const { startIndex, numberDisplayed } = this.state;
      const displayedIngredients = ingredients.slice(startIndex, startIndex + numberDisplayed);
      let pageBtn = "";
      if (ingredients.length > numberDisplayed) {
        pageBtn = (
          <div className="flex items-center justify-center mt-4">
            <button onClick={this.onClickPrev} className="px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-opacity-75">{"<"}</button>
            <span className="text-white text-[1.5rem] mx-2">Page : {this.state.pageIndex}/{this.state.pageMax}</span>
            <button onClick={this.onClickNext} className="px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-opacity-75">{">"}</button>
          </div>
        );
      }

      content = (
        <div>
          {pageBtn}
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-white text-[1.5rem]">Nom</th>
                <th className="p-2 text-white text-[1.5rem]">Stock</th>
                <th className="p-2 text-white text-[1.5rem]">Modifier</th>
                <th className="p-2 text-white text-[1.5rem]">Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {displayedIngredients.map((ingredient, index) => (
                <tr key={ingredient.id} className={index % 2 === 0 ? "bg-custom-secondary_color" : "bg-custom-primary_color"}>
                  <td className="p-2 text-white text-center">{ingredient.name}</td>
                  <td className="p-2 text-white text-center">{ingredient.stock}</td>
                  <td className="p-2 text-white text-center">
                    <Link to={`/ingredients/${ingredient.id}/edit`}>
                      <button className="ml-4 bg-custom-hover_effect text-white hover:text-white hover:bg-custom-primary_color text-xl rounded-[0.5rem] px-[1rem] py-[0.2rem]">Modifier</button>
                    </Link>
                  </td>
                  <td className="p-2 text-white text-center">
                    <button onClick={(event) => this.deleteIngredient(event, ingredient.id)} className="px-4 py-2 bg-custom-hover_effect text-white rounded hover:bg-custom-primary_color text-xl rounded-[0.5rem] px-[1rem] py-[0.2rem]">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center mt-8 mb-10">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-white pl-2">Ingrédients :</h1>
          <div className="mt-4 pl-2 text-white">
            Recherche <input 
              className="w-80 h-10 border-2 border-custom-secondary_color rounded bg-transparent text-white placeholder-custom-secondary_color focus:outline-none px-2"
              type="search"
              placeholder="Rechercher un ingrédient"
              value={searchQuery}
              onChange={this.handleSearchChange}
            />
            <Link to={`/ingredients/ajout`}>
              <button className="ml-2 px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-opacity-75 focus:outline-none">Ajouter</button>
            </Link>
          </div>

          {content}
        </div>
      </div>
    );
  }
}

export default IngredientsList;
