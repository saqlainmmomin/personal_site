# PORTFOLIO REDESIGN: "THE AUDIT FILE" (2026-10-23) — APPROVED 2026-10-23, IN PROGRESS

Decisions (Saqlain, 2026-10-23): Vite + React + TS + Tailwind; audit-file metaphor;
moderate cut (~40% less copy, every section kept); lanyard badge with his photo.
Research: Sonnet teardown of yashb.xyz / itspsneha.com / aarya.wtf / stanleyojima;
Sonnet stack research (Leon Sans, react-bits Lanyard + LogoLoop, Vite/shadcn/Vercel).

Constraints carried over: no invented metrics, client names, adoption or readiness claims
(Stanley-style stat rows only with real numbers: ISO ×3, since 2021, 4 builds, 7 notes).
Max ~60 words per screen. One signature interaction per section. Every piece of content
readable without interaction, without JS-driven reveals firing, and under reduced motion.

## Architecture
- New `web/` Vite 8 + React 19 + TS + Tailwind 4 app; `site-v2/` stays until cutover.
- Keep the current type system (Instrument Serif + Inter + JetBrains Mono, self-hosted) and
  the ink/paper/orange palette, reworked as audit-file tokens (manila, ink, stamp red/orange).
- Leon Sans vendored at `src/vendor/leon.js` (MIT header kept, `export default` appended).
- Lanyard + LogoLoop via shadcn `@react-bits` registry (plain three.js, no GLB assets).
  three.js lazy-loaded after first paint, desktop only; mobile/no-WebGL = static badge PNG.
- One scroll utility (IntersectionObserver + rAF), no GSAP/Lenis unless a section needs it.
- vercel.json: output `web/dist`, hashed `/assets/*` immutable cache, headers kept.

## Sections
0. Chrome — file-index tab nav ("01 · ENGAGEMENTS" mono tabs), active tab slides.
1. Hero / cover sheet — Leon Sans "Saqlain Momin" draws in, then idles in wave mode; real
   sr-only <h1>. One-line claim ("I turn security evidence into decisions.") + 3 proof
   lines. Physics lanyard badge: photo, Assistant Manager · Cyber Strategy & Governance,
   KPMG, 5+ yrs (since 2021), ISO Lead Auditor ×3, "Open to GRC roles" status; back = CV QR.
   LogoLoop of frameworks (ISO 27001/27701/22301, NIST CSF, DPDPA, PCI DSS, OWASP, SOC 2).
2. Statement — "Controls matter when they change a decision…" grey→ink word reveal on scroll.
3. Engagements / case files — 4 manila folders in a CSS sticky stack; each: doc ID, NDA
   stamp that thumps in, Mandate / Owned / Result in ≤45 words, tag chips. KPMG + Mitkat as
   a 2-row personnel record above.
4. Yozora / evidence trail — one SVG path drawn on scroll through Scope → Assess → Approve →
   Act nodes; each node pins a one-line claim. "AI proposes · consultant approves" shown as
   two record cards (draft vs. signed). Demo video + GitHub kept; skip link past the trail.
5. Other builds — Recon / Velocity / RL Playground as evidence exhibits (tag "EXHIBIT B-02"),
   poster → video on hover/tap, existing demo dialogs reused.
6. Credentials — 3 embossed ISO seals (tilt + foil sheen on hover) + 2 degrees as a ledger;
   capability groups compressed to one line each under the seals.
7. Field notes — featured note as a declassified report; 6 others as a redacted index where
   black bars lift on hover/focus (always readable on touch and reduced motion).
8. Contact / sign-off — "Let us make risk operable." signature line that draws itself;
   email as the primary stamp button, LinkedIn/GitHub/CV secondary; footer.

## Phases (each ends with a smoke check run by a Sonnet subagent)
- [x] P1 Scaffold `web/`, port assets, tokens, fonts, vercel.json; build passes
      (verified 2026-10-23: npm ci + build, dist assets 14/14 img, 4 fonts, headers, no
      overflow 390/1440, fonts load, legacy npm test passes with new deploy target)
