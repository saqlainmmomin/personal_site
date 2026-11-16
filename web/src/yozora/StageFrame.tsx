import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { applyState, makeStatic, screenUrl, type Stage } from './screens'

/**
 * One product screen as an inset panel in a paper-grey frame. The screen renders at a fixed
 * design width (1200px, or 360px on phones) and is CSS-scaled down so the whole screen plus the
 * stage caption fits in one viewport. A screen with a reveal has one live button inside it;
 * Reset (outside) restores it.
 */
const PAD = 14
const PAD_PHONE = 10
const DESKTOP_W = 1200
const PHONE_W = 360

export function StageFrame({ stage, n }: { stage: Stage; n: number }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [doc, setDoc] = useState<Document | null>(null)
  const [height, setHeight] = useState(stage.estimate)
  const [revealed, setRevealed] = useState(false)
  const moveFocus = useRef(false)
  const wrap = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ colW: 0, vw: 1440, room: 700 })

  // Column width, viewport width and the height left under the caption.
  useLayoutEffect(() => {
    const w = wrap.current!
    const measure = () => {
      const above = w.getBoundingClientRect().top - w.parentElement!.parentElement!.getBoundingClientRect().top
      // Desktop: caption and frame share one viewport. Phones: the caption alone takes ~40% of the
      // screen, so only the frame (not the caption) is held to one viewport.
      const phone = window.innerWidth <= 640
      setFit({ colW: w.clientWidth, vw: window.innerWidth, room: window.innerHeight - (phone ? 0 : above) - (stage.reveal ? 44 : 0) - 24 })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(w)
    window.addEventListener('resize', measure)
    return () => (ro.disconnect(), window.removeEventListener('resize', measure))
  }, [stage.reveal])

  const phone = fit.vw <= 640
  const pad = phone ? PAD_PHONE : PAD
  const dw = phone ? PHONE_W : DESKTOP_W
  const boxMaxH = Math.max(320, fit.room) - 2 * pad - 2
  const scale = fit.colW ? Math.min(1, (fit.colW - 2 * pad - 2) / dw, boxMaxH / height) : 1

  const onLoad = () => {
    const d = frame.current?.contentDocument
    if (!d || d.documentElement.dataset.yz) return
    d.documentElement.dataset.yz = '1'
    makeStatic(d)
    applyState(d, 'before')
    d.addEventListener('click', (e) => {
      if (!(e.target as Element).closest?.('[data-reveal]')) return
      e.preventDefault()
      moveFocus.current = true
      setRevealed(true)
    })
    const measure = () => setHeight(Math.ceil(d.documentElement.getBoundingClientRect().height))
    new (d.defaultView as typeof window).ResizeObserver(measure).observe(d.documentElement)
    measure()
    setDoc(d)
  }

  useEffect(() => {
    if (!doc) return
    applyState(doc, revealed ? 'after' : 'before')
    if (!moveFocus.current) return
    moveFocus.current = false
    // Keyboard users land on the result, or back on the button after a reset.
    doc.querySelector<HTMLElement>(revealed ? '[data-reveal-focus]' : '[data-reveal]')?.focus({ preventScroll: true })
  }, [doc, revealed])

  return (
    <div className="yz-wide mt-md">
      <div ref={wrap}>
       <div className="mx-auto border border-line bg-mat" style={{ padding: pad, width: dw * scale + 2 + 2 * pad + 2 }}>
        <div className="overflow-hidden border border-line bg-white" style={{ width: dw * scale + 2, height: height * scale + 2 }}>
          <iframe
            ref={frame}
            src={screenUrl(stage.screen)}
            title={`Yozora screen, stage ${n} of 6: ${stage.title} (sample data)`}
            onLoad={onLoad}
            tabIndex={stage.reveal ? undefined : -1}
            data-screen={stage.screen}
            data-revealed={revealed || undefined}
            className="block border-0"
            style={{ width: dw, height, transform: `scale(${scale})`, transformOrigin: '0 0' }}
          />
        </div>
       </div>
      </div>
      {stage.reveal && (
        <div className="mt-xs flex flex-wrap items-baseline justify-between gap-x-sm gap-y-xs">
          <p className="label text-grey" aria-live="polite">
            {revealed ? stage.reveal.announce : `Press ${stage.reveal.button} in the screen to see the result.`}
          </p>
          <button
            type="button"
            className="label border border-line bg-paper px-sm py-[4px] text-ink hover:border-ink disabled:cursor-default disabled:opacity-40 disabled:hover:border-line"
            disabled={!revealed}
            onClick={() => {
              moveFocus.current = true
              setRevealed(false)
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
