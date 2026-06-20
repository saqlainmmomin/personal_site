// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// Set to your custom domain when ready; used for canonical URLs, sitemap, OG.
const SITE = 'https://saqlainmomin.com';

export default defineConfig({
  site: SITE,
  integrations: [sitemap(), react()],

  build: {
    inlineStylesheets: 'always',
  },

  compressHTML: true,
});