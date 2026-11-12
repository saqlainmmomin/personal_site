import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { trail } from '@/content/builds'

// A wave through one node per column, all on y = 40. It starts a half-column before the
// viewBox so every segment has the same shape.
const COLS = trail.length
const STEP = 1000 / COLS
const PATH =
  `M${-STEP / 2} 40 Q 0 4 ${STEP / 2} 40` +
  Array.from({ length: COLS }, (_, i) => ` T ${STEP / 2 + STEP * (i + 1)} 40`).join('')
const DWELL = 3400 // ms on each step while it plays by itself

const delay = (ms: number) => ({ '--d': ms }) as CSSProperties
const Label = ({ children }: { children: ReactNode }) => (
  <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">{children}</p>
)
const Bar = ({ w }: { w: string }) => <span className="block h-2 bg-line" style={{ width: w }} />

/** One small illustration per step. Everything in them is made-up sample data, not the product's interface. */
const scenes: ReactNode[] = [
  // 1. Map once
  <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]">
    <div className="pop border border-ink p-4">
      <Label>One control</Label>
      <p className="mt-2 font-serif text-2xl leading-tight">Access is reviewed every quarter</p>
    </div>
    <span className="grow-x hidden h-0.5 bg-accent sm:block" style={delay(250)} aria-hidden="true" />
    <ul className="grid gap-2">
      {['ISO 27001', 'NIST CSF', 'DPDPA'].map((f, i) => (
        <li key={f} className="pop flex items-center justify-between gap-3 border border-line-2 px-3 py-2 text-sm" style={delay(450 + i * 180)}>
          {f}
          <span className="font-mono text-[11px] tracking-[0.15em] text-accent-dark uppercase">Mapped ✓</span>
        </li>
      ))}
    </ul>
  </div>,
  // 2. Pre-fill answers
  <ul className="grid gap-2">
    {['Is MFA enforced for admin access?', 'Are backups restored on a schedule?', 'Are vendors tiered by risk?'].map((q, i) => (
      <li key={q} className="grid items-center gap-x-4 gap-y-1 border border-line-2 px-3 py-2.5 text-sm sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        {q}
        <span className="pop w-max bg-paper-2 px-2 py-0.5 font-mono text-[11px] tracking-[0.12em] uppercase" style={delay(200 + i * 350)}>
          Pre-filled from evidence
        </span>
        <span className="pop w-max font-mono text-[11px] tracking-[0.12em] text-accent-dark uppercase" style={delay(1300 + i * 300)}>
          Confirmed ✓
        </span>
      </li>
    ))}
  </ul>,
  // 3. Review the evidence
  <div className="grid gap-5 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
    <div className="pop grid gap-2.5 border border-line-2 p-4" aria-hidden="true">
      <Bar w="55%" />
      <Bar w="92%" />
      <p className="relative w-max max-w-full px-1 text-sm">
        <span className="grow-x absolute inset-0 bg-accent/25" style={delay(500)} />
        <span className="relative">Quarterly access review signed off by the IT lead</span>
      </p>
      <Bar w="80%" />
      <Bar w="64%" />
    </div>
    <ul className="grid content-center gap-2 text-sm">
      {['Design effectiveness ✓', 'Operating effectiveness ✓', 'Source: access-review.pdf, page 2'].map((t, i) => (
        <li key={t} className="pop border-l-2 border-accent pl-3" style={delay(900 + i * 250)}>
          {t}
        </li>
      ))}
    </ul>
  </div>,
  // 4. Score by rule
  <div className="grid gap-3">
    {[
      ['ISO 27001', '82%'],
      ['NIST CSF', '64%'],
      ['DPDPA', '73%'],
    ].map(([f, w], i) => (
      <div key={f} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 text-sm">
        {f}
        <span className="block h-5 border border-line-2" aria-hidden="true">
          <span className="grow-x block h-full bg-ink" style={{ width: w, ...delay(200 + i * 220) }} />
        </span>
      </div>
    ))}
    <p className="pop mt-1 font-mono text-[11px] tracking-[0.15em] text-accent-dark uppercase" style={delay(1100)}>
      Sample scores · one score per framework · fixed rules, never blended
    </p>
  </div>,
  // 5. Approve & act
  <div className="grid items-center gap-5 sm:grid-cols-2">
    <div className="pop relative border border-ink p-4">
      <Label>Proposed conclusion</Label>
      <p className="mt-2 font-serif text-2xl leading-tight">Partially effective</p>
      <span className="pop absolute top-3 right-3 rotate-[-8deg] border-[3px] border-double border-stamp-ink px-2 py-0.5 font-mono text-xs tracking-[0.2em] text-stamp-ink uppercase" style={delay(800)}>
        Approved
      </span>
    </div>
    <div className="pop border border-line-2 border-l-4 border-l-accent p-4" style={delay(1400)}>
      <Label>Tracked action</Label>
      <p className="mt-2 text-sm leading-snug">Close the gaps found in the access review. Owner: IT lead. Due in 30 days.</p>
    </div>
  </div>,
]

