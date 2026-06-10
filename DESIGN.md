# DESIGN.md

Design guidelines for the personal site. Built from the settled Phase 0 decisions. No code is written until this is signed off. Every rule below has a reason; where a choice was between alternatives, the reason names the trade-off.

Ground rules carried through every decision: no em dashes, no emojis, no LinkedIn cliches, bold used sparingly, accessibility first, sub-1s LCP, SEO, mobile-first.

---

## 0. Decisions locked in Phase 0

| Decision | Choice | Consequence for this doc |
|----------|--------|--------------------------|
| Tone | Professional with edge | Copy register is restrained; structure carries the boldness |
| Default lens | Auditor first | First paint is the light/serif Auditor reading |
| Lens scope | Hero + project cards only | Window, Field Notes, Who, Contact are single-voice |
| Visual system | Dual treatment | Skin swaps with the lens, not just the words |
| Type + palette | Direction 1, "Ledger" | JetBrains Mono / Source Serif 4, teal + blue, amber machine line |
| Stack / host | Astro + Vercel | Static-first, islands for the two interactions |
| Employer | "a Big Four firm" | No KPMG name anywhere |
| Demo links | Mixed per project | Per-project map confirmed before build |
| Field Notes | Hook + link out | On-site hook, canonical link to LinkedIn, new tab |
| Photo | Text-only | No image assets; LCP is text |
| CV | PDF download | Link in Who and Contact |
| Figures | Publish as written | All seven figures shown with sources |
| v1 scope | Full IA | All six sections ship at launch |

---

## 1. Visual system

### 1.1 The dual treatment

Two registers. The lens trades the entire register, not only the words. This is the concept made literal: you build (Builder) and you audit (Auditor), and the reader holds both.

**Builder register** (dark, technical)
- Background `--build-bg #0c0e13`, raised surface `--build-bg-2 #12151c`
- Foreground `--build-fg #e3e8ee`, dim `--build-dim #8a97a8`
- Accent `--build-accent #6ea8fe` (blue)
- Hairline `--build-line #1d2530`
- Type: JetBrains Mono throughout. Monospace is the register's tell: this is the maker's view.

**Auditor register** (light, document)
- Background `--audit-bg #f3f3f1`, raised surface `--audit-bg-2 #eceae4`
- Foreground `--audit-fg #1a1a17`, dim `--audit-dim #55534d`
- Accent `--audit-accent #0e6b5e` (deep teal)
- Hairline `--audit-line #dcdcd6`
- Type: Source Serif 4 throughout. The serif gives the audit reading document gravitas, which is the point of "I know why a control exists."

**Window register** (single voice, dark)
- Background `--win-bg #07080b`, surface `--win-bg-2 #0c0e13`
- Foreground `#e8ecf2`, dim `#6f7a8a`, grid `#161a22`
- Human line `--human #6ea8fe` (blue, same as builder accent: the human cycle is the side we build on)
- Machine line `--machine #f5a623` (amber). Reason: red-on-dark is the default everyone reaches for; amber reads as escalation/caution, pairs with the blue, and keeps the chart from looking like a generic alert.
- Gap fill `rgba(245,166,35,.10)`

Contrast: every text token above clears WCAG AA for its size. `--build-dim` on `--build-bg` and `--audit-dim` on `--audit-bg` are reserved for >=16px text where AA large applies; body copy uses full `--fg`. Accents are used for non-text or large text only unless verified against their background (teal `#0e6b5e` on `#f3f3f1` passes AA for normal text; blue `#6ea8fe` on `#0c0e13` passes AA large only, so blue is never used for body copy, only headings/labels/lines).

### 1.2 Typography

Two families, self-hosted (see 7.1). No third family.

- **Source Serif 4** (variable, opsz 8..60): Auditor register, all Window prose, Field Notes, Who, Contact body. The site's default reading face.
- **JetBrains Mono** (400/500/600): Builder register, all data/metrics, eyebrows, labels, source citations, the stat-band numbers.

Type scale (fluid, `clamp`), 1.25 ratio anchored at 19px body:

| Token | clamp | Use |
|-------|-------|-----|
| `--fs-display` | clamp(44px, 7vw, 88px) | Hero headlines |
| `--fs-h2` | clamp(30px, 4vw, 50px) | Section headlines |
| `--fs-h3` | clamp(22px, 2.6vw, 30px) | Window step / card titles |
| `--fs-stat` | clamp(56px, 12vw, 132px) | Stat-band numbers |
| `--fs-lead` | clamp(19px, 2.2vw, 24px) | Hero sub, section leads |
| `--fs-body` | 19px | Body copy |
| `--fs-small` | 15px | Card body, captions |
| `--fs-mono-label` | 12px, .14em tracking, uppercase | Eyebrows, meta, sources |

