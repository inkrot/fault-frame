import { defineConfig } from 'vite';

export default defineConfig({
  base: '/demo/',
  server: {
    port: 3131,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});
