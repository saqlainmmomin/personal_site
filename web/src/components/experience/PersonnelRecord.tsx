import { useRef } from 'react'
import { roles, type Role } from '@/content/experience'
import { useInViewOnce } from '@/lib/motion'

/** One job as a feature block: dates, a big wordmark with a rule that grows in, then place, title and summary. */
function RoleBlock({ role, current }: { role: Role; current?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInViewOnce(ref, '0px 0px -15% 0px')
  return (
    <article ref={ref} data-in={inView || undefined}>
      <header data-reveal className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <p className={`flex items-center gap-2.5 font-mono text-xs tracking-[0.15em] uppercase ${current ? 'text-accent-dark' : 'text-muted'}`}>
            <span className={`size-2.5 rounded-full ${current ? 'bg-accent' : 'border border-muted'}`} aria-hidden="true" />
            {role.period}
          </p>
          <h3 className={`mt-4 font-serif leading-none ${current ? 'text-6xl md:text-8xl' : 'text-5xl md:text-7xl'}`}>{role.org}</h3>
          <span className={`grow-rule mt-4 block h-1 ${current ? 'bg-accent' : 'bg-ink'}`} aria-hidden="true" />
        </div>
        <div className="max-w-2xl lg:pb-3">
          <p className="font-serif text-2xl text-muted italic">{role.place}</p>
          <p className="mt-2 text-lg font-semibold text-ink">{role.title}</p>
          <p className="mt-3 text-[17px] leading-[1.45] text-ink-2">{role.summary}</p>
        </div>
      </header>
    </article>
  )
}

/** The current role. Its engagements follow it in the engagement map. */
export function PersonnelRecord() {
  return <RoleBlock role={roles[0]} current />
}

/** Jobs before the current one, each set apart by a rule so it reads as a separate employer. */
export function EarlierRoles() {
  return (
    <>
      {roles.slice(1).map((role) => (
        <div key={role.org} className="mt-24 border-t border-line-2 pt-12">
          <p className="mb-8 font-mono text-xs tracking-[0.2em] text-muted uppercase">Before KPMG</p>
          <RoleBlock role={role} />
        </div>
      ))}
    </>
  )
}
