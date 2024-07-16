import React from 'react';
import { Link } from 'react-router-dom';

class NotFound extends React.Component {
  render() {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-5xl font-bold text-custom-text_page_not_found">
          Page not found, Sorry
        </p>
        <Link to="/">
          <button className="mt-5 px-4 py-2 bg-custom-secondary_color text-white rounded hover:bg-custom-hover_effect">
            Retour à l'accueil
          </button>
        </Link>
      </div>
    );
  }
}

export default NotFound;
