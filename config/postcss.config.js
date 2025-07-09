// config/postcss.config.js
const path = require('path');
const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    tailwindcss(path.resolve(__dirname, 'tailwind.config.js')),
    autoprefixer,
  ],
};