- [x] P2 Hero: Leon Sans name, Lanyard badge (+ static fallback), LogoLoop
      (Sonnet smoke 8/8 pass; then: weight 220, full-hero badge canvas, tuned metallic finish)
- [x] P3 Statement + engagements case files
      (Sonnet smoke: fixed AA contrast on manila, mobile stamp overlap, tab overlap, SR spacing;
      copy rewritten from the evidence map, scope section folded into a tenure-ruler personnel record)
- [x] P4 Yozora evidence trail + other builds (port demo dialogs)
      (Sonnet smoke: all pass after small orange labels moved to accent-dark for AA)
- [x] P5 Credentials seals + field notes redaction index + contact
      (2026-10-23: trail copy decluttered; seals, ledger, declassified featured note, redaction index,
      signature + stamp contact, footer; verified at 1280 and 375 in the pane; Sonnet smoke below)
- [~] P6 (nav menu + active indicator and `web/smoke-test.mjs` done, wired into `npm test` beside
      the legacy test; cutover awaiting Saqlain's approval) Port smoke test to the new build (assets, anchors, dialogs, no overflow 390/1440,
      reduced motion, console clean, Lighthouse perf on mobile); cutover; remove site-v2

## Open items
- Portrait for the badge (≥800px short side, plain background).
- Repo is PUBLIC: react-bits is MIT + Commons Clause; shipping it on the site is fine, the
  source sitting in a public repo is a grey area. Options: make repo private, or accept.
- Branch: build on a new branch off codex/yozora-portfolio-preview (keeps Yozora copy).

---

# LOCAL PORTFOLIO / YOZORA PREVIEW (2026-10-09)

Scope: local preview only; retain the current visual identity, existing demo video,
and published August writing. Native implementation on codex/yozora-portfolio-preview.
No invented engagement metrics, customer adoption, or product readiness claims.

- [x] Reconcile published site with origin/main and read current Yozora direction
- [x] Sharpen hero and shorten experience introductions
- [x] Present Yozora workflow and an expandable case study with current product direction
- [x] Condense capabilities and connect writing to governance practice
- [x] Run smoke checks, review diff, and verify desktop/mobile preview and demo
- [x] Open the local preview for Saqlain

Verification: existing structural/asset/interaction smoke suite plus browser checks.
Content and styling changes use visual verification; no new runtime behavior planned.
Yozora sources: dpdpa-gap-tool/docs/product/2026-09-21-cyberassess-product-requirements.md,
yozora-design-system.md (approved 2026-10-03), and current tasks/todo.md.

Verified: npm test (HTML/CSS/JS parsing, 18 assets, 10 images, seven demo triggers),
git diff --check, responsive layout at 1440px and 390px with no horizontal overflow,
all internal anchors resolve, keyboard disclosure, mobile navigation, old video playback,
Yozora dialog title, media cleanup and focus return. Browser console: no warnings/errors.
Simplification: three independent passes; fixed heading contamination of the dialog title.
Code review: complete (lite), no remaining actionable findings; receipt at
/tmp/personal-site-yozora-review/review.json. No lint/typecheck command configured.
Local preview: http://localhost:4173/. Saqlain approved committing and pushing this preview on 2026-10-09.

---

# SITE-V2 CURSOR + CONTACT INTERACTION FIX (2026-07-16)

- [x] Restore cursor contrast across orange and light backdrops with difference blending
- [x] Replace the contact-link background/padding transition with a transform-based highlight sweep
- [x] Preserve keyboard-focus parity and reduced-motion behavior
- [x] Add regression assertions and verify the interactions in a real browser

Verification: `npm test`, HTML/CSS/JavaScript parsing, `git diff --check`, live cursor
contrast over the orange contact highlight, completed focus-state transforms, and a clean console.

