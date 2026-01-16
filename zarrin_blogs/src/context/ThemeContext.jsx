import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * ZARRIN THEME CONTEXT
 * 
 * Manages light/dark mode state with localStorage persistence.
 * CSS variables are automatically updated via design-system.css
 * 
 * Usage:
 *   const { isDark, toggleTheme } = useTheme();
 */

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or system preference
    const saved = localStorage.getItem('zarrin-theme');
    if (saved === 'dark' || saved === 'light') {
      return saved === 'dark';
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    
    if (isDark) {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('zarrin-theme', 'dark');
      // Set color scheme for inputs
      document.documentElement.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('zarrin-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const setExplicitTheme = (isDarkTheme) => {
    setIsDark(isDarkTheme);
  };

  const value = {
    isDark,
    toggleTheme,
    setIsDark: setExplicitTheme,
    theme: isDark ? 'dark' : 'light',
    isLight: !isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
