# Proposal — Scroll-Driven "Death of Socrates" Hero

Status: **approved — decisions locked 2026-06-10.**

Locked decisions:
1. **Placement:** Socrates prelude *above* the existing Lens hero, resolving into the name/identity.
2. **Engine:** WebGL fragment shader (single fullscreen quad), with static-image fallback.
3. **Dependency:** `ogl` (~8KB) permitted.
4. **Images:** user generates source stills externally from §5 prompts; build proceeds with programmatic placeholders until real stills land in `public/img/`.

---

## 1. Codebase Audit

### What already exists

| Area | Reality |
|------|---------|
| Stack | Astro 6.4.4, **zero** UI framework. Dependencies are only `astro` + `@astrojs/sitemap`. No React, no GSAP, no Three.js, no canvas/WebGL anywhere. |
| Hero | `src/components/Lens.astro` — a "Name First" hero with a dual-reading toggle (Auditor/Builder) backed by `src/lib/reading.ts` and `ReadingOverlay.astro` (a fixed crossfade overlay). LCP element is the serif `<h1>` name. |
| Scroll architecture | **A proven, dependency-free scroll-scrub pattern already lives in `ClosingWindow.astro`:** a `position: sticky` stage held open by tall trigger blocks, scroll progress computed from `getBoundingClientRect()` mapped to `0..1`, throttled with `requestAnimationFrame`, re-skinned per frame. This is exactly the mechanic the Socrates piece needs. |
| Rendering pipeline | Static-first. CSS inlined at build (`inlineStylesheets: 'always'`), HTML compressed, fonts self-hosted woff2 (IBM Plex Serif/Sans/Mono), two faces preloaded. Per-component `<script>` blocks are bundled as tiny ES modules. |
| Asset loading | **No image pipeline at all.** Site is text-only by deliberate decision (`DESIGN.md` §0: "Photo: text-only; LCP is text"). Only binary assets are fonts + `cv.pdf` + `favicon.svg`. |
| Accessibility / motion | Load-bearing. Every motion mechanic has a static SSR fallback and a `prefers-reduced-motion` branch. Global media query kills animation; per-mechanic guards exist. WCAG AA contrast verified per token in `tokens.css`. |
| Performance posture | Explicit sub-1s LCP target; islands hydrate `client:idle`/`client:visible`; JS budget ~15KB gzipped for interactive islands. |

### What can be reused

- **The scroll-scrub engine** from `ClosingWindow.astro` (sticky + scroll-progress + rAF + reduced-motion/static fallback). The Socrates scene is the same shape: one pinned stage, scroll → `0..1` progress, progress drives the visual.
- **`tokens.css`** palette — the existing dark "Window register" (`--win-bg #07080b`, `--human #6ea8fe`, `--machine #f5a623`) is already a near-black, high-contrast, blue-human / amber-machine system. The Socrates monochrome + the "human reaching toward machine" symbolism map onto these tokens almost 1:1.
- **The reduced-motion / SSR-final-state philosophy** — copy it verbatim: render the final dithered frame as a static image; JS only upgrades to scroll-driven.
- **Nav reveal pattern** (`IntersectionObserver` hiding nav over the hero) — works unchanged regardless of what the hero contains.

### What should be replaced / added

- The hero's role changes: today `Lens.astro` *is* the first screen. The Socrates piece becomes a new pinned scene either **above** or **in place of** the Lens hero (decision below).
- A **new asset class**: 2–4 monochrome source stills (the first images the site will ever ship). This is a genuine departure from the text-only decision and must be weighed against LCP.
- A small **WebGL render layer** (recommended approach) — the one new runtime capability.

### Technical risks

1. **LCP regression.** Today the LCP is instant serif text. Any large hero image pushes LCP onto a decoded raster. Mitigation: keep the *text* identity as LCP and treat the art as a progressively-enhanced layer; ship a tiny poster (blurred, <30KB AVIF) as the first paint.
2. **WebGL availability / low-end mobile.** ~2–3% of contexts fail or are slow. Mitigation: capability-detect; fall back to a static dithered `<img>` (which is also the reduced-motion and no-JS state). The shader is never load-bearing.
3. **Scroll-jank on long pinned scenes.** Mitigation: reuse the rAF-throttled, passive-listener pattern already in the repo; do all heavy work on the GPU (one fullscreen quad), keep the JS per-frame work to setting one float uniform.
4. **Art-direction iteration cost.** The hard part is not code — it's getting source stills that read as "modern, cinematic, not a museum repro," with the hands legible and enough negative space. This needs 2–4 generation rounds. Budget for it.
5. **Narrative/identity dilution** (see §3) — an art-piece-first hero can bury the name/role on a job-search-facing site.

