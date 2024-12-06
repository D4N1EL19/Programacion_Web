/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/views/**/*.hbs',
    './src/public/**/*.{html, js}',
  ],
  theme: {
    extend: {
      colors: {
        customGradientStart: '#91D5C9',
        customGradientEnd: '#456361',
        lightButton: '#CAEBE2',
        hover: '#ABD3BB',
        darkTxt: '#709593',
      },
      fontFamily: {
        Cutive: ['Cutive', 'sans-serif'],
        Galada: ['Galada', 'sans-serif']
      }
    },
  },
  plugins: [],
}

