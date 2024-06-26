import React from 'react';
import { Link } from 'react-router-dom';

class FoodCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: require('../images/loadingFoodImage.gif')
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch(this.props.food.image);
      if (response.ok) {
        this.setState({ image: this.props.food.image });
      } else {
        this.setState({ image: require('../images/0.png') });
      }
    } catch (error) {
      this.setState({ image: require('../images/0.png') });
    }
  }

  render() {
    return (
      <Link to={`/nos-produits/${this.props.food.id}`}>
      <div>
        <img src={this.state.image} alt="image" />
        <div>
          <p>{this.props.food.name}</p>
          <p>{this.props.food.price}</p>
        </div>
      </div>
      </Link>
    );
  }
}

export default FoodCard;
