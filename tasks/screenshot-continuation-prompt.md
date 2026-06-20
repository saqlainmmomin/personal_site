# Portfolio Screenshots — Continuation Prompt

Paste this into a fresh Claude Code session from `~/personal-site/`:

---

I'm adding real screenshots and visuals to my personal portfolio site's project rows. Read the vault note `01-projects/personal-site.md` and the plan at the bottom of `~/personal-site/tasks/todo.md` for full context.

## What's already done
- **Prisoner's Dilemma**: MP4 (143KB, 27s autoplay loop) + poster PNG already in `public/img/projects/pd-tournament.mp4` and `pd-tournament-poster.png`. The Pygame UI in `~/Prisoners_dilemma/ui.py` was rewritten for portfolio-grade visuals — dark navy, glowing nodes, anti-aliased everything. `capture.py` produces the GIF/MP4.
- **Recon repo renamed**: `cyberdd` → `github.com/saqlainmmomin/Recon`. The link in `WorkList.astro` line 36 is already fixed.

## What needs to happen now (in this order)

### 1. Velocity screenshot (`~/Velocity` — React + Express + SQLite)
- Boot the app: `node server.js` for the backend, then `npm run dev` in `client/` for the frontend
- May need a Gemini API key in `.env` — the UI should render from existing SQLite data regardless
- Screenshot the "Mission Control" dashboard showing scored AI developments with opportunity/disruption/knowledge-gap badges
- Save to `public/img/projects/velocity-dashboard.png`

### 2. Recon screenshot (`github.com/saqlainmmomin/Recon` — clone needed)
- Clone to `~/Recon` if not already there
- It's a React 19 + async Python (FastAPI) project — 6 domain scanners + red-flag detector
- Boot and screenshot the scan result page showing 6 scanner panels + the red-flag verdict
- The scanners may need network access to produce real data — if they can't run, check if there's seed/mock data
- Save to `public/img/projects/recon-scan.png`

### 3. Wire all project images into the site
The 4 projects live in `src/components/WorkList.astro` as a `Project[]` array rendered by `WorkRow.astro`. Currently text-only.

- Extend the `Project` interface in `WorkRow.astro` with an optional `image` field (path to the asset, and optionally a `builderImage` variant + `caption`)
- For Prisoner's Dilemma: use `<video autoplay muted loop playsinline poster="/img/projects/pd-tournament-poster.png" src="/img/projects/pd-tournament.mp4">` — it's 143KB, no lazy-load needed
- For Velocity and Recon: use `<picture>` with WebP/PNG fallback, `loading="lazy"`, themed border matching auditor/builder palette
- Render a `<figure>` below the meta line in each `WorkRow`, styled to the dual-reading palette
- All images are below the fold — LCP is unaffected

### 4. CyberAssess — SKIP for now
CyberAssess screenshots are deferred until after a separate cleanup session. Don't attempt to boot `~/dpdpa-gap-tool/` — it has Python version issues. Leave its row as text-only for now; the `image` field being optional handles this.

### 5. Verify
- Boot the personal site dev server (`npm run dev`)
- Check all 4 project rows in both Auditor and Builder reading modes
- Verify mobile (<=640px) — images should stack or hide gracefully
- Verify reduced-motion — video should show poster only
- Check LCP is still sub-1s (images are below fold, so should be fine)

## Ground rules
- The site is Astro 6, zero UI framework, static-first. No React, no client-side JS beyond what exists.
- Earth-tone palette: auditor = warm ivory/espresso/cypress green, builder = chinese black/warm cream/antique brass.
- Sub-1s LCP, reduced-motion-first, a11y.
- WebP via `cwebp` (available). No avifenc on this machine.

---
