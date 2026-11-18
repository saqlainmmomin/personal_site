// Game shell: engine, canvas, keys, HUD, loop and teardown. World and fighters plug in.
// Launch: the text flies into an arena, then fighters drop. Esc: fighters fade, text flies home, page is restored.
import Matter from 'matter-js'
import { createFighters } from './fighters'
import { muted, setMuted, unlock } from './sound'
import { buildWorld } from './world'

const CONTROLS: [string, string][] = [
  ['Move', '← →  or  A D'],
  ['Jump', '↑  W  or  Space'],
  ['Drop down', '↓  or  S'],
  ['Punch · combo', 'J  J  J'],
  ['Every third combo: slam', 'J  J  J'],
  ['Kick · combo', 'K  K  K'],
  ['Sweep', '↓ + K'],
  ['Lunge kick', 'J  K'],
  ['Grab a loose word, throw it', 'L'],
  ['Leave', 'Esc'],
]

const GAME_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyJ', 'KeyK', 'KeyL'])

export function start(onExit: () => void) {
  unlock() // the launch click is the user gesture audio needs
  const html = document.documentElement
  const saved = { overflow: html.style.overflow, x: scrollX, y: scrollY }
  html.style.overflow = 'hidden' // lock before measuring so the scrollbar is gone from the layout

  const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.2 } })
  const world = buildWorld(engine)

  const dpr = devicePixelRatio || 1
  const canvas = document.createElement('canvas')
  canvas.dataset.fight = ''
  canvas.width = innerWidth * dpr
  canvas.height = innerHeight * dpr
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:50;pointer-events:none;transition:opacity .25s'
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  const fighters = createFighters(world, engine)
  let ready = false
  void world.ready.then(() => {
    if (exiting) return
    ready = true
    fighters.add('player')
    fighters.add('enemy')
    showHelp(6000)
  })

  // Floating text controls, no chrome.
  const hud = document.createElement('div')
  hud.dataset.fightHud = ''
  hud.className = 'label fixed top-xs right-sm z-[51] flex gap-sm text-grey transition-opacity'
  hud.innerHTML =
    `<button type="button" data-add class="cursor-pointer hover:text-ink">+ fighter</button>` +
    `<button type="button" data-help class="cursor-pointer hover:text-ink">controls</button>` +
    `<button type="button" data-sound class="cursor-pointer hover:text-ink"></button>` +
    `<button type="button" data-close class="cursor-pointer hover:text-ink" aria-label="End the fight">Esc ×</button>`
  const soundBtn = hud.querySelector<HTMLButtonElement>('[data-sound]')!
  const label = () => (soundBtn.textContent = muted() ? 'sound off' : 'sound on')
  label()
  soundBtn.addEventListener('click', () => (setMuted(!muted()), label()))
  hud.querySelector('[data-add]')!.addEventListener('click', () => ready && fighters.add('enemy'))
  hud.querySelector('[data-close]')!.addEventListener('click', () => stop())
  hud.querySelector('[data-help]')!.addEventListener('click', () => showHelp(8000))

  // Controls card: shown when the fighters drop, fades on its own or once you start fighting.
  const help = document.createElement('div')
  help.dataset.fightHelp = ''
  help.className = 'label pointer-events-none fixed top-xl right-sm z-[52] rounded-sm border border-line bg-paper/95 px-md py-sm text-ink opacity-0 shadow-sm transition-opacity duration-300'
  help.innerHTML =
    `<p class="mb-xs font-semibold">Controls</p><dl class="grid grid-cols-[auto_auto] gap-x-md gap-y-[4px]">` +
    CONTROLS.map(([what, key]) => `<dt class="text-grey">${what}</dt><dd class="font-medium whitespace-pre">${key}</dd>`).join('') +
    `</dl>`
  let helpTimer = 0
  let helpShownAt = 0
  function showHelp(ms: number) {
    help.style.opacity = '1'
    helpShownAt = performance.now()
    clearTimeout(helpTimer)
    helpTimer = window.setTimeout(hideHelp, ms)
  }
  function hideHelp() {
    help.style.opacity = '0'
  }
  document.body.append(canvas, hud, help)

  const keys = new Set<string>()
  const down = (e: KeyboardEvent) => {
    if (e.code === 'Escape') return stop()
    if (!GAME_KEYS.has(e.code)) return
    e.preventDefault()
    keys.add(e.code)
    if (performance.now() - helpShownAt > 1500 && ['KeyJ', 'KeyK', 'KeyL'].includes(e.code)) hideHelp() // first real attack dismisses it
  }
  // Releases land after the next update, so a tap shorter than a frame still registers.
  const released = new Set<string>()
  const up = (e: KeyboardEvent) => released.add(e.code)
  const blur = () => keys.clear()
  addEventListener('keydown', down)
  addEventListener('keyup', up)
  addEventListener('blur', blur)

  let raf = 0
  let last = performance.now()
  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 30) * (fighters.timeScale?.() ?? 1)
    last = now
    if (ready) for (let t = dt * 1000; t > 0.5; t -= 1000 / 60) Matter.Engine.update(engine, Math.min(t, 1000 / 60))
    fighters.update(dt, keys) // before sync, so a carried word's clone follows its fighter this frame
    world.sync()
    released.forEach((k) => keys.delete(k))
    released.clear()
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    fighters.draw(ctx)
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  const w = window as unknown as { __fight?: unknown }
  w.__fight = { state: () => fighters.state(), ready: () => ready, timeScale: () => fighters.timeScale?.() ?? 1, stop: () => stop() }

  let exiting = false
  async function stop() {
    if (exiting) return
    exiting = true
    ready = false
    removeEventListener('keydown', down)
    removeEventListener('keyup', up)
    removeEventListener('blur', blur)
    keys.clear()
    canvas.style.opacity = '0'
    hud.style.opacity = '0'
    clearTimeout(helpTimer)
    help.remove()
    cancelAnimationFrame(raf)
    await world.destroy() // flies every piece home, then unhides the page
    fighters.destroy()
    Matter.World.clear(engine.world, false)
    Matter.Engine.clear(engine)
    canvas.remove()
    hud.remove()
    html.style.overflow = saved.overflow
    scrollTo(saved.x, saved.y)
    delete w.__fight
    onExit()
  }
}
