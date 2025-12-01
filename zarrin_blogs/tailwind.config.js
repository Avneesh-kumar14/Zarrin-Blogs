
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
        font2: 'Roboto , sans-serif',
      },
      width:{
        'custom':'1232px',
      },
      height:{
        'custom-x':'576px',
      },
      colors: {
        primary: 'var(--color-primary)',
        dark: 'var(--color-dark)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        secondaryGray: 'var(--color-secondaryGray)',
      },
      lineHeight: {
        'custom-para': '24px',
        'custom-heading': '32px',
        'custom-heading-xl': '45px',
        'custom-heading-xxl': '84px',
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

