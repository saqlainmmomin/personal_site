# Lessons

## Claude Preview / headless verification
- The preview tab runs with `document.visibilityState === 'hidden'`. `requestAnimationFrame` does NOT advance in hidden tabs, so rAF-based animations (tweens, count-ups, scroll scrubbing) look frozen when you poll state via `preview_eval`. `setTimeout` still fires (throttled). `preview_screenshot` forces a paint, so animated states are best verified by screenshot, not by polling computed values.
- After `location.reload()` in the preview, an explicit `preview_resize` override can be dropped (it reverts to native ~small size). Re-set the viewport (custom width) after reload, and confirm with `innerWidth` before screenshotting.

## Astro build output
- Small component `<script>` tags get inlined into the HTML and minified, so identifiers are renamed (e.g. `machinePath` -> `x`). Don't grep dist for source identifiers to check a script shipped; check the inline `<script type="module">` blocks instead.
- `build.inlineStylesheets: 'always'` collapses CSS into a `<style>` in the HTML. Good for a single-page site (one round trip, better LCP); avoid for multi-page where shared CSS caching matters.

## Mechanic gating
- Decide narrow/wide and motion preferences with `matchMedia` and re-evaluate on `change`, not once at load. The Closing Window initially gated scroll-driving at load only, so loading narrow then resizing wide left it stuck in the static fallback.
- Don't trigger one-time intro animations off the `load` event from a module script; `load` may have already fired. Use a short `setTimeout` after the module executes.
