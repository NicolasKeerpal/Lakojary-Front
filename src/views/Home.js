import React from 'react';
import { Link } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import { getFoods } from '../services/FoodService';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foods: [],
    };
  }

  async componentDidMount() {
    try {
      const foodsData = await getFoods();
      if (foodsData.success) {
        this.setState({ foods: foodsData.data });
      }
    } catch (error) {
      alert('Une erreur est survenue');
    }
  }

  render() {
    const { foods } = this.state;
    const displayedFoods = foods.slice(0, 3);
    return (
      <div className='bg-custom-primary_color'>
        <div
          className="flex items-center justify-center bg-cover bg-center bg-no-repeat h-[30rem]"
          style={{ backgroundImage: `url(../assets/bk-image.png)` }}
        >
          <div className="text-center">
            <p className="text-white text-8xl font-bold mb-10">Votre boulangerie en ligne</p>
            <p className="text-white text-2xl mb-10">Nous livrons vos pâtisseries préférées directement chez vous</p>
            <div className="flex justify-center">
              <Link
                to="/nos-produits"
                className="text-white text-2xl font-semibold py-2 px-4 bg-custom-hover_effect border-4 border-custom-hover_effect rounded-full 
                           hover:bg-transparent hover:text-custom-hover_effect duration-300 cursor-pointer w-[20rem] text-center"
              >
                Commander Maintenant
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-[4rem] mb-[4rem]">
          <div className="text-center">
            <p className="text-white text-[2.5rem] font-bold">Produit Phare</p>
            <div className="mt-[2rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[4rem]">
              {displayedFoods.map((food, index) => (
                <FoodCard key={index} food={food} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;