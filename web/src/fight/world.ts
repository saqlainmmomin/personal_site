// Turns the homepage into a level: every word flies into a tiered arena of platforms (reading order, top to bottom), then gets chewed up as you fight.
// Esc flies every word back to its exact original spot and restores the page byte for byte.
import Matter from 'matter-js'

/** Viewport (position: fixed) pixel rect. */
export type Rect = { x: number; y: number; w: number; h: number }

export type World = {
  /** LIVE static platforms in viewport px (mutated in place when bricks get knocked loose). Floor and walls are NOT in here. */
  ledges: Rect[]
  /** LIVE loose pieces: dynamic Matter bodies (label 'debris'), each mirrored by a fixed-position DOM clone. */
  debris: Matter.Body[]
  width: number
  height: number
  /** Resolves once the text has flown into its arena layout. The shell only steps physics and drops fighters after this. */
  ready: Promise<void>
  /** Knock platform bricks overlapping `r` loose (they become debris) with velocity vx, vy in px/s. */
  /** `blast` skips the throttle and allows more bricks per call (the ladder's shockwave). */
  knock(r: Rect, vx: number, vy: number, blast?: boolean): void
  /** Copy body positions/angles onto the clones. Called every frame. */
  sync(): void
  /** Fly every piece back to its original spot, then remove clones and unhide the page exactly. The shell clears the engine after. */
  destroy(): Promise<void>
}

type Pose = { cx: number; cy: number; rot: number; s: number }
type Row = { y: number; h: number; pieces: Piece[] }
type Plat = { alive: number; total: number }
type Piece = {
  el: HTMLElement
  w: number
  h: number
  orig: Pose
  target: Pose
  cur: Pose
  wobble: number
  loose?: boolean
  left: number // target left edge of the (unscaled) brick, used for footing runs
  row?: Row
  plat?: Plat
  body?: Matter.Body
  alive: boolean
}
type Word = { text: string; rect: Rect; css: string }

const GAP = 6
const TOP_Y = 150 // surface of the top tier; everything above stays clear for spawns
const CAP = 170 // words taken from the page, in reading order
const LOOSE = 28 // short words that start loose on the platforms, ready to grab and throw
const FLY_STAGGER = 650
const DUR = 750
const BACK_STAGGER = 260
const BACK_DUR = 520
// Platform lengths in px (jittered); the short one is a 3-word island.
const LENS = [190, 300, 420, 520, 640, 380, 460]

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const outBack = (t: number) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2)
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function styleFor(cs: CSSStyleDeclaration) {
  return `font:${cs.font};color:${cs.color};letter-spacing:${cs.letterSpacing};text-transform:${cs.textTransform};font-feature-settings:${cs.fontFeatureSettings};font-kerning:${cs.fontKerning};-webkit-font-smoothing:antialiased`
}

/** Every visible word under main (below the fold too, as long as it is horizontally on screen), in document order, with its own rect and computed text style. */
function measureWords(main: Element): Word[] {
  const out: Word[] = []
  const range = document.createRange()
  const cache = new Map<Element, string>()
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text
    if (!t.data.trim()) continue
    const parent = t.parentElement
    if (!parent || parent.closest('.sr-only, [aria-hidden="true"], script, style, noscript, svg, textarea')) continue
    if (!parent.checkVisibility({ visibilityProperty: true })) continue
    let css = cache.get(parent)
    if (css === undefined) cache.set(parent, (css = styleFor(getComputedStyle(parent))))
    for (const m of t.data.matchAll(/\S+/g)) {
      range.setStart(t, m.index!)
      range.setEnd(t, m.index! + m[0].length)
      const r = [...range.getClientRects()].find((q) => q.width > 0 && q.height > 0)
      if (!r) continue
      if (r.right <= 0 || r.left >= innerWidth) continue
      out.push({ text: m[0], rect: { x: r.left, y: r.top, w: r.width, h: r.height }, css })
      if (out.length >= 2000) { range.detach(); return out }
    }
  }
  range.detach()
  return out
}

/** CAP words starting at the first one on screen (extended backwards if the page ends sooner). */
function pickWindow(all: Word[]) {
  const s = Math.max(0, all.findIndex((w) => w.rect.y + w.rect.h > 0 && w.rect.y < innerHeight))
  const end = Math.min(all.length, s + CAP)
  return all.slice(Math.max(0, end - CAP), end)
}

