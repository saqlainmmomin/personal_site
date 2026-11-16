import { useEffect, useRef, useState } from 'react'

const user = 'saqlainmmomin'
const profile = `https://github.com/${user}`

interface Day {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}
interface Activity {
  total: number
  days: Day[]
}

const CELL = 11
const GAP = 3
const STEP = CELL + GAP
const SHADES = [
  'var(--color-line)',
  'color-mix(in srgb, var(--color-link) 30%, var(--color-paper))',
  'color-mix(in srgb, var(--color-link) 55%, var(--color-paper))',
  'color-mix(in srgb, var(--color-link) 80%, var(--color-paper))',
  'var(--color-link)',
]

/** The last year of GitHub contributions, from a public contributions API. Falls back to a plain link. */
export function GithubActivity() {
  const [data, setData] = useState<Activity | 'failed' | null>(null)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: { total: { lastYear: number }; contributions: Day[] }) => setData({ total: j.total.lastYear, days: j.contributions }))
      .catch((e) => e.name !== 'AbortError' && setData('failed'))
    return () => ctrl.abort()
  }, [])

  // On narrow screens the graph scrolls sideways; start at the most recent weeks.
  useEffect(() => {
    const el = scroller.current
    if (el && data && data !== 'failed') el.scrollLeft = el.scrollWidth
  }, [data])

  if (data === 'failed') {
    return (
      <p>
        <a href={profile} target="_blank" rel="noopener">
          @{user} on GitHub
        </a>
      </p>
    )
  }

  const days = data?.days ?? []
  // Pad the first week so rows line up with weekdays (Sunday = row 0).
  const lead = days.length ? new Date(`${days[0].date}T00:00:00`).getDay() : 0
  const cells: (Day | null)[] = [...Array<null>(lead).fill(null), ...days]
  const weeks = Math.max(Math.ceil(cells.length / 7), 53)

  return (
    <div>
      <p className="text-grey">
        {data ? `${data.total.toLocaleString('en')} contributions in the last year · ` : 'Loading activity · '}
        <a href={profile} target="_blank" rel="noopener">
          @{user} on GitHub
        </a>
      </p>
      <div ref={scroller} className="mt-sm overflow-x-auto pb-xs">
        <svg
          role="img"
          aria-label={data ? `GitHub contribution graph: ${data.total} contributions in the last year` : 'GitHub contribution graph loading'}
          viewBox={`0 0 ${weeks * STEP - GAP} ${7 * STEP - GAP}`}
          className="block w-full min-w-[640px]"
        >
          {data
            ? cells.map((d, i) =>
                d ? (
                  <rect key={d.date} x={Math.floor(i / 7) * STEP} y={(i % 7) * STEP} width={CELL} height={CELL} rx={2} fill={SHADES[d.level]}>
                    <title>{`${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}`}</title>
                  </rect>
                ) : null,
              )
            : Array.from({ length: 53 * 7 }, (_, i) => (
                <rect key={i} x={Math.floor(i / 7) * STEP} y={(i % 7) * STEP} width={CELL} height={CELL} rx={2} fill={SHADES[0]} />
              ))}
        </svg>
      </div>
    </div>
  )
}
