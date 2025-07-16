// config/postcss.config.js (ESM format for Vite 5+ and Node 24+)

import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
}

