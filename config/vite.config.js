import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const rootPath = path.resolve(__dirname, '..');

export default defineConfig({
  root: path.join(rootPath, 'frontend'),
  build: {
    outDir: path.join(rootPath, 'dist'),
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.join(rootPath, 'frontend'),
    },
  },
});
