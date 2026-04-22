import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    // Verificar se há preferência salva no localStorage
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Verificar preferência do sistema operacional
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Salvar preferência no localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));

    // Isolar completamente do site principal
    document.body.classList.remove('dark-mode');

    // Aplicar atributo seguro de tema na raiz do documento html
    if (darkMode) {
      document.documentElement.setAttribute('data-vitalhub-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-vitalhub-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return { darkMode, toggleDarkMode };
}
