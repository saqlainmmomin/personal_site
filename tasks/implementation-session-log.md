# Site Elevation — Implementation Session Log

Generated: 2026-07-09  
Last updated: 2026-07-09 (session 2 — completed remaining items)

Maintainer notes for traceback and review. Each item records what changed, why, and verification results.

**Status:** All planned code changes from `site-elevation-plan.md` are implemented. Two commits from session 1 (items 1–2); session 2 completed items 3–6 below (uncommitted at time of writing).

---

## Item 1 — Retune overlay dev-only guard ✅

**Commit:** `53e4c64` (session 1)

**Files modified:** `src/layouts/Layout.astro`

**Change:** Wrapped `<RetuneOverlay client:only="react" />` in `{import.meta.env.DEV && (...)}` so React + Retune is tree-shaken from production builds.

**Rationale:** `dist/index.html` was shipping `RetuneOverlay.*.js` (504 KB) + React runtime (180 KB) unconditionally. Every visitor saw the floating Retune toolbar. Guarding with `import.meta.env.DEV` removes ~680 KB of JS from production.

**Verification:** `npm run build` → `grep -c 'RetuneOverlay\|react' dist/index.html` returns 0.

---

## Item 2 — Shorten path to work ✅

**Commit:** `d7357a0` (session 1)

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

**Change:** Reordered nav: Work → Window → Notes → Who → Contact (Work moved up before Window).

---

## Item 3 — Proof/outcomes ✅

**Session:** 2

### 3a. Outcomes/metrics slot in WorkRow

**Files modified:** `src/components/WorkRow.astro`, `src/components/WorkList.astro`

**Change:** Added optional `outcomes` field to `Project` interface. Rendered as bullet list below the reading stack when present. Populated all four projects with metrics derived from existing project copy (framework count, scanner count, pipeline details — no invented numbers).

### 3b. KPMG impact bullets

**Files modified:** `src/components/Who.astro`

**Change:** Added "Impact" section with 3 bullets extracted from CV:
- Led 15+ security engagements across BFSI, real estate, and e-commerce
- Built vendor risk programs covering 50+ vendor ecosystems
- Delivered end-to-end compliance reviews against NIST CSF, OWASP Top 10, PCI DSS

### 3c. Photo — skipped per plan instruction.

---

## Item 4 — Shareability / SEO ✅

**Session:** 2

### 4a. OG image

**Files created:** `public/og/og-image.svg`, `public/og/og-image.png`

**Change:** Fixed corrupted SVG footer text from session 1. 1200×630 SVG in monolith style (dark `#0c0e13` bg, Big Shoulders Display type). Rasterized to PNG with `npx sharp-cli`.

### 4b. JSON-LD GitHub

**Files modified:** `src/layouts/Layout.astro`

**Change:** Added `'https://github.com/saqlainmmomin'` to `sameAs` array. Removed stale "GitHub URL still pending" comment.

### 4c. OG/Twitter image meta tags

**Files modified:** `src/layouts/Layout.astro`

**Change:** Added `og:image`, `og:image:width`, `og:image:height`, and `twitter:image` meta tags pointing to `https://saqlainmomin.com/og/og-image.png`.

**Verification:** `npm run build` → `dist/index.html` contains `og:image`, `twitter:image`, and GitHub in JSON-LD `sameAs`.

---

## Item 5 — Hiring CTA ✅

**Session:** 2

### 5a. Contact footer availability

**Files modified:** `src/components/Contact.astro`

**Change:** Added availability sentence below h2: "Open to senior GRC / security engineering roles and advisory work." Added primary "Email me" button styled with accent border.

### 5b. CV link in nav/footer

**Files modified:** `src/components/Nav.astro`, `src/components/Contact.astro`

**Change:** Added "CV" link to nav list (before Contact). Added CV download link to contact footer links row.

---

## Smaller fixes ✅

**Session:** 2

### 6a. Mobile nav

**Files modified:** `src/components/Nav.astro`

**Change:** Replaced `display: none` on mobile nav links with compact layout (smaller font, tighter gap, flex-wrap) showing all links including Notes and Who.

### 6b. Footnote renumbering

**Files modified:** `src/components/Lens.astro`

**Change:** Renumbered superscripts 3–6 → 1–4. Updated `data-ref` attributes and `FOOTNOTES` keys.

### 6c. webp/`<picture>` for heavy images

**Files modified:** `src/components/WorkRow.astro`, `src/components/WorkList.astro`

**Change:** Generated webp versions of all three video poster PNGs (`cyberassess-demo-poster.webp`, `recon-demo-poster.webp`, `pd-evolution-poster.webp`). Added `posterWebp` field. Video posters now use webp via `<picture>` wrapper and as the `poster` attribute when available. Velocity dashboard already had webp via existing `<picture>` path.

**Verification:** `npm run build` completes successfully.

---

## Not in scope / deferred

- **Photo** in hero or Who section (explicitly skipped)
- **CyberAssess case-study page** or expandable section (plan item 3 — deeper treatment)
- **DNS / custom domain** verification for `saqlainmomin.com` (infra, not code)
- **Calendar link** (cal.com) — marked optional in plan
- **On-site field-note pages** — longer-term content collection work

---

## Review before launch

1. **OG image** — open `public/og/og-image.png` and confirm typography/layout look right on LinkedIn/Twitter preview
2. **Availability wording** — edit the sentence in `src/components/Contact.astro` if the role framing should change
3. **Outcome bullets** — refine per-project metrics in `src/components/WorkList.astro` if you want harder numbers (assessment time saved, LOC, test count, etc.)
4. **CV file** — replace placeholder `public/cv.pdf` with current export before linking goes live