---

# SITE-V2 FINAL INTERACTION POLISH (2026-07-14)

Assumptions: keep the desktop navigation available while scrolling, but give it an opaque
scrolled state; dismiss the hero availability status as soon as scrolling begins; keep the
particle field ambient across the site, with stronger hero contrast and quieter body contrast.

- [x] Add smoke-test coverage for the global particle field, scrolled chrome, text-only CyberAssess card, and corrected Field Note URL
- [x] Implement site-wide cursor particles with hero/body prominence states and reduced-motion safeguards
- [x] Add scroll-safe navigation treatment and dismiss the availability status on scroll
- [x] Remove the CyberAssess poster trigger while retaining its accessible View demo dialog flow
- [x] Update the featured Field Note LinkedIn link
- [x] Run automated checks and verify desktop/mobile interactions in a browser

Verification: `npm test`, inline HTML/CSS/JavaScript parsing, `git diff --check`, and live
browser checks at 1440px and 390px. Confirmed scroll-state chrome, hero/body particle contrast,
no horizontal overflow, the text-only CyberAssess layout, demo open/close cleanup and focus
return, mobile navigation, the corrected LinkedIn href, and a clean browser console.

---

# SITE-V2 POLISH IMPLEMENTATION (2026-07-14)

Locked decisions: 7/5 evidence-rail hero; exact title "Assistant Manager, Cyber Strategy & Governance";
anonymized outcome-led cases without recycled 15+/50+ counts; merged KPMG/Mitkat experience;
CyberAssess flagship plus accessible demo modal; grouped capability taxonomy; one featured Field Note;
retain cursor and particles with subtler, accessible behavior; target GRC/cyber-risk/security-assurance roles.

- [x] Rebuild hero, navigation, status and spacing system
- [x] Merge About + Engagements into experience timeline and four evidence-led cases
- [x] Rebuild project hierarchy and accessible media dialog
- [x] Replace practice chips with grouped capabilities and feature one Field Note
- [x] Restore SEO/progressive-enhancement/reduced-motion/accessibility plumbing
- [x] Verify assets, markup, responsive layout and interactions; review and simplify diff

Verification: `npm test`, script syntax, `git diff --check`, and live browser checks at 1440px,
1200px, and 390px. Confirmed hero balance, no horizontal overflow, mobile menu state, project
dialog isolation/cleanup/focus return, equal adjacent-card heights, Field Note imagery, hero-only
status visibility, and a clean browser console.

---

# SITE-V2 DESIGN/CONTENT AUDIT (2026-07-14)

- [x] Read the v2 implementation notes, elevation plan, and vault operating rules
- [x] Inspect the supplied desktop render and responsive/interaction code, including project demo expansion
- [x] Audit current KPMG, practice-area, selected-work, and field-note content in source
- [x] Review recent Job Search roles and map recurring recruiter expectations to portfolio evidence
- [x] Deliver a prioritized design/content polish brief; no site edits in this pass

---

# SITE-V2 PIVOT (2026-07-14) — everything below is the superseded Astro plan

The Claude-designed single-file site (`site-v2/index.html`, live at saqlainswebsite.vercel.app)
replaces the Astro scrollytelling build. Refined this session: name fixed (Momin), hero = name +
"GRC Professional", engagements = 5 NDA-safe capability lines (TPRM / ISO impl+audit / CMA / BCMS /
risk & monitoring), no recycled 15+/50+ metrics, demos behind View-demo toggles, Writing section
(6 field notes → LinkedIn), real contacts + CV.

- [x] Saqlain confirmed exact public title: "Assistant Manager, Cyber Strategy & Governance"
- [x] Demo dialog, media lifecycle, mobile navigation, and responsive layout verified in a real browser
- [ ] Saqlain: commit and push; keep Vercel Root Directory at repository root so root `vercel.json` serves `site-v2`
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
