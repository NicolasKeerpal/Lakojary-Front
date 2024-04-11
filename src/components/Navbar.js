import React from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: null
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.setState({ role: decoded.role });
      } catch (error) {
        this.setState({ role: null });
      }
    }
  }

  render() {
    const { role } = this.state;

    const getNavbar = () => {
      switch (role) {
        case 'admin':
          return (
            <>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/nos-produits">Nos produits</Link></li>
              <li><Link to="/qui-sommes-nous">Qui sommes nous ?</Link></li>
              <li><Link to="/ingredients">Ingrédients</Link></li>
              <li>
                <span>Utilisateurs</span>
                <ul>
                  <li><Link to="/clients">Clients</Link></li>
                  <li><Link to="/employes">Employés</Link></li>
                </ul>
              </li>
              <li><Link to="/remplir-bdd">Remplir BDD</Link></li>
              <li><Link to="/profil">Profil</Link></li>
            </>
          );
        case 'livreur':
          return (
            <>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/nos-produits">Nos produits</Link></li>
              <li><Link to="/qui-sommes-nous">Qui sommes nous ?</Link></li>
              <li><Link to="/livraisons">Livraisons</Link></li>
              <li><Link to="/profil">Profil</Link></li>
            </>
          );
        case 'client':
          return (
            <>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/nos-produits">Nos produits</Link></li>
              <li><Link to="/qui-sommes-nous">Qui sommes nous ?</Link></li>
              <li><Link to="/commandes">Commandes</Link></li>
              <li><Link to="/panier">Panier</Link></li>
              <li><Link to="/profil">Profil</Link></li>
            </>
          );
        case 'boulanger':
          return (
            <>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/nos-produits">Nos produits</Link></li>
              <li><Link to="/ingredients">Ingrédients</Link></li>
              <li><Link to="/qui-sommes-nous">Qui sommes nous ?</Link></li>
              <li><Link to="/profil">Profil</Link></li>
            </>
          );
        default:
          return (
            <>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/nos-produits">Nos produits</Link></li>
              <li><Link to="/qui-sommes-nous">Qui sommes nous ?</Link></li>
              <li><Link to="/connexion">Connexion</Link></li>
            </>
          );
      }
    };

    return (
      <nav>
        <ul>
          {getNavbar()}
        </ul>
      </nav>
    );
  }
}

export default Navbar;
