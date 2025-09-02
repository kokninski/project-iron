// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  // Site URL - replace with your actual domain
  site: 'https://YOUR_DOMAIN',

  // Enable integrations
  integrations: [
    tailwind(), // Tailwind CSS integration
    sitemap(), // Sitemap generation
  ],

  // Build configuration
  build: {
    format: 'directory', // Creates clean URLs without .html extension
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true, // good default in WSL
      watch: {
        usePolling: true, // key for WSL if you ever touch files under /mnt/*
        interval: 300,
      },
      // hmr: { host: 'localhost' }, // usually not needed when you browse on the same machine
    },
  },
});
