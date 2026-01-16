
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: '"Inter", "Segoe UI", sans-serif',
        display: '"Inter", "Segoe UI", sans-serif',
        mono: '"Fira Code", "Courier New", monospace',
      },
      colors: {
        // Light mode - Text
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        
        // Light mode - Backgrounds
        'bg-page': 'var(--color-bg-page)',
        'bg-surface': 'var(--color-bg-surface)',
        'bg-muted': 'var(--color-bg-muted)',
        
        // Accent Colors
        'accent-primary': 'var(--color-accent-primary)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-soft': 'var(--color-accent-soft)',
        
        // Borders
        'border-light': 'var(--color-border-light)',
        'border-muted': 'var(--color-border-muted)',
        
        // Semantic
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'error': 'var(--color-error)',
        
        // Legacy support
        primary: 'var(--color-accent-primary)',
        secondary: 'var(--color-text-secondary)',
        accent: 'var(--color-accent-primary)',
        'border-color': 'var(--color-border-light)',
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.25', fontWeight: '700' }],
        'h3': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['22px', { lineHeight: '1.35', fontWeight: '600' }],
        'h5': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'h6': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-base': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      lineHeight: {
        'reading': '1.6',
        'heading': '1.2',
        'custom-para': '1.6',
        'custom-heading': '1.25',
        'custom-heading-xl': '1.25',
        'custom-heading-xxl': '1.2',
      },
      maxWidth: {
        'article': '800px',
        'container': '1280px',
        'content': '1024px',
      },
      spacing: {
        // Legacy support
        'custom-3xl': '1232px',
        'custom-2xl': '796px',
        'custom-xl': '750px',
        'custom-lg': '610px',
        'custom-md': '530px',
        'custom-sm': '450px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'sm': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'md': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'lg': '0 20px 25px rgba(0, 0, 0, 0.12)',
        'focus': '0 0 0 3px rgba(37, 99, 235, 0.1)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },
    },
  },
  plugins: [],
}

