/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#722129',
          dark: '#5a1920',
          light: '#8a333c',
        },
        secondary: {
          DEFAULT: '#c9a84c',
          dark: '#b8933d',
          light: '#d4b85e',
        },
        burgundy: '#8F2D3A',
        charcoal: '#2d3436',
        'warm-gray': '#636e72',
        ivory: '#f8f6f0',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
