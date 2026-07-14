# SITE-V2 PIVOT (2026-07-14) — everything below is the superseded Astro plan

The Claude-designed single-file site (`site-v2/index.html`, live at saqlainswebsite.vercel.app)
replaces the Astro scrollytelling build. Refined this session: name fixed (Momin), hero = name +
"GRC Professional", engagements = 5 NDA-safe capability lines (TPRM / ISO impl+audit / CMA / BCMS /
risk & monitoring), no recycled 15+/50+ metrics, demos behind View-demo toggles, Writing section
(6 field notes → LinkedIn), real contacts + CV.

- [ ] Saqlain: confirm KPMG title wording ("Cyber Strategy & Governance" vs CV's "Assistant Manager, Cybersecurity")
- [ ] Saqlain: eyeball demo toggles + videos in a real browser (embedded pane suspends video)
- [ ] Commit site-v2/ and point the Vercel project's root directory at `site-v2`
- [ ] Decide fate of the Astro build (src/) once v2 is confirmed live

---

# Personal site - build plan

## Phase 0 - Decisions (in progress)
- [x] Round 1: tone (professional with edge), default lens (Auditor first), lens scope (hero + cards), visual system (dual treatment confirmed)
- [x] Round 2: stack (Astro + Vercel), employer ("a Big Four firm"), demo links (mixed per project), articles (hook + link out)
- [x] Round 3: photo (text-only), CV PDF (include), figures (publish as written), v1 scope (full IA)
- [x] Type + palette: Direction 1 "Ledger" (JetBrains Mono / Source Serif 4, teal+blue, amber machine)
- [x] Window section palette: dark builder palette, blue human / amber machine
- [ ] Free-text inputs (needed for Phase 2, not blocking DESIGN): LinkedIn URL, GitHub URL, 5 article URLs, per-project repo/demo map, domain, CV PDF source

## Phase 1 - DESIGN.md
- [x] Visual system, type scale, spacing, grid
- [x] Lens interaction model + a11y/keyboard/reduced-motion fallback
- [x] Closing Window scroll viz + a11y/reduced-motion fallback
- [x] Responsive behavior, component inventory
- [x] Added "Outside the work" section per user request
- [~] Sign-off: approved with the Outside-the-work addition

## Phase 2 - Build (Astro) - DONE
- [x] Scaffold, self-hosted fonts, tokens
- [x] Hero/Lens (drag + keyboard slider + toggle, auditor-first, hint, mobile crossfade)
- [x] Closing Window (sticky chart, count-up, SSR/no-JS/reduced-motion static fallback)
- [x] Work rows (dual-readable, shared reading state, register swap)
- [x] Field Notes, Who (Big Four, CV), Outside (placeholders), Contact
- [x] Verified in browser: no console errors, screenshots of all sections + all lens states + mobile
- [x] Reduced-motion/no-JS fallback verified complete in built HTML
- [x] Build clean: ~4.6KB JS, CSS inlined, font preload, JSON-LD, sitemap, robots
- [x] Deploy prep: README, .gitignore, Vercel-ready static output

## Still needs user input before launch (see README)
- [ ] LinkedIn + GitHub URLs; 5 article URLs; per-project link map; real CV pdf; Outside copy; domain

## Ground rules
No em dashes. No emojis. No LinkedIn cliches. Bold sparingly. Every decision needs a reason.
Accessibility, sub-1s LCP, SEO, mobile-first.

---

# Socrates Hero (scroll-driven prelude) — Build Checklist
Full proposal: `tasks/socrates-hero-proposal.md`. Decisions locked 2026-06-10:
prelude above Lens / WebGL fragment shader / ogl allowed / images generated externally.

## Phase 0 — setup
- [x] Decisions locked
- [x] Install `ogl` (1.0.11, ~8KB)
- [x] Generate placeholder stills + Bayer matrix -> `public/img/` (`scripts/gen-placeholders.mjs`)

## Phase 1 — scroll scaffold
- [x] `SocratesHero.astro`: sticky pinned stage (ClosingWindow mechanic), 480vh track
- [x] Static `<img final-dither>` fallback (reduced-motion / no-JS / no-WebGL) + a11y text equivalent
- [x] Scroll progress 0..1 via getBoundingClientRect + rAF, IO-gated render loop
- [x] Mount above `<Lens />` in index.astro

## Phase 2 — WebGL layer
- [x] `src/lib/socrates-gl.ts`: ogl renderer, fullscreen Triangle, capability detect -> null fallback
- [x] `src/lib/socrates-shader.ts`: GLSL fragment shader (uProgress, uTexA/uTexB, uBayer)
- [x] Wire scroll progress -> uProgress; dpr-correct sizing via ResizeObserver

## Phase 3 — shader scenes (all verified in browser)
- [x] zoom + contrast/levels; halftone + Bayer dither + scanlines + bloom + vignette; A->B crossfade + chalice fade; settle to blurred dither dots + human/machine tint

## Phase 4 — identity handoff
- [x] Mono kicker (fades in at end); scroll resolves into Lens hero (kept single <h1> in Lens)
- [x] Nav reveal still works over the prelude
- [x] Seam softened: reading-aware gradient band (win-bg -> audit/build bg) between prelude and Lens

## Phase 5/6 — overlays + hardening
- [x] CSS grain layer; mobile tuning (360vh track, full-width captions, kicker hidden)
- [x] Reduced-motion / no-JS / no-WebGL static fallback verified in built HTML
- [x] Build clean; SocratesHero island 16.6KB gz; mobile sizing fixed (ResizeObserver)
- [x] LCP poster: blurred Scene-1, <picture> avif(1.5KB)>webp(3KB)>png, fetchpriority high
- [x] WebP-first texture loading with png fallback
- [x] preserveDrawingBuffer:true (reliable compositing/capture, negligible for 1 quad)
- [x] Caption container width bug fixed (was 0 -> per-word wrap)
- [ ] OPTIONAL still: formal LCP measurement (throttled mobile); dust particles; AVIF for the 2 large textures

## REAL ASSETS LANDED (2026-06-10)
- Real monochrome stills in public/img/ (socrates-full, hands-adam) + poster + avif/webp/png variants.
- An image watcher on the machine auto-regenerates format variants; gen-placeholders.mjs now guards
  against overwriting real stills (REAL flag), so it is safe to run.
- Shader tuned to real art: push in to the chalice (Scenes 1-3) then PULL BACK for the full two-hands
  reach (Scenes 4-5); focal vec2(0.5,0.46) on the chalice/gap.

## Handoff to user
- Replace only 2 placeholder stills in `public/img/` (prompts: proposal §5, grounded in R1-R4 refs):
  `socrates-full.png` (use R3 as img2img/style base) + `hands-adam.png`. Keep filenames or update
  paths in `src/lib/socrates-gl.ts` + the fallback `<img>` in `SocratesHero.astro`.
- `final-dither.png` (static/LCP fallback) is DERIVED, not generated: scroll to progress=1 and capture
  the shader canvas (`canvas.toDataURL('image/png')`) so the fallback exactly matches shipped output.
- Framing: keep the chalice (socrates-full) and the gap (hands-adam) near image center, or give me the
  cup's normalized x/y and I'll set the zoom focal in `socrates-shader.ts`.
- webp available via `cwebp` (no avifenc/ImageMagick) for the later `<picture>` optimization.

---

# Project Screenshots — "proof, not a text box" (2026-06-16)

Goal: give each of the 4 work rows real visual proof. Mix: clean screenshots + annotated
callouts where they add signal + GIFs for the RL sims. Dual-reading aware (auditor/builder).
Pipeline: capture PNG → AVIF/WebP/PNG (cwebp + existing watcher) → `public/img/projects/` →
`<figure>` in WorkRow.astro, lazy-loaded, themed to palette, below the fold (LCP safe).

## Decisions locked
- [x] Project #2 = Recon. Repo renamed cyberdd → github.com/saqlainmmomin/Recon. Site link fixed.
- [x] Style: clean SS + annotated callouts + GIFs for RL.

## Per-project capture
### 1. CyberAssess (LEAD) — ~/dpdpa-gap-tool — FastAPI+HTMX ✅ local
- [ ] Boot + seed (Meridian / Helix / Vantara fixtures)
- [ ] AUDITOR: board-ready PDF gap report page (severity + answer-source pills) — annotated
- [ ] BUILDER: adaptive questionnaire w/ tier badges (deep/standard/quick-confirm)
### 2. Recon (LEAD) — github/Recon — clone needed
- [ ] Clone + run; check scanner API keys
- [ ] 60-second scan result: 6 scanner panels + red-flag verdict — annotated
### 3. RL · game theory — github/Prisoners_dilemma (+ Usain-Bot) — clone needed
- [ ] Clone + run
- [ ] GIF: interactive prisoner's-dilemma sim; optional GIF: snake agent
### 4. Velocity — ~/Velocity — React+Express ✅ local
- [ ] Boot (Gemini key? UI should render from SQLite)
- [ ] "Mission Control" dashboard — scored developments w/ opportunity/disruption/gap badges

## Wire-up
- [ ] Extend `Project` type with `image` (+ optional builder variant) + `caption`
- [ ] Render `<figure>` in WorkRow.astro, palette-themed, lazy, AVIF+fallback
- [ ] Verify in preview (mobile + reduced-motion); commit
