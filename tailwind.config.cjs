/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'sahibinden-red': '#e60000',
      },
      spacing: {
        '18': '4.5rem',
      },
      height: {
        '45vh': '45vh',
      }
    },
  },
  plugins: [],
}

