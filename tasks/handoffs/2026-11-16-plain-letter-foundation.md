# Handoff 1 of 3: "Plain letter" foundation pass

Run order: **this one first.** Handoffs 2 (Yozora demo) and 3 (project tiles) start after this
one has finished step 1 and reported the shared data shape. Run as a Sonnet session; use Sonnet
subagents for browser checks and screenshots.

## Goal

Rebuild Saqlain Momin's portfolio (`/Users/saqlainmomin/personal-site/web`, Vite + React + TS +
Tailwind 4) from the current "audit file" design into a plain, single-column site modelled on
harshux.com. Plain means no metaphor, no decoration and no page-level effects: one text serif,
one narrow column, plain factual copy, and depth moved to inner pages. This pass builds the
system, the homepage and the KPMG inner page. Project tiles are placeholders (handoff 3 fills
them), and the Yozora demo is out of scope (handoff 2).

**Done means:**
- The homepage and `/kpmg` render in the new system at 1440px and 390px with no horizontal
  overflow.
- All removed devices are deleted (files and CSS, with no orphans).
- The smoke test is rewritten for the new page and passes.
- `npm run build` and `npm test` pass from the repo root.
- Results are written below.

## Current state

- Branch `feat/badge-photo`. The last commit is 68a1c9b ("cut copy by half and add a connected,
  animated page"). **First action:** create branch `feat/plain-letter` from it. Do not commit;
  Saqlain ships with `/ship`.
- `tasks/todo.md` begins with the locked plan, "PORTFOLIO REDESIGN v3: PLAIN LETTER". **Read
  it first.** It is the source of truth, and this file summarises it.
- A design roast found the following:
  - mixed metaphors (lanyard badge, NDA and DECLASSIFIED stamps, 3D seals, fake app window)
  - 18 font sizes, including 9–11px
  - four different reds
  - no shared grid
  - a decorative scroll thread
  - dead space between sections
  - horizontal overflow: scrollWidth 1468 at 1440, and 435 at 390, because `body` has
    `overflow-x: hidden` but `html` does not; the stamps and seals overhang
  - an engagement map that breaks on phones
- Reference site teardown (harshux.com, measured):
  - All copy is a 15px serif (EB Garamond), weight 450 for body and 600 for headings.
    Hierarchy comes only from weight, grey vs near-black, and space.
  - Text column about 560px (65–75 characters per line) inside a centred column about 736px.
    Images use the full column width.
  - Background about #FAFAFA, text about #2B2B2B, secondary text about #707070. Hairline
    borders only.
  - Home is about 230 words: small portrait at the top of the column, short paragraphs, a
    "Get in touch" row of links (email with a copy button), then projects as full-width image
    tiles with a bold title and one grey line, linking to inner pages.
  - Screenshots: `/private/tmp/claude-501/-Users-saqlainmomin-personal-site/82da499f-c282-4495-af5e-1764930105d7/scratchpad/harsh/`
    (d-0.png, d-1.png, m-0.png). This is a temp folder; if it's gone, look at harshux.com
    directly.

## Key files

| Path | What it is |
|---|---|
| `/Users/saqlainmomin/personal-site/tasks/todo.md` | Locked v3 plan (top section) |
| `web/src/App.tsx` | Page composition |
| `web/src/index.css` | Tokens, fonts, global CSS, reduced-motion rules |
| `web/src/components/**` | Current sections. Most get deleted or rewritten (see below) |
| `web/src/content/*.ts` | Content. The copy is already reviewed: reuse its facts, rewrite the tone |
| `web/public/img/`, `web/public/fonts/` | Assets (badge photo in `img/badge/`) |
| `web/smoke-test.mjs` | Playwright smoke test (33 checks, mostly for the old sections) |
| `/Users/saqlainmomin/personal-site/vercel.json` | `cleanUrls: true`, so `kpmg.html` is served at `/kpmg` |

## Steps

1. **System.** Make these the only tokens in `index.css`:
   - Colors: off-white background, near-black ink, one grey, and one red used for links only.
   - One readable text serif for all copy (EB Garamond or Source Serif 4, self-hosted woff2
     subsets via the Fontsource CDN, the same way the current fonts are). Inter only for small
     UI labels.
   - Sizes: body (about 16–17px) and one small label size, no smaller than 12px. A larger size
     only if it's clearly needed on the inner page.
   - A fixed spacing scale, a column about 720px wide, and text capped at about 560px.
   - Fix overflow at the root (both `html` and `body`, and remove the overhanging elements).
     Don't mask it.
   - Define the **project data shape** in `web/src/content/projects.ts`:
     `{ slug, title, group: 'compliance' | 'coding', line /* ≤20 words, plain */, media: { type: 'video' | 'image', src, poster?, width, height }, links: { label, href }[], status? }`.
     Seed it with Yozora, Recon and RL Playground from `builds.ts`, then delete `builds.ts`.
     **After this step, write the shape into Results**, because handoffs 2 and 3 depend on it.
     From then on, handoff 3 owns `projects.ts` and `public/img/projects/`; don't edit them
     after that point.
2. **Delete:** Lanyard/HeroBadge/`badge.ts` and the three.js dependency, HeroName (Leon Sans
   and `src/vendor/leon.js`), Thread, Seal, GithubActivity, EngagementMap, PersonnelRecord,
   EvidenceTrail, Exhibits, DemoDialog, NotePreview, all stamps, the dot grid, offset shadows,
   section bands and the motion tokens that only those used. Remove any dependencies that
   become unused.
3. **Homepage (`index.html`):** one column, in this order:
   1. A small portrait with 2–4 short first-person paragraphs: role (Assistant Manager, Cyber
      Strategy & Governance, KPMG Bangalore), what he does (cyber risk, ITGC and ISO audits
      for regulated enterprises), and that he builds tools for assurance work.
   2. Links: Email (copy button), LinkedIn, CV (`/cv.pdf`).
   3. **Work:** plain rows for KPMG (2022–now) and Mitkat Advisory (May–Sep 2021, Risk
      Intelligence Analyst, Mumbai). KPMG links to `/kpmg`.
   4. **Compliance builds:** placeholder tiles for Yozora and Recon from `projects.ts`.
   5. **For the love of coding:** placeholder tiles; handoff 3 fills these.
   6. **Credentials:** one line of text with three ISO lead-auditor certs (27001:2022,
      27701:2019, 22301:2019) and two degrees (MBA Finance and B.Tech IT, both NMIMS).
   7. **Writing:** one line with a link to the LinkedIn notes (URL in `content/notes.ts`).
   8. Footer.

   A tile is a full-width bordered media block with a bold title and one grey line under it.
   Facts come only from the existing content files. Invent no metrics, client names or claims.
   Use the existing badge photo as the portrait placeholder; Saqlain will supply a new one.
4. **`/kpmg` page (`kpmg.html`, a second Vite entry; no router dependency):**
   - A short intro.
   - The engagements as one plain table (5 rows from `content/experience.ts`). Columns:
     engagement, frameworks/regulation, result. Each row expands to show what he owned.
   - It must work the same way at 390px (stacked rows, not a squeezed table).
   - A back link to the homepage.
5. **Nav:** name on the left; Work, Builds, Writing and Contact links on the right (anchors
   on the homepage). On phones, keep it in one line if it fits. No hamburger unless it must.
6. **Smoke test:** rewrite `web/smoke-test.mjs` for the new structure. It must check:
   - no overflow at 1440 and 390
   - no text under 12px
   - one red in use
   - every external link has rel=noopener
   - the email copy button works
   - the `/kpmg` table rows expand
   - no console errors

## Constraints (decided, do not relitigate)

- No metaphor and no decoration: no stamps, badges, seals, reference-code costume, fake
  window chrome, dot grid, thread, tilt or hover-preview effects.
- Motion only inside the work (project videos playing when in view). No page-level effects
  beyond, at most, one subtle fade. Respect `prefers-reduced-motion`.
- Copy: plain and factual, first person, no catchphrases, no generic soft lines ("I think
  deeply about…"). Source facts from the content files and CV evidence; don't invent any.
- Velocity is dropped. The old field-notes list collapses to one line.
- Don't touch `site-v2/` or `archive/`, and don't edit CLAUDE.md or memory. Propose changes
  in Results instead.
- Keep the per-component style of the existing code (Tailwind classes, content in
  `src/content`).

## Verification

- Show the site while building: run `npm run dev` (from `web/`) and keep it open in the
  browser. Have a Sonnet subagent take screenshots at 1440×900 and 390×844 (playwright-core
  is in the repo root's node_modules) after steps 3 and 4. Fix what it finds.
- Run `npm run build` and `npm test` from `/Users/saqlainmomin/personal-site`, and paste the
  summaries into Results.

## Report back

Append a `## Results` section to this file containing:
- the project data shape (from step 1)
- the list of deleted files and dependencies
- the screenshot paths
- the test output
- open issues
- proposed copy for Saqlain to edit

## Results

### Step 1 checkpoint: project data shape (ready for handoffs 2 and 3)

`web/src/content/projects.ts` exports:

```ts
interface ProjectMedia { type: 'video' | 'image'; src: string; poster?: string; width: number; height: number }
interface Project {
  slug: string
  title: string
  group: 'compliance' | 'coding'
  line: string                       // one plain line, 20 words max
  media: ProjectMedia
  links: { label: string; href: string }[]
  status?: string
}
export const projects: Project[]     // seeded: yozora, recon (compliance), rl-playground (coding)
```

Handoff 3 owns `projects.ts` and `public/img/projects/` from now on.

### Deleted

- Components: `Lanyard`, `Thread`, `Nav` (rewritten as `Layout`), `hero/*` (Hero, HeroBadge, HeroName), `experience/*` (Experience, PersonnelRecord, EngagementMap), `builds/*` (Builds, EvidenceTrail, Exhibits, DemoDialog), `credentials/*` (Credentials, Seal, GithubActivity), `writing/*` (FieldNotes, NotePreview), `contact/*`, `ui/*`, `App.tsx`
- Lib/vendor: `lib/badge.ts`, `lib/motion.ts`, `vendor/leon.js` + `leon.d.ts` + `LICENSE.leonsans`
- Content: `content/builds.ts` (seeded `projects.ts` from it); `notes.ts` cut to the one LinkedIn link; `credentials.ts` cut to certs and degrees; `experience.ts` lost areas, `touches`, `mapGroups` (case files now carry `frameworks`)
- Assets: `public/img/notes/*` (7), `public/img/projects/velocity-dashboard-crop.webp` (Velocity dropped), fonts Instrument Serif x2 and JetBrains Mono, `components.json` (shadcn/react-bits registry config)
- CSS: dot grid, thread, badge sway, engagement map, reveal and scribble, surface-warm, motion tokens, all stamp/seal/offset-shadow styles. `index.css` is now 4 colours, 2 sizes, 1 spacing scale
- Dependencies removed: `three`, `@types/three`, `qrcode-generator`
- Added: `public/fonts/eb-garamond-latin-wght-normal.woff2` (Fontsource variable, 400-800); Inter kept for labels

### What was built

- `web/src/index.css` tokens: paper #FAFAFA, ink #2B2B2B, grey #6B6B6B, link red #B42318 (links only), hairline #E2E2E0; sizes 17px body and 13px label; spacing xs/sm/md/lg/xl (8/16/24/40/64); column 720px, text 560px.
- Overflow: `overflow-x: hidden` removed from body and nothing overhangs, so there is no masking. Both `html` and `body` scrollWidth equal innerWidth.
- Homepage `index.html` -> `src/pages/Home.tsx`; `/kpmg` -> `kpmg.html` + `src/kpmg.tsx` + `pages/Kpmg.tsx` (second Vite entry, no router). `vite.config.ts` has a small plugin rewriting `/kpmg` to `kpmg.html` in dev and preview; Vercel uses `cleanUrls`. `/kpmg` added to sitemap.
- Nav: name left; Work, Builds, Writing, Contact right; one line at 390 (no hamburger). Contact anchor is the "Get in touch" block near the top.
- KPMG table: native `<details>` rows; 3-column grid on desktop, stacked with inline labels at 390. Videos play only in view and not under reduced motion. No page-level fade added.
- Smoke test `web/smoke-test.mjs` rewritten: 38 checks.

### Screenshots

`tasks/handoffs/screens/plain-letter/`: home-1440.png, home-390.png, kpmg-1440.png, kpmg-390.png, kpmg-open-1440.png, kpmg-open-390.png (taken by a Sonnet subagent). I looked at home-390 myself: single column, no overflow, media full width. I did not read the subagent's written review before writing this, so check the other five.

### Test output

- `npm run build` (repo root): passes, `dist/index.html`, `dist/kpmg.html`, one shared JS chunk ~224 kB (70 kB gzip), no chunk warning.
- `npm test` (repo root): exit 0. site-v2 smoke test passed; web smoke test "38 checks passed" (overflow, text >= 12px, one red, rel=noopener, images load, one h1, no console errors or 4xx at 1440 and 390 on both pages; nav anchors and one-line nav; KPMG link; email copy writes the clipboard; video in view and reduced motion; 5 KPMG rows expand, table on desktop, stacked on phone). `oxlint` is clean.
- Nothing committed. Branch `feat/plain-letter`.

### Open issues

- Portrait is the existing badge photo, cropped to 96px; swap when the new one arrives (`content/profile.ts`).
- The Yozora tile shows the older CyberAssess prototype video, labelled "In development · synthetic demo data". Handoff 2 replaces it.
- Coding group has only RL Playground until handoff 3.
- `og-image` and the `index.html` JSON-LD/meta still describe the old site wording; not changed. `tasks/todo.md` was already modified before this session; I did not touch it.
- Proposed (not applied): the project CLAUDE.md, if one exists, should drop mentions of three.js, Leon Sans and the audit-file design.

### Proposed copy (edit freely; all in `content/profile.ts` unless noted)

1. I'm an Assistant Manager in Cyber Strategy & Governance at KPMG in Bangalore.
2. I run cyber risk, ITGC and ISO audits for regulated enterprises, from the first gap assessment to ongoing delivery.
3. I also build tools for assurance work: software that helps consultants assess evidence and screen vendors.
4. I'm open to GRC, cyber risk and security assurance roles.
- Writing line (`pages/Home.tsx`): "Short notes on AI agents and what they mean for security controls, on LinkedIn."
- KPMG intro (`pages/Kpmg.tsx`): "Since July 2022 I have worked in Cyber Strategy & Governance at KPMG in Bangalore. These are the five kinds of engagement I have worked on."

### Screenshot review follow-up

Fixed after the subagent review: stray toggle glyph on opened rows at 390 (now pinned top-right), wider Result column on /kpmg, gap between role line and summary in Work rows. Not fixed: at 1440 the subagent saw the Yozora tile as a spinner on white, which is the first frame of the old CyberAssess video, not a load failure (the poster is a different frame); handoff 2 replaces this media. Section spacing (64px) and heading size (same as body, bold) are as specified.
