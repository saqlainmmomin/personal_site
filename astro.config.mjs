// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set to your custom domain when ready; used for canonical URLs, sitemap, OG.
const SITE = 'https://saqlainmomin.com';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  build: {
    // Single-page site: inline all CSS to remove the render-blocking request
    // and keep the critical path to one round trip for sub-1s LCP.
    inlineStylesheets: 'always',
  },
  compressHTML: true,
});