Builder headlines render one step smaller than Auditor headlines at the same level (mono sets wider), matched optically not numerically. Line-height: display .98, h2 1.05, body 1.55, mono body 1.7. Numbers use `font-variant-numeric: tabular-nums`.

### 1.3 Spacing, grid, layout

- Spacing scale (8px base): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Token names `--s-1` .. `--s-10`.
- Content max-width: 1100px for full-bleed sections (hero, window), 760px for reading sections (Field Notes, Who, Contact). Gutters: `clamp(20px, 5vw, 64px)`.
- Vertical rhythm between sections: `clamp(96px, 14vh, 200px)`.
- Grid: single-column reading measure (<=68ch) everywhere text is read continuously. The Work uses a 1px-hairline divided list, not cards-as-boxes (less chrome, more document-like, consistent with the audit framing).
- Radius: 0 by default. This is a document, not an app. Only the lens knob and the focus ring are round.

---

## 2. Information architecture

Scroll order, single `index` page (the narrative is linear and short):

1. **Hero / The Lens** - identity in two readings, the thread line at the seam.
2. **The Closing Window** - the argument. Single voice. Scroll-driven chart + stat band.
3. **The Work** - four projects as the response. Dual-readable.
4. **Field Notes** - selected published analysis, hook + link out.
5. **Who** - role, certs, sectors, education. Compact. CV download.
6. **Outside the work** - the human dimension: reading, what I'm chasing, off the clock. Single-voice, light/serif register, dry and specific.
7. **Contact** - email, LinkedIn, GitHub. Closing line.

A thin skip-link and a minimal in-page nav (Argument / Work / Notes / Who) appear after the hero. The thread line "I see risk at the enterprise level, and I build the tools to close the gaps I find." is the connective tissue: it sits at the hero seam and is restated once in Contact.

---

## 3. Interaction model A: The Lens

### 3.1 Concept

The hero stacks both readings at the same vertical positions. A vertical seam reveals Builder on one side and Auditor on the other. Dragging the seam trades one reading for the other; at a centered seam both are legible at once. The Builder copy hugs the left edge, the Auditor copy hugs the right, so a centered seam shows both headlines side by side. This is the one place the mechanic is continuous; everywhere else it is a binary state.

### 3.2 State model

One shared variable, `reading`, with a continuous backing value `split` (0..100, percent revealed to Auditor):
- Hero: `split` is continuous (drag / arrow keys). `reading` derives: `split >= 50` -> Auditor, else Builder.
- The Work: binary `reading`, set by a section toggle. Cards crossfade between readings; they do not use a continuous clip (a clip on small cards is fussy and degrades on mobile).
- Hero and The Work share `reading` so the mental model is one lens, not two. Scrolling from a Builder-revealed hero into The Work shows Builder cards.

Default on load: `split = 100` (Auditor fully shown). Reason: clean, credible first paint (light serif hero is the LCP element) and it honors "Auditor first."

### 3.3 Controls (three, all equivalent)

1. **Drag** the seam handle (pointer + touch). The handle is a 46px round knob, min 44px hit target.
2. **Keyboard**: the seam is `role="slider"`, `aria-label="Reading lens: Builder to Auditor"`, `aria-valuemin=0 aria-valuemax=100 aria-valuenow`, `aria-valuetext="Auditor reading"` / `"Builder reading"` / `"Both readings, split evenly"`. Left/Right arrow move 5%, Home/End snap to 0/100, PageUp/PageDown 25%. Focus-visible ring on the knob.
3. **Toggle**: a two-button segmented control, "Builder" / "Auditor", labelled `aria-pressed`. Snaps `split` to 0 / 100. This is the primary control on mobile and the only control under reduced-motion. It is always present, not a fallback bolted on.

### 3.4 Discoverability

On first load, after the hero paints, a one-time hint animates the seam from 100 to ~62 and back to ~80, resting with a sliver of Builder visible on the left as a permanent affordance, plus the persistent label "drag, or switch reading" near the toggle. The animation is a `clip-path` transform only (no layout, so no CLS) and is fully skipped under `prefers-reduced-motion`, where the hero simply rests at `split=100` with both the visible Builder sliver and the toggle doing the discovery work.

### 3.5 Reduced motion

- No auto-hint, no crossfade. Lens changes are instant.
- Drag still works (drag is user-driven, not animation), but the toggle is the promoted path.
- Card reading changes swap instantly instead of crossfading.

### 3.6 Responsive

