import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  return payload.exp * 1000 > Date.now();
}

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Validar se o token ainda é válido no cookie
      const storedToken = localStorage.getItem('token');
      if (storedToken && isTokenValid(storedToken)) {
        setUsuario(userData);
      } else {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const loginContext = (userData, userToken) => {
    setUsuario(userData);
    localStorage.setItem('usuario', JSON.stringify(userData));
    if (userToken) {
      localStorage.setItem('token', userToken);
    }
  };

  const logoutContext = async () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    try {
      await api.post('/logout');
    } catch {
      // Ignorar erro - cookie pode já ter expirado
    }
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      loading,
      loginContext,
      logoutContext,
      authenticated: !!usuario
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
