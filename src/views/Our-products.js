import React from 'react';
import { getFoods } from '../services/FoodService';
import FoodCard from '../components/FoodCard';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

class OurProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foods: [],
      startIndex: 0,
      pageIndex: 1,
      pageMax: 0,
      numberDisplayed: 16,
      searchQuery: '',
      role: null,
    };

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
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
        this.setState({ foods: foodsData.data }, () => {
          const max = Math.ceil(this.state.foods.length / this.state.numberDisplayed);
          this.setState({ pageMax: max });
        });
      }
    } catch (error) {
      alert('Une erreur est survenue');
    }
  }

  onClickNext() {
    const { startIndex, numberDisplayed, pageIndex, pageMax } = this.state;
    const index = startIndex + numberDisplayed;
    const page = pageIndex + 1;

    if (page > pageMax) {
      this.setState({ startIndex: 0, pageIndex: 1 });
    } else {
      this.setState({ startIndex: index, pageIndex: page });
    }
  }

  onClickPrev() {
    let index = this.state.startIndex - this.state.numberDisplayed;
    const { pageMax } = this.state;

    if (index < 0) {
      index = (pageMax - 1) * this.state.numberDisplayed;
      this.setState({ startIndex: index, pageIndex: pageMax });
    } else {
      this.setState({ startIndex: index, pageIndex: this.state.pageIndex - 1 });
    }
  }

  handleSearchChange(event) {
    const value = event.target.value;
    this.setState({ searchQuery: value, startIndex: 0, pageIndex: 1 });
  }

  render() {
    let { foods, searchQuery, role, startIndex, numberDisplayed } = this.state;

    if (searchQuery.trim() !== '') {
      foods = foods.filter(food =>
        food.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const displayedFoods = foods.slice(startIndex, startIndex + numberDisplayed);
    const totalPages = Math.ceil(foods.length / numberDisplayed);

    return (
      <div className="ml-[2rem] mr-[2rem]">
        <p className="text-white text-[2.5rem] font-bold pt-[2rem] pb-[1rem]">Nos produits :</p>

        <div className="flex items-center mb-[2rem]">
          <p className="text-[1.5rem] text-white">
            Recherche 
            <input
              className="h-[2.5rem] border-2 border-custom-secondary_color rounded bg-transparent p-2 placeholder-custom-secondary_color focus:outline-none"
              type="text"
              value={this.state.searchQuery}
              onChange={this.handleSearchChange}
              placeholder="Search a product"
            />
          </p>
          {role === 'admin' && (
            <Link to="/nos-produits/ajout">
              <button className="ml-4 bg-custom-secondary_color text-white hover:text-white hover:bg-custom-hover_effect text-xl rounded-[0.5rem] px-[1rem] py-[0.2rem]">
                Ajouter
              </button>
            </Link>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-4 font-bold">
            <button onClick={this.onClickPrev} className="px-4 bg-custom-secondary_color text-white rounded-md mr-2 text-[2rem]">←</button>
            <span className="text-2xl text-white">Page: {this.state.pageIndex}/{totalPages}</span>
            <button onClick={this.onClickNext} className="px-4 bg-custom-secondary_color text-white rounded-md ml-2 text-[2rem]">→</button>
          </div>
        )}

        <div className="flex justify-center mt-[2rem] mb-[4rem]">
          <div className="text-center">
            <div className="mt-[2rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[4rem]">
              {displayedFoods.map(food => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-4 font-bold mb-[2rem]">
            <button onClick={this.onClickPrev} className="px-4 bg-custom-secondary_color text-white rounded-md mr-2 text-[2rem]">←</button>
            <span className="text-2xl text-white">Page: {this.state.pageIndex}/{totalPages}</span>
            <button onClick={this.onClickNext} className="px-4 bg-custom-secondary_color text-white rounded-md ml-2 text-[2rem]">→</button>
          </div>
        )}
      </div>
    );
  }
}

export default OurProducts;
