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

    // Aplicar classe ao body
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return { darkMode, toggleDarkMode };
}
