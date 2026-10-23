import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { practice, type PracticeGroup } from '@/content/credentials'

const pad = (n: number) => String(n).padStart(2, '0')

function Chips({ terms }: { terms: string[] }) {
  return (
    <ul className="mt-2.5 flex flex-wrap gap-2">
      {terms.map((t) => (
        <li key={t} className="rounded-full border border-ink/25 bg-paper px-3 py-1 text-[14px] leading-[1.45] font-medium text-ink">
          {t}
        </li>
      ))}
    </ul>
  )
}

function Panel({ group }: { group: PracticeGroup }) {
  return (
    <>
      {group.itemsLabel && <h5 className="mt-7 text-[15px] font-semibold text-accent-dark">{group.itemsLabel}</h5>}
      {group.items && (
        <ul className={`${group.itemsLabel ? 'mt-3' : 'mt-7'} grid gap-3 sm:grid-cols-2`}>
          {group.items.map((item) => (
            <li key={item.name} className={`flex gap-3 border border-ink/15 bg-paper/80 px-4 py-3.5 text-[16px] leading-[1.45] text-ink${item.terms ? ' sm:col-span-2' : ''}`}>
              <span className="mt-[0.45em] size-2 shrink-0 bg-accent" aria-hidden="true" />
              <span>
                {item.name}
                {item.terms && <Chips terms={item.terms} />}
              </span>
            </li>
          ))}
        </ul>
      )}
      {group.sets && (
        <div className={`mt-6 grid gap-x-8 gap-y-6 ${group.sets.length > 3 ? 'sm:grid-cols-2' : ''} ${group.items ? '' : 'first:mt-7'}`}>
          {group.sets.map((set) => (
            <div key={set.label}>
              <h5 className="text-[15px] font-semibold text-accent-dark">{set.label}</h5>
              <Chips terms={set.terms} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/**
 * Practice areas as a pass you flip through: six tabs on the left (a grid on phones), one access-pass card on the
 * right. The card tilts toward a mouse and catches a foil sheen, like the hero badge. Every panel stays in the DOM.
 */
export function PracticePass() {
  const [active, setActive] = useState(0)
  const uid = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const card = useRef<HTMLDivElement>(null)

  const go = (i: number, focus = false) => {
    const n = (i + practice.length) % practice.length
    setActive(n)
    if (focus) tabs.current[n]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    const next = { ArrowDown: active + 1, ArrowRight: active + 1, ArrowUp: active - 1, ArrowLeft: active - 1, Home: 0, End: practice.length - 1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    go(next, true)
  }

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = card.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${((0.5 - y) * 6).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((x - 0.5) * 8).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
  }
  const reset = () => {
    const el = card.current
    if (!el) return
    for (const v of ['--rx', '--ry', '--mx', '--my']) el.style.removeProperty(v)
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-10">
      <div role="tablist" aria-label="Practice and focus areas" aria-orientation="vertical" onKeyDown={onKey} className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:content-start lg:gap-1">
        {practice.map((g, i) => (
          <button
            key={g.area}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${uid}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => go(i)}
            className="pass-tab group flex items-baseline gap-3 border-l-4 px-3 py-3 text-left transition-colors lg:gap-4 lg:px-5 lg:py-4"
          >
            <span className="font-serif text-xl leading-none text-muted group-aria-selected:text-accent-dark lg:text-3xl">{pad(i + 1)}</span>
            <span className="font-serif text-xl leading-tight lg:text-[1.75rem]">{g.area}</span>
          </button>
        ))}
      </div>

      <div className="pass" onPointerMove={onMove} onPointerLeave={reset}>
        <div ref={card} className="pass-face relative overflow-hidden rounded-2xl border border-ink/20 p-5 pt-12 sm:p-8 sm:pt-14 lg:min-h-[34rem]">
          <span className="absolute top-4 left-1/2 h-3 w-20 -translate-x-1/2 rounded-full bg-paper shadow-[inset_0_2px_3px_rgb(13_13_13/0.35)] ring-1 ring-ink/25" aria-hidden="true" />
          <span className="pass-foil" aria-hidden="true" />
          <div className="relative">
            {practice.map((g, i) => (
              <div key={g.area} role="tabpanel" id={`${uid}-panel-${i}`} aria-labelledby={`${uid}-tab-${i}`} hidden={active !== i} tabIndex={0} className="pass-panel">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-serif text-5xl leading-none text-balance sm:text-6xl">{g.area}</h4>
                  <p className="font-serif text-2xl leading-none whitespace-nowrap text-ink-2 sm:text-3xl" aria-hidden="true">
                    {pad(i + 1)}
                    <span className="text-muted"> / {pad(practice.length)}</span>
                  </p>
                </div>
                <Panel group={g} />
              </div>
            ))}
          </div>
          <div className="relative mt-8 flex items-center justify-between gap-4 border-t border-ink/20 pt-4">
            <button type="button" onClick={() => go(active - 1)} className="pass-step">
              ← Previous
            </button>
            <button type="button" onClick={() => go(active + 1)} className="pass-step">
              Next area →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
