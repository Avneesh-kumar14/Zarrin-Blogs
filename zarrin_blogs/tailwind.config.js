
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        font1: 'Raleway,sans-serif',
        font2: 'Roboto,sans-serif',
        serif: 'Georgia,serif',
      },
      width:{
        'custom':'1232px',
      },
      height:{
        'custom-x':'576px',
      },
      maxWidth: {
        'reading': '65ch',
        'content': 'max-w-4xl',
      },
      colors: {
        /* ==================== PRIMARY COLORS ==================== */
        'primary': 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-hover': 'var(--color-primary-hover)',
        'on-primary': 'var(--color-on-primary)',
        
        /* ==================== SECONDARY COLORS ==================== */
        'secondary': 'var(--color-secondary)',
        'secondary-light': 'var(--color-secondary-light)',
        'secondary-dark': 'var(--color-secondary-dark)',
        'secondary-hover': 'var(--color-secondary-hover)',
        'on-secondary': 'var(--color-on-secondary)',
        
        /* ==================== ACCENT COLORS ==================== */
        'accent': 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        'accent-dark': 'var(--color-accent-dark)',
        'accent-hover': 'var(--color-accent-hover)',
        'on-accent': 'var(--color-on-accent)',
        
        /* ==================== SEMANTIC STATUS COLORS ==================== */
        'success': 'var(--color-success)',
        'success-light': 'var(--color-success-light)',
        'success-dark': 'var(--color-success-dark)',
        'success-hover': 'var(--color-success-hover)',
        'on-success': 'var(--color-on-success)',
        'success-bg': 'var(--color-success-bg)',
        
        'error': 'var(--color-error)',
        'error-light': 'var(--color-error-light)',
        'error-dark': 'var(--color-error-dark)',
        'error-hover': 'var(--color-error-hover)',
        'on-error': 'var(--color-on-error)',
        'error-bg': 'var(--color-error-bg)',
        
        'warning': 'var(--color-warning)',
        'warning-light': 'var(--color-warning-light)',
        'warning-dark': 'var(--color-warning-dark)',
        'warning-hover': 'var(--color-warning-hover)',
        'on-warning': 'var(--color-on-warning)',
        'warning-bg': 'var(--color-warning-bg)',
        
        'info': 'var(--color-info)',
        'info-light': 'var(--color-info-light)',
        'info-dark': 'var(--color-info-dark)',
        'info-hover': 'var(--color-info-hover)',
        'on-info': 'var(--color-on-info)',
        'info-bg': 'var(--color-info-bg)',
        
        /* ==================== NEUTRAL COLORS ==================== */
        'neutral': {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
        
        /* ==================== SURFACE COLORS ==================== */
        'surface-primary': 'var(--color-surface-primary)',
        'surface-secondary': 'var(--color-surface-secondary)',
        'surface-tertiary': 'var(--color-surface-tertiary)',
        'surface-hover': 'var(--color-surface-hover)',
        'surface-active': 'var(--color-surface-active)',
        
        /* ==================== TEXT COLORS ==================== */
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-inverse': 'var(--color-text-inverse)',
        'text-muted': 'var(--color-text-muted)',
        
        /* ==================== BORDER COLORS ==================== */
        'border-light': 'var(--color-border-light)',
        'border-default': 'var(--color-border-default)',
        'border-dark': 'var(--color-border-dark)',
        'border-accent': 'var(--color-border-accent)',
        
        /* ==================== INTERACTIVE STATE COLORS ==================== */
        'disabled-bg': 'var(--color-disabled-bg)',
        'disabled-text': 'var(--color-disabled-text)',
        'focus-ring': 'var(--color-focus-ring)',
      },
      lineHeight: {
        'custom-para': '24px',
        'custom-heading': '32px',
        'custom-heading-xl': '45px',
        'custom-heading-xxl': '84px',
        'relaxed-editorial': '1.8',
      },
      fontSize: {
        "custom-2xl":"86px",  
      },
      spacing:{
        'custom-3xl':'1232px',
        'custom-2xl':'796px',
        'custom-xl':'750px',
        'custom-lg':'610px',
        'custom-md':'530px',
        'custom-sm':'450px',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

