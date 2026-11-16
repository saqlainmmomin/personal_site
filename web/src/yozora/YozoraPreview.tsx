import { useEffect, useRef, useState } from 'react'
import { applyState, makeStatic, screenUrl, type ScreenName, type ScreenState } from './screens'

// The screens render at a fixed width and are scaled to the tile: the desktop layout on wide
// tiles, the product's narrow layout on phones so the text stays legible.
const DESKTOP = 1200
const NARROW = 600
const RATIO = 10 / 16
const DWELL = 2200 // ms per frame

interface Frame {
  screen: ScreenName
  state: ScreenState
  /** Scroll the screen so this element shows, at the top or the bottom of the tile. */
  show?: [string, 'top' | 'bottom']
}

const FRAMES: Frame[] = [
  { screen: 'scope', state: 'before' },
  { screen: 'rfi', state: 'before' },
  { screen: 'evidence', state: 'before' },
  { screen: 'evidence', state: 'after', show: ['[data-reveal-focus]', 'top'] },
  { screen: 'questionnaire', state: 'before' },
  { screen: 'questionnaire', state: 'after', show: ['[data-reveal-focus]', 'top'] },
  { screen: 'review', state: 'before' },
  { screen: 'review', state: 'after', show: ['.actions:not([hidden])', 'bottom'] },
  { screen: 'report', state: 'before', show: ['img', 'top'] },
]
const SCREENS = [...new Set(FRAMES.map((f) => f.screen))]
const STILL = 3 // the evidence analysis result

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function show(doc: Document, f: Frame) {
  applyState(doc, f.state)
  const win = doc.defaultView!
  const el = f.show && doc.querySelector<HTMLElement>(f.show[0])
  if (!el) return win.scrollTo({ top: 0 })
  const r = el.getBoundingClientRect()
  const top = f.show![1] === 'top' ? r.top - 72 : r.bottom - win.innerHeight + 24
  win.scrollTo({ top: Math.max(0, win.scrollY + top) })
}

/**
 * A non-interactive, looping preview of the six stages for the homepage tile, including the
 * revealed results. It plays only while in view; under reduced motion it shows one still frame.
 * Screen readers get one label; the screens inside are hidden from them and inert.
 */
export function YozoraPreview({ className = '' }: { className?: string }) {
  const [i, setI] = useState(() => (reducedMotion() ? STILL : 0))
  const [tileW, setTileW] = useState(0)
  const [inView, setInView] = useState(false)
  const [seen, setSeen] = useState(false)
  const [loaded, setLoaded] = useState<Partial<Record<ScreenName, Document>>>({})
  const outer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = outer.current!
    const ro = new ResizeObserver(([e]) => setTileW(e.contentRect.width))
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => (setInView(e.isIntersecting), e.isIntersecting && setSeen(true)), { rootMargin: '200px 0px' })
    io.observe(el)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion()) return
    const t = window.setInterval(() => setI((n) => (n + 1) % FRAMES.length), DWELL)
    return () => window.clearInterval(t)
  }, [inView])

  const frame = FRAMES[i]
  const doc = loaded[frame.screen]
  useEffect(() => {
    if (doc) show(doc, frame)
  }, [doc, frame, tileW])

  const width = tileW < NARROW ? NARROW : DESKTOP
  const scale = tileW / width

  return (
    <div
      ref={outer}
      role="img"
      aria-label="Preview of the Yozora concept: scoping an engagement, the evidence request, evidence analysis, the questionnaire and its draft conclusions, the consultant approving a conclusion, and the released report."
      className={`relative w-full overflow-hidden border border-line bg-[#E6E5EE] ${className}`}
      style={{ aspectRatio: '16 / 10' }}
    >
      {seen && scale > 0 && (
        <div aria-hidden="true" inert className="absolute top-0 left-0 origin-top-left" style={{ width, height: width * RATIO, transform: `scale(${scale})` }}>
          {SCREENS.filter((s) => !reducedMotion() || s === frame.screen).map((s) => (
            <iframe
              key={s}
              src={screenUrl(s)}
              title="Yozora preview"
              tabIndex={-1}
              onLoad={(e) => {
                const d = e.currentTarget.contentDocument
                if (!d) return
                makeStatic(d)
                setLoaded((l) => ({ ...l, [s]: d }))
              }}
              className="absolute inset-0 block h-full w-full border-0"
              style={{ visibility: s === frame.screen && loaded[s] ? 'visible' : 'hidden' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
