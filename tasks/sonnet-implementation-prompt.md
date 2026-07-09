# Prompt for fresh Claude session — implement site elevation plan

Copy everything below the line into a fresh Claude Code session in this repo.

---

Implement the website improvements documented in `tasks/site-elevation-plan.md`. Read that file first — it is the source of truth for scope and priority. This prompt adds execution rules and context.

## Context

This is my personal portfolio site (Astro 6, static output, deployed to Cloudflare Pages via wrangler). Single page composed of section components in `src/components/`, design tokens in `src/styles/tokens.css`, layout and SEO head in `src/layouts/Layout.astro`. The site has a deliberate editorial design language: Big Shoulders Display / serif / IBM Plex Mono type system, an Auditor↔Builder "dual reading" theme toggle driven by `src/lib/reading.ts`, and a scroll-driven divergence chart. A dev server config exists in `.claude/launch.json` (port 4327).

## Task

Work through the plan items in this order, committing after each one is verified:

1. **Item 1 (Retune overlay)** — dev-only guard in `src/layouts/Layout.astro`. After the fix, run `npm run build` and verify `dist/index.html` no longer references any `RetuneOverlay` bundle and no React runtime chunk ships.
2. **Item 2 (shorten path to work)** — hero CTA, tightened argument scrollytelling, curated Field Notes (best 4–6 by editorial judgment on `hook`/`thesis` strength, plus an "all 15 on LinkedIn →" link to my LinkedIn profile). Measure section offsets before and after via the preview (`document.getElementById('work').getBoundingClientRect().top + scrollY`) and report the numbers. Target: `#work` reachable within ~4 viewport heights on mobile.
3. **Item 4 (shareability/SEO)** — OG image, JSON-LD `sameAs` GitHub entry, wire `og:image`/`twitter:image` in `Layout.astro`. For the OG image: generate a 1200×630 static asset in the site's monolith style (dark background `#0c0e13` or the audit cream `#F0EBE3`, Big Shoulders Display type, name + role) — build it as SVG and rasterize to PNG, place in `public/og/`.
4. **Item 5 (hiring CTA)** — contact footer availability sentence + primary email button + CV link in nav/footer.
5. **Item 3 (proof/outcomes)** — ONLY the structural parts: add an outcomes/metrics slot to the `WorkRow` meta rendering and an impact-bullets block in `Who.astro`, filled with clearly marked `TODO(saqlain)` placeholder copy. Do the same for the photo (layout slot + placeholder). Do NOT invent numbers, client names, or testimonials.
6. **Smaller fixes** from the plan's final section (mobile nav hiding links, footnote renumbering 1–4, webp/`<picture>` for heavy images).

## Rules

- Preserve the design language exactly: existing tokens, type scale, scoped `<style>` blocks per component, vanilla TS `<script>` blocks (no new frameworks, no Tailwind, no new dependencies).
- Match the existing writing voice (short declarative sentences, no marketing fluff) for any copy you add. Keep new copy minimal — I will refine wording.
- NEVER fabricate factual claims: no invented metrics, outcomes, client names, quotes, or dates. Use `TODO(saqlain): ...` placeholders and collect every placeholder into a final "needs your input" list.
- Respect `prefers-reduced-motion` in anything you touch, as the existing components do.
- Touch only what each plan item requires. No refactors, no renames, no deploy.
- Do not modify or delete `tasks/site-elevation-plan.md`; check items off as you complete them.

## Verification (required per item)

Use the preview tools with the existing `site` launch config. After each item: reload, check console for errors, screenshot at desktop and mobile widths, and confirm the specific claim of that item (e.g. for item 1, the built `dist/index.html`; for the OG image, that the file exists at the referenced path and the meta tags render in built HTML). Run a final `npm run build` at the end to confirm the site builds clean.

## Done means

- All plan items implemented and individually verified, one commit each.
- Final summary: what changed per item, before/after scroll measurements for item 2, total JS shipped before/after for item 1, and the consolidated `TODO(saqlain)` list of content I need to supply (metrics, KPMG bullets, photo file, availability wording, OG image approval).