/** Greedy row packing of words[from, from+count) into rows of at most spanW. */
function pack(ws: Word[], from: number, count: number, spanW: number, maxRows: number) {
  const rows: Word[][] = [[]]
  let rowW = 0
  let i = from
  for (; i < from + count; i++) {
    const w = ws[i]
    const need = rowW + (rowW ? GAP : 0) + w.rect.w
    if (rows[rows.length - 1].length && need > spanW) {
      if (rows.length >= maxRows) break
      rows.push([])
      rowW = 0
    }
    rows[rows.length - 1].push(w)
    rowW += (rowW ? GAP : 0) + w.rect.w
  }
  return { rows, next: i }
}

/** Left edges for a packed row: spread to fill the span (extra gap capped), else centred (or left-aligned for a ground tail). */
function placeRow(row: Word[], x0: number, spanW: number, spread: boolean, centre: boolean, cap = 22) {
  const nat = row.reduce((s, w) => s + w.rect.w, 0) + GAP * (row.length - 1)
  const extra = spread && row.length > 1 ? Math.min((spanW - nat) / (row.length - 1), cap) : 0
  const total = nat + extra * (row.length - 1)
  let x = x0 + (centre ? (spanW - total) / 2 : 0)
  return row.map((w) => {
    const left = x
    x += w.rect.w + GAP + extra
    return left
  })
}

function makeClone(base: string, w: number, h: number) {
  const el = document.createElement('div')
  el.dataset.fightDebris = ''
  el.style.cssText = `position:fixed;left:0;top:0;margin:0;padding:0;white-space:nowrap;pointer-events:none;z-index:40;transform-origin:center;will-change:transform;width:${w}px;height:${h}px;line-height:${h}px;${base}`
  return el
}

