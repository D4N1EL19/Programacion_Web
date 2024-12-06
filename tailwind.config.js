/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/views/**/*.hbs',
    './public/**/*.html',
    './src/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        customGradientStart: '#91D5C9',
        customGradientEnd: '#456361',
      },
    },
  },
  plugins: [],
}

