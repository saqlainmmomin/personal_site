import { useRef, useState, type KeyboardEvent } from 'react'
import { cycle } from '@/content/experience'

const OUT_MS = 180

/** Plan, Do, Check, Act. One stage is on screen at a time; the others leave before the next arrives. */
export function WorkCycle() {
  const [active, setActive] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const timer = useRef<number>(undefined)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (i: number) => {
    if (i === active) return
    window.clearTimeout(timer.current)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setActive(i)
    setLeaving(true)
    timer.current = window.setTimeout(() => {
      setActive(i)
      setLeaving(false)
    }, OUT_MS)
  }

  const onKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' ? (i + 1) % cycle.length : e.key === 'ArrowLeft' ? (i + cycle.length - 1) % cycle.length : -1
    if (next < 0) return
    e.preventDefault()
    select(next)
    tabs.current[next]?.focus()
  }

  const step = cycle[active]
  return (
    <div>
      <div role="tablist" aria-label="Plan, do, check, act" className="flex flex-wrap gap-md border-b border-line pb-xs">
        {cycle.map((c, i) => (
          <button
            key={c.name}
            ref={(el) => void (tabs.current[i] = el)}
            role="tab"
            id={`cycle-tab-${i}`}
            aria-selected={i === active}
            aria-controls="cycle-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`label cursor-pointer py-1 transition-[color,text-shadow] duration-300 ${i === active ? 'text-link [text-shadow:0_0_12px_color-mix(in_srgb,var(--color-link)_45%,transparent)]' : 'text-grey hover:text-ink'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div
        id="cycle-panel"
        role="tabpanel"
        aria-labelledby={`cycle-tab-${active}`}
        className={`pt-md transition-opacity ease-out ${leaving ? 'opacity-0 duration-150' : 'opacity-100 duration-300'}`}
      >
        <p className="text-grey">{step.purpose}</p>
        <ol key={step.name} className="mt-md space-y-md">
          {step.points.map((pt, i) => (
            <li key={pt.title} className="cycle-item" style={{ animationDelay: `${i * 90}ms` }}>
              <p className="font-semibold">{pt.title}</p>
              <p className="max-w-text text-grey">{pt.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
