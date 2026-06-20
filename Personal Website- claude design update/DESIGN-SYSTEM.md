# Design System — Settled Decisions

All decisions below are final. They emerged from a structured design exploration (type pairings, hero layouts, full-page prototype) and were approved before this document was written. The prototype lives in `design-explore/Full Page Prototype.html` and its companion JSX files.

---

## 1. Typography

### Family: IBM Plex

| Register | Family | Use | Weight |
|----------|--------|-----|--------|
| **Auditor** display | IBM Plex Serif | Hero name, section headings, project titles, headline | 600 (Semibold) |
| **Builder** display | IBM Plex Sans | Same elements when Builder reading is active | 500–600 |
| **Auditor** body | IBM Plex Serif | Subheads, paragraph text, descriptions | 400–500 |
| **Builder** body | IBM Plex Mono | Same elements when Builder reading is active | 400 |
| **Meta / Labels** | IBM Plex Mono | Eyebrows, nav links, project tags, stat sources, dates | 400–500, 12–13px |

### Why Plex over the current Source Serif 4 + JetBrains Mono

- **Three weights from one superfamily.** Serif, Sans, and Mono share metrics, x-height, and spacing. The dual-register concept (serif = auditor, sans = builder, mono = data) maps cleanly without mixing unrelated type families.
- **Sans for Builder display.** The previous design used JetBrains Mono at 44–88px display sizes, which is hard to scan and sets very wide. IBM Plex Sans at display sizes communicates "technical" without the readability penalty of monospace. Mono stays for body/meta/labels in Builder reading.
- **Institutional weight.** Plex reads as deliberate and authoritative — appropriate for someone working in cyber governance at a Big Four firm.

### Font loading

Self-host woff2, latin subset only. Preload the Serif 600 and Mono 400 weights (most common above the fold). Same approach as the current JetBrains Mono setup in `tokens.css`.

```css
/* Replace current @font-face blocks in tokens.css */
/* Weights to self-host: */
/* IBM Plex Serif: 400, 400i, 500, 600 */
/* IBM Plex Sans:  400, 500, 600 */
/* IBM Plex Mono:  400, 500, 600 */
```

---

## 2. Color Palettes

Unchanged from DESIGN.md. The two reading palettes and the Window palette are confirmed.

### Auditor (light)

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#f3f3f1` | Page background |
| `--fg` | `#1a1a17` | Primary text |
| `--dim` | `#55534d` | Secondary text, descriptions |
| `--accent` | `#0e6b5e` | Teal — eyebrows, labels, links |
| `--line` | `#dcdcd6` | Borders, dividers |
| `--bg2` | `#eceae4` | Subtle surface differentiation |

### Builder (dark)

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#0c0e13` | Page background |
| `--fg` | `#e3e8ee` | Primary text |
| `--dim` | `#8a97a8` | Secondary text |
| `--accent` | `#6ea8fe` | Blue — eyebrows, labels, links |
| `--line` | `#1d2530` | Borders, dividers |
| `--bg2` | `#12151c` | Subtle surface differentiation |

### Closing Window (always dark)

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#07080b` | Deepest dark background |
| `--fg` | `#e8ecf2` | Text |
| `--dim` | `#6f7a8a` | Secondary text |
| `--grid` | `#161a22` | Chart grid lines |
| `--machine` | `#f5a623` | Amber — machine/attacker line |
| `--human` | `#6ea8fe` | Blue — human/defender line |
| `--gap` | `rgba(245,166,35,0.10)` | Shaded risk area |

---

## 3. Hero Layout — "Name First"

### Structure (top to bottom)

1. **Eyebrow** — Reading-specific. Auditor: "CYBER STRATEGY & GOVERNANCE". Builder: "BUILD & SHIP". Mono 12px, accent color, uppercase, 0.14em tracking.
2. **Name** — `Saqlain Momin`. The #1 hierarchy element. clamp(52px, 8.5vw, 118px). Plex Serif 600 (auditor) / Plex Sans 600 (builder). Line-height 0.92, letter-spacing -0.03em.
3. **Headline** — Unified across both readings: *"I see risk at the enterprise level, and I build the tools to close the gaps I find."* clamp(22px, 3vw, 38px). Serif 500 (auditor) / Sans 400 (builder).
4. **Sub** — Reading-specific. Auditor: serif body about audit experience. Builder: mono body about tech stack. Dim color.
5. **Lens Toggle** — Auditor / Builder seam control. Keyboard accessible (← →), `role="slider"`, `aria-valuetext`.

### What changed from the original Lens

- **Name is always visible and dominant.** The original hero showed "SM" in the nav and no name in the hero viewport — a structural gap for a personal site whose purpose is introduction.
- **The headline is the thread line.** The original had separate headlines per reading ("I assess where systems break" / "I build security tools"). Both were functional but generic. The thread line — which was buried in a bar below the hero — does more work as the primary headline because it embodies the duality in a single sentence.
- **The Lens seam mechanic can still layer on top.** The vertical drag-split is a strong interaction; it just shouldn't be the *introduction*. In production, it can reveal/hide the reading-specific sub and eyebrow while the name and headline stay constant.

