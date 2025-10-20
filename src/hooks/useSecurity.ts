import React from 'react';
// import { SessionManager } from '../utils/security';

// Security hook for React components
export const useSecurity = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const checkAuth = () => {
      // const currentUser = SessionManager.getSession();
      setIsAuthenticated(false);
      setUser(null);
    };

    checkAuth();
    
    // Check authentication status periodically
    const interval = setInterval(checkAuth, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  const login = (userData: any) => {
    // SessionManager.createSession(userData);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    // SessionManager.clearSession();
    setIsAuthenticated(false);
    setUser(null);
  };

  const hasRole = (role: string) => {
    return user && user.role === role;
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    hasRole
  };
};
