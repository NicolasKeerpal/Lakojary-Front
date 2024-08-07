import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'; 
import Home from '../views/Home';
import Connexion from '../views/Connexion';
import AboutUs from '../views/About-us';
import OurProducts from '../views/Our-products';
import Profile from '../views/Profile';
import UpdateProfile from '../views/Update-profile';
import SignUp from '../views/Sign-up';
import CustomersList from '../views/Customers-list';
import UpdateCustomer from '../views/Update-customer';
import { authMiddleware } from './AuthMiddlewares';
import PopulateDB from '../views/Populate-db';
import AddProduct from '../views/Add-product';
import IngredientsList from '../views/Ingredients-list';
import UpdateIngredient from '../views/Update-ingredient';
import AddIngredient from '../views/Add-ingredient';
import EmployeesList from '../views/Employees-list';
import UpdateEmployee from '../views/Update-employee';
import AddEmployee from '../views/Add-employee';
import AddCustomer from '../views/Add-customer';
import VacationsList from '../views/Vacations-list';
import AddVacations from '../views/Add-vacations';
import UpdateVacations from '../views/Update-vacations';
import NotFound from '../views/NotFound';
import Product from '../views/Product';
import Cart from '../views/Cart';
import DeliveriesList from '../views/Deliveries-list';
import OrdersList from '../views/Orders-list';
import UpdateProduct from '../views/Update-product';

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

const WithIdFromUrl = ({ Component, navigate }) => {
  const { id } = useParams();

  return <Component navigate={navigate} id={id} />;
};

const WithIdsFromUrl = ({ Component, navigate }) => {
  const { vacationsId, id } = useParams();

  return <Component navigate={navigate} vacationsId={vacationsId} id={id} />;
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
      <Route path="/profil/edit" element={
        <AuthRoute allowedRoles={['all']} navigate={navigate}>
          <UpdateProfile navigate={navigate}/>
        </AuthRoute>
      }/>
      <Route path="/clients" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
          <CustomersList navigate={navigate}/>
        </AuthRoute>
      }/>
      <Route path="/clients/:id/edit" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
            <WithIdFromUrl Component={UpdateCustomer} navigate={navigate} />
        </AuthRoute>
        }/>
      <Route path="/remplir-bdd" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
          <PopulateDB />
        </AuthRoute>
      }/>
      <Route path="/nos-produits/ajout" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
          <AddProduct navigate={navigate} />
        </AuthRoute>
      }/>
      <Route path="/ingredients" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
          <IngredientsList navigate={navigate}/>
        </AuthRoute>
      }/>
      <Route path="/ingredients/:id/edit" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
            <WithIdFromUrl Component={UpdateIngredient} navigate={navigate} />
        </AuthRoute>
      }/>
      <Route path="/ingredients/ajout" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
          <AddIngredient navigate={navigate}/>
        </AuthRoute>
      }/>
      <Route path="/employes" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
          <EmployeesList navigate={navigate}/>
        </AuthRoute>
      }/>
      <Route path="/employes/ajout" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
          <AddEmployee navigate={navigate}/>
        </AuthRoute>
      }/>
      <Route path="/employes/:id/edit" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
            <WithIdFromUrl Component={UpdateEmployee} navigate={navigate} />
        </AuthRoute>
      }/>
      <Route path="/clients/ajout" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
          <AddCustomer navigate={navigate}/>
        </AuthRoute>
      }/>
      <Route path="/employes/:id/vacances" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
            <WithIdFromUrl Component={VacationsList} navigate={navigate} />
        </AuthRoute>
      }/>
      <Route path="/employes/:id/vacances/ajout" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
            <WithIdFromUrl Component={AddVacations} navigate={navigate} />
        </AuthRoute>
      }/>
      <Route path="/employes/:id/vacances/:vacationsId/edit" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
            <WithIdsFromUrl Component={UpdateVacations} navigate={navigate} />
        </AuthRoute>
      }/>
      <Route path="/nos-produits/:id" element={
          <WithIdFromUrl Component={Product} navigate={navigate} />
      }/>
      <Route path="/nos-produits/:id/edit" element={
        <AuthRoute allowedRoles={['admin']} navigate={navigate}>
          <WithIdFromUrl Component={UpdateProduct} navigate={navigate} />
        </AuthRoute>
      }/>
      <Route path="/mon-panier" element={
        <AuthRoute allowedRoles={['client']} navigate={navigate}>
          <Cart navigate={navigate}/>
        </AuthRoute>
      }/>
      <Route path="/mes-commandes" element={
        <AuthRoute allowedRoles={['client']} navigate={navigate}>
          <OrdersList navigate={navigate}/>
        </AuthRoute>
      }/>
      <Route path="/mes-livraisons" element={
        <AuthRoute allowedRoles={['livreur']} navigate={navigate}>
          <DeliveriesList navigate={navigate}/>
        </AuthRoute>
      }/>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;