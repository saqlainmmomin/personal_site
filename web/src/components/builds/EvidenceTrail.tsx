import { useCallback, useRef, type CSSProperties } from 'react'
import { trail } from '@/content/builds'
import { useScrollProgress } from '@/lib/motion'

// A wave through one node per column, all on y = 40. It starts a half-column before the
// viewBox so every segment has the same shape.
const COLS = trail.length
const STEP = 1000 / COLS
const PATH =
  `M${-STEP / 2} 40 Q 0 4 ${STEP / 2} 40` +
  Array.from({ length: COLS }, (_, i) => ` T ${STEP / 2 + STEP * (i + 1)} 40`).join('')

/** How Yozora runs, as a trail that draws itself on scroll; each node lights up as the line reaches it. */
export function EvidenceTrail() {
  const ref = useRef<HTMLDivElement>(null)
  const onProgress = useCallback((p: number) => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--p', p.toFixed(4))
    el.dataset.step = String(Math.min(trail.length, Math.floor(p * trail.length + 0.5)))
  }, [])
  useScrollProgress(ref, onProgress, 0.8, 0.55)

  return (
    <div ref={ref} className="trail relative mt-20" data-step="0">
      <h3 className="font-serif text-3xl">How it is designed to run</h3>

      {/* Desktop: horizontal wave */}
      <svg viewBox="0 0 1000 80" preserveAspectRatio="none" className="mt-6 hidden h-20 w-full lg:block" aria-hidden="true">
        <path d={PATH} fill="none" stroke="var(--color-line-2)" strokeWidth="1.5" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
        <path
          d={PATH}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          pathLength={1}
          className="trail-ink"
        />
      </svg>

      <ol className="relative grid gap-0 lg:-mt-[52px] lg:grid-cols-5">
        {/* Mobile: vertical rail */}
        <span className="trail-rail absolute top-2 bottom-2 left-[11px] w-0.5 bg-line lg:hidden" aria-hidden="true" />
        {trail.map((node, i) => (
          <li key={node.step} className="trail-node relative pb-12 pl-10 lg:px-3 lg:pb-0 lg:pl-4 lg:text-center" style={{ '--i': i } as CSSProperties}>
            <span className="trail-dot absolute top-1 left-0 grid size-6 place-items-center rounded-full border-2 font-mono text-xs lg:relative lg:top-0 lg:mx-auto">
              {i + 1}
            </span>
            <h4 className="mt-0 font-serif text-2xl leading-tight lg:mt-6 lg:whitespace-nowrap">{node.step}</h4>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2 lg:mx-auto lg:max-w-[24ch]">{node.line}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
