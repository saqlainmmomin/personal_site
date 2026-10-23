import { useState } from 'react'
import { yozora, type Demo } from '@/content/builds'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { DemoDialog } from './DemoDialog'
import { EvidenceTrail } from './EvidenceTrail'
import { Exhibits } from './Exhibits'

export function Builds() {
  const [demo, setDemo] = useState<Demo | null>(null)

  return (
    <>
      <Section id="builds" index="02" label="Builds" warm>
        <SectionHead
          title={
            <>
              Built from the work, <em className="text-accent">for the workflow</em>.
            </>
          }
          intro="I build around the parts of assurance that eat attention: tracing evidence, reviewing judgments, and turning findings into action."
        />

        <article id="yozora" aria-labelledby="yozora-name" className="mt-16 grid gap-10 border-t border-ink pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
              <h3 id="yozora-name" className="font-serif text-7xl leading-none md:text-8xl">
                {yozora.name}
              </h3>
              <span className="mb-2 inline-flex items-center gap-2 border border-ink/40 px-2.5 py-1 font-mono text-[11px] tracking-[0.15em] uppercase">
                <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                {yozora.status}
              </span>
            </div>
            <p className="mt-8 max-w-lg font-serif text-3xl leading-tight">{yozora.pitch}</p>
            <p className="mt-4 max-w-lg leading-relaxed text-ink-2">{yozora.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setDemo(yozora.demo)}
                className="bg-ink px-5 py-3 font-mono text-xs tracking-[0.18em] text-paper uppercase transition-colors hover:bg-accent"
              >
                Watch earlier prototype ▶
              </button>
              <a href={yozora.github} target="_blank" rel="noreferrer" className="border border-line-2 px-5 py-3 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:border-ink">
                GitHub ↗
              </a>
            </div>
          </div>
          <dl className="grid content-start gap-x-8 sm:grid-cols-2 lg:pt-3">
            {yozora.facts.map(([k, v]) => (
              <div key={k} className="border-t border-line-2 py-4">
                <dt className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">{k}</dt>
                <dd className="mt-1.5 text-[15px] leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </article>

        <EvidenceTrail />

        <p className="mt-14 max-w-3xl border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink-2">
          <span className="font-mono text-[11px] tracking-[0.2em] text-ink uppercase">Current direction · </span>
          {yozora.direction}
        </p>

        <Exhibits onOpen={setDemo} />
      </Section>
      <DemoDialog demo={demo} onClose={() => setDemo(null)} />
    </>
  )
}
