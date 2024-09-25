/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#060d29',
        'navy-light': '#253248',
        turquoise: '#8bd2d7',
      },
    },
  },
  plugins: [],
};
