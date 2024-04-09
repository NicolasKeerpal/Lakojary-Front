import { jwtDecode } from 'jwt-decode';

export const authMiddleware = (allowedRoles) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);

    //Verify role
    if (allowedRoles[0]!='all') {
        if (!allowedRoles.includes(decodedToken.role)) {
            return false;
        }
    }

    //Verify token expiration
    const tokenExpiration = decodedToken.exp;
    const currentTime = Date.now() / 1000;
    if (tokenExpiration < currentTime) {
      alert('La session a expiré, veuillez vous reconnecter');
      localStorage.removeItem('token');
      window.location.reload();
      return false;
    }
    
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
  return true;
};
