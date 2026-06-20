# Hero Redesign — Annotated Monolith (Concepts B+C Hybrid)

## Context for Claude

You're working on `~/personal-site`, an Astro 6 portfolio for Saqlain Momin. The site has a dual-reading system (auditor/builder) toggled by a shared `reading.ts` module that sets `<html data-reading="auditor|builder">`. A `ReadingOverlay.astro` handles crossfade transitions between modes.

**The task**: Replace the current `SocratesHero.astro` (a scroll-driven WebGL "Death of Socrates" prelude) and redesign `Lens.astro` (the name/identity hero) into a single, extraordinary hero section. Remove `SocratesHero` from `index.astro` and make the new Lens the first thing visitors see.

---

## The Design: "Annotated Monolith"

This is a hybrid of two concepts the user approved:

### Stage 1 — The Monolith (viewport arrival)
- The name **"Saqlain Momin"** fills the viewport at massive scale — think `clamp(72px, 12vw, 140px)` or larger. Centered or near-centered. Nothing else visible except the name and a barely-there mono label (`01 / arrival` or similar).
- No headline, no subtitle, no toggle, no credentials. Just the name. The confidence of saying nothing except your name IS the statement.
- The name's typography shifts with reading: auditor = serif (IBM Plex Serif), builder = sans (IBM Plex Sans).

### Stage 2 — The Annotation Layer (scroll-reveal OR timed reveal after ~1.5s)
- Below the monolith name, the full identity unfolds — but NOT as a standard text stack. It's an **annotated document**.
- The headline (`"I see risk at the enterprise level, and I build the tools to close the gaps I find."`) and sub-paragraph appear with **superscript footnote numbers** embedded in key words.
- A **margin column** (left side, ~180px) contains the footnote annotations. Hovering a superscript in the main text highlights and reveals its corresponding annotation in the margin.
- Footnotes are reading-specific: auditor footnotes reference certifications, frameworks, audit methodology. Builder footnotes reference tech stack, architecture decisions, tools.
- Below the annotated text: the auditor/builder toggle, and a thin footer line with key credentials.
- The reveal transition: the name scales down slightly and docks toward the top, the annotation layer slides up from below. Consider `position: sticky` on the name so it pins during the reveal scroll.

### Stage 3 — Handoff to next section
- The hero's bottom edge hands off cleanly into the ClosingWindow section (which uses `--win-bg: #07080b`). Use a gradient seam similar to the old Socrates seam, adapted to the new palette.

---

## Color Palette — NEW (replacing the existing tokens)

The user wants earth tones for auditor mode and dark moody tones for builder mode. Here are the exact palettes derived from the user's mood board:

### Auditor Register (earthy, warm, natural)
```css
--audit-bg:      #F0EBE3;   /* warm ivory — parchment feel */
--audit-bg-2:    #E6DFD3;   /* oatmeal — secondary surfaces */
--audit-fg:      #2C2420;   /* espresso — primary text */
--audit-dim:     #6B5E54;   /* cedar — secondary text */
--audit-accent:  #4C583E;   /* cypress green — accent, links, labels */
--audit-line:    #D4CCC0;   /* warm sand — borders */
```
Accent alternatives available: `#2C3424` (moss, darker), `#768064` (olive, softer), `#724B39` (coffee, warm).

### Builder Register (dark, atmospheric, warm metallics)
```css
--build-bg:      #0C1519;   /* chinese black — near-black with blue-green undertone */
--build-bg-2:    #162127;   /* dark jungle green — secondary surfaces */
--build-fg:      #E8DFD4;   /* warm cream — primary text (NOT cold white) */
--build-dim:     #8A7B6E;   /* weathered bronze — secondary text */
--build-accent:  #CF9D7B;   /* antique brass — accent, warm copper tone */
--build-line:    #1E2A30;   /* deep teal-charcoal — borders */
```
Accent alternatives: `#724B39` (coffee), `#B08D6A` (golden sand, more muted).

### Window Register (shared neutral dark — for ClosingWindow, Contact, etc.)
Keep `--win-bg: #07080b` but update accent from current cold blue/orange to warmer tones:
```css
--win-bg:    #07080b;
--win-fg:    #E8DFD4;     /* warm cream, matching builder fg */
--win-dim:   #6B5E54;     /* cedar */
--human:     #768064;     /* olive green — human line in chart */
--machine:   #CF9D7B;     /* antique brass — machine line in chart */
--gap-fill:  rgba(207, 157, 123, 0.10);
```

---

## Footnote Content

