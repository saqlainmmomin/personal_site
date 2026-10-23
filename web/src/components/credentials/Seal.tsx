import { useRef, type PointerEvent } from 'react'
import type { seals } from '@/content/credentials'

type SealData = (typeof seals)[number]

/** Embossed seal: tilts toward the pointer and catches a foil sheen (fine pointers, motion allowed). */
export function Seal({ seal }: { seal: SealData }) {
  const ref = useRef<HTMLElement>(null)
  const ring = `ring-${seal.id}`

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${((0.5 - y) * 16).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((x - 0.5) * 16).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
  }
  const reset = () => {
    const el = ref.current
    if (!el) return
    for (const v of ['--rx', '--ry', '--mx', '--my']) el.style.removeProperty(v)
  }

  return (
    <figure ref={ref} className="seal" onPointerMove={onMove} onPointerLeave={reset}>
      <div className="seal-face">
        <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden="true">
          <defs>
            <path id={ring} d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
          </defs>
          <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
          <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
          <text className="seal-ring" fill="currentColor">
            <textPath href={`#${ring}`} startOffset="0" textLength="486" lengthAdjust="spacing">
              LEAD AUDITOR · CERTIFIED · LEAD AUDITOR · CERTIFIED ·
            </textPath>
          </text>
        </svg>
        <div className="relative grid place-items-center text-center" aria-hidden="true">
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase">ISO</p>
          <p className="font-serif text-[1.9rem] leading-none">{seal.standard.replace('ISO ', '')}</p>
          <p className="mt-0.5 font-mono text-[9px] tracking-[0.2em]">:{seal.edition}</p>
        </div>
        <span className="seal-foil" aria-hidden="true" />
      </div>
      <figcaption className="mt-4 text-center">
        <p className="font-serif text-xl leading-tight">
          {seal.standard}:{seal.edition}
        </p>
        <p className="mt-1 text-[13px] leading-snug text-ink-2">Lead Auditor · {seal.topic}</p>
      </figcaption>
    </figure>
  )
}
