# Lessons

## Claude Preview / headless verification
- The preview tab runs with `document.visibilityState === 'hidden'`. `requestAnimationFrame` does NOT advance in hidden tabs, so rAF-based animations (tweens, count-ups, scroll scrubbing) look frozen when you poll state via `preview_eval`. `setTimeout` still fires (throttled). `preview_screenshot` forces a paint, so animated states are best verified by screenshot, not by polling computed values.
- After `location.reload()` in the preview, an explicit `preview_resize` override can be dropped (it reverts to native ~small size). Re-set the viewport (custom width) after reload, and confirm with `innerWidth` before screenshotting.

## Astro build output
- Small component `<script>` tags get inlined into the HTML and minified, so identifiers are renamed (e.g. `machinePath` -> `x`). Don't grep dist for source identifiers to check a script shipped; check the inline `<script type="module">` blocks instead.
- `build.inlineStylesheets: 'always'` collapses CSS into a `<style>` in the HTML. Good for a single-page site (one round trip, better LCP); avoid for multi-page where shared CSS caching matters.

## WebGL / ogl (Socrates hero)
- ogl `Renderer.setSize(w, h)` treats `w/h` as CSS pixels: it sets the drawing buffer to `w*dpr` AND writes inline `style.width/height` in px. Pass DPR to the `Renderer({ dpr })` constructor and call `setSize` with CSS px (measure a layout-driven parent, not the canvas — ogl owns the canvas size). Do NOT also set `canvas.width` yourself or multiply by dpr — that double-applies it and the inline style overrides any `width:100%` CSS.
- A debounced `window.resize` handler can latch a single bad transient measurement (saw stage width = 5px during a viewport change, stuck until the next resize). Prefer a `ResizeObserver` on the stage (re-fires until layout settles) plus a guard that ignores rects with width/height < 2px.
- WebGL canvases screenshot as blank/white in the headless preview unless the drawing buffer is preserved. With `alpha:false` + default `preserveDrawingBuffer:false`, a capture between rAF frames reads the cleared buffer (opaque -> white) and you get an all-white screenshot even though the canvas renders fine live. Set `preserveDrawingBuffer:true` (negligible cost for a single fullscreen quad) to make captures reliable. Symptom: scene 1-5 captured fine while the rAF loop ran continuously, but a paused/edge frame captured white.
- An absolutely-positioned container whose children are ALL absolutely-positioned collapses to 0 width, so descendants wrap to min-content (per word). Give the container an explicit `width` (not just `max-width`) or set width on the absolute children.

## Mechanic gating
- Decide narrow/wide and motion preferences with `matchMedia` and re-evaluate on `change`, not once at load. The Closing Window initially gated scroll-driving at load only, so loading narrow then resizing wide left it stuck in the static fallback.
- Don't trigger one-time intro animations off the `load` event from a module script; `load` may have already fired. Use a short `setTimeout` after the module executes.
