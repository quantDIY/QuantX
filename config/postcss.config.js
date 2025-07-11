// config/postcss.config.js
const autoprefixer = require('autoprefixer');
const tailwindcss = require('@tailwindcss/postcss');

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
};

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}