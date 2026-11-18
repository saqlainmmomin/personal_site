// Ink ladder: every enemy KO repaints the page one step (blush, red, black, shockwave back to paper) with a circular wipe from the body.
import type { World } from './world'

export type Palette = {
  bg: string
  /** Word colour: 'orig' keeps what the page had; link-red words get `link` on dark steps. */
  word: 'orig' | 'ink' | 'paper'
  player: string
  enemy: string
  /** Hit sparks, flash and the final-KO burst: must read on `bg`. */
  spark: string
  hud: string
  hudHover: string
  num: string
}

const INK = '#2B2B2B'
const PAPER = '#FAFAFA'
const RED = '#B42318'
const LINK_ON_BLACK = '#E5534B' // link red lifted so it still reads on near-black

const STEPS: Palette[] = [
  { bg: '#F3DEDA', word: 'orig', player: RED, enemy: INK, spark: RED, hud: '#6B6B6B', hudHover: INK, num: INK },
  { bg: RED, word: 'ink', player: PAPER, enemy: INK, spark: INK, hud: PAPER, hudHover: INK, num: INK },
  { bg: '#161616', word: 'paper', player: RED, enemy: PAPER, spark: RED, hud: '#BDBDBD', hudHover: PAPER, num: PAPER },
  { bg: PAPER, word: 'orig', player: RED, enemy: INK, spark: RED, hud: '#6B6B6B', hudHover: INK, num: INK },
]
const REST: Palette = { ...STEPS[3] }

const WIPE_MS = 650
const NUM_OPACITY = 0.07
const SHOCK_R = 260// each of the 8 blast sectors: a rect this wide, centred this far out from the body

let kills = 0
let pal = REST
const layers: HTMLElement[] = []
const origColor = new WeakMap<HTMLElement, string>()
let hud: HTMLElement | null = null
let hudStyle: HTMLStyleElement | null = null
let exitTimer = 0

export const palette = () => pal

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const isLink = (c: string) => {
  const m = c.match(/\d+/g)?.map(Number)
  return !!m && m[0] > 140 && m[1] < 90 && m[2] < 90
}

function paintHud() {
  if (!hud) return
  hud.style.color = pal.hud
  hud.style.setProperty('--ladder-hover', pal.hudHover)
}

/** Hover colour comes from a tag (inline styles can't express :hover); removed in reset. */
export function bindHud(el: HTMLElement) {
  hud = el
  if (!hudStyle) {
    hudStyle = document.createElement('style')
    hudStyle.dataset.fightLadder = ''
    hudStyle.textContent = '[data-fight-hud] button:hover{color:var(--ladder-hover)!important}'
    document.head.appendChild(hudStyle)
  }
  paintHud()
}

function makeLayer(p: Palette, n: number) {
  const el = document.createElement('div')
  el.dataset.fightLadder = ''
  el.style.cssText = `position:fixed;inset:0;z-index:39;pointer-events:none;background:${p.bg};overflow:hidden;display:flex;align-items:center;justify-content:center`
  const num = document.createElement('div')
  const size = Math.min(40 + (n - 1) * 3, 70) // vh: grows a little per kill, capped
  num.textContent = String(n)
  // light italic Garamond reads as a watermark rather than a slab; it drifts in after the wipe instead of being stamped
  num.style.cssText = `font-family:'EB Garamond',Georgia,serif;font-style:italic;font-weight:400;font-size:${size}vh;line-height:1;letter-spacing:-0.02em;color:${p.num};opacity:${NUM_OPACITY};user-select:none`
  el.appendChild(num)
  document.body.appendChild(el)
  if (!reduced())
    num.animate(
      { opacity: [0, NUM_OPACITY], transform: ['scale(0.94)', 'scale(1)'], filter: ['blur(6px)', 'blur(0)'] },
      { duration: 1100, delay: WIPE_MS * 0.4, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'backwards' },
    )
  return el
}

function wordColor(el: HTMLElement, p: Palette) {
  const orig = origColor.get(el) ?? (origColor.set(el, el.style.color), el.style.color)
  if (p.word === 'orig') return orig
  if (p.word === 'ink') return INK
  return isLink(orig) ? LINK_ON_BLACK : PAPER
}

/** Recolour every word clone as the wipe front (an ease-out circle from x,y) reaches it. */
function recolorWords(p: Palette, x: number, y: number, R: number, stagger: boolean) {
  for (const el of document.querySelectorAll<HTMLElement>('[data-fight-debris]')) {
    if (el.tagName === 'IMG') continue
    let delay = 0
    if (stagger) {
      const r = el.getBoundingClientRect()
      const d = Math.min(1, Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y) / R)
      delay = (1 - Math.pow(1 - d, 1 / 3)) * WIPE_MS // inverse of the cubic ease-out
    }
    el.style.transition = stagger ? `color 140ms linear ${delay}ms` : ''
    el.style.color = wordColor(el, p)
  }
}

/** An enemy fell at (x, y): advance the counter and repaint. */
export function kill(x: number, y: number, world: World) {
  kills++
  const step = (kills - 1) % STEPS.length
  const p = STEPS[step]
  pal = p
  paintHud()

  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const layer = makeLayer(p, kills)
  layers.push(layer)
  const still = reduced()
  recolorWords(p, x, y, R, !still)

  const done = () => {
    const i = layers.indexOf(layer)
    if (i < 0) return
    for (const old of layers.splice(0, i)) old.remove()
  }
  if (still) done()
  else {
    layer.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
      { duration: WIPE_MS, easing: 'cubic-bezier(0.215,0.61,0.355,1)', fill: 'backwards' },
    ).finished.then(done, () => {}) // cancelled when the layer is removed in reset
    layer.style.clipPath = `circle(${R}px at ${x}px ${y}px)`
  }

  if (step === 3) {
    // shockwave: a radial blast of platform bricks, 8 sectors each thrown outward
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      const ux = Math.cos(a), uy = Math.sin(a)
      const cx = x + ux * SHOCK_R, cy = y + uy * SHOCK_R
      world.knock({ x: cx - SHOCK_R, y: cy - SHOCK_R, w: SHOCK_R * 2, h: SHOCK_R * 2 }, ux * 700, uy * 700 - 250, true)
    }
  }
}

function restoreWords() {
  for (const el of document.querySelectorAll<HTMLElement>('[data-fight-debris]')) {
    const orig = origColor.get(el)
    el.style.transition = ''
    if (orig !== undefined) el.style.color = orig
  }
}

/** Esc pressed: words go back to the page's colours at once and the layers fade while they fly home. */
export function exit() {
  restoreWords()
  for (const l of layers) {
    l.style.transition = 'opacity .25s'
    l.style.opacity = '0'
  }
  clearTimeout(exitTimer)
  exitTimer = window.setTimeout(reset, 300)
}

/** Remove every layer and style and zero the counter. */
export function reset() {
  clearTimeout(exitTimer)
  for (const l of layers.splice(0)) l.remove()
  hudStyle?.remove()
  hudStyle = null
  if (hud) {
    hud.style.removeProperty('color')
    hud.style.removeProperty('--ladder-hover')
    if (!hud.getAttribute('style')) hud.removeAttribute('style')
  }
  hud = null
  kills = 0
  pal = REST
}