### Auditor Footnotes (shown when `data-reading="auditor"`)
1. **On "Saqlain"**: KPMG India, Cyber Strategy & Governance. Before this: compliance analysis, vendor risk, controls testing.
2. **On "Momin"**: B.Tech in Information Technology. MBA in Finance, NMIMS. The combination is deliberate — technology risk lives at the intersection of both.
3. **On "risk"**: Risk as in: the structural gap between what frameworks mandate and what organisations actually do. Compliance theatre vs. actual controls.
4. **On "enterprise level"**: ISO 27001, ISO 27701, ISO 22301 — Lead Auditor in all three. Not checkboxes. Each is a different way of asking: what happens when this fails?
5. **On "tools"**: CyberAssess: a multi-framework gap assessment platform. Six compliance frameworks, two-call Claude pipeline, deterministic scoring.
6. **On "gaps"**: The gap between human security cycles and machine-speed iteration. AI task autonomy doubling every 89 days. This is the divergence I track and build into.

### Builder Footnotes (shown when `data-reading="builder"`)
1. **On "Saqlain"**: `~/saqlain` — the home directory. Everything starts from here.
2. **On "Momin"**: NMIMS → KPMG → building solo. Each environment taught a different kind of discipline.
3. **On "risk"**: `scoring.py` — deterministic, server-side. Claude outputs qualitative strings, the code decides the number. Never let the model compute scores.
4. **On "enterprise level"**: 41 requirements across 6 chapters, defined as Python dicts. Version-controlled, embeddable in prompts, never stored in the database.
5. **On "tools"**: Python 3.13 · FastAPI · Anthropic SDK · SQLAlchemy · Jinja2 + HTMX · Swift · n8n. The model writes language; the code decides the number.
6. **On "gaps"**: `machinePath(progress)` — the exponential curve from ClosingWindow. Human security cycles are linear. The shaded area between them is where I work.

---

## Technical Constraints

- **Astro 6** — `.astro` components, no React/Vue. Client JS in `<script>` tags.
- **Zero UI framework** — no Tailwind, no CSS framework. Hand-written CSS with custom properties.
- **IBM Plex** font family already loaded: Serif (400/500/600), Sans (400/500/600), Mono (400/500/600).
- **Reading system**: `reading.ts` exports `getReading()`, `setReading()`, `onReading()`. Toggle sets `<html data-reading>`.
- **ReadingOverlay.astro** handles crossfade between modes (paints overlay with previous bg, fades to 0).
- **Nav** observes `#lens` with IntersectionObserver — it slides in when the hero scrolls out. Keep `id="lens"` on the hero section.
- **Reduced motion**: everything must degrade to a static layout under `prefers-reduced-motion: reduce`.
- **No-JS fallback**: all text content readable without JavaScript. Footnotes can degrade to a stacked list.
- **LCP target**: sub-1s. No heavy assets. The hero is pure typography + CSS.
- **ogl** is a dependency (used by the old Socrates hero). It can be removed if SocratesHero is fully deleted, but check if anything else imports it first.

## Files to Modify
- `src/pages/index.astro` — remove SocratesHero import/usage, Lens stays as first component
- `src/components/Lens.astro` — complete redesign (this is the hero)
- `src/styles/tokens.css` — update color variables to new earth-tone palette
- `src/components/SocratesHero.astro` — delete (or keep as reference)
- `src/lib/socrates-gl.ts` / `src/lib/socrates-shader.ts` — can be deleted
- `scripts/build-hero-assets.mjs` — can be deleted (was for Socrates image pipeline)
- `src/components/ClosingWindow.astro` — update chart colors if `--human`/`--machine` change
- `src/components/Nav.astro` — verify it still observes the right element

## Files to Read First (scaffolding)
- `src/styles/tokens.css` — current design tokens, font stacks, spacing scale
- `src/components/Lens.astro` — current hero (the starting point)
- `src/lib/reading.ts` — the reading toggle system
- `src/components/ReadingOverlay.astro` — crossfade overlay
- `src/components/ClosingWindow.astro` — the section that follows the hero (needs seam)
- `docs/hero-redesign-color-tokens.css` — the new palette ready to drop in

---

## Design References (in repo)

- `docs/hero-redesign-color-tokens.css` — new palette as CSS custom properties, ready to paste into `tokens.css`
- `Personal Website- claude design update/hero-layouts.jsx` — earlier layout explorations (React, for reference only)

---

## Quality Bar

This is a portfolio for a cybersecurity professional who also builds. The hero needs to feel:
- **Scholarly and precise** (the annotations, the footnote system)
- **Confident and restrained** (the monolith arrival — no noise, just the name)
- **Warm and grounded** (earth tones, not the cold tech-blue/clinical-white defaults)
- **Technically interesting** (the margin-annotation interaction, reading-specific footnotes)

Do NOT make it look like a SaaS landing page. Do NOT use gradients, glows, or decorative SVG. The beauty comes from typography, whitespace, and the interaction of hovering footnotes. Think editorial magazine, academic paper, rare book — not Dribbble portfolio.
