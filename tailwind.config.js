// @ts-check
/* eslint-env node */

module.exports = {
  purge: ['./src/tester/index.html', './src/tester/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
};
