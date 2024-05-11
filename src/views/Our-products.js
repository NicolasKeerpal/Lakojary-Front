import React from 'react';
import { getFoods } from '../services/FoodService';
import FoodCard from '../components/FoodCard';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

class Our_products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foods: [],
      startIndex: 0,
      pageIndex: 1,
      pageMax: 0,
      numberDisplayed: 16,
      searchQuery: '',
      role: null
    };

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.dividedInSubTab = this.dividedInSubTab.bind(this);
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
      const foodsData = await getFoods();

      if (foodsData.success) {
        this.setState({ foods: foodsData.data });
        const max = Math.ceil(this.state.foods.length/this.state.numberDisplayed);
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

  dividedInSubTab(tab, sizeSubTab) {
    let subTab = [];
    for (let i = 0; i < tab.length; i += sizeSubTab) {
      subTab.push(tab.slice(i, i + sizeSubTab));
    }
    return subTab;
}

  render() {
    let { foods, searchQuery, role } = this.state;
    let content;

    if (searchQuery.trim() !== '') {
      foods = foods.filter(food =>
        food.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    if (foods.length == 0) {
      content = (
          <p>Aucun produit trouvé</p>
      );
    } else {
      const { startIndex, numberDisplayed } = this.state;
      const displayedFoods = this.dividedInSubTab(foods.slice(startIndex, startIndex + numberDisplayed), 4);

      let pageBtn = "";
      if (foods.length > numberDisplayed) {
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
              {displayedFoods.map((subTab, index) => (
                <tr key={index}>
                  {subTab.map(food => (
                        <td key={food.id}><FoodCard food={food} /></td>
                    ))}
                </tr>
              ))}
          </table>
        </div>
      );
    }
    let addBtn;
    if (role=='admin'||role=='boulanger') {
      addBtn = (
        <Link to={`/nos-produits/ajout`}><button>Ajouter</button></Link>
      );
    }

    return (
      <div>
        <h1>Nos produits</h1>
        Recherche <input type="search" placeholder="Rechercher un produit" value={this.state.searchValue} onChange={this.handleSearchChange}/> {addBtn}
        <br/><br/>
        {content}
      </div>
    );
  }
}

export default Our_products;