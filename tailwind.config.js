/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
    "./styles/**/*.{css}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: '#111111', // Deep Black
        secondary: '#F3F4F6', // Soft Gray
        accent: '#D4AF37', // Gold
        purified: '#FFFFFF', // Pure White
      },
      screens: {
        'xs': '375px',
      },
      borderRadius: {
        'none': '0px',
      }
    },
  },
  plugins: [],
};
