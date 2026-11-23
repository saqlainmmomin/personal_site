// Projects page: the stickman starts in the nav like everywhere else, but the tiles make a poor arena
// up there. On the first scroll (or a click) it hops off the nav and falls down the page, tumbling,
// to land at the right end of the footer (index.css places the slot). The fight starts from there only.
import { mounted } from './launch'

const G = 2800 // px/s², down
const HOP = -320 // px/s: the little hop up off the nav before it falls
const BOUNCE = 220 // px/s: the one small bounce when it lands

void mounted.then((li) => {
  const footer = document.querySelector('footer')
  if (!li || !footer) return
  const button = li.querySelector('button')!
  let dropped = false

  const drop = (animate: boolean) => {
    if (dropped) return
    dropped = true
    removeEventListener('scroll', onScroll)
    const from = button.getBoundingClientRect()
    const slot = document.createElement('span')
    slot.dataset.fightLaunch = ''
    slot.append(button)
    footer.append(slot)
    li.remove()
    if (!animate) return

    // Fly from where it was in the nav to its slot: x eases across, y follows gravity, one full turn on the way.
    const to = button.getBoundingClientRect()
    const dx = from.left - to.left
    const dy = from.top - to.top // negative: the slot is below
    const fall = (-HOP + Math.sqrt(HOP * HOP - 2 * G * dy)) / G // when dy + HOP t + G t²/2 reaches 0
    const land = fall + (2 * BOUNCE) / G
    const t0 = performance.now()
    button.style.pointerEvents = 'none'
    const frame = (now: number) => {
      const t = (now - t0) / 1000
      if (t >= land) {
        button.style.transform = button.style.pointerEvents = ''
        return
      }
      if (t < fall) {
        const p = t / fall
        button.style.transform = `translate(${dx * (1 - p) ** 2}px, ${dy + HOP * t + (G * t * t) / 2}px) rotate(${360 * p}deg)`
      } else {
        const b = t - fall
        button.style.transform = `translateY(${-BOUNCE * b + (G * b * b) / 2}px)`
      }
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  // Up in the nav the fight isn't on yet: a click knocks the stickman off instead.
  li.addEventListener('click', (e) => (e.stopPropagation(), drop(true)), { capture: true })
  const onScroll = () => scrollY > 8 && drop(true)
  // Already scrolled (a reload mid-page) or reduced motion: it is simply waiting at the bottom.
  if (scrollY > 8 || matchMedia('(prefers-reduced-motion: reduce)').matches) drop(false)
  else addEventListener('scroll', onScroll, { passive: true })
})
