import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(() => {
  return {
    // GitHub Pages cần base path là tên repository
    base: process.env.NODE_ENV === 'production' ? '/lumi-lighting/' : '/',
    resolve: {
      alias: {
        '@': path.resolve(import.meta.url, '.'),
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      }
    }
  };
});
