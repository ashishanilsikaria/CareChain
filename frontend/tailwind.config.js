/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0284c7',
          dark: '#0369a1',
          light: '#38bdf8',
        },
        accent: {
          DEFAULT: '#10b981',
          purple: '#8b5cf6',
        },
      },
    },
  },
  plugins: [],
};
