import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/demo/',
  server: {
    port: 3131,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'server/*.php',
          dest: '.'
        }
      ]
    })
  ]
});
