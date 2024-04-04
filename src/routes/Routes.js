import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Home from '../views/Home';
import Connexion from '../views/Connexion';
import About_us from '../views/About-us';
import Our_products from '../views/Our-products';

const AppRoutes = () => {
  return (
    <Routes> 
      <Route exact path="/" element={<Home/>} /> 
      <Route path="/qui-sommes-nous" element={<About_us/>} />
      <Route path="/nos-produits" element={<Our_products/>} />
      <Route path="/connexion" element={<Connexion/>} />
    </Routes>
  );
}

export default AppRoutes;
