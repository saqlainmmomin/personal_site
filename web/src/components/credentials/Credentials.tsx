import { degrees, seals } from '@/content/credentials'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { GithubActivity } from './GithubActivity'
import { PracticePass } from './PracticePass'
import { Seal } from './Seal'

export function Credentials() {
  return (
    <Section id="credentials" index="03" label="Credentials">
      <SectionHead
        title={
          <>
            Credentials and <em className="text-accent">capability depth</em>.
          </>
        }
        intro="Formal credentials, the range of work they cover, and what I am building now."
      />

      <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {seals.map((seal) => (
            <Seal key={seal.id} seal={seal} />
          ))}
        </div>

        <div>
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

      <div className="mt-20 border-t border-ink pt-10">
        <h3 className="font-serif text-3xl">Practice and focus areas</h3>
        <PracticePass />
      </div>

      <div className="mt-20 border-t border-ink pt-10">
        <h3 className="font-serif text-3xl">GitHub activity</h3>
        <div className="mt-6">
          <GithubActivity />
        </div>
      </div>
    </Section>
  )
}
