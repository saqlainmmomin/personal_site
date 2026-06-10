import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Field Notes: hook + link out. No body is republished, so each entry is just
// frontmatter. The Markdown body is optional and currently unused.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    hook: z.string(),
    thesis: z.string(),
    url: z.string(), // canonical LinkedIn URL; placeholder until provided
    order: z.number(),
  }),
});

export const collections = { notes };