---

## 2. Implementation Strategy

### Evaluation against *this* codebase's constraints (zero-dep, sub-1s LCP, reduced-motion-first, no image pipeline)

| Option | Visual ceiling | Effort | Maintainability | Perf / weight | Fit | Verdict |
|--------|---------------|--------|-----------------|---------------|-----|---------|
| **A. GSAP ScrollTrigger + layered images** | Medium — crossfades/zoom only; halftone/dither must be pre-baked into images | Low–Med | Med (adds GSAP ~30KB + learning a scroll lib the repo doesn't use) | Med | GSAP duplicates the scroll engine the repo *already has* | Reject (redundant dep) |
| **B. Image-sequence (frame-by-frame)** | **Highest** — every frame art-directed | Med code / **High asset production** | Med | **Poor** — 60–120 stills = multi-MB, decode jank on mobile, LCP risk | Fights the sub-1s budget hard | Reject as primary; borrow its "stills" idea at small N |
| **C. SVG morphing** | Medium — beautiful for hand *geometry* + dot patterns, but cannot render an oil-painting texture dissolving | Med | High (pure vector, no runtime) | Excellent (tiny) | Can't carry the painterly→raster evolution from a single source | Reject as primary; useful for the final dot field |
| **D. Three.js** | High | High | Low (heavy abstraction for one quad) | Poor (~150KB) | Violates zero-dep / LCP ethos for a 2D effect | Reject (overkill) |
| **E. React Three Fiber** | High | High | Low | Worst (~200KB + React runtime into a framework-free site) | Hard no | Reject |
| **F. Shader-based transitions (raw WebGL / ogl)** | **Highest for *this brief* specifically** — zoom, crossfade, halftone, Bayer dither, CRT scanlines, bloom, grain, blur are all native fragment-shader operations from a single source texture | Med | High once written (one ~120-line shader, isolated) | **Excellent** — one fullscreen quad, GPU-driven, ~8–12KB runtime (`ogl`) | Mirrors the repo's "static fallback + JS upgrade" model perfectly | **Recommended** |

### Recommendation: **Hybrid — Option F (shader) as the engine + a tiny set of Option B stills as input, driven by the repo's existing scroll-progress pattern.**

**Why this wins.** The brief is, at its core, *image processing over scroll*: a painterly image that zooms, simplifies, then turns into halftone → dither → CRT → minimalist dots. Those are exactly the effects a single fragment shader does in real time — so instead of pre-rendering and shipping dozens of heavy frames (Option B's fatal weight), we ship **2–3 source stills** and let the GPU generate every intermediate state from a single `uProgress` uniform.

The one thing a shader *can't* invent from a single image is the **hand repositioning** (Socrates' chalice grip → the Adam-style reaching gap). We solve that with exactly **two composition stills** crossfaded in-shader as progress crosses a threshold: Still A (full Socrates composition) and Still B (two hands, Adam-style layout, near-touching). The chalice "disappears" by being absent from Still B and faded out during the crossfade window.

This hybrid is the *only* option that simultaneously: hits the visual ceiling the brief demands, stays inside the sub-1s LCP / low-JS budget, and degrades to a static image for reduced-motion / no-JS / no-WebGL — which is the non-negotiable house style here.

**Runtime choice:** `ogl` (~8KB gzipped, no React, pure WebGL helper) over raw WebGL boilerplate (faster to build, still tiny) and over Three.js (15× heavier). If the user wants *literally zero* new dependencies, raw WebGL in ~150 lines is viable — slightly more code, same result.

**Safe fallback path (if WebGL is vetoed):** Option A-lite *without GSAP* — reuse the repo's own scroll engine, layer the 2–3 stills as stacked `<img>`, and do halftone/dither with CSS (`background: radial-gradient` dot pattern + `mask` + `mix-blend-mode: screen`) crossfaded on scroll. Lower dither fidelity, zero shader risk, works everywhere. Presented as the conservative option.

---

## 3. Content Review — does the new hero change the site's meaning?

**Yes, and mostly in a good way — but it introduces one real risk.**

The existing site already argues *human cycles vs. machine cycles, ideas/standards failing to transmit fast enough, the gap toward machine intelligence* (`ClosingWindow.astro`, Field Notes thesis: "systems security for synthetic cognition"). The Socrates piece — *knowledge → mortality → transmission of ideas → technology → AI, hands reaching but never touching* — is the **poetic prelude to that exact argument.** It rhymes with "The Closing Window." So thematically it is *additive*, not contradictory.

**The risk:** this is a job-search-facing portfolio for a cyber-governance professional. An art-installation hero that delays the name, role, and value proposition can read as a designer's site, not a security practitioner's — and it moves the LCP off instant text onto a heavy image.

**Recommendation (content/IA):**

- **Keep the Socrates piece as a cinematic *Scene 0* prelude that resolves *into* the existing Lens hero**, rather than replacing it. Sequence: pinned Socrates scroll-story → final dithered "hands nearly touching" frame → the frame's negative space becomes the dark backdrop the name "Saqlain Momin" fades up onto. The art *delivers* you to the identity; it doesn't hide it. This preserves the text LCP (name fades up early / is in DOM for crawlers) and keeps the practitioner framing.
- **Headline / copy:** no rewrite of the Lens copy required. Add one quiet caption line tying the prelude to the thread: e.g. a mono kicker near the final frame — *"The frameworks will catch up eventually. I would rather be early."* (already the Contact closing line — restating it here bookends the narrative) — or a new line: *"Ideas outlive the people who hold them. The handoff is the dangerous part."* (decision deferred to copy round).
- **Section reordering:** none needed. The prelude sits above the current scroll order; `ClosingWindow` ("The window is closing") becomes the *intellectual* payoff of the *visual* metaphor introduced up top.
- **Messaging consistency:** the amber-machine / blue-human color language from `tokens.css` should govern the final dither frame (human hand cooler, machine hand warmer/amber), so the prelude and the chart speak the same visual language.

If the user instead wants the Socrates piece to **fully replace** the Lens hero, that's viable but I'd require a fast text-identity reveal inside the scene to protect LCP and recruiter-scan-ability. (This is decision #1 below.)

---

## 4. Asset Plan

Monochrome throughout; near-black background `#07080b` to match `--win-bg`. Source stills are generated once (see §5), everything else is procedural in-shader or CSS.

| # | Filename | Dimensions | Format | Transparency | Purpose | Animation role |
|---|----------|-----------|--------|--------------|---------|----------------|
| 1 | `socrates-full.avif` (+`.webp` fallback) | 2400×1600 | AVIF q60 | No (full frame) | Scene 1 composition: stylized Death of Socrates, chalice exchange centered | Shader texture `uTexA`; the zoom/simplify source |
| 2 | `hands-adam.avif` (+`.webp`) | 2400×1600 | AVIF q60 | No | Scene 4 composition: two hands, Adam-style layout, near-touching, no chalice | Shader texture `uTexB`; crossfade target as progress > ~0.6 |
| 3 | `final-dither.avif` | 1600×1067 | AVIF q70 | No | Scene 5 minimalist dithered frame (also the **static/reduced-motion/no-JS fallback** and the LCP poster) | `<img>` fallback + optional final-frame lock |
| 4 | `socrates-poster.avif` | 640×427 | AVIF q40, blurred | No | <30KB first-paint poster behind the canvas while WebGL inits | Instant first paint; swapped by canvas |
| 5 | `bayer8.png` | 8×8 | PNG (grayscale) | No | Ordered-dither threshold matrix | Sampled in fragment shader for dithering |
| 6 | `grain.png` | 256×256 | PNG, tileable | Alpha | Film grain / noise | Tiled, animated offset, `screen` blend (CSS or shader) |
| 7 | `scanlines` | — | procedural | — | CRT scanlines | Generated in shader (`sin(uv.y * lines)`), no asset |
| 8 | `vignette` | — | procedural | — | Edge darkening / negative space | Radial falloff in shader, no asset |
| 9 | `bloom` | — | procedural | — | Soft glow on highlights | Threshold + blur pass in shader, no asset |
| 10 | `dust` (optional) | 512×512 | PNG | Alpha | Floating dust motes | Optional CSS/particle layer; cut if budget tight |

Total shipped weight target: **< 250KB** for all stills combined (AVIF, monochrome compresses extremely well). Stills 1–2 lazy-load; only the poster (#4) and the static fallback (#3) are on the critical path. Overlays 7–9 cost zero bytes (procedural).

---

## 5. AI Image Generation Prompts (grounded in the user's reference images)

Four references provided: **(R1)** David's original *Death of Socrates* (color) — canonical composition; **(R2)** macro of the chalice exchange — the shallow footed *kylix* held from below, a hand reaching down to accept it; **(R3)** a dark monochrome reinterpretation — vaulted prison, crushed blacks, hard chiaroscuro, the black archway as negative space (this is ~90% of the Scene 1 target already); **(R4)** the *Creation of Adam* near-touching hands.

Shared visual universe (append to every prompt): **black-and-white, single-source cinematic chiaroscuro, crushed blacks, fine engraving-like grain, very high contrast, large negative space, modern minimalist reinterpretation — NOT a museum reproduction, no frame, no gallery, no signature, no color, no text.** Aspect 3:2, generate at 2400×1600.

**Pipeline note (saves you one image):** only **two** real stills are strictly required — `socrates-full` and `hands-adam`. I can derive `final-dither.png` (the static/LCP fallback) programmatically from your real `hands-adam` via the dither script, so you don't need to generate it. **Strongly recommended: use R3 as an img2img base / style reference (`--sref`) for `socrates-full`** — it already matches the target; a txt2img-only run will drift.

**5.1 — `socrates-full` (Still #1, Scene 1 base) — anchor: R3, composition from R1**
> Cinematic black-and-white reinterpretation of Jacques-Louis David's The Death of Socrates, not a museum reproduction. A wide neoclassical stone prison interior; a deep barrel-vaulted archway recedes into pure black on the left as vast negative space. Center-right: an aged but muscular Socrates sitting upright on a stone bed, one arm raised with index finger pointing upward, the other arm extended to accept a shallow footed cup offered by a turning disciple in classical drapery. Grieving figures clustered in deep shadow on the right; a tall iron oil lamp, scattered scrolls and broken chains on the stone floor. Single hard key light from the upper right carving the figures out of darkness, extreme chiaroscuro, crushed blacks, fine engraving-grain and stone texture, desaturated grayscale, very high contrast, austere and modern. The chalice exchange is the focal point, framed near horizontal center. No color, no text, no frame. --ar 3:2

**5.2 — Mid-zoom / simplification (intermediate, optional) — anchor: R3 cropped + R2**
> Same monochrome prison scene pushed in close on Socrates and the offering disciple; background mourners and architecture dissolved into pure black, only the seated figure's outstretched accepting hand and the offering arm with the cup remain lit. Soft cinematic rim light from upper right, deep shadow, fine grain, high contrast, minimalist, vast black negative space. No color, no text. --ar 3:2

**5.3 — Hand + chalice isolation (intermediate) — anchor: R2**
> Extreme close monochrome study of the chalice exchange: a shallow footed ceremonial cup (kylix) held from below by a muscular hand, a second hand reaching down from above to accept it, fingers nearly meeting at the cup's rim. Black void background, single soft key light from upper right, deep falloff into shadow, subtle film grain, very high contrast, immense negative space. Austere photographic realism in grayscale. No color, no text. --ar 3:2

**5.4 — Digital-transition look (shader-tuning reference only, not shipped) — anchor: R2**
> The chalice-exchange hands rendered as a coarse halftone screen print: visible black-and-white ordered-dither dot pattern, faint CRT scanlines, computational and screen-printed, very high contrast, pure black background, the image breaking into dots. No color, no text. --ar 3:2

**5.5 — `hands-adam` (Still #2, Scene 4 target) — anchor: R4, reinterpreted (evoke, don't copy)**
> Cinematic monochrome composition: two bare human arms reaching horizontally toward each other across a wide empty black void, fingertips almost meeting with a deliberate small gap between them — echoing the near-touch gesture of a classical fresco WITHOUT reproducing it (no fresco, no cracked plaster, no ceiling). One arm enters from the left, one from the right, both modeled by a single dramatic side light, deep shadow, fine grain. No cup. Immense black negative space, very high contrast, grayscale. The gap between the fingertips is the exact focal point, centered horizontally and vertically. No color, no text, no frame. --ar 3:2

**5.6 — `final-dither` (Still #3, static/LCP fallback) — DERIVED, generation optional**
> Preferred: derive from the real `hands-adam` via the dither script (no generation needed). If generating instead: minimalist monochrome image of two hands reaching toward each other, fingertips almost meeting with a small gap, rendered entirely in white ordered-dither halftone dots on a pure black background, coarse 1-bit dithering, slight gaussian blur, extreme contrast, enormous negative space, ghostly and computational. The hands never quite connect. No color, no text, no frame. --ar 3:2

**5.7 — Overlay assets**
- *Film grain* (`grain.png`): "Seamless tileable fine film grain noise texture, grayscale, subtle, transparent background, 256x256, neutral, no pattern bias." (Optional — a CSS grain layer already ships.)
- *Dust* (`dust.png`, optional): "Scattered soft floating dust particles and motes, white on transparent, bokeh, sparse, 512x512."
- *Bayer matrix* (`bayer8.png`): generated programmatically, not AI (`scripts/gen-placeholders.mjs`).
- Scanlines / bloom / vignette / tint: procedural in-shader, no asset.

**Framing constraint for the shader:** Scenes 2–3 zoom toward the source-image center. In R1/R3 the chalice sits slightly left of center, so either (a) frame/crop `socrates-full` so the cup is near the horizontal center, or (b) tell me the cup's normalized position and I'll set the focal point in `socrates-shader.ts`. Same applies to the gap in `hands-adam` (keep it centered).

---

## 6. Build Plan

Prereq (blocking): decisions in §"Decisions needed" + source stills #1–#3 in `public/img/`.

| Phase | Goal | Files / components | Assets | Complexity | Order |
|-------|------|--------------------|--------|------------|-------|
| **0** | Lock decisions + generate stills (§5) | — | Stills 1–3 → `public/img/` | Low (mostly art iteration) | 1 |
| **1** | Scaffold `SocratesHero.astro` — pinned scroll stage cloned from `ClosingWindow` mechanic; static `<img final-dither>` fallback; reduced-motion + no-JS render the final frame; scroll → `uProgress 0..1`. **No shader yet.** | `src/components/SocratesHero.astro`, `src/pages/index.astro` (mount above/replacing `Lens`) | #3 (fallback), #4 (poster) | Med | 2 |
| **2** | WebGL layer: one fullscreen quad, fragment shader, `ogl` (or raw GL). Sample `uTexA`/`uTexB`, expose `uProgress`. Capability-detect → fallback to Phase-1 static image. Wire scroll progress → uniform via existing rAF throttle. | `src/lib/socrates-gl.ts`, `src/lib/socrates-shader.ts` (GLSL), `SocratesHero.astro` script | #1, #2 | High | 3 |
| **3** | Shader scenes: zoom (uv scale on progress), figure-fade/desaturate (Scene 2), halftone + Bayer dither + CRT scanlines + bloom + vignette ramping in by progress (Scene 3), A→B crossfade + chalice fade (Scene 4), settle to blurred dither dots (Scene 5). Tune thresholds. | `socrates-shader.ts`, `bayer8.png` generator (`scripts/gen-bayer.mjs`) | #5 | High | 4 |
| **4** | Identity handoff: final dither frame's negative space → name/headline fade-up; integrate with existing `Lens.astro`/nav reveal; mono kicker caption line. | `SocratesHero.astro`, `Lens.astro`, `Nav.astro` | — | Med | 5 |
| **5** | Overlays + polish: grain, optional dust, scroll-progress indicator if wanted; mobile tuning (shorter pin, reduced texture res). | `SocratesHero.astro`, `grain.png`, (`dust.png`) | #6, #10 | Med | 6 |
| **6** | Hardening: LCP measurement, reduced-motion QA, no-WebGL QA, mobile perf, AVIF/WebP `<picture>`, lazy-load, a11y (`aria-hidden` canvas + real text equivalent, mirroring `ClosingWindow`). | all above, `astro.config.mjs` if needed | — | Med | 7 |

Estimated net-new runtime JS: ~10–14KB gzipped (`ogl` + shader strings + driver), within the repo's island budget. New shipped image weight: < 250KB (lazy, off critical path).

---

## Decisions needed before build (the genuine forks)

1. **Placement** — Socrates as a *prelude above* the existing Lens hero (recommended; protects text-LCP + recruiter scan), or *full replacement* of the Lens hero?
2. **Engine** — WebGL shader hybrid (recommended; highest fidelity, ~12KB) or the conservative CSS-halftone + image-crossfade fallback (zero shader risk, lower dither fidelity)?
3. **Dependency** — allow `ogl` (~8KB) for the shader, or keep *strictly zero* new deps (raw WebGL, slightly more code)?
4. **Image generation** — should I drive the `gemini-imagegen` skill to produce stills (needs API key), or will you generate them externally from the §5 prompts?