/**
 * How Yozora is designed to run, as a five-step walkthrough. It plays by itself whenever it is in view: the
 * line draws to the current step and a small window acts the step out. Clicking a step jumps to it and the
 * walkthrough carries on from there. Under reduced motion it stays put and is driven by clicks only.
 */
export function EvidenceTrail() {
  const ref = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [jumps, setJumps] = useState(0) // bumped on a click, so the timer restarts and the picked step gets its full time
  const auto = !matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!auto) return
    let timer = 0
    const io = new IntersectionObserver(([entry]) => {
      clearInterval(timer)
      if (entry.isIntersecting) timer = window.setInterval(() => setStep((s) => (s + 1) % COLS), DWELL)
    }, { threshold: 0.25 })
    io.observe(ref.current!)
    return () => {
      clearInterval(timer)
      io.disconnect()
    }
  }, [auto, jumps])

  const pick = (i: number) => {
    setStep(i)
    setJumps((n) => n + 1)
  }

  return (
    <div ref={ref} className="trail relative mt-20" data-step={step + 1} style={{ '--p': (step + 1) / (COLS + 1) } as CSSProperties}>
      <h3 className="font-serif text-3xl">How it is designed to run</h3>

      {/* Desktop: horizontal wave */}
      <svg viewBox="0 0 1000 80" preserveAspectRatio="none" className="mt-6 hidden h-20 w-full lg:block" aria-hidden="true">
        <path d={PATH} fill="none" stroke="var(--color-line-2)" strokeWidth="1.5" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
        <path d={PATH} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" pathLength={1} className="trail-ink" />
      </svg>

      <ol className="relative mt-6 grid gap-0 lg:-mt-[52px] lg:grid-cols-5">
        {/* Mobile: vertical rail */}
        <span className="trail-rail absolute top-2 bottom-2 left-[11px] w-0.5 bg-line lg:hidden" aria-hidden="true" />
        {trail.map((node, i) => (
          <li key={node.step} className="trail-node relative lg:px-3">
            <button
              type="button"
              aria-pressed={i === step}
              aria-controls="yozora-window"
              onClick={() => pick(i)}
              className="trail-step relative w-full cursor-pointer pb-4 pl-10 text-left lg:pb-0 lg:pl-0 lg:text-center"
            >
              <span className="trail-dot absolute top-1 left-0 grid size-6 place-items-center rounded-full border-2 font-mono text-xs lg:relative lg:top-0 lg:mx-auto">
                {i + 1}
              </span>
              <span className="block font-serif text-2xl leading-tight lg:mt-6 lg:whitespace-nowrap">{node.step}</span>
            </button>
          </li>
        ))}
      </ol>

      <div id="yozora-window" aria-live={auto ? 'off' : 'polite'} className="mt-8 border border-ink bg-paper shadow-[8px_8px_0_0_var(--color-ink)]">
        <div className="flex items-center gap-2 border-b border-ink px-4 py-2.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-2.5 rounded-full border border-ink" aria-hidden="true" />
          ))}
          <p className="ml-2 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            Step {step + 1} of {COLS} · illustration with sample data
          </p>
        </div>
        <div key={step} className="grid min-h-[13.5rem] content-center p-5 md:px-8">
          {scenes[step]}
        </div>
        <p key={`line-${step}`} className="detail-in border-t border-line px-5 py-3.5 text-[15px] leading-[1.45] text-ink-2 md:px-8">
          {trail[step].line}
        </p>
      </div>
    </div>
  )
}