- **>=900px**: full seam drag, two-column edge-aligned hero, knob + toggle.
- **<900px**: no seam. The hero shows one reading at a time, full width, switched by the segmented toggle with a 180ms crossfade (instant under reduced-motion). Reason: dragging a vertical seam across narrow full-bleed text is awkward and the left/right edge alignment collapses. The toggle is the honest mobile mechanic. The thread line sits below both readings, always visible.
- The Work cards: always toggle-driven (same on all widths), single column on mobile, two columns >=720px.

---

## 4. Interaction model B: The Closing Window

### 4.1 Concept

A sticky divergence chart. Two lines from a shared origin; the human line rises gently, the machine line bends into exponential growth as you scroll. Four caption steps drive the machine line's growth and the shaded gap between the lines. Then a stat band counts up three sourced figures. This is the argument, single voice.

### 4.2 Mechanic

- The chart is `position: sticky` for the height of the scene; scroll progress (0..1) maps to machine-line growth and to the active caption (quartiles).
- Steps (from CONTENT 4.2): (1) same starting point, (2) one side stops being human (89 days, METR), (3) defender line barely moves (3 to 5 year lag, ISO/NIST), (4) the shaded gap is the risk.
- Stat band counts up on enter: 89 days, 97M, 3 to 5 years, each with its source line in mono.
- Geometry math is the proven approach from prototype c (exponential machine curve, gap area as the region between curves), re-skinned to the Window palette.

### 4.3 Accessibility and reduced-motion (this is the load-bearing part)

The chart is decorative for assistive tech. It must not be the only carrier of the argument.

- The SVG is `aria-hidden="true"`. The argument lives in real text: the four step captions are actual DOM headings/paragraphs, readable in order regardless of scroll. A visually-hidden one-paragraph summary plus a small data table (year, human capability, machine capability, source) precedes the chart for screen readers and for no-JS.
- **No-JS / SSR**: the chart renders its final state statically (machine line fully grown, gap shaded), all four captions shown stacked as normal content, stat numbers at final value. The section reads completely without JavaScript. JS only upgrades it to scroll-driven.
- **prefers-reduced-motion**: identical to no-JS visually. No sticky scrubbing, no count-up (numbers shown final immediately), no line growth animation. The captions become a normal stacked list and the chart shows its final state. Reason: scroll-scrubbing and count-ups are exactly what reduced-motion users opt out of; the content must not depend on them.
- Count-up uses `requestAnimationFrame`, but the element's text content is the final number in the DOM from the start (progressive: SSR renders "89 days"; JS resets to 0 and animates only when motion is allowed and the element is in view). So the number is always present to a crawler and to AT.
- Keyboard: nothing in the Window is a control; it is read by scrolling. No keyboard trap, no focusable chart.

### 4.4 Responsive

- The chart height is `min(62vh, 520px)`; on mobile the caption sits above the chart (static position) rather than overlapping it. Lines and labels scale with the viewBox. Stat numbers clamp down but stay tabular.

---

## 5. Section-by-section behavior

- **Hero**: section 3. LCP element = Auditor headline (serif text). Nav and thread line below.
- **Closing Window**: section 4.
- **The Work**: hairline-divided list of four. Each row carries tag (mono), title, body, and a metrics line (mono, tabular). Dual reading via the shared lens toggle. Per-project link slot ([repo] / [live demo] / case study label) filled from the map in section 8. CyberAssess and CyberDD lead (larger rows / first); Verified and Velocity follow (compact rows).
- **Field Notes**: 760px measure. Each entry: hook line (the strongest asset, shown big), one-line thesis, mono "read on LinkedIn ->" linking to canonical URL, `target=_blank rel="noopener"`. No body duplication.
- **Who**: 760px. Role ("Assistant Manager, Cyber Strategy & Governance at a Big Four firm"), the three Lead Auditor certs, degrees, sectors, the kind of work. Compact. "Download CV (PDF)" link (mono).
- **Outside the work**: 760px, light/serif register. Three labelled strands, each two or three lines, framed dry and concrete (no "passionate about"): **Reading** (current intellectual inputs; ties to the "track AI capability like a threat landscape" thesis), **What I'm chasing** (ambitions/goals, forward-looking, on-thesis), **Off the clock** (a few concrete personal notes). Scaffolded with clearly-marked placeholder copy for you to fill; section title and the three strand labels are adjustable. Reason for placement after Who: credentials establish the ground first, then the human dimension lands before the close, where it reads as character rather than padding.
- **Contact**: email (mailto), LinkedIn, GitHub, the closing line "The frameworks will catch up eventually. I would rather be early." No form (a form is a liability with nothing to gain over a mailto here).

