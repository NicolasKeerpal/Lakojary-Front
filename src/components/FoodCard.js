import React from 'react';
import { Link } from 'react-router-dom';

class FoodCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: require('../assets/loadingFoodImage.gif'),
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch(this.props.food.image);
      if (response.ok) {
        this.setState({ image: this.props.food.image });
      } else {
        this.setState({ image: require('../assets/0.png') });
      }
    } catch (error) {
      this.setState({ image: require('../assets/0.png') });
    }
  }

  render() {
    return (
      <Link
        to={`/nos-produits/${this.props.food.id}`}
        className="bg-custom-secondary_color food-card max-w-sm rounded-[0.5rem] overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-custom-bk_color_card hover:border-custom-bk_border_card border-4 border-solid border-custom-border_color"
      >
        <img
          className="rounded-[1rem] py-2 w-48 h-48 object-cover mx-auto"
          src={this.state.image}
          alt="image"
          onError={() => this.setState({ image: require('../assets/0.png') })}
        />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 text-white">{this.props.food.name}</div>
          <p className="text-[2rem] font-bold text-white">{this.props.food.price} €</p>
        </div>
      </Link>
    );
  }
}

export default FoodCard;
