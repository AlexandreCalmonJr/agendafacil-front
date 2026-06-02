import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { logoutApi } from '../services/api';

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
    // Recuperar dados ao carregar
    const storedUser = localStorage.getItem('usuario');

    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginContext = (userData) => {
    setUsuario(userData);
    localStorage.setItem('usuario', JSON.stringify(userData));
  };

  const logoutContext = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Erro ao efetuar logout no servidor:', err);
    } finally {
      setUsuario(null);
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
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