export function buildWorld(engine: Matter.Engine): World {
  const width = innerWidth
  const height = innerHeight - 8 // floor sits just above the edge so feet aren't clipped
  const { Bodies, Body, Composite } = Matter
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  const ledges: Rect[] = []
  const debris: Matter.Body[] = []
  const pieces: Piece[] = []
  const rows: Row[] = []
  const byBody = new Map<Matter.Body, Piece>()
  let resolveReady!: () => void
  const ready = new Promise<void>((r) => (resolveReady = r))

  const T = 200
  const bound = { isStatic: true, label: 'bound', friction: 0.8 }
  Composite.add(engine.world, [
    Bodies.rectangle(width / 2, height + T / 2, width * 2 + T * 2, T, bound),
    Bodies.rectangle(-T / 2, height / 2, T, height * 4, bound),
    Bodies.rectangle(width + T / 2, height / 2, T, height * 4, bound),
  ])

  const main = document.querySelector('main')
  const noop = (): World => ({
    ledges, debris, width, height, ready, knock() {}, sync() {}, destroy: async () => {},
  })
  if (!main) { resolveReady(); return noop() }

  // 1. Measure (page is scroll-locked by the shell, so these rects are what we fly back to).
  const words = pickWindow(measureWords(main))
  const img = [...main.querySelectorAll('img')].find((i) => {
    const r = i.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth
  })
  if (!words.length && !img) { resolveReady(); return noop() }

  // 2. Layout on plain data: loose words, a full-width ground, then tiers of platforms in reading order (top first).
  const rng = mulberry32(7)
  const rowPad = 8
  const N = words.length
  const baseH = (words.map((w) => w.rect.h).sort((a, b) => a - b)[Math.floor(N / 2)] ?? 20) + rowPad
  const avgW = words.reduce((s, w) => s + w.rect.w, 0) / Math.max(1, N) + GAP
  const imgRect = img?.getBoundingClientRect()
  let pScale = 1
  if (imgRect) pScale = Math.min(1, (height * 0.3) / imgRect.height, (width * 0.2) / imgRect.width)
  const pw = imgRect ? imgRect.width * pScale : 0
  const ph = imgRect ? imgRect.height * pScale : 0
  const px = 16
  const py = height - ph

  // Loose words: short ones (easy to throw), spread evenly through the reading order.
  const looseIdx = new Set<number>()
  const shortIdx = words.map((w, i) => (w.rect.w <= 110 && /\w{2,}/.test(w.text) ? i : -1)).filter((i) => i >= 0)
  const nLoose = Math.min(LOOSE, Math.floor(N * 0.2), shortIdx.length)
  for (let j = 0; j < nLoose; j++) looseIdx.add(shortIdx[Math.floor(((j + 0.5) * shortIdx.length) / nLoose)])
  const loose = words.filter((_, i) => looseIdx.has(i))
  const flow = words.filter((_, i) => !looseIdx.has(i))
  const F = flow.length

  const slots = new Map<Word, { left: number; cy: number; row?: Row; plat?: Plat }>()
  type Host = { x0: number; x1: number; y: number }
  const hosts: Host[] = []
  const rowHOf = (r: Word[]) => Math.max(...r.map((w) => w.rect.h)) + rowPad
  const lay = (packed: Word[][], x0: number, spanW: number, top: number, centre: boolean, spreadLast: boolean, cap: number): Host => {
    const plat: Plat = { alive: 0, total: 0 }
    let y = top, minL = Infinity, maxR = -Infinity
    packed.forEach((row, ri) => {
      const r: Row = { y, h: rowHOf(row), pieces: [] }
      rows.push(r)
      placeRow(row, x0, spanW, spreadLast || ri < packed.length - 1, centre, cap).forEach((left, k) => {
        slots.set(row[k], { left, cy: y + r.h / 2, row: r, plat })
        plat.total++; plat.alive++
        if (ri === 0) { minL = Math.min(minL, left); maxR = Math.max(maxR, left + row[k].rect.w) }
      })
      y += r.h
    })
    return { x0: minL, x1: maxR, y: top }
  }

  // Ground: the last words fill a 2-row floor across the whole width (right of the portrait pillar).
  const groundX0 = imgRect ? px + pw + 18 : 10
  const groundW = width - 10 - groundX0
  let G = Math.min(Math.floor(F * 0.25), Math.floor(groundW / avgW) * 2 + 2)
  while (G > 0 && pack(flow, F - G, G, groundW, 2).next < F) G--
  const groundRows = G ? pack(flow, F - G, G, groundW, 2).rows : []
  const groundTop = height - groundRows.reduce((s, r) => s + rowHOf(r), 0)
  if (G) hosts.push(lay(groundRows, groundX0, groundW, groundTop, false, false, 40))
  const supply = F - G

  // Tiers: gap ~110-130px (a jump reaches ~180), staggered spans with 60-110px hops between them.
  const tiers = clamp(Math.floor((groundTop - TOP_Y) / 110), 2, 6)
  const gap = (groundTop - TOP_Y) / tiers
  type Span = { tier: number; x0: number; w: number; rows: number; max: number }
  const spans: Span[] = []
  for (let t = tiers - 1; t >= 0; t--) {
    const yTop = groundTop - gap * (t + 1)
    const minX = imgRect && yTop + 3 * baseH > py - 24 ? px + pw + 50 : 8
    let x = minX + (((tiers - 1 - t) % 3) * 0.06 + rng() * 0.04) * width
    while (x < width - 150) {
      const w = Math.min(LENS[Math.floor(rng() * LENS.length)] * (0.85 + rng() * 0.3), width - 8 - x)
      if (w >= 150) {
        const max = w < 260 ? 1 : 2
        spans.push({ tier: t, x0: x, w, rows: max, max })
      }
      x += w + 60 + rng() * 50
    }
  }
  const live = () => spans.filter((sp) => sp.rows > 0)
  const consume = () => {
    let i = 0
    for (const sp of live()) if (i < supply) i = pack(flow, i, supply - i, sp.w, sp.rows).next
    return i
  }
  // Trim to just hold the supply, in shuffled order: 3 rows -> 2, then drop whole spans (keeping every tier populated), then 2 -> 1.
  const order = spans.map((_, i) => i).sort(() => rng() - 0.5)
  const trim = (from: number, to: number) => {
    for (const i of order) {
      const sp = spans[i]
      if (sp.rows !== from) continue
      if (to === 0 && spans.filter((o) => o.rows > 0 && o.tier === sp.tier).length < 2) continue
      sp.rows = to
      if (consume() < supply) sp.rows = from
    }
  }
  trim(3, 2)
  for (const r of [1, 2]) trim(r, 0)
  trim(2, 1)
  let idx = 0
  for (const sp of live()) {
    if (idx >= supply) break
    const { rows: packed, next } = pack(flow, idx, supply - idx, sp.w, sp.rows)
    idx = next
    hosts.push(lay(packed, sp.x0, sp.w, groundTop - gap * (sp.tier + 1), true, false, 22))
  }

  // Loose words: dynamic bodies resting on random platforms / the ground from the first second.
  // Dealt round the platforms in turn, each word in its own slice of the platform so they don't stack.
  const hostOrder = hosts.map((_, i) => i).sort(() => rng() - 0.5)
  const perHost = Math.ceil(loose.length / Math.max(1, hosts.length))
  loose.forEach((w, j) => {
    const h = hosts[hostOrder[j % hostOrder.length]]
    const k = Math.floor(j / hostOrder.length)
    const slice = (h.x1 - h.x0) / perHost
    const x = h.x0 + k * slice + rng() * Math.max(0, slice - w.rect.w - 4)
    slots.set(w, { left: Math.min(x, h.x1 - w.rect.w), cy: h.y - (w.rect.h + rowPad) / 2 - 1 })
  })

  // 3. Clone, then hide the page, remembering its exact style attribute.
  const prevStyle = main.getAttribute('style')
  const apply = (p: Piece) => {
    const c = p.cur
    p.el.style.transform = `translate(${c.cx - p.w / 2}px,${c.cy - p.h / 2}px) rotate(${c.rot}rad) scale(${c.s})`
  }
  const mk = (el: HTMLElement, w: number, h: number, r: Rect): Piece => {
    const orig = { cx: r.x + r.w / 2, cy: r.y + r.h / 2, rot: 0, s: 1 }
    const p: Piece = {
      el, w, h, orig, target: { ...orig }, cur: { ...orig }, left: r.x, alive: true,
      wobble: (Math.random() - 0.5) * 0.9,
    }
    apply(p)
    document.body.appendChild(el)
    pieces.push(p)
    return p
  }

  let portrait: Piece | null = null
  if (img && imgRect) {
    const r = imgRect
    const cs = getComputedStyle(img)
    const el = document.createElement('img')
    el.dataset.fightDebris = ''
    el.src = img.currentSrc || img.src
    el.alt = ''
    el.style.cssText = `position:fixed;left:0;top:0;margin:0;padding:0;pointer-events:none;z-index:40;transform-origin:center;will-change:transform;width:${r.width}px;height:${r.height}px;object-fit:${cs.objectFit};object-position:${cs.objectPosition};border-radius:${cs.borderRadius};filter:${cs.filter}`
    portrait = mk(el, r.width, r.height, { x: r.left, y: r.top, w: r.width, h: r.height })
    portrait.target = { cx: px + pw / 2, cy: py + ph / 2, rot: 0, s: pScale }
    portrait.left = px
  }
  for (const w of words) {
    const slot = slots.get(w)
    if (!slot) continue
    const el = makeClone(w.css, w.rect.w, w.rect.h)
    el.textContent = w.text
    const p = mk(el, w.rect.w, w.rect.h, w.rect)
    p.target = { cx: slot.left + p.w / 2, cy: slot.cy, rot: 0, s: 1 }
    p.left = slot.left
    if (slot.row) { p.row = slot.row; p.plat = slot.plat; slot.row.pieces.push(p) } else p.loose = true
  }
  // Via the attribute, not CSSOM: removing a CSSOM-touched style attribute leaves style="" behind in Chrome.
  main.setAttribute('style', `${prevStyle ? `${prevStyle};` : ''}visibility:hidden`)
  main.setAttribute('data-fight-hidden', '')

  // 4. Footing: one Rect per contiguous run of living bricks per row.
  const rebuildLedges = () => {
    ledges.length = 0
    for (const r of rows) {
      let run: Piece[] = []
      const flush = () => {
        if (!run.length) return
        const first = run[0], last = run[run.length - 1]
        ledges.push({ x: first.left, y: r.y, w: last.left + last.w - first.left, h: r.h })
        run = []
      }
      for (const p of r.pieces.slice().sort((a, b) => a.left - b.left)) {
        if (p.alive) run.push(p)
        else flush()
      }
      flush()
    }
    if (portrait) ledges.push({ x: px, y: py, w: pw, h: ph })
  }

  // 5. Assemble tween, then freeze into static bodies.
  const finish = () => {
    for (const p of pieces) {
      p.cur = { ...p.target }
      apply(p)
      const t = p.target
      const bw = p.w * t.s
      const bh = p === portrait ? p.h * t.s : p.row ? p.row.h : p.h + rowPad
      p.body = Bodies.rectangle(t.cx, t.cy, bw, bh, {
        isStatic: !p.loose, label: p.loose ? 'debris' : 'ledge', friction: 0.6, frictionAir: 0.01, restitution: 0.1, density: 0.002,
      })
      Composite.add(engine.world, p.body)
      byBody.set(p.body, p)
      if (p.loose) debris.push(p.body)
    }
    rebuildLedges()
    resolveReady()
  }

  let raf = 0
  let torn = false
  if (reduced) finish()
  else {
    const t0 = performance.now()
    const step = (now: number) => {
      const t = now - t0
      let done = true
      pieces.forEach((p, i) => {
        const u = clamp((t - (i / Math.max(1, pieces.length - 1)) * FLY_STAGGER) / DUR, 0, 1)
        if (u < 1) done = false
        const e = outBack(u)
        const k = outCubic(u)
        p.cur.cx = lerp(p.orig.cx, p.target.cx, e)
        p.cur.cy = lerp(p.orig.cy, p.target.cy, e) - Math.sin(Math.PI * u) * 60
        p.cur.rot = p.wobble * (1 - k)
        p.cur.s = lerp(1, p.target.s, k)
        apply(p)
      })
      if (done) finish()
      else raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  // 6. Fighting.
  let lastKnock = -1e9
  function knock(r: Rect, vx: number, vy: number, blast = false) {
    const now = performance.now()
    if (!blast && now - lastKnock < 140) return
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2
    const hits = pieces
      .filter((p) => {
        if (!p.alive || !p.row || !p.plat || !p.body) return false
        const x = p.left, y = p.row.y
        return x < r.x + r.w && x + p.w > r.x && y < r.y + r.h && y + p.row.h > r.y
      })
      .sort((a, b) => Math.hypot(a.left + a.w / 2 - cx, a.row!.y - cy) - Math.hypot(b.left + b.w / 2 - cx, b.row!.y - cy))
    let n = 0
    for (const p of hits) {
      const plat = p.plat!
      if (n >= (blast ? 12 : 2) || plat.alive <= Math.ceil(plat.total * 0.3)) continue
      p.alive = false
      plat.alive--
      n++
      const b = p.body!
      Body.setStatic(b, false)
      Body.setVelocity(b, { x: vx / 60 + (Math.random() - 0.5), y: vy / 60 - 2 - Math.random() * 2 })
      Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.35)
      debris.push(b)
    }
    if (n) { lastKnock = now; rebuildLedges() }
  }

  function sync() {
    for (const b of debris) {
      const flat = Math.round(b.angle / Math.PI) * Math.PI
      Body.setAngularVelocity(b, (b.angularVelocity + (flat - b.angle) * 0.004) * 0.94)
      const p = byBody.get(b)!
      p.cur.cx = b.position.x
      p.cur.cy = b.position.y
      p.cur.rot = b.angle
      apply(p)
    }
  }

  // 7. Return flight, then restore the page exactly.
  function restore() {
    for (const p of pieces) p.el.remove()
    if (prevStyle === null) main!.removeAttribute('style')
    else main!.setAttribute('style', prevStyle)
    main!.removeAttribute('data-fight-hidden')
  }
  function destroy() {
    if (torn) return Promise.resolve()
    torn = true
    cancelAnimationFrame(raf)
    for (const b of debris) {
      const p = byBody.get(b)!
      p.cur.cx = b.position.x; p.cur.cy = b.position.y; p.cur.rot = b.angle
    }
    if (reduced) { restore(); return Promise.resolve() }
    const from = pieces.map((p) => {
      let rot = p.cur.rot % (Math.PI * 2)
      if (rot > Math.PI) rot -= Math.PI * 2
      if (rot < -Math.PI) rot += Math.PI * 2
      return { ...p.cur, rot }
    })
    return new Promise<void>((resolve) => {
      const t0 = performance.now()
      const step = (now: number) => {
        const t = now - t0
        let done = true
        pieces.forEach((p, i) => {
          const u = clamp((t - (i / Math.max(1, pieces.length - 1)) * BACK_STAGGER) / BACK_DUR, 0, 1)
          if (u < 1) done = false
          const e = inOutCubic(u)
          const f = from[i]
          p.cur.cx = lerp(f.cx, p.orig.cx, e)
          p.cur.cy = lerp(f.cy, p.orig.cy, e) - Math.sin(Math.PI * u) * 40
          p.cur.rot = lerp(f.rot, 0, e)
          p.cur.s = lerp(f.s, 1, e)
          if (u >= 1) p.cur = { ...p.orig }
          apply(p)
        })
        if (done) { restore(); resolve() }
        else requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    })
  }

  return { ledges, debris, width, height, ready, knock, sync, destroy }
}
