import React from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import

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
            <li><Link to="/" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Accueil</Link></li>
            <li><Link to="/nos-produits" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Nos produits</Link></li>
            <li><Link to="/qui-sommes-nous" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Qui sommes nous ?</Link></li>
            <li><Link to="/ingredients" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Ingrédients</Link></li>
            <li>
              <span className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Utilisateurs</span>
              <ul>
                <li><Link to="/clients" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Clients</Link></li>
                <li><Link to="/employes" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Employés</Link></li>
              </ul>
            </li>
            <li><Link to="/remplir-bdd" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Remplir BDD</Link></li>
            <li><Link to="/profil" className="bg-custom-primary_color text-white hover:text-white hover:bg-custom-hover_effect text-xl font-bold rounded-[5rem] px-[2rem] py-[0.2rem]">Profil</Link></li>
          </>
          );
        case 'livreur':
          return (
            <>
              <li><Link to="/" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Accueil</Link></li>
              <li><Link to="/nos-produits" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Nos produits</Link></li>
              <li><Link to="/qui-sommes-nous" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Qui sommes nous ?</Link></li>
              <li><Link to="/livraisons" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Livraisons</Link></li>
              <li><Link to="/profil" className="bg-custom-primary_color text-white hover:text-white hover:bg-custom-hover_effect text-xl font-bold rounded-[5rem] px-[2rem] py-[0.2rem]">Profil</Link></li>
            </>
          );
        case 'client':
          return (
            <>
              <li><Link to="/" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Accueil</Link></li>
              <li><Link to="/nos-produits" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Nos produits</Link></li>
              <li><Link to="/qui-sommes-nous" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Qui sommes nous ?</Link></li>
              <li><Link to="/commandes" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Commandes</Link></li>
              <li><Link to="/panier" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Panier</Link></li>
              <li><Link to="/profil" className="bg-custom-primary_color text-white hover:text-white hover:bg-custom-hover_effect text-xl font-bold rounded-[5rem] px-[2rem] py-[0.2rem]">Profil</Link></li>
            </>
          );
        case 'boulanger':
          return (
            <>
              <li><Link to="/" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Accueil</Link></li>
              <li><Link to="/nos-produits" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Nos produits</Link></li>
              <li><Link to="/ingredients" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Ingrédients</Link></li>
              <li><Link to="/qui-sommes-nous" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Qui sommes nous ?</Link></li>
              <li><Link to="/profil" className="bg-custom-primary_color text-white hover:text-white hover:bg-custom-hover_effect text-xl font-bold rounded-[5rem] px-[2rem] py-[0.2rem]">Profil</Link></li>
            </>
          );
        default:
          return (
            <>
              <li><Link to="/" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Accueil</Link></li>
              <li><Link to="/nos-produits" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Nos produits</Link></li>
              <li><Link to="/qui-sommes-nous" className="relative text-white hover:text-custom-hover_effect text-xl font-bold">Qui sommes nous ?</Link></li>
              <li><Link to="/connexion" className="bg-custom-primary_color text-white hover:text-white hover:bg-custom-hover_effect text-xl font-bold rounded-[5rem] px-[2rem] py-[0.2rem]">Connexion</Link></li>
            </>
          );
      }
    };

    return (
      <header className="bg-custom-secondary_color sticky top-0 z-10">
        <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
          <img className="w-[4rem] h-[3.5rem] p-0" src="/path/to/your/logo.png" alt="Logo" />
          <ul className="flex space-x-4">
            {getNavbar()}
          </ul>
        </nav>
      </header>
    );
  }
}

export default Navbar;
