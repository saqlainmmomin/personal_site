# Personal site

Saqlain Momin. Cyber strategy and governance, and security tooling. Built with Astro, static, zero framework runtime.

Two mechanics: **The Lens** (dual-readable identity and projects, Builder vs Auditor) and **The Closing Window** (a scroll-driven argument). See `DESIGN.md` for the full system and `CONTENT.md` for copy.

## Develop

```
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview  # serve the build locally
```

## Deploy

Static output. On **Vercel**: import the repo, framework preset auto-detects Astro, build command `npm run build`, output `dist`. No adapter or serverless functions needed. Netlify works the same way (publish directory `dist`).

Set the production domain in `astro.config.mjs` (`SITE`) so canonical URLs, the sitemap, and Open Graph resolve correctly.

## Before launch: fill these in

Placeholders are marked in source and in `CONTENT.md`. Search for `URL-NEEDED` and `PLACEHOLDER`.

Done:
- [x] **LinkedIn**: wired in `Contact.astro` and `sameAs` in `Layout.astro` (linkedin.com/in/saqlain-musa).
- [x] **Field Notes**: 7 real articles with live LinkedIn URLs in `src/content/notes/`.
- [x] **CV PDF**: `public/cv.pdf` generated from the master CV `~/Desktop/cv_saqlain.html`.

Still needed:
1. **GitHub URL**: `src/components/Contact.astro` and `sameAs` in `src/layouts/Layout.astro` (still `#URL-NEEDED`).
2. **Per-project links**: `link:` in `src/components/WorkList.astro` (currently `null`, which renders a neutral "case study" marker). Set `{ label, href }` for any project that should link to a repo or live demo.
3. **Outside the work**: replace the `[PLACEHOLDER]` strands in `src/components/Outside.astro` (reading, what I'm chasing, off the clock).
4. **Domain**: set `SITE` in `astro.config.mjs`.
5. **Decide**: Who-section title vs CV title (Cyber Strategy & Governance vs Cybersecurity); whether the publicly-downloadable CV should name KPMG and include the phone number.

Field Notes left out of the curated 7 (re-add by dropping a `.md` in `src/content/notes/` if wanted): the AI-workflow posts (Claude agents / "everything is a context problem" / Claude Skills), the "Ghost and the Dish" biotech piece, the Dario Amodei interview, the DeepMind "five principles" follow-up, and the Mythos "malware factory" post (overlaps the kept vulnerability-discovery note).

## Notes

- Fonts are self-hosted in `public/fonts` (Source Serif 4, JetBrains Mono, latin woff2) and the Auditor face is preloaded.
- Both interactions degrade: the Lens becomes a toggle on touch/narrow screens; the Closing Window renders its final state with all captions and final figures when JS is off or `prefers-reduced-motion` is set.
