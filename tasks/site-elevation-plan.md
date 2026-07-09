# Site Elevation Plan — 5 improvements (review from 2026-07-07)

Context: full review of the site (code + rendered preview, desktop and mobile).
Goal: visitor should understand what Saqlain does fast, be impressed, and be
more inclined to hire him. Design language (editorial type, Auditor/Builder
dual reading, divergence chart) is a strength — keep it.

## 1. Remove the Retune dev overlay from production (bug — do first)

`src/layouts/Layout.astro` renders `<RetuneOverlay client:only="react" />`
unconditionally. Confirmed in `dist/index.html`: the production build ships
`RetuneOverlay.*.js` (504 KB) plus the React runtime (`client.*.js`, 180 KB).
Every visitor — including on mobile — sees the floating Retune editing toolbar
pinned to the bottom of the viewport (visible in every screenshot taken).

Fix: only render it in dev, e.g. guard with `import.meta.env.DEV` in the
layout frontmatter so the component (and React) is tree-shaken out of prod.
This removes ~680 KB of JS from an otherwise ~50 KB-JS site and instantly
looks more professional.

## 2. Shorten the path to the work (structure / experience)

Measured on mobile: total page height 22,171 px; `#work` starts at 9,452 px —
~12 full screens of hero + "window is closing" scrollytelling before the first
project. On desktop it's ~10 screens. A recruiter gives the site 30–60 s.

- Add a CTA in the hero (Stage 2 annotation layer): "See the work ↓" anchor to
  `#work`, next to the lens toggle. Currently the hero has zero links.
- Tighten the argument section: 4 scroll steps + 3 stat cards is ~8,000 px of
  pinned scroll. Cut to ~3 beats or reduce the scroll distance per step;
  consider moving the stats row into the same pinned scene.
- Curate Field Notes: 15 equal-weight cards ≈ 6,000 px. Show the best 4–6 with
  a "all 15 on LinkedIn →" link. (Keep the section header thesis — it's good.)
- Consider nav order mirroring priority: Work before Window.

Target: work visible within ~3–4 screens; total page ≤ ~60% of current length.

## 3. Add proof, outcomes, and a human face (content / credibility)

Right now projects describe architecture beautifully but claim no outcomes,
and the site has no photo, no testimonials, and no KPMG impact detail.

- Per project, add 1–3 outcome/scale numbers to the meta line or body
  (e.g. assessment time vs. manual baseline, frameworks covered, scan time,
  LOC/tests, anything honest and concrete).
- Give CyberAssess (flagship) a deeper treatment: either a short case-study
  page or an expandable section — problem → design decisions → what an
  auditor gets → demo video. GitHub link alone undersells it.
- "Who" section: add 2–3 impact bullets from the KPMG years (clients served,
  audits led, programs designed) — the facts table is titles only.
- Add a photo (hero margin or Who section). Hiring is human; zero photos on a
  personal site lowers trust.
- Optional: 1–2 short quotes from colleagues/clients if obtainable.

## 4. Fix shareability + SEO plumbing

- No `og:image` / `twitter:image` despite `twitter:card summary_large_image`
  (confirmed missing in `dist/index.html`). LinkedIn is the primary channel
  (15 articles) — shares currently render as a bare text card. Design a
  branded 1200×630 OG image in the site's monolith style and wire it in
  `Layout.astro`.
- `https://saqlainmomin.com` did not resolve when checked (curl timeout).
  Verify the Cloudflare custom-domain hookup / DNS; canonical URLs and
  sitemap all point there.
- Add GitHub (`https://github.com/saqlainmmomin`) to `sameAs` in the JSON-LD
  (comment says "still pending").
- Longer-term: host field-note summaries on-site (content collection already
  exists) with canonical pages, so search traffic lands on the site rather
  than LinkedIn.

## 5. Sharpen the hiring CTA (conversion)

- Contact footer has a poetic line + three links but never says what he's
  open to. Add one plain sentence, e.g. "Open to senior GRC / security
  engineering roles and advisory work" + a primary "Email me" button styled
  like the accent links.
- Surface "Download CV" in the nav or contact footer, not only buried in Who.
- Optional: calendar link (cal.com) for a 20-min intro call.

## Smaller fixes (bundle into the same session)

- `Nav.astro` hides the Notes and Who links on mobile
  (`li:nth-child(3), li:nth-child(4) { display: none }`) — use a compact
  menu instead of dropping sections.
- Hero footnote superscripts number 3–6 with no 1–2 anywhere — looks like a
  bug to readers; renumber 1–4.
- `velocity-dashboard-crop.png` is 585 KB and a 24 KB webp sits next to it —
  verify WorkRow serves the webp via `<picture>`; do the same for the video
  posters (PNG → webp/avif).
- OG description/title are solid; keep.
