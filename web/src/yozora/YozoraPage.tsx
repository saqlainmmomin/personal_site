import { Fragment } from 'react'
import { Layout } from '@/components/Layout'
import { StageFrame } from './StageFrame'
import { STAGES } from './screens'
import './yozora.css'

const GITHUB = 'https://github.com/saqlainmmomin/Cyber'
const PROTOTYPE_VIDEO = '/img/projects/cyberassess-demo.mp4'

// Short lines between stages that say how one feeds the next.
const CONNECTORS: Record<number, string> = {
  1: 'The scope sets the request list.',
  2: 'The requested files come back through the link.',
  3: 'The evidence feeds the questionnaire.',
  4: 'The drafts go to the consultant.',
  5: 'Only approved conclusions reach the report.',
}

export default function YozoraPage() {
  return (
    <Layout>
      <p className="label">
        <a href="/projects">← Projects</a>
      </p>
      <h1 className="mt-md">Yozora</h1>
      <p className="label mt-xs text-grey">In development · synthetic demo data</p>
      <div className="mt-sm max-w-text space-y-sm">
        <p>Yozora is an assessment workspace I am building for small GRC consulting firms.</p>
        <p>
          It runs a whole assessment end to end: scoping, the evidence request, evidence analysis, the questionnaire, review, tracking and the report. The AI drafts; the consultant approves every
          conclusion. This page shows six key moments.
        </p>
        <p className="text-grey">These are the approved screen designs for the finished product, not the current prototype, on made-up sample data. Nothing is sent anywhere.</p>
        <p className="label flex flex-wrap gap-x-sm gap-y-xs">
          <a href={GITHUB} target="_blank" rel="noopener">
            Code on GitHub
          </a>
          <a href={PROTOTYPE_VIDEO}>Earlier prototype (video)</a>
        </p>
      </div>

      {STAGES.map((stage, i) => (
        <Fragment key={stage.screen}>
          <section aria-labelledby={`stage-${i + 1}`} data-stage={i + 1} className="mt-xl">
            <p className="label text-grey">Stage {i + 1} of 6</p>
            <h2 id={`stage-${i + 1}`} className="mt-xs">
              {stage.title}
            </h2>
            <div className="mt-xs max-w-text space-y-sm">
              {stage.text.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
            <StageFrame stage={stage} n={i + 1} />
          </section>
          {CONNECTORS[i + 1] && <p className="label mt-xl text-center text-grey">{CONNECTORS[i + 1]}</p>}
        </Fragment>
      ))}

      <p className="label mt-xl">
        <a href="/projects">← Back to projects</a>
      </p>
    </Layout>
  )
}
