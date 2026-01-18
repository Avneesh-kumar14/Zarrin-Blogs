
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
        // Semantic Primary - Slate
        'primary': 'rgb(15 23 42 / <alpha-value>)',
        
        // Semantic Accent - Blue
        'accent': 'rgb(37 99 235 / <alpha-value>)',
        'accent-dark': 'rgb(29 78 188 / <alpha-value>)',
        
        // Semantic Success
        'success': 'rgb(22 163 74 / <alpha-value>)',
        
        // Semantic Warning
        'warning': 'rgb(217 119 6 / <alpha-value>)',
        
        // Semantic Error
        'error': 'rgb(220 38 38 / <alpha-value>)',
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
  plugins: [],
}

