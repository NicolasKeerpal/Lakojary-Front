import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/nos-produits">Nos produits</Link></li>
        <li><Link to="/qui-sommes-nous">Qui sommes nous ?</Link></li>
        <li><Link to="/connexion">Connexion</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
