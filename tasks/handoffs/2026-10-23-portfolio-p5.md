# Handoff: portfolio "audit file" redesign — trail copy fix, then Phases 5–6

## Goal

Finish Saqlain Momin's portfolio rebuild in `/Users/saqlainmomin/personal-site` (branch `feat/audit-file-redesign`). The work has three steps:

1. Declutter the Yozora evidence-trail copy.
2. Build Phase 5: credentials, field notes and contact.
3. Build Phase 6: nav polish, a ported smoke test, and a cutover proposal.

**Done means** each step is visible in the browser and verified, a Sonnet subagent smoke check has passed with its defects fixed, `npm run build` and `npm test` pass from the repo root, and progress is logged in `tasks/todo.md`. Removing `site-v2/` is proposed, not done.

## Current state

- **All work so far is uncommitted** on `feat/audit-file-redesign`. Do not switch branches, stash, reset or commit unless Saqlain asks.
- **The old site** is a single static file, `site-v2/index.html`. It stays as the legacy reference until cutover.
- **The new site** is a Vite 8 + React 19 + TS + Tailwind 4 app in `web/`. The root `vercel.json` already deploys `web/dist`.
- **Phases 1–4 are done and verified** (scaffold, hero, engagements, builds):
  - Hero: a Leon Sans hand-drawn name with a faint wave tremor, a physics lanyard badge with his photo, and a LogoLoop of frameworks.
  - Personnel record: a tenure ruler plus numbered KPMG work tiles.
  - Engagements: four stacking manila case files with NDA stamps.
  - Builds: Yozora with a five-step scroll-drawn evidence trail, three exhibits (Recon, Velocity, RL Playground), and native-dialog demos.
- **#credentials, #writing and #contact are still placeholders** in `web/src/App.tsx`.
- **The trail copy was rejected** as "mad cluttered". Step 1 fixes it.

## Step 1 — Yozora trail copy

Edit `trail` in `web/src/content/builds.ts`. It is rendered by `web/src/components/builds/EvidenceTrail.tsx`.

- Keep the five step titles.
- Make each line ONE short sentence, two at most.
- Remove all internal counts (409 controls, 52 clusters, six frameworks, 728 criteria).

What each step should say:

| Step | Direction |
|---|---|
| **Map once** | For multi-framework assessments, a unified control framework maps one answer to every relevant framework, so there is no repeat work. |
| **Pre-fill the questionnaire** | Evidence pre-fills answers, and the consultant confirms each one. Keep it shorter than now. |
| **Review the evidence** | Test criteria are defined for all required evidence. The AI reviews evidence for test of design and operating effectiveness, and cites the source of every response for traceability. |
| **Score by rule** | Say "the AI", never "the model". The AI only proposes; scoring follows fixed rules, per framework, never blended. |
| **Approve & act** | Only consultant-approved conclusions reach the report, and findings become tracked actions. Keep it short. |

Also loosen the layout so it reads less dense. Shorter lines, and maybe smaller step titles so "Pre-fill the questionnaire" fits on one line.

Then ask Saqlain once whether to remove the "Proposed by AI / Signed conclusion" `RecordPair` cards in `web/src/components/builds/Builds.tsx`. He called the "AI proposes, consultants approve" copy unnecessary, but hasn't decided on the cards.

## Step 2 — Phase 5

Port all content and links from `site-v2/index.html`: the #credentials, #writing and #contact sections. The note images are already in `web/public/img/notes/`.

- **Credentials:**
  - Three embossed seals for the ISO Lead Auditor certifications (27001:2022, 27701:2019, 22301:2019). On hover they tilt and show a foil sheen.
  - Degrees as a ledger: MBA Finance and B.Tech IT, both NMIMS.
  - Capability groups compressed to one line each, or dropped if they repeat the case files.
