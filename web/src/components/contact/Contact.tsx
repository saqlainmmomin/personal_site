import { useRef } from 'react'
import { contact } from '@/content/contact'
import { Section } from '@/components/ui/Section'
import { useInViewOnce } from '@/lib/motion'

// One hand-drawn stroke under "operable". pathLength=1 lets the dash offset run 1 → 0 whatever the real length.
const SCRIBBLE = 'M4 14 C 50 4, 110 20, 170 9 S 290 14, 356 5'

function Operable() {
  const ref = useRef<HTMLSpanElement>(null)
  const drawn = useInViewOnce(ref, '0px 0px -20% 0px')
  return (
    <span ref={ref} className="scribble relative inline-block" data-drawn={drawn || undefined}>
      <em className="text-accent">operable</em>
      <svg viewBox="0 0 360 20" preserveAspectRatio="none" className="absolute -bottom-3 left-0 h-3 w-full md:-bottom-4 md:h-4" aria-hidden="true">
        <path d={SCRIBBLE} pathLength={1} fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="scribble-ink" />
      </svg>
    </span>
  )
}

export function Contact() {
  return (
    <Section id="contact" index="05" label="Contact">
      <h2 className="font-serif text-6xl leading-[0.95] md:text-8xl">
        Let us make risk <Operable />.
      </h2>
      <p className="mt-10 max-w-xl text-lg leading-relaxed text-ink-2">{contact.intro}</p>

      <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-8">
        <a href={`mailto:${contact.email}`} aria-label={`Interested in working with me? Email ${contact.email}`} className="contact-stamp">
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase">Interested in working with me?</span>
          <span className="font-mono text-lg tracking-[0.06em] sm:text-2xl">{contact.email}</span>
        </a>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {contact.links.map((l) => (
            <li key={l.name}>
              <a
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener' } : { download: true })}
                className="group inline-flex items-baseline gap-2 border-b border-line-2 pb-1 transition-colors hover:border-ink"
              >
                <span className="font-mono text-xs tracking-[0.18em] uppercase">{l.name}</span>
                <span className="font-mono text-[11px] text-ink-2">{l.handle}</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
