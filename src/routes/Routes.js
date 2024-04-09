import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; 
import Home from '../views/Home';
import Connexion from '../views/Connexion';
import AboutUs from '../views/About-us';
import OurProducts from '../views/Our-products';
import Profile from '../views/Profile';
import SignUp from '../views/Sign-up';
import { authMiddleware } from './AuthMiddlewares';

const AuthRoute = ({ allowedRoles, children, navigate }) => {
  React.useEffect(() => {
    const isAuthenticated = authMiddleware(allowedRoles);
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [allowedRoles, navigate]);

  return <>{children}</>;
};

const NoAuthRoute = ({ allowedRoles, children, navigate }) => {
  React.useEffect(() => {
    const isAuthenticated = authMiddleware(allowedRoles);
    if (isAuthenticated) {
      navigate('/');
    }
  }, [allowedRoles, navigate]);

  return <>{children}</>;
};

const AppRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes> 
      <Route exact path="/" element={<Home/>} /> 
      <Route path="/qui-sommes-nous" element={<AboutUs/>} />
      <Route path="/nos-produits" element={<OurProducts/>} />
      <Route path="/connexion" element={
        <NoAuthRoute allowedRoles={['all']} navigate={navigate}>
          <Connexion navigate={navigate}/>
        </NoAuthRoute>
      }/>
      <Route path="/inscription" element={
        <NoAuthRoute allowedRoles={['all']} navigate={navigate}>
          <SignUp navigate={navigate}/>
        </NoAuthRoute>
      }/>
      <Route path="/profil" element={
        <AuthRoute allowedRoles={['all']} navigate={navigate}>
          <Profile navigate={navigate}/>
        </AuthRoute>
      }/>
    </Routes>
  );
}

export default AppRoutes;