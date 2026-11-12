import { useEffect, useRef, useState } from 'react'
import { caseFiles, mapGroups } from '@/content/experience'
import { useInViewOnce } from '@/lib/motion'

interface Wire {
  id: string
  term: string
  d: string
}

function Stamp() {
  const ref = useRef<HTMLSpanElement>(null)
  const stamped = useInViewOnce(ref, '0px 0px -35% 0px')
  return (
    <span ref={ref} className="stamp" data-stamped={stamped || undefined}>
      NDA{' '}
      <small>Client confidential</small>
    </span>
  )
}

/**
 * Five anonymized engagement types wired to what each one touched: frameworks, regulators, assurance work and
 * sectors. Picking an engagement (hover, focus or click) lights its wires and shows its result below;
 * hovering a term lights every engagement that touched it. On first view it steps through all of them once.
 * Sized so the map and the detail panel fit one laptop screen together. Below lg the columns stack and the
 * wires are dropped; the terms still light up.
 */
export function EngagementMap() {
  const boardRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState(caseFiles[0].id)
  const [hoverTerm, setHoverTerm] = useState<string | null>(null)
  const [wires, setWires] = useState<Wire[]>([])
  const touched = useRef(false)
  const inView = useInViewOnce(boardRef, '0px 0px -30% 0px')
  const active = caseFiles.find((f) => f.id === selected)!

  // Engagements sit in the centre: wires leave the left edge for terms on the left, the right edge for terms on the right.
  useEffect(() => {
    const board = boardRef.current!
    const measure = () => {
      const box = board.getBoundingClientRect()
      const next: Wire[] = []
      for (const file of caseFiles) {
        const from = board.querySelector(`[data-eng="${file.id}"]`)?.getBoundingClientRect()
        if (!from) continue
        for (const term of file.touches) {
          const to = board.querySelector(`[data-term="${term}"]`)?.getBoundingClientRect()
          if (!to) continue
          const toLeft = to.right <= from.left
          if (!toLeft && to.left < from.right) continue // stacked layout: no wires
          const x1 = (toLeft ? from.left : from.right) - box.left
          const y1 = from.top + from.height / 2 - box.top
          const x2 = (toLeft ? to.right : to.left) - box.left
          const y2 = to.top + to.height / 2 - box.top
          const bend = (x2 - x1) * 0.55
          next.push({ id: file.id, term, d: `M${x1} ${y1} C${x1 + bend} ${y1} ${x2 - bend} ${y2} ${x2} ${y2}` })
        }
      }
      setWires(next)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(board)
    measure()
    return () => ro.disconnect()
  }, [])

  // First time in view: step through every engagement once, unless the visitor has already taken over.
  useEffect(() => {
    if (!inView || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let i = 0
    const timer = setInterval(() => {
      i += 1
      if (touched.current || i > caseFiles.length) return clearInterval(timer)
      setSelected(caseFiles[i % caseFiles.length].id)
    }, 1900)
    return () => clearInterval(timer)
  }, [inView])

  const pick = (id: string) => {
    touched.current = true
    setSelected(id)
  }
  const isLit = (w: Wire) => (hoverTerm ? w.term === hoverTerm : w.id === selected)
  const termLit = (term: string) => (hoverTerm ? term === hoverTerm : active.touches.includes(term))

  return (
    <div className="mt-20">
      <div className="relative flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-line pb-3 md:pr-52">
        <h3 className="font-serif text-3xl">Selected engagements at KPMG</h3>
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">Pick one to trace what it touched</p>
        <Stamp />
      </div>

      <div ref={boardRef} data-reveal className="relative mt-5 grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)_13rem] lg:gap-x-24 xl:grid-cols-[16rem_minmax(0,1fr)_16rem] xl:gap-x-40">
        <svg className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block" aria-hidden="true">
          {/* Only lit wires are drawn: showing all of them at once read as a tangle. */}
          {/* Keyed by lit state, so a wire redraws each time it lights. */}
          {wires.filter(isLit).map((w) => (
            <path key={`${w.id}-${w.term}-${hoverTerm ?? selected}`} d={w.d} pathLength={1} className="wire-lit" />
          ))}
        </svg>

        <ol className="grid content-between gap-[clamp(0.5rem,1.6vh,1rem)] lg:order-2">
          {caseFiles.map((file) => (
            <li key={file.id}>
              <button
                type="button"
                data-eng={file.id}
                data-linked={(hoverTerm && file.touches.includes(hoverTerm)) || undefined}
                aria-pressed={file.id === selected}
                aria-controls="engagement-detail"
                onClick={() => pick(file.id)}
                onFocus={() => pick(file.id)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && pick(file.id)}
                className="map-eng grid w-full cursor-pointer grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-2 border border-line-2 px-4 py-3.5 text-left"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-muted">{file.id}</span>
                <span className="font-serif text-2xl leading-none">{file.practice}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* Term groups flank the engagements (DOM order stays 0-3). Stacked, the engagements come first. */}
        {[mapGroups.slice(0, 2), mapGroups.slice(2)].map((column, i) => (
          <dl key={i} className={`grid content-start gap-[clamp(0.75rem,2.2vh,2rem)] ${i === 0 ? 'lg:order-1 lg:text-right' : 'lg:order-3'}`}>
            {column.map((group) => (
              <div key={group.label}>
                <dt className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">{group.label}</dt>
                <dd className="mt-2">
                  <ul className={`flex flex-wrap gap-1 lg:flex-col lg:gap-[clamp(0.25rem,calc((100svh-640px)/26),0.625rem)] ${i === 0 ? 'lg:items-end' : 'lg:items-start'}`}>
                    {group.terms.map((term) => (
                      <li
                        key={term}
                        data-term={term}
                        data-lit={termLit(term) || undefined}
                        onPointerEnter={(e) => e.pointerType === 'mouse' && setHoverTerm(term)}
                        onPointerLeave={() => setHoverTerm(null)}
                        className={`map-term relative z-[1] flex items-center gap-2 border border-line-2 px-2.5 py-0.5 text-[13px] lg:border-transparent lg:text-sm ${i === 0 ? 'lg:flex-row-reverse' : ''}`}
                      >
                        <span className="map-dot size-1.5 rounded-full" aria-hidden="true" />
                        {term}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        ))}
      </div>

      <div id="engagement-detail" aria-live="polite" className="relative z-[1] mt-[clamp(1.25rem,4vh,3.5rem)] border border-ink bg-paper p-5 md:px-7 lg:min-h-[12.5rem]">
        <dl key={active.id} className="detail-in grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-10">
          <div>
            <dt className="font-serif text-2xl leading-[1.1]">{active.title}</dt>
            <dd className="mt-3 border-t border-line pt-3 text-sm leading-[1.5]">
              <span className="mr-2 font-mono text-xs tracking-[0.2em] text-stamp-ink uppercase">Result</span>
              {active.result}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs tracking-[0.2em] text-muted uppercase">Mandate</dt>
            <dd className="mt-2 text-sm leading-[1.5] text-ink-2">{active.mandate}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs tracking-[0.2em] text-muted uppercase">Owned</dt>
            <dd className="mt-2 text-sm leading-[1.5] text-ink-2">{active.owned}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
