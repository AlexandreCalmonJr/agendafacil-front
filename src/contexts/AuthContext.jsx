import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recuperar dados ao carregar
    const storedUser = localStorage.getItem('usuario');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUsuario(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const loginContext = (userData, userToken) => {
    setUsuario(userData);
    setToken(userToken);
    localStorage.setItem('usuario', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logoutContext = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      token, 
      loading, 
      loginContext, 
      logoutContext,
      authenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
