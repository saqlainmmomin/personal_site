# Handoff 3 of 3: project tiles and footage

Run order: start **after handoff 1** (`2026-11-16-plain-letter-foundation.md`) has written the
project data shape into its Results. It can run in parallel with handoff 2. Run as a Sonnet
session, with **one Sonnet subagent per project**, in parallel.

## Goal

Fill the two project groups on Saqlain Momin's portfolio homepage
(`/Users/saqlainmomin/personal-site/web`):
- **Compliance builds:** Yozora (its tile media comes from handoff 2) and Recon.
- **For the love of coding:** AirPosture (the head-tracking app), Tell Me How (the polymath
  app), RL Playground and Munshi.

For each project: find or make strong footage, write one plain line, collect links, and add
the entry to `web/src/content/projects.ts`.

**Done means:** every project has an entry with:
- media: a short muted looping mp4 and a webp poster in `web/public/img/projects/`
- a description line of 20 words or fewer
- links

It also means: the homepage shows all tiles correctly at 1440px and 390px, every project
missing footage is listed for Saqlain with exactly what's needed, `npm run build` and
`npm test` pass, and Results are written below.

## Projects and where to look

| Project | Group | Source folder | Notes |
|---|---|---|---|
| Recon | compliance | `/Users/saqlainmomin/Recon/` | Has `web/public/img/projects/recon-demo.mp4`. Vendor security screen: six scanners run in parallel, and fixed rules set the risk tier before any AI step. |
| AirPosture (head tracking) | coding | `/Users/saqlainmomin/unshrimp/` | iOS posture app using head tracking. Has a website (`AirPosture-Website/`), `App-Assets/` and `design/`. Look for screen recordings and marketing assets. |
| Tell Me How (polymath app) | coding | `/Users/saqlainmomin/tell-me-how/` | Read `PRODUCT.md` and `CLAUDE.md`; there are `prototypes/` and `ios/`. Confirm the product name from `PRODUCT.md`. |
| Munshi | coding | `/Users/saqlainmomin/munshi/` | Renter-side apartment search agent for India. Saqlain says a demo UI exists: check `apps/`, `design/` and `docs/`. |
| RL Playground | coding | already in the site | Has `web/public/img/projects/pd-evolution.mp4`. Source is probably `/Users/saqlainmomin/iterated_prisoners_dilemma/` or `/Users/saqlainmomin/Prisoners_dilemma/`. Confirm which repo the GitHub link should point to. |

Yozora's homepage entry is just its title, line and links. Its tile shows the `YozoraPreview`
component from handoff 2 instead of a video, so leave a `media` placeholder and note it.

## Each project subagent should

1. Read the README or PRODUCT doc and find the existing footage: `*.mp4`, `*.mov`, `*.gif`,
   screen recordings, and screenshots in the repo (search the whole folder, not just the top
   level).
2. If there's good footage: trim it to a 6–12 second loop that shows the product doing its
   main thing, muted, about 1280px wide, ideally under 3 MB. Use `ffmpeg` if it's installed;
   if not, report that and don't install it. Export a webp poster from a representative frame.
3. If the only option is a runnable web demo UI (for example Munshi), it may run it locally
   and record it with playwright-core's video recording (in
   `/Users/saqlainmomin/personal-site/node_modules`). Don't install packages, and don't
   change anything in the project repos.
4. If no usable footage exists: **don't fake it.** Report exactly what Saqlain needs to
   record (which screen, which action, how long).
5. Write one plain line about what the project does, in 20 words or fewer. It must be factual,
   with no catchphrases and no claims the repo doesn't support. Collect links: GitHub (from
   `git remote -v`), and a live site if one exists.

## Constraints

- This session owns only `web/src/content/projects.ts`, `web/public/img/projects/` and this
  file. If a tile needs a component change (for example a different aspect ratio), propose it
  in Results rather than editing shared components. Handoff 2 owns `web/src/yozora/**`.
- Project folders are **read-only**.
- No credentials, private client names or `.env` contents in copy, footage or this file.
  Check that recordings don't show secrets, emails or private data.
- Velocity is dropped; don't add it back.
- Design is decided (plain, single column, a full-width bordered tile, a bold title and one
  grey line). Don't add tags, badges or overlays on the media.
- Don't commit (Saqlain ships with `/ship`).

## Verification

- Run `npm run dev` from `web/`. A Sonnet subagent screenshots the homepage project sections
  at 1440×900 and 390×844 and checks the following:
  - every video loads and loops muted
  - every poster shows
  - no overflow
  - no console errors
- Check the file sizes in `web/public/img/projects/`.
- Run `npm run build` and `npm test` from `/Users/saqlainmomin/personal-site`.

## Report back

Append `## Results` to this file. Include:
- a table with one row per project: footage source, output files and sizes, line, links, and
  status (done / needs recording)
- the exact recording requests for Saqlain
- the screenshot paths
- the test output

## Results

Entries for all six projects are in `web/src/content/projects.ts`. `npm run build` and `npm test` pass (38 checks). Nothing committed.

