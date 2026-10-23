import { useRef, type CSSProperties } from 'react'
import { roles, type Area } from '@/content/experience'
import { useInViewOnce } from '@/lib/motion'

function AreaCard({ item, ghost }: { item: Area; ghost?: number }) {
  return (
    <div className="work-card h-full overflow-hidden border border-line-2 border-t-4 border-t-ink bg-paper-2/70 p-5 md:p-6">
      <h4 className="text-[15px] font-semibold text-accent-dark">{item.area}</h4>
      <p className="mt-3 font-serif text-[2.5rem] leading-[1] text-balance text-ink md:text-[2.75rem]">
        <span className="mark">{item.key}</span>
      </p>
      <p className="mt-4 text-[15px] leading-[1.45] text-ink-2">{item.detail}</p>
      {ghost && (
        <span className="pointer-events-none absolute right-4 bottom-0 hidden font-serif text-[10rem] leading-[0.8] text-ink/[0.07] select-none lg:block" aria-hidden="true">
          {ghost}
        </span>
      )}
    </div>
  )
}

/**
 * The current role as a feature block: big wordmark, then the six areas laid out as the lifecycle of an
 * engagement (design → implement → assure → run) with client leadership running underneath all four.
 */
export function PersonnelRecord() {
  const [current, ...past] = roles
  const ref = useRef<HTMLElement>(null)
  const inView = useInViewOnce(ref, '0px 0px -15% 0px')
  const areas = current.areas ?? []
  const stages = [1, 2, 3, 4].map((n) => areas.filter((a) => a.stage === n))
  const leadership = areas.find((a) => !a.stage)

  return (
    <div>
      <article ref={ref} data-in={inView || undefined}>
        <header className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <p className="flex items-center gap-2.5 font-mono text-xs tracking-[0.15em] text-accent-dark uppercase">
              <span className="pulse-dot size-2.5 rounded-full bg-accent" aria-hidden="true" />
              {current.period}
            </p>
            <h3 className="mt-4 font-serif text-6xl leading-none md:text-8xl">{current.org}</h3>
            <span className="grow-rule mt-4 block h-1 bg-accent" aria-hidden="true" />
          </div>
          <div className="max-w-2xl lg:pb-3">
            <p className="font-serif text-2xl text-muted italic">{current.place}</p>
            <p className="mt-2 text-lg font-semibold text-ink">{current.title}</p>
            <p className="mt-3 text-[17px] leading-[1.45] text-ink-2">{current.summary}</p>
          </div>
        </header>

        <ol className="mt-14 grid gap-0 lg:grid-cols-4 lg:gap-6">
          {stages.map((items, i) => (
            <li key={i} className="stagger-in relative flex flex-col pb-8 pl-14 last:pb-0 lg:pb-0 lg:pl-0" style={{ '--i': i } as CSSProperties}>
              <span
                className="absolute top-0 left-0 grid size-9 place-items-center rounded-full bg-ink font-mono text-sm text-paper lg:static"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              {i < stages.length - 1 && <span className="flow-link" style={{ '--i': i } as CSSProperties} aria-hidden="true" />}
              <div className="grid gap-3 lg:mt-5 lg:flex-1 lg:auto-rows-fr">
                {items.map((item) => (
                  <AreaCard key={item.area} item={item} ghost={items.length === 1 ? i + 1 : undefined} />
                ))}
              </div>
            </li>
          ))}
        </ol>

        {leadership && (
          <div className="stagger-in mt-8 lg:mt-6" style={{ '--i': 4 } as CSSProperties}>
            <span className="bracket mb-3 block h-3 border-x-2 border-b-2 border-ink/60" aria-hidden="true" />
            <div className="grid gap-x-10 gap-y-2 border border-line-2 border-l-8 border-l-accent bg-paper-2/70 p-5 md:p-6 lg:grid-cols-[10rem_minmax(0,1.6fr)_minmax(0,1.5fr)] lg:items-center">
              <h4 className="text-[15px] font-semibold text-accent-dark">{leadership.area}</h4>
              <p className="font-serif text-[2.5rem] leading-[1] text-balance text-ink md:text-[2.75rem]">
                <span className="mark">{leadership.key}</span>
              </p>
              <p className="text-[15px] leading-[1.45] text-ink-2">{leadership.detail}</p>
            </div>
          </div>
        )}
      </article>

      {/* Earlier roles */}
      {past.map((role) => (
        <article key={role.org} className="mt-14 grid gap-3 border-t border-line pt-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:gap-12">
          <header>
            <p className="font-mono text-xs tracking-[0.15em] text-muted uppercase">{role.period}</p>
            <h3 className="mt-2 font-serif text-3xl leading-tight">
              {role.org} <span className="text-muted italic">· {role.place}</span>
            </h3>
            <p className="mt-1 text-sm text-ink-2">{role.title}</p>
          </header>
          <p className="max-w-2xl self-end leading-[1.45] text-ink-2">{role.summary}</p>
        </article>
      ))}
    </div>
  )
}
