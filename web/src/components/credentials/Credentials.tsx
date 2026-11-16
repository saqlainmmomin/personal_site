import { useRef, type CSSProperties } from 'react'
import { degrees, seals } from '@/content/credentials'
import { useInViewOnce } from '@/lib/motion'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { GithubActivity } from './GithubActivity'
import { Seal } from './Seal'

/** Each seal comes to rest at its own slight angle, so the row reads as hand-stamped. */
const REST = ['-5deg', '3deg', '-2deg']

export function Credentials() {
  const sealRow = useRef<HTMLDivElement>(null)
  const stamped = useInViewOnce(sealRow)

  return (
    <Section id="credentials" index="03" label="Credentials">
      <SectionHead
        title={
          <>
            Certifications and <em className="text-accent">education</em>.
          </>
        }
        intro="Three ISO lead-auditor certifications, two degrees, and public code on GitHub."
      />

      <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20">
        <div ref={sealRow} data-stamped={stamped ? '' : undefined} className="grid grid-cols-3 gap-4 sm:gap-8">
          {seals.map((seal, i) => (
            <div key={seal.id} style={{ '--i': i, '--rest': REST[i % REST.length] } as CSSProperties}>
              <Seal seal={seal} />
            </div>
          ))}
        </div>

        <div data-reveal style={{ '--i': 3 } as CSSProperties}>
          <h3 className="font-serif text-3xl">Degrees</h3>
          <dl className="mt-4 border-t border-ink">
            {degrees.map((d) => (
              <div key={d.name} className="flex items-baseline justify-between gap-4 border-b border-line-2 py-4">
                <dt className="font-serif text-2xl leading-tight">{d.name}</dt>
                <dd className="font-serif text-3xl leading-none tracking-wide">{d.school}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div data-reveal className="mt-20 border-t border-ink pt-10">
        <h3 className="font-serif text-3xl">GitHub activity</h3>
        <div className="mt-6">
          <GithubActivity />
        </div>
      </div>
    </Section>
  )
}
