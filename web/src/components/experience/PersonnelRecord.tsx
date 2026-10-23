import { useRef } from 'react'
import { roles } from '@/content/experience'
import { useInViewOnce } from '@/lib/motion'

/** The current role as a feature block: big wordmark, a live "present" dot, and the six areas of work as tiles. */
export function PersonnelRecord() {
  const [current, ...past] = roles
  const ref = useRef<HTMLElement>(null)
  const inView = useInViewOnce(ref, '0px 0px -15% 0px')

  return (
    <div className="mt-16">
      <article ref={ref} data-in={inView || undefined} className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:gap-12">
        <header>
          <p className="flex items-center gap-2.5 font-mono text-xs tracking-[0.15em] text-accent-dark uppercase">
            <span className="pulse-dot size-2.5 rounded-full bg-accent" aria-hidden="true" />
            {current.period}
          </p>
          <h3 className="mt-4 font-serif text-7xl leading-none md:text-8xl">{current.org}</h3>
          <span className="grow-rule mt-4 block h-1 bg-accent" aria-hidden="true" />
          <p className="mt-4 font-serif text-2xl text-muted italic">{current.place}</p>
          <p className="mt-5 max-w-xs text-sm leading-snug text-ink-2">{current.title}</p>
          <p className="mt-4 max-w-xs leading-snug text-ink">{current.summary}</p>
        </header>
        <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {current.areas?.map((item, i) => (
            <li key={item.area} className="stagger-in" style={{ '--i': i } as React.CSSProperties}>
              <div className="work-tile group relative h-full overflow-hidden border border-line bg-paper-2/60 p-5">
                <span className="font-serif text-4xl leading-none text-ink/45 transition-colors duration-300 group-hover:text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4 className="mt-4 font-mono text-[11px] tracking-[0.2em] text-ink uppercase">{item.area}</h4>
                <p className="mt-2 text-[15px] leading-snug text-ink-2">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </article>

      {/* Earlier roles */}
      {past.map((role) => (
        <article key={role.org} className="mt-12 grid gap-3 border-t border-line pt-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:gap-12">
          <header>
            <p className="font-mono text-xs tracking-[0.15em] text-muted uppercase">{role.period}</p>
            <h3 className="mt-2 font-serif text-3xl leading-tight">
              {role.org} <span className="text-muted italic">· {role.place}</span>
            </h3>
            <p className="mt-1 text-sm text-ink-2">{role.title}</p>
          </header>
          <p className="max-w-2xl self-end leading-snug text-ink-2">{role.summary}</p>
        </article>
      ))}
    </div>
  )
}
