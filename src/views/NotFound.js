import React from 'react';
import { Link } from 'react-router-dom';

class NotFound extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Erreur 404</p>
        <p>La page que vous recherchez n'a pas été trouvée</p>
        <Link to='/'><button>Retour à l'accueil</button></Link>
      </div>
    );
  }
}

export default NotFound;
