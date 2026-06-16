// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set to your custom domain when ready; used for canonical URLs, sitemap, OG.
const SITE = 'https://saqlainmomin.com';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],

  build: {
    inlineStylesheets: 'always',
  },

  compressHTML: true,
});