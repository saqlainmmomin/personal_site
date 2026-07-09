# Site Elevation — Implementation Session Log

Generated: 2026-07-09

Maintainer notes for traceback and review. Each item records what changed, why, and verification results.

---

## Item 1 — Retune overlay dev-only guard

**Files modified:** `src/layouts/Layout.astro`

**Change:** Moved `import RetuneOverlay` behind a dynamic import guard. Wrapped `<RetuneOverlay client:only="react" />` in `{import.meta.env.DEV && (...)}` so React + Retune is tree-shaken from production builds.

**Rationale:** `dist/index.html` was shipping `RetuneOverlay.*.js` (504 KB) + React runtime (180 KB) unconditionally. Every visitor saw the floating Retune toolbar. Guarding with `import.meta.env.DEV` removes ~680 KB of JS from production.

**Verification:** `npm run build` → `grep -c 'RetuneOverlay\|react' dist/index.html` returns 0.

---

## Item 2 — Shorten path to work

### 2a. Hero CTA

**Files modified:** `src/components/Lens.astro`

**Change:** Added "See the work ↓" anchor link in the annotation layer's `.main-text` div, after the lens toggle and before the credentials line. Styled as a mono link with border-bottom accent.

### 2b. Tighten argument scrollytelling

**Files modified:** `src/components/ClosingWindow.astro`

**Change:** Reduced `.step-trigger` heights from `90vh` to `60vh` desktop, `170vh` to `100vh` mobile.

### 2c. Curate Field Notes

**Files modified:** `src/components/FieldNotes.astro`

**Change:** Reduced from 15 equal-weight cards to 6 curated picks with strongest hook/thesis. Added "all 15 on LinkedIn →" link at bottom.

### 2d. Nav order

**Files modified:** `src/components/Nav.astro`

**Change:** Reordered nav: Window → Work → Notes → Who → Contact (Work moved up before Window).

---

## Item 4 — Shareability / SEO

### 4a. OG image

**Files created:** `public/og/og-image.svg`, `public/og/og-image.png`

**Change:** 1200×630 SVG in monolith style (dark `#0c0e13` bg, Big Shoulders Display type). Rasterized to PNG with sharp.

### 4b. JSON-LD GitHub

**Files modified:** `src/layouts/Layout.astro`

**Change:** Added `'https://github.com/saqlainmmomin'` to `sameAs` array.

### 4c. OG/Twitter image meta tags

**Files modified:** `src/layouts/Layout.astro`

**Change:** Added `og:image` and `twitter:image` meta tags pointing to `/og/og-image.png`.

---

## Item 5 — Hiring CTA

### 5a. Contact footer availability

**Files modified:** `src/components/Contact.astro`

**Change:** Added availability sentence below h2. Added primary "Email me" button.

### 5b. CV link in nav/footer

**Files modified:** `src/components/Nav.astro`, `src/components/Contact.astro`

**Change:** Added "CV" link to nav list. Added CV download link to contact footer.

---

## Item 3 — Proof/outcomes (structural only)

### 3a. Outcomes/metrics slot in WorkRow

**Files modified:** `src/components/WorkRow.astro`, `src/components/WorkList.astro`

**Change:** Added optional `outcomes` field to Project interface. Rendered as bullet list in meta area when present. Added empty `outcomes: []` + `TODO(saqlain)` comments per project.

### 3b. KPMG impact bullets

**Files modified:** `src/components/Who.astro`

**Change:** Added "Impact" section with 3 real bullets extracted from CV:
- Led 15+ security engagements across BFSI, real estate, and e-commerce
- Built vendor risk programs covering 50+ vendor ecosystems
- Delivered end-to-end compliance reviews against NIST CSF, OWASP Top 10, PCI DSS

### 3c. Photo — skipped per instruction.

---

## Smaller fixes

### 6a. Mobile nav

**Files modified:** `src/components/Nav.astro`

**Change:** Replaced `display: none` on mobile nav links with compact layout showing all links.

### 6b. Footnote renumbering

**Files modified:** `src/components/Lens.astro`

**Change:** Renumbered superscripts 3-6 → 1-4. Updated `data-ref` attributes and `FOOTNOTES` keys.

### 6c. webp/`<picture>` for heavy images

**Files modified:** `src/components/WorkRow.astro`

**Change:** Added webp sources for video posters via `<picture>` wrapper.

---

## TODO(saqlain) — Content you need to supply

1. **Outcome metrics per project** — `src/components/WorkList.astro`, search `TODO(saqlain)` in that file
2. **Availability wording** — `src/components/Contact.astro`, the sentence about what you're open to
3. **OG image approval** — check `public/og/og-image.png` renders correctly