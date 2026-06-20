# End-to-End Implementation Prompt for Claude Code

Copy the block below and paste it into Claude Code. It references DESIGN-SYSTEM.md (which is in the repo root) and the prototype files in `design-explore/`.

---

```
Read DESIGN-SYSTEM.md, DESIGN.md, and CONTENT.md in full. Then read every file in design-explore/ — especially Full Page Prototype.html and its companion JSX files (page-data.jsx, page-sections.jsx, page-app.jsx). These are the approved design prototype. Your job is to implement every decision from these documents into the Astro codebase. Here is the full scope:

## 1. Typography Migration: JetBrains Mono + Source Serif 4 → IBM Plex

### Font files
- Download IBM Plex Serif (400, 400i, 500, 600), IBM Plex Sans (400, 500, 600), and IBM Plex Mono (400, 500, 600) as woff2, latin subset only.
- Place them in public/fonts/, replacing the existing JetBrains Mono files.
- Update all @font-face declarations in src/styles/tokens.css to reference the new Plex files. Match the current preload strategy (preload the most-used weights: Serif 600 and Mono 400).

### CSS token updates (tokens.css)
- Replace --ff-serif (currently Source Serif 4) with 'IBM Plex Serif', Georgia, serif
- Replace --ff-mono (currently JetBrains Mono) with 'IBM Plex Mono', monospace  
- Add --ff-sans: 'IBM Plex Sans', system-ui, sans-serif (new token — used for Builder display)
- Update --step-* type scale if any sizes reference the old fonts' metrics

### Component updates
- Every .astro component that uses font-family must be updated. Search for all references to --ff-serif, --ff-mono, Source Serif, JetBrains.
- In dual-reading contexts: Auditor display uses --ff-serif. Builder display uses --ff-sans. Builder body/meta uses --ff-mono. See DESIGN-SYSTEM.md §1 for the full mapping.

## 2. Hero Restructure: Lens.astro

Read the current Lens.astro carefully, then read the HeroSection component in design-explore/page-sections.jsx. Implement these changes:

### Layout change — "Name First"
- The name "Saqlain Momin" becomes the #1 hierarchy element. Font size: clamp(52px, 8.5vw, 118px). Plex Serif 600 (auditor) / Plex Sans 600 (builder).
- Above the name: reading-specific eyebrow (Mono 12px, accent color, uppercase, 0.14em tracking).
  - Auditor: "Cyber Strategy & Governance"
  - Builder: "Build & Ship"
- Below the name: unified headline — "I see risk at the enterprise level, and I build the tools to close the gaps I find." clamp(22px, 3vw, 38px).
- Below the headline: reading-specific sub paragraph. See page-data.jsx HERO object for exact copy.
- Below the sub: the Lens toggle (Auditor / Builder).

### Lens seam mechanic
- The existing drag-split seam interaction can be preserved as an enhancement, but it should NOT be the introduction. The name and headline must always be visible regardless of seam position.
- The seam reveals/hides the reading-specific sub and eyebrow while name + headline stay constant above.
- On mobile (tap toggle), the same Name First layout applies — tap switches reading, no seam.

### Transition
- Use a page-level crossfade overlay for the reading switch: a fixed div with the previous reading's background color, animated from opacity:1 to 0 over 380ms. Content snaps immediately beneath. See the PageOverlay component in page-app.jsx.
- This replaces any CSS transition approach on individual elements (which is unreliable across browsers for inherited custom property changes).

### Accessibility
- Lens toggle: role="slider", keyboard ← →, aria-valuetext="{reading} reading", focus ring.
- Respect prefers-reduced-motion: disable overlay animation.

## 3. Nav.astro Updates

- Brand mark: keep "SM" in Mono 16px 600.
- Links: "Window", "Work", "Notes", "Who", "Contact" — Mono 12px, uppercase, 0.06em tracking.
- Background: matches current reading palette (auditor light / builder dark).
- Show/hide behavior: unchanged (hidden over hero, slides in on scroll).
- Smooth scroll: add scroll-behavior: smooth to html element.

## 4. Section Implementation

Read each section in page-sections.jsx and implement in the corresponding .astro component:

### ClosingWindow.astro
- Single-voice (no reading toggle). Always dark (#07080b).
- Keep the existing scroll-driven chart animation from chart.ts — just apply the new Plex typography.
- Update the 4 narrative steps and 3 stat callouts to match page-data.jsx WINDOW_STEPS and WINDOW_STATS exactly.
- Stat numbers: Mono clamp(56px, 12vw, 132px), machine color (amber) or human color (blue).

### WorkList.astro + WorkRow.astro
- Apply Plex type system to all text.
- Work section header: eyebrow "THE WORK" + heading "The response." + intro paragraph.
- Include a LensToggle in the header (same component as hero).
- Each row: tag column (160px, mono, accent, uppercase) + content column (title in serif/sans, body in serif/mono, meta in mono accent).
- Lead projects (first two) get larger title size and more padding.

### FieldNotes.astro
- Single-voice, auditor light palette.
- Heading: "I publish a position, with the data attached."
- Max width: 760px (narrower than hero/work).
- Each note: hook (Serif, semibold, clamp 21–27px) + thesis (dim, 15px) + "read on LinkedIn →" link.

### Who.astro
- Single-voice, auditor light.
- Heading: "The audit grounding."
- Definition list: label column 180px (mono, accent, uppercase) + value column.
- 4 rows: Role, Certifications, Education, Sectors. Use exact copy from page-data.jsx WHO object.
- CV download link at bottom.

### Outside.astro
- Single-voice, auditor light, 760px max width.
- Same grid layout as Who (180px label + content).
- Keep [PLACEHOLDER] markers in the copy — do not invent content.
- 3 rows: Reading, What I'm chasing, Off the clock.

### Contact.astro
- Dark footer (#07080b, matches Window).
- Centered layout.
- Closing line: "The frameworks will catch up eventually. I would rather be early." (Serif, semibold).
- Links: email, linkedin, github. Mono 14px.

## 5. Color Palette Updates

If any hex values in tokens.css differ from DESIGN-SYSTEM.md §2, update them. The palettes are:
- Auditor: bg #f3f3f1, fg #1a1a17, dim #55534d, accent #0e6b5e, line #dcdcd6
- Builder: bg #0c0e13, fg #e3e8ee, dim #8a97a8, accent #6ea8fe, line #1d2530
- Window: bg #07080b, fg #e8ecf2, dim #6f7a8a, machine #f5a623, human #6ea8fe

## 6. Layout & Spacing

Apply these consistently:
- Hero + Work: max-width 1080px
- Notes, Who, Outside: max-width 760px (narrower for reading comfort)
- Section vertical padding: clamp(96px, 14vh, 200px)
- Horizontal padding: clamp(20px, 5vw, 64px)
- Eyebrow style (reusable): Mono 12px, 0.14em tracking, uppercase, accent color, margin-bottom 16px

## 7. Verification Checklist

After implementing, verify each of these:

- [ ] All fonts render as IBM Plex (Serif, Sans, Mono) — no Source Serif 4 or JetBrains Mono references remain
- [ ] Hero shows "Saqlain Momin" as the dominant element in both readings
- [ ] Lens toggle switches all dual-reading sections (hero + work) simultaneously
- [ ] Lens toggle is keyboard accessible (← → arrows)
- [ ] Nav slides in on scroll, anchors work, background matches reading
- [ ] Closing Window renders with divergence chart, 4 narrative steps, 3 stats
- [ ] The Work shows correct content per reading for all 4 projects
- [ ] Field Notes lists 5 articles with hooks and theses
- [ ] Who section has 4 fact rows and CV download
- [ ] Outside section shows [PLACEHOLDER] markers (do not invent content)
- [ ] Contact footer has email + linkedin + github
- [ ] Page overlay crossfade fires on reading switch
- [ ] prefers-reduced-motion disables all animation
- [ ] No console errors
- [ ] Lighthouse accessibility score ≥ 95

## 8. Do NOT change

- The project structure (Astro, content collections, existing routing)
- The reading.ts shared state module — keep it, update consumers
- The chart.ts geometry — keep it, the math is correct
- Any content in CONTENT.md that isn't contradicted by DESIGN-SYSTEM.md
```

---
