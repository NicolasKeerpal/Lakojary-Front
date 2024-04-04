// App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Routes from './routes/Routes';     
import Footer from './components/Footer';       

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar/>
        <Routes/>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
