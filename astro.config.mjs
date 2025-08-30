// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Site URL - replace with your actual domain
  site: 'https://YOUR_DOMAIN',

  // Enable integrations
  integrations: [
    tailwind(),  // Tailwind CSS integration
    sitemap()    // Sitemap generation
  ],

  // Build configuration
  build: {
    format: 'directory'  // Creates clean URLs without .html extension
  }
});
