import { useLayoutEffect, useRef, type ReactNode } from 'react'

const TRAVEL = 0.5 // of the window height: scroll spent carrying the name, picture and text into place
const HOLD = 0.35 // more scroll with the screen still pinned, while the tabs and Get in touch fade in
const NAME_SCALE = 1.75 // the name starts larger and shrinks into the header
const GAP = 24 // between the name and the picture while centred

// Remembers, for this tab, that the landing has played once. Storage can be blocked: then it just plays again.
const storage = (op: 'get' | 'set') => {
  try {
    if (op === 'set') sessionStorage.setItem('landing-seen', '1')
    return sessionStorage.getItem('landing-seen') === '1'
  } catch {
    return false
  }
}

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

/**
 * The homepage's first screen. The screen is pinned while the name, picture and text sit centred;
 * scrolling moves them to their places: the name into the sticky header, the rest below it. When
 * they land, the tabs (with the stickman) and Get in touch fade in, and after a short hold the page
 * scrolls on, the screen fades away, and the header shrinks to just the stickman.
 * It plays once: after that, and under reduced motion, when the screen is too tall to pin (small
 * phones), or when coming back to the homepage (seen this session, or arriving from another page of
 * the site), it is a plain page.
 */
export function Landing({ intro, contact }: { intro: ReactNode; contact: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  // Layout effect: set the intro state before first paint, so the nav and name never flash in place.
  useLayoutEffect(() => {
    const track = trackRef.current!
    const stage = stageRef.current!
    const block = introRef.current!
    const contactEl = contactRef.current!
    const header = document.querySelector<HTMLElement>('header')!
    const name = header.querySelector<HTMLElement>('[data-site-name]')!
    const root = document.documentElement
    name.style.transformOrigin = 'left top'

    let geo: { start: number; travel: number; dName: number; dBlock: number } | null = null
    let frame = 0
    let natural = 0 // the plain landing's own height, without the empty space that fills the screen
    const fromSite = (() => {
      try {
        return new URL(document.referrer).origin === location.origin
      } catch {
        return false
      }
    })()
    let skip = fromSite || storage('get') // also set once the landing has played, so it never replays on this view

    // The nav sits in the header; index.css hides it while <html data-landing="intro">.
    // Past: the landing has started scrolling away, so the header shrinks to just the stickman.
    const setLanded = (landed: boolean) => {
      // Pinned: once the stage unpins and moves. Plain page: once the reader has scrolled at all.
      const past = landed && (geo ? stage.getBoundingClientRect().bottom < window.innerHeight - 1 : window.scrollY > 40)
      root.dataset.landing = past ? 'past' : landed ? 'open' : 'intro'
      contactEl.classList.toggle('is-shown', landed)
      if (landed && geo) storage('set')
    }

    const measure = () => {
      name.style.transform = block.style.transform = stage.style.opacity = ''
      stage.classList.remove('landing-pinned')
      track.style.height = stage.style.top = stage.style.height = stage.style.minHeight = ''
      const vh = window.innerHeight
      const hh = header.offsetHeight
      if (skip || window.matchMedia('(prefers-reduced-motion: reduce)').matches || stage.offsetHeight > vh - hh) {
        // Plain page: the landing fills the first screen at the top; close() shrinks the space under it as you scroll.
        natural = stage.offsetHeight
        geo = null
        close()
        setLanded(true)
        return
      }
      // The stage pins just below the sticky header and fills the rest of the window.
      stage.classList.add('landing-pinned')
      stage.style.top = `${hh}px`
      stage.style.height = `${vh - hh}px`
      track.style.height = `${vh - hh + vh * (TRAVEL + HOLD)}px`
      // Where the name and intro sit in the window once pinned and in place.
      const n = name.getBoundingClientRect()
      const b = block.getBoundingClientRect()
      const nameTop = n.top - header.getBoundingClientRect().top
      const blockTop = hh + b.top - stage.getBoundingClientRect().top
      const startTop = (vh - (n.height * NAME_SCALE + GAP + b.height)) / 2
      geo = {
        start: track.getBoundingClientRect().top + window.scrollY - hh,
        travel: vh * TRAVEL,
        dName: startTop - nameTop,
        dBlock: startTop + n.height * NAME_SCALE + GAP - blockTop,
      }
    }

    // After it has played and the page starts scrolling on, swap the pinned track for the plain page,
    // shifting the scroll by the height removed so nothing on screen moves. Scrolling back up then
    // shows the landed screen instead of running the animation again.
    const release = () => {
      const before = stage.getBoundingClientRect().top
      skip = true
      storage('set')
      measure()
      const shift = stage.getBoundingClientRect().top - before
      if (shift) window.scrollBy({ top: shift, behavior: 'instant' })
      close() // same frame, at the corrected scroll, so Work never flashes up
    }

    // Plain page: full screen at the top; each pixel scrolled takes a pixel off the empty space under
    // Get in touch, so Work rises to a normal gap below it (and the space opens again on the way up).
    const close = () => {
      stage.style.minHeight = `${Math.max(natural, window.innerHeight - header.offsetHeight - window.scrollY)}px`
    }

    const fade = () => {
      // Measured from the stage's top, so closing the space under it doesn't change the fade:
      // fully visible for the first 40% of a screen it travels under the header, gone after a full screen.
      const span = window.innerHeight - header.offsetHeight
      stage.style.opacity = String(clamp((stage.getBoundingClientRect().top - header.offsetHeight + span) / (span * 0.6)))
    }

    const update = () => {
      frame = 0
      if (!geo) return setLanded(true), close(), fade()
      // Within a pixel of the end counts as landed: browsers restore and snap scroll to fractional positions.
      const p = window.scrollY >= geo.start + geo.travel - 1 ? 1 : clamp((window.scrollY - geo.start) / geo.travel)
      const k = 1 - ease(p) // 1 = centred, 0 = in place
      name.style.transform = k ? `translateY(${geo.dName * k}px) scale(${1 + (NAME_SCALE - 1) * k})` : ''
      block.style.transform = k ? `translateY(${geo.dBlock * k}px)` : ''
      setLanded(p === 1)
      if (p === 1 && stage.getBoundingClientRect().bottom < window.innerHeight - 1) release()
      fade()
    }

    // Tabbing into the header or contact, or following a #contact link, jumps to the landed screen.
    const toLanded = () => {
      if (geo && window.scrollY < geo.start + geo.travel) window.scrollTo({ top: geo.start + geo.travel, behavior: 'instant' })
    }
    const onHash = () => {
      if (location.hash === '#contact') toLanded()
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      update()
    }

    onResize()
    onHash()
    const ro = new ResizeObserver(onResize)
    ro.observe(block)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('hashchange', onHash)
    stage.addEventListener('focusin', toLanded)
    header.addEventListener('focusin', toLanded)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', onHash)
      stage.removeEventListener('focusin', toLanded)
      header.removeEventListener('focusin', toLanded)
      name.style.transform = ''
      delete root.dataset.landing
    }
  }, [])

  return (
    <div ref={trackRef}>
      <div ref={stageRef} className="pb-lg">
        <div ref={introRef}>{intro}</div>
        <div ref={contactRef} className="landing-contact">
          {contact}
        </div>
      </div>
    </div>
  )
}