---

## 6. Motion

- Global: transitions 150-220ms, ease `cubic-bezier(.4,0,.2,1)`. Nothing bounces.
- Allowed motion: lens crossfade/seam, one-time lens hint, Window scroll-scrub, stat count-up, link underline transitions, focus ring.
- `prefers-reduced-motion: reduce` removes all of the above except focus ring and instant state changes. This is wired globally via a single media query plus per-mechanic guards (sections 3.5, 4.3), not retrofitted.
- No parallax, no scroll-jacking (the page never hijacks scroll velocity; sticky is not scroll-jacking), no autoplaying anything.

---

## 7. Performance, SEO, accessibility budgets

### 7.1 LCP < 1s

- **Self-host fonts** (woff2, latin subset) via `@fontsource-variable/source-serif-4` and `@fontsource/jetbrains-mono`. Reason: Google Fonts adds a render-blocking stylesheet plus a third-party connection; self-hosting with `preload` on the two hero faces removes that from the critical path. `font-display: swap`.
- Preload only the Auditor face weights used in the hero (the LCP text). Builder/mono preloaded at lower priority.
- Astro ships zero JS by default. The two islands hydrate `client:visible` (Window) and `client:idle` (Lens), so they never block first paint. Critical CSS is inlined by Astro per route.
- No images on the critical path (text-only). CV PDF is a plain link, never preloaded.
- Target: LCP < 1s on a mid-tier mobile over 4G; total JS for the two islands kept under ~15KB gzipped combined.

### 7.2 SEO

- One `<h1>` (the hero). Semantic landmarks (`header`, `main`, `nav`, `section`, `footer`).
- `<title>`, meta description, Open Graph + Twitter card (text OG image generated at build, optional v1.1), canonical URL.
- JSON-LD `Person` schema: name, jobTitle, knowsAbout (the cert/topic list), sameAs (LinkedIn, GitHub).
- Field Notes links carry the LinkedIn canonical; we do not republish, so no duplicate-content risk.
- `sitemap.xml` + `robots.txt` via Astro integration.

### 7.3 Accessibility

- WCAG 2.2 AA target. Color contrast verified per token (section 1.1).
- Visible `:focus-visible` ring on every interactive element (2px, accent-colored per register, plus offset).
- Skip-to-content link as first focusable element.
- The lens fully operable by keyboard and by the toggle (section 3.3). The Window fully readable without JS or motion (section 4.3).
- Respects `prefers-reduced-motion` and `prefers-color-scheme` is not used to override the register logic (the registers are content state, not a theme; the toggle is explicit).
- Touch targets >= 44px. Text resizes to 200% without loss.

---

## 8. Inputs still needed from you (for Phase 2, not blocking this doc)

These do not change DESIGN.md; they fill content slots at build time:

1. **LinkedIn URL** and **GitHub URL** (CONTENT marks both "[URL needed]").
2. **Five Field Notes canonical URLs**, matched to the five selected pieces in CONTENT 4.4.
3. **Per-project link map**: for each of CyberAssess, CyberDD, Verified, Velocity, pick public repo / live demo / case-study-only (and the URL where applicable).
4. **Custom domain** (if any) for canonical + OG; otherwise the Vercel subdomain for v1.
5. **CV PDF**: the file to serve, or confirm I should export one from your master CV (the cv-tailor skill references a master CV).

---

## 9. Component inventory (Astro)

- `Layout.astro` - html shell, head, fonts preload, JSON-LD, skip link, tokens.
- `Lens.astro` + `lens.ts` island - stacked hero panes, seam, knob, toggle, keyboard, hint, reduced-motion + responsive logic. Hydrates `client:idle`.
- `ClosingWindow.astro` + `window.ts` island - sticky chart, SVG geometry, scroll scrub, caption steps, stat count-up, static fallback. Hydrates `client:visible`.
- `WorkList.astro` + `WorkRow.astro` - hairline list, dual-readable rows, link slot. Reading state shared with Lens via a tiny store (`reading` signal / custom event), no framework runtime.
- `FieldNotes.astro` + content collection `notes` (frontmatter: title, hook, thesis, url).
- `Who.astro`, `Outside.astro` (three placeholder strands), `Contact.astro`, `Nav.astro`, `ThreadLine.astro`.
- `tokens.css` - all custom properties (the three registers, type scale, spacing, motion).

---

## 10. Out of scope for v1

Analytics, a contact form, full article republishing, OG image automation, blog/CMS, light/dark theme switch beyond the lens registers, i18n. Revisit in v1.1 if wanted.
