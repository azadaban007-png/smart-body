/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f6f5',
          100: '#e9e9e7',
          200: '#d3d3cf',
          300: '#b0b0aa',
          400: '#888880',
          500: '#6b6b62',
          600: '#54544c',
          700: '#44443d',
          800: '#2c2c27',
          900: '#1a1a17',
          950: '#0f0f0d',
        },
      },
    },
  },
  plugins: [],
};
