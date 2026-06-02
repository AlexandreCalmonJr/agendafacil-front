import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.remove('dark-mode');

    if (darkMode) {
      document.documentElement.setAttribute('data-vitalhub-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-vitalhub-theme', 'light');
    }

    return () => {
      document.documentElement.removeAttribute('data-vitalhub-theme');
    };
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return { darkMode, toggleDarkMode };
}
