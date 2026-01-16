import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

/**
 * DarkModeToggle Component
 * 
 * Professional dark mode toggle button that appears in navbar/header.
 * Uses lucide-react icons for sun/moon.
 */

const DarkModeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center p-2 rounded-sm
                   bg-bg-muted hover:bg-border-light text-text-primary
                   transition-all duration-200 focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-accent-primary
                   ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? (
        <Sun size={20} aria-hidden="true" />
      ) : (
        <Moon size={20} aria-hidden="true" />
      )}
    </button>
  );
};

export default DarkModeToggle;