- **Field notes (#writing):**
  - The featured note becomes a "declassified report". It is "The Slow Escape", dated 23 Aug 2026, and links to the-slow-escape.vercel.app.
  - The other six notes become an index with black redaction bars that lift on hover and on focus.
  - The notes must always be readable on touch screens and under reduced motion.
  - Keep the original dates and LinkedIn links.
- **Contact (#contact):**
  - The heading "Let us make risk operable." with a signature line that draws itself.
  - Email (`saqlainmmomin@gmail.com`) as the primary stamp-style button.
  - LinkedIn (`/in/saqlain-musa`), GitHub (`saqlainmmomin`) and CV (`/cv.pdf`) as secondary links.
  - A footer.

## Step 3 — Phase 6

- **Nav:** add a mobile menu (the links are hidden below `md` today) and an active-section indicator.
- **Smoke test:** port it to the new build. It should cover assets, anchors, dialogs, no horizontal overflow at 390 and 1440px, reduced motion, and a clean console. Wire it into `npm test` alongside or instead of `site-v2/smoke-test.mjs`.
- **Cutover:** propose removing `site-v2/` and restoring `npm run dev` defaults, then ask before doing it.

## Key files

- `/Users/saqlainmomin/personal-site/tasks/todo.md`: the phase plan and verification log. Update it as you go.
- `/Users/saqlainmomin/personal-site/web/src/App.tsx`: page composition and nav; holds the placeholder sections.
- `/Users/saqlainmomin/personal-site/web/src/index.css`: theme tokens (`@theme`) and the component CSS for badge, stamps, tenure, tiles and trail.
- `/Users/saqlainmomin/personal-site/web/src/content/experience.ts` and `builds.ts`: all copy for those sections.
- `/Users/saqlainmomin/personal-site/web/src/components/ui/SectionHead.tsx`: the shared "01 / LABEL" section header.
- `/Users/saqlainmomin/personal-site/web/src/components/builds/`: `Builds.tsx`, `EvidenceTrail.tsx`, `Exhibits.tsx`, `DemoDialog.tsx`.
- `/Users/saqlainmomin/personal-site/web/src/components/hero/`: `Hero.tsx`, `HeroName.tsx` (Leon Sans), `HeroBadge.tsx`.
- `/Users/saqlainmomin/personal-site/web/src/lib/badge.ts`: paints the badge art onto a canvas.
- `/Users/saqlainmomin/personal-site/web/src/lib/motion.ts`: the `useInViewOnce` and `useScrollProgress` hooks.
- `/Users/saqlainmomin/personal-site/web/src/lib/dates.ts`: tenure helpers, so durations never go stale.
- `/Users/saqlainmomin/personal-site/site-v2/index.html`: the legacy site and source for the Phase 5 content.
- `/Users/saqlainmomin/personal-site/.claude/launch.json`: the `site` dev server on port 5173.
- `/Users/saqlainmomin/.claude/skills/cv-tailor/reference/content-evidence-map.md`: the source of truth for his experience.

## Constraints (decided — don't relitigate)

- **Copy:**
  - Explain concepts and mechanisms; no vague slogans and no unexplained internal numbers.
  - No invented metrics, client names, or adoption claims.
  - Don't repeat facts already on the badge (role, KPMG, years, ISO ×3).
  - The master CV is NOT a source of truth; use the evidence map.
- **Yozora claims:**
  - The citation-checked pipeline is built but not the default yet.
  - There is no auth and no deploy.
  - No time-saved or adoption figures exist.
  - Keep the "Current direction" disclaimer.
- **Small text:** use `text-accent-dark`, `text-folder-muted` or `text-stamp-ink`, which all clear WCAG AA. Bright `text-accent` is only for large text.
- **Keep as they are:**
  - The faint name tremor after the draw-in (Saqlain chose to keep it).
  - The metallic badge finish.
  - The full-hero badge canvas.
- **Vendored files:** `web/src/components/Lanyard.tsx` and `LogoLoop.tsx` come from react-bits (MIT + Commons Clause). Edit them minimally and keep their notices. `web/src/vendor/leon.js` is MIT; keep its header.
- **Working style:**
  - Keep the dev server open in the browser pane (preview_start `site`) and show each visible change.
  - Delegate verification loops and research to Sonnet subagents.

## Gotchas

- **Hidden pane:** the preview pane is often hidden or resized. requestAnimationFrame stalls between screenshots, and emulated viewports render scaled into the top-left of the screenshot, so use zoom on that region.
- **Lost viewport size:** the app clears a set viewport size when the pane width changes, so re-check `innerWidth`.
- **Scrolling in scripts:** the page uses smooth scroll, so pass `behavior: 'instant'` to `scrollTo` in scripts.
- **Leon Sans dashes:** its draw-in leaves canvas line dashes set, and `wave()` needs `ctx.setLineDash([])` first (already handled).
- **Lanyard WebGL:** the Lanyard renders nothing if WebGL fails. The still `<img>` fallback in `HeroBadge.tsx` covers mobile and no-WebGL.

## Verification

For each step:
- Show it in the browser pane at 1280×800 and at the mobile preset.
- Check the console is clean and no resources return 4xx.
- Check there is no horizontal overflow.
- Have a Sonnet subagent run a smoke check (contrast, keyboard and focus, reduced-motion code paths, content against `site-v2`), then fix what it finds.

Finally, from the repo root:

```bash
npm run build
```

```bash
npm test
```

Both must pass.

## Report back

Append a `## Results` section to this file covering:
- what changed, per step
- verification evidence
- open questions for Saqlain, including the RecordPair decision and the cutover approval

## Results

Executed 2026-10-23. Everything is still uncommitted on `feat/audit-file-redesign`; no branch, stash, reset or commit was made. Dev server ran on port 5174 (5173 was taken).

### What changed

**Step 1: Yozora trail copy**
- `trail` in `web/src/content/builds.ts`: titles kept; each line is now one or two short sentences, all internal counts removed, "the AI" instead of "the model", copy follows the direction table.
- `EvidenceTrail.tsx`: step titles `text-2xl` (single line at 1280, including "Pre-fill the questionnaire"), narrower `24ch` lines, looser spacing.
- The `RecordPair` cards were removed from `Builds.tsx` after Saqlain approved.

**Step 2: Phase 5** (new: `content/{credentials,notes,contact}.ts`, `components/{credentials,writing,contact}/`, CSS appended to `index.css`)
- Credentials: three embossed ISO seals (tilt + foil sheen on hover, fine pointer and motion allowed only), degrees ledger, capability groups compressed to one line each (kept the NIST CSF / PCI DSS / OWASP / due diligence / remediation validation keywords).
- Field notes: "The Slow Escape" as a declassified report with stamp; six notes as an index with black redaction bars that lift on hover and keyboard focus. Bars only exist on fine pointers with motion allowed; touch, reduced motion and print always show the text. Thumbnails and alts are kept at every width. Dates and LinkedIn links match `site-v2` exactly.
- Contact: "Let us make risk operable." heading, self-drawing signature, email as a double-border stamp button, LinkedIn / GitHub / Download CV secondary, footer.

**Step 3: Phase 6**
- `components/Nav.tsx` (App.tsx now composes it): mobile menu (aria-expanded, Escape closes and returns focus to the button, hidden links unfocusable) and a sliding active-section indicator that re-measures on resize.
- `web/smoke-test.mjs` (22 checks) wired into `npm test` after the legacy test. Added `playwright-core@1.61.0` as a root devDependency (matches the Chromium already cached locally; on a fresh machine run `npx playwright-core install chromium`). Covers: metadata/canonical/JSON-LD/robots/sitemap, vercel output dir, every asset named in content exists in `dist`, no confidential names or em dashes, dates and featured link; in the browser at 1440 and 390: no horizontal overflow, one h1, anchors resolve, images load with alt, link safety, note and contact links, both demo dialogs open and close on Escape, console clean with no 4xx, active nav, redaction lift on hover and focus, mobile menu, touch readability; and a reduced-motion pass.
- Cutover is NOT done (see below).

### Verification evidence
- Shown in the browser pane at 1280×800 and the 375 mobile preset: trail, seals, ledger, featured note, redaction bars, contact and footer, mobile menu. No horizontal overflow (375/375 and 1280/1280).
- `npm run build` passes; `npm test` exits 0 (`site-v2 smoke test passed`, `web smoke test passed (22 checks)`).
- Sonnet subagent smoke check (contrast, keyboard/focus, reduced motion/touch, content vs `site-v2`, layout). Found no blockers; fixed all its defects:
  1. Inactive nav links fell to 4.2:1 over dark demo cards → nav bar `bg-paper/97`.
  2. Escape in the mobile menu dropped focus → returns to the Menu button.
  3. Indicator went stale on resize → `ResizeObserver` plus `fonts.ready`.
  4. Seal foil ignored reduced motion → moved under the no-preference query.
  5. Redacted text blank in print → `@media print` rule.
  6. Seal text read twice by screen readers → block `aria-hidden`.
  7. Content drift: restored "followed by" intro wording, ↑/↓ link arrows, "Download CV", email link accessible name; thumbnails no longer hidden below 768px; signature left-aligned.
- Not changed (judgement calls): nav labels "Engagements / Field notes / Audit file" (intentional rename), the "Report ·" prefix and "Certified" ring wording, tall featured image leaving empty space under the CTA on desktop, long accessible names on note rows.
- Smoke test caught one real gap along the way: the Phase 4 GitHub links use `rel="noreferrer"`; the test accepts that alongside `noopener`.
- `oxlint` still reports pre-existing warnings in vendored files and `PersonnelRecord.tsx`; none from the new code.

### Open questions for Saqlain
1. **RecordPair (DECIDED, done):** Saqlain said remove; the cards are gone from `Builds.tsx` and build + `npm test` still pass. (Original question: remove the "Proposed by AI / Signed conclusion" cards in `web/src/components/builds/Builds.tsx`? You called the "AI proposes, consultants approve" copy unnecessary; the trail now says it once per step. My lean: remove them and let the facts list carry it, but it is your call.)
2. **Cutover approval:** proposal is to delete `site-v2/`, drop `dev:legacy`, make `npm test` run only `web/smoke-test.mjs`, drop the now-unused `css-tree` and `parse5` devDependencies, and remove the `site-legacy` entry from `.claude/launch.json` so `npm run dev` / `npm test` are the new site only. Not done; say the word.
3. **Port 5173** was occupied by another process, so the `site` preview used 5174. Harmless, but worth knowing if something else is holding it.

### Follow-up changes (same day, at Saqlain's request)
- **Section separation:** tonal bands via `.surface-desk` / `.surface-dark` in `index.css` (hero + credentials on paper; engagements + field notes on a cool desk; builds, contact and footer on ink). The surfaces re-point colour tokens, so children follow automatically; `DemoDialog` now sits outside the dark section so it keeps its own look. Sonnet contrast audit found dark sections clean; desk fixes applied: accent-dark #A02308 (5.2:1) and accent #C93611 (3.5:1, headline italics) scoped to the desk, work-tile numerals darkened.
- **Field note images:** index thumbnails enlarged from 88px to about 350px (4:3, full width on phones), and the date now sits above the image.
- `npm run build` and `npm test` pass after all of this (22 web checks). Contact section and a few boundaries were only checked by the subagent's screenshots, not by me.
