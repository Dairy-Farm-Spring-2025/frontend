import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: 'dist',
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@model': path.resolve(__dirname, 'src/model'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@service': path.resolve(__dirname, 'src/service'),
      '@common': path.resolve(__dirname, 'src/common'),
    },
  },
});