| Project | Footage source | Output (size) | Line | Links | Status |
|---|---|---|---|---|---|
| Yozora | handoff 2 supplies a `YozoraPreview` component | placeholder: the old `cyberassess-demo.mp4` and poster | existing line, unchanged | GitHub (Cyber) | Placeholder media; handoff 2 replaces it |
| Recon | existing `recon-demo.mp4` | `recon-demo.mp4` 75 KB, 800×500, 11.5 s; poster 20 KB | existing line, unchanged | GitHub (Recon) | Done |
| AirPosture | `unshrimp/unshrimp_demo_v2 2.MP4`, 7.5–17.5 s | `airposture-demo.mp4` 884 KB, 1280×960, 10 s; poster 43 KB | "iOS app using AirPods head tracking to show posture state and alert when head angle passes a threshold." (17 words) | GitHub (`saqlainmmomin/unshrimp`), Site (`airposture.github.io`, from the README, not checked to resolve) | Done, with three caveats below |
| Tell Me How | Recorded from the real iOS app on a simulator, using a scratchpad copy of the repo | `tell-me-how-demo.mp4` 163 KB, 1280×720, 9 s; poster 16 KB | "iOS app of short animated how-things-work topics, narrated by voice, each answering one question." (14 words) | GitHub (`saqlainmmomin/Polymath`) | Done |
| RL Playground | existing `pd-evolution.mp4` | `pd-evolution.mp4` 1.3 MB, 1400×844, 10.5 s; poster 49 KB | existing line, unchanged | GitHub (`Prisoners_dilemma`) | Done |
| Munshi | Recorded a scroll of the marketing landing page; the real product needs credentials to run | `munshi-demo.mp4` 617 KB, 1280×720, 12 s; poster 32 KB | "Renter-side apartment search agent for India. Bengaluru pilot, concierge-assisted, in development." (13 words) | GitHub (`saqlainmmomin/Munshi`) | Needs recording |

### What Saqlain needs to confirm or record

- **Munshi (needs recording):** the current clip is a landing-page scroll, not the product. Record 8–12 s of the running app at `/party/[id]/review`, using seed data from `db/seed.sql` and no real renter data. A batch of ranked flats appears, you approve or reject two or three, then open `/party/[id]/shortlist`. The Munshi README also says "no production implementation yet" while the repo has an app and a worker, so reconcile that before the tile claims anything.
- **AirPosture authorship:** `unshrimp` is a fork of `allenv0/AirPosture`. The README is written by someone else and says the project is "on hold". I labelled the tile "Fork of an open-source app", and you should confirm that label and say what you built. The upstream is at `github.com/allenv0/AirPosture`.
- **AirPosture footage:** the clip shows a person's face. Confirm it is you, or that you have the right to publish it. I saw no emails or secrets in the frames.
- **AirPosture loop:** the clip starts green and ends orange, so the loop visibly jumps. A cleaner clip would start and end upright.
- **Tell Me How:** the clip is a 9 s slice of a roughly 84 s narration, so it also does not loop smoothly. The app is a prototype and not on the App Store, so the tile says "iOS prototype". The repo is named `Polymath` while the product is "Tell Me How". I left out the testers' claude.ai link, which CLAUDE.md says not to republish.

### Decisions I made

- **Tell Me How letterbox:** the recording was portrait (588×1280), which would be about 1500 px tall at full width. I re-encoded it as a 1280×720 video with the phone centred on the line grey (`#E2E2E0`) instead of proposing a component change. That keeps every tile landscape.
- **Posters:** posters were made with `cwebp`, because this ffmpeg build has no libwebp.

### Screenshots

- `tasks/handoffs/screens/project-tiles/home-1440.png`
- `tasks/handoffs/screens/project-tiles/home-390.png`

At both 1440 and 390, a Sonnet subagent found:
- all six tiles render
- each video has a poster, loads, is muted and loops
- no overflow
- no console errors or 4xx responses

Visual notes from that review, which I have not looked at myself:
- The Munshi video is cropped at the top, so the "In Bengaluru" headline is partly cut off.
- Yozora shows the old CyberAssess media, as expected.
- Tell Me How sits in a grey letterbox.

The subagent saw 5 of 6 videos paused after scrolling back to the top, and Munshi still playing. It did not check why.

### Test output

- `npm run build`: passes.
- `npm test`: exit 0, "38 checks passed".

### Update after Saqlain's follow-up (same day)

- **Unshrimp:** the AirPosture tile is renamed Unshrimp. Per Saqlain, the AirPods head-tracking base comes from AirPosture (one axis), they extended it to full head tracking, and they did the app and UI design. The footage is Saqlain. Links are their repo and the original AirPosture repo. The "fork" status label is dropped.
- **Munshi:** footage replaced with a 14 s recording of the interactive web prototype `munshi/design/explorations/volcanic-graphic.html` (photo carousel, pass with reasons, shortlist toast), 1.0 MB. Status reads "In development · clip is the web design prototype". The page shows its own "throwaway, not wired to real data" note in frame.
- **Tell Me How:** now a three-phone gallery of real simulator recordings: car engine (blueprint), sky colour (airbrush), moon tides (wireframe). Each is 588×1280, 76–247 KB. The old single clip is deleted. The line now ends "Each topic has its own visual style."
- **Component change:** `ProjectTile.tsx` gained an optional `gallery` (three clips side by side in one frame), and `projects.ts` got a matching `gallery` field.
- **Scroll reveal:** `Layout.tsx` adds a fade-up reveal on headings, paragraphs, list items, images and videos (70 ms stagger, off under reduced motion), with CSS in `index.css`. A subagent checked that all 47 elements reveal and nothing stays hidden, and that reduced motion shows everything.
- **Checks:** `npm run build` passes. `npm test` passes with 52 checks. Screenshots are in `screens/project-tiles/` (`coding-1440.png`, `coding-390.png`). A subagent found no overflow and no console errors; I haven't looked at those screenshots myself.
