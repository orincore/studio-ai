import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://studioapi.orincore.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
});