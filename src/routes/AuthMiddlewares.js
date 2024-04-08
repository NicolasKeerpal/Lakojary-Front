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
      alert('La session a expiré');
      return false;
    }
    
  } catch (error) {
    return false;
  }
  return true;
};
