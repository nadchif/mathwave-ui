/** @type {import('tailwindcss').Config} */
import palette from './src/styles/palette';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Titan One', 'sans-serif'],  // Replace with your custom font
      },
      colors: {
        gamePrimary: palette.primary,
        gameSecondary: palette.secondary,
        gameTertiary: palette.tertiary,
        gameAccent: palette.accent,
      }
    },
  },
  plugins: [],
}

