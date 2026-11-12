import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useCountUp, useInViewOnce } from '@/lib/motion'
import { githubUser } from '@/content/credentials'

interface Day {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}
interface Activity {
  total: number
  days: Day[]
}

const SHADES = ['rgb(13 13 13 / 0.07)', 'rgb(241 73 32 / 0.28)', 'rgb(241 73 32 / 0.5)', 'rgb(241 73 32 / 0.75)', 'rgb(241 73 32)']
const CELL = 18
const GAP = 4
/** The fill-in wave staggers by week column; its delays add up to at most this, so the wave ends in about a second. */
const WAVE_MS = 600

/** The last year of GitHub contributions, fetched from a public contributions API; falls back to a plain link. */
export function GithubActivity() {
  const [data, setData] = useState<Activity | 'failed' | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  // Start as soon as the block shows, so the count is never seen sitting at 0.
  const inView = useInViewOnce(box, '0px 0px -5% 0px')
  const loaded = data !== null && data !== 'failed'
  const shown = useCountUp(loaded ? data.total : 0, inView && loaded)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`https://github-contributions-api.jogruber.de/v4/${githubUser}?y=last`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: { total: { lastYear: number }; contributions: Day[] }) => setData({ total: j.total.lastYear, days: j.contributions }))
      .catch((e) => e.name !== 'AbortError' && setData('failed'))
    return () => ctrl.abort()
  }, [])

  // Start scrolled to the most recent weeks when the graph is wider than its box.
  useEffect(() => {
    const el = scroller.current
    if (el && data && data !== 'failed') el.scrollLeft = el.scrollWidth
  }, [data])

  const profile = `https://github.com/${githubUser}`
  const link = (
    <a href={profile} target="_blank" rel="noopener" className="inline-block py-2 font-mono text-xs tracking-[0.18em] text-accent-dark uppercase underline-offset-4 hover:underline">
      @{githubUser} on GitHub ↗
    </a>
  )

  if (data === 'failed') return <p>{link}</p>

  // Pad the first week so rows line up with weekdays (Sunday = row 0).
  const days = data?.days ?? []
  const lead = days.length ? new Date(`${days[0].date}T00:00:00`).getDay() : 0
  const cells: (Day | null)[] = [...Array<null>(lead).fill(null), ...days]
  const weeks = Math.ceil(cells.length / 7)
  const step = Math.min(20, WAVE_MS / Math.max(weeks - 1, 1))

  return (
    <div ref={box}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="font-serif text-2xl leading-tight tabular-nums">
          {data ? (
            <>
              <span data-gh-total aria-hidden="true">
                {shown.toLocaleString('en')}
              </span>
              <span className="sr-only">{data.total.toLocaleString('en')}</span> contributions <span className="text-muted">in the last year</span>
            </>
          ) : (
            <span className="text-muted">Loading activity…</span>
          )}
        </p>
        {link}
      </div>
      <div ref={scroller} className="mt-5 overflow-x-auto pb-2">
        <svg
          role="img"
          aria-label={data ? `GitHub contribution graph: ${data.total} contributions in the last year` : 'GitHub contribution graph loading'}
          width={Math.max(weeks, 53) * (CELL + GAP)}
          height={7 * (CELL + GAP)}
          className="gh-graph block"
          data-wave={inView && loaded ? '' : undefined}
          style={{ '--step': `${step}ms` } as CSSProperties}
        >
          {cells.map((d, i) =>
            d ? (
              <rect
                key={d.date}
                x={Math.floor(i / 7) * (CELL + GAP)}
                y={(i % 7) * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2}
                fill={SHADES[d.level]}
                className="gh-cell"
                style={{ '--w': Math.floor(i / 7) } as CSSProperties}
              >
                <title>{`${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}`}</title>
              </rect>
            ) : null,
          )}
          {!data &&
            Array.from({ length: 53 * 7 }, (_, i) => (
              <rect key={i} x={Math.floor(i / 7) * (CELL + GAP)} y={(i % 7) * (CELL + GAP)} width={CELL} height={CELL} rx={2} fill={SHADES[0]} />
            ))}
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1.5 font-mono text-xs tracking-[0.15em] text-muted uppercase" aria-hidden="true">
        Less
        {SHADES.map((c) => (
          <span key={c} className="size-3 rounded-[2px]" style={{ background: c }} />
        ))}
        More
      </div>
    </div>
  )
}