### Transition behavior

- **Page crossfade overlay.** When the reading switches, a fixed overlay with the previous background color fades out over 380ms. All content snaps to the new reading immediately beneath it. This avoids CSS transition complexity while producing a smooth visual switch.
- **Reduced motion.** Overlay animation is disabled when `prefers-reduced-motion: reduce` is set.

---

## 4. Page Architecture (section order)

| # | Section | Reading behavior | Background |
|---|---------|-----------------|------------|
| 1 | **Hero** | Dual-reading (toggles) | Auditor light / Builder dark |
| 2 | **The Closing Window** | Single-voice (no toggle) | Always `#07080b` (deepest dark) |
| 3 | **The Work** | Dual-reading (toggles) | Matches current reading |
| 4 | **Field Notes** | Single-voice | Auditor light |
| 5 | **Who** | Single-voice | Auditor light |
| 6 | **Outside** | Single-voice | Auditor light |
| 7 | **Contact** | Single-voice | `#07080b` (matches Window) |

### Section-specific notes

**The Closing Window** — Single-voice because the argument (the gap between human security cycles and machine-speed iteration) is shared by both registers. Contains:
- Intro block with headline "The window is closing."
- Divergence chart (SVG): human line (linear, blue) vs machine line (exponential, amber), shaded gap area
- 4-step narrative alongside the chart
- 3 stat callouts (89 days, 97M, 3–5 yrs)

**The Work** — Dual-reading project rows. Each row has:
- Left column: tag (mono, accent, uppercase)
- Right column: title (serif/sans depending on reading), body (serif/mono), meta (mono, accent), case study link
- Lead projects get more vertical padding

**Field Notes** — Article listing. Each row: hook (serif, bold), thesis (dim), "read on LinkedIn →" link.

**Who** — Definition list layout. Key (mono, accent, uppercase, 180px) + value. CV download link at bottom.

**Outside** — Same layout as Who. All copy is `[PLACEHOLDER]` — needs real content before launch.

**Contact** — Centered. Closing line in serif, then email/LinkedIn/GitHub links in mono.

---

## 5. Nav

- **Hidden over the hero.** Slides in (translateY) when hero scrolls out of viewport (IntersectionObserver, threshold 0.05).
- **Brand mark:** "SM" in Mono 16px 600.
- **Links:** Window, Work, Notes, Who, Contact. Mono 12px, uppercase, 0.06em tracking. Anchor scroll.
- **Background:** Matches current reading palette.

---

## 6. Spacing & Layout Constants

| Token | Value | Use |
|-------|-------|-----|
| Max content width | `1080px` (hero, work) / `760px` (notes, who, outside) | Narrower for reading-focused sections |
| Section padding (vertical) | `clamp(96px, 14vh, 200px)` | Generous breathing room |
| Horizontal padding | `clamp(20px, 5vw, 64px)` | Responsive margins |
| Eyebrow → heading gap | `16px` | Consistent |
| Heading → body gap | `16–24px` | |
| Row padding | `20–24px` vertical | For list items |
| Grid gutter (work rows) | `32px` | Between tag and content columns |
| Tag column width | `160px` | Fixed in work section |
| Fact label width | `180px` | Fixed in who/outside sections |

---

## 7. Interaction Patterns

| Pattern | Implementation |
|---------|---------------|
| Reading switch | Page overlay crossfade (380ms ease-out). Content snaps; overlay fades. |
| Lens toggle | `role="slider"`, keyboard ← →, focus ring, active indicator slides |
| Nav reveal | IntersectionObserver on hero, `transform: translateY` with 380ms ease |
| Scroll-to-section | `scroll-behavior: smooth` on `<html>`, anchor `href="#id"` |
| Reduced motion | All animations/transitions disabled via `prefers-reduced-motion: reduce` |
| Hover states | Nav links: dim → fg. Article rows: default link behavior. |

---

## 8. Files Reference

| File | Purpose |
|------|---------|
| `design-explore/Full Page Prototype.html` | Interactive prototype — all sections, both readings |
| `design-explore/page-data.jsx` | All copy, palette constants, chart geometry, project data |
| `design-explore/page-sections.jsx` | All section React components |
| `design-explore/page-app.jsx` | App shell, nav, overlay, scroll wiring |
| `design-explore/Hero Prototype.html` | Earlier hero-only prototype (for reference) |

---

## 9. What This Document Does NOT Cover

- **The Lens seam mechanic.** The drag-split interaction is a production enhancement to the hero. This document covers the base layout; the seam layers on top.
- **Scroll-driven chart animation.** The Window's divergence chart is static in the prototype. The existing `chart.ts` + IntersectionObserver approach from the codebase carries over.
- **Mobile breakpoints.** The prototype is desktop-first. Mobile adaptation happens in Astro.
- **Blog post templates.** Field Notes detail pages are out of scope.
- **Image/media assets.** No photography or illustrations are specified yet.
