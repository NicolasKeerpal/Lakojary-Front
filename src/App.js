import { refreshToken } from './services/LoginService';
import { authMiddleware } from './routes/AuthMiddlewares';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Routes from './routes/Routes';     
import Footer from './components/Footer';       

function App() {
    const isAuthenticated = authMiddleware(['all']);
    React.useEffect(() => {
      if (isAuthenticated) {
      const refreshTokenInterval = setInterval(async () => {
        try {
          const response = await refreshToken();
          
          if (response.success) {
            localStorage.setItem('token', response.token);
          } else {
            alert(response.message);
          }
        } catch (error) {
          alert("La session a expiré, veuillez vous reconnecter");
        }
      }, 6000 * 1000);
      
      return () => clearInterval(refreshTokenInterval);
    }
    }, [isAuthenticated]);


  return (
    <BrowserRouter>
      <div className="app_container bg-custom-primary_color flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
