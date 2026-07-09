# Prisoner's Dilemma — capture new views and update the site

## Context

The Prisoner's Dilemma project at `~/Prisoners_dilemma` (GitHub: `saqlainmmomin/Prisoners_dilemma`) was just extended with two new views beyond the original tournament:

- **Spatial** — a 16×16 grid-world (`SpatialWorld`, in `spatial.py`) where strategies play out spatially.
- **Evolution** — a genetic algorithm (`Evolver`, in `evolution.py`) breeding finite-state-machine strategies (`strategies/fsm_strategy.py`) over generations.

These live in a new combined Pygame app at `ui/app.py` with a tab bar (`Tournament | Spatial | Evolution`), run via `python -m ui.app`. The original single-file `ui.py` was replaced by the `ui/` package, but a back-compat shim (`ui/__init__.py` → `TournamentUI`) preserves the exact old interface so the existing `capture.py` script still works unchanged for the Tournament view.

The personal site (`~/personal-site`) currently shows only the old Tournament view for this project — a looping video (`pd-tournament.mp4` + `pd-tournament-poster.png` in `public/img/projects/`) wired into the "reinforcement learning · game theory" row. That row's `image` block is at `src/components/WorkList.astro` (search for `tag: 'reinforcement learning`).

## What's already true (don't re-derive)

- `capture.py` already ran today and produced a fresh `tournament.gif` (1MB) in `~/Prisoners_dilemma` — the Tournament view itself didn't change visually, just got a new contestant (`EvolvedFSM`, bred by `evolution.py`, loaded from `logs/evolved_population.json` if it exists).
- There is **no existing capture path for Spatial or Evolution** — `capture.py` only drives `TournamentUI`/`TournamentView`. You'll need a new small script for whichever of these two you capture.
- The clean way to drive Spatial/Evolution headlessly, bypassing the interactive tab bar entirely, is to instantiate the controllers directly from `ui/app.py`:
  ```python
  from ui.app import SpatialController, EvolutionController
  # or: from ui.app import TournamentController
  ```
  Each controller is a no-arg class with `.step()` (advances the simulation) and `.render(surface, mouse_pos=None)` (draws one frame). This is exactly the same shape `capture.py` already uses for `TournamentUI` — loop `step()` → `render()` → `pygame.image.save()` every Nth frame → assemble with ffmpeg, same as the existing `capture_frames/` → `tournament.mp4` pipeline. `SpatialController`/`EvolutionController` create their own `SpatialView(width=1400, height=900-56)` / `EvolutionView(...)` internally, so you don't need to touch the view classes directly.

## Decision to make with the user first

Don't just pick one — ask: feature **one** new view (replacing the current Tournament clip), or **all three** as a multi-clip/tabbed showcase (more work, more impressive, mirrors how the site already shows multiple angles elsewhere)? My read: **Evolution** is the strongest single pick if only one — "strategies bred by a genetic algorithm, not hand-coded" is a sharper builder-narrative hook than Spatial, and ties into the existing `EvolvedFSM` already wired into the classic tournament. But confirm before doing the work.

## Capturing it

This is a native Pygame window, not a browser — Playwright doesn't apply here. Pattern to follow (mirrors `capture.py`):

1. Write a short script that imports the relevant controller(s), runs `step()`+`render()` in a loop for enough iterations to show real progression (Evolution: enough generations for fitness/genome to visibly change; Spatial: enough steps for the grid pattern to evolve), saving frames to a `capture_frames/` dir every Nth frame (`capture.py` uses `CAPTURE_SKIP = 3` at 30fps).
2. Assemble frames into a video with ffmpeg (`ffmpeg -framerate 30 -i frame_%06d.png -c:v libx264 ...`), same as the existing `tournament.mp4`.
3. Copy/convert into `~/personal-site/public/img/projects/` — match existing naming (`pd-evolution.mp4` + `pd-evolution-poster.png`, or similar).

## Website-side conventions established this session (follow these — don't reinvent)

These were all worked out the hard way across Recon/Velocity updates earlier this session. Read [WorkRow.astro](../src/components/WorkRow.astro) before editing it.

- **Card chrome**: every project preview is wrapped in `<figure class="preview">` with a `.preview-bar` mono label (e.g. `"recon — cloudflare.com scan"`). Keep the same pattern, e.g. `"prisoner's dilemma — evolution"`.
- **Natural sizing, no forced crop**: `.preview video, .preview picture img { width: 100%; height: auto; }` — images/video are NOT force-cropped into a fixed aspect-ratio box anymore. Let the real content dictate height.
- **CSS specificity gotcha (already fixed, don't reintroduce it)**: the poster `<img class="preview-poster">` must stay hidden via a selector that doesn't collide with `.preview picture img` (which has higher specificity and would override `display:none`). Current correct rule: `.preview-poster { display: none; width: 100%; height: auto; }` paired with `.preview video, .preview picture img { ... }` — note `picture img`, not a bare `img`. If you add a new video+poster pair, this is why the poster won't "leak" through.
- **Video pacing**: if you capture a long simulation (e.g. evolution running many generations), do NOT just uniformly speed it up — measure how long the "boring middle" actually is vs. the interesting reveal, and use a non-uniform ffmpeg speed ramp (`trim`+`setpts=(PTS-STARTPTS)*factor` per segment, then `concat`) so dead time gets compressed hard and the actual payoff (e.g. best genome's fitness converging, final tournament ranking) holds on screen for several real seconds. This bit us with the Recon demo — the result was visible for under a second until we fixed it.
- **Trim blank pre-paint/init frames**: the very first captured frame(s) of a fresh window/page are sometimes blank (pygame window not yet drawn, or browser pre-paint). Check frame 0 before using it as a loop start or poster — trim it if blank.
- **Poster frame**: extract with `ffmpeg -ss <near-end> -update 1 -frames:v 1 poster.png`, not `-sseof` (seeks to nearest keyframe, can land on the wrong frame).
- **`prefers-reduced-motion`**: video/poster swap is handled by existing CSS (`@media (prefers-reduced-motion: reduce)`), no changes needed there.

## To update

1. Capture the agreed view(s) per above.
2. Process into web-ready assets in `public/img/projects/`.
3. Edit the PD `image` block in `src/components/WorkList.astro` (current block shown below) — update `video`/`poster`/`label`/`alt` to match what you captured. If showing more than the Tournament view, decide whether to replace it outright or extend `WorkRow.astro`'s `Project.image` type to support multiple clips (currently one video+poster OR one picture+webp per project — extending to a list is a bigger change, confirm with the user first rather than assuming).
4. Verify with the dev server (`npm run dev`, port from `.claude/launch.json`) in both auditor/builder reading modes and at mobile width before calling it done.

Current block to edit, in `src/components/WorkList.astro`:
```js
image: {
  src: '/img/projects/pd-tournament-poster.png',
  alt: 'Prisoner\'s dilemma tournament — strategy competition running over thousands of iterations',
  poster: '/img/projects/pd-tournament-poster.png',
  video: '/img/projects/pd-tournament.mp4',
  label: 'prisoner\'s dilemma — tournament #1',
},
```
