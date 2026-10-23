// Builds copy, condensed from site-v2. Yozora claims stay within its current direction:
// core workflows implemented, interface in development, no adoption or production claims.

export interface Demo {
  title: string
  type: 'video' | 'image'
  src: string
  poster?: string
  label: string
  description: string
  github?: string
}

export const yozora = {
  status: 'In development',
  name: 'Yozora',
  pitch: 'From client evidence to defensible assessment conclusions.',
  summary:
    'An assessment workspace for GRC consultants. Scope the engagement, collect evidence, review proposed conclusions, and carry approved findings into reporting and remediation.',
  facts: [
    ['Built for', 'Boutique GRC consulting firms'],
    ['Structure', 'Client → Engagement → Assessment'],
    ["AI's role", 'Extract evidence, propose assessments'],
    ["Consultant's role", 'Review the basis, approve conclusions'],
  ],
  github: 'https://github.com/saqlainmmomin/Cyber',
  direction:
    'Built around DPDPA, ISO 27001, and NIST CSF assessments. The core assessment and evidence workflows are implemented; the Yozora interface is in development. Customer adoption and production validation are still ahead.',
  demo: {
    title: 'Yozora',
    type: 'video',
    src: '/img/projects/cyberassess-demo.mp4',
    poster: '/img/projects/cyberassess-demo-poster.webp',
    label: 'Earlier CyberAssess prototype walkthrough using synthetic demo data',
    description:
      "Synthetic demo data. This earlier CyberAssess prototype shows the previous report experience. Yozora's current workflow and interface are in development.",
    github: 'https://github.com/saqlainmmomin/Cyber',
  } satisfies Demo,
}

/**
 * How Yozora is designed to run: one short sentence per step, two at most. Facts from the Yozora
 * repo (saqlainmmomin/Cyber): clusters.py, auto_answer.py, grounding/, judge.py, scoring.py,
 * conclusion_review.py. Keep internal counts and time-saved figures out of this copy.
 */
export const trail = [
  {
    step: 'Map once',
    line: 'A unified control framework maps one answer to every relevant framework, so no work is repeated.',
  },
  {
    step: 'Pre-fill the questionnaire',
    line: 'Evidence pre-fills the answers. The consultant confirms each one.',
  },
  {
    step: 'Review the evidence',
    line: 'Test criteria are defined for all required evidence. The AI reviews it for design and operating effectiveness and cites the source of every response.',
  },
  {
    step: 'Score by rule',
    line: 'The AI only proposes. Scoring follows fixed rules, per framework, never blended.',
  },
  {
    step: 'Approve & act',
    line: 'Only consultant-approved conclusions reach the report. Findings become tracked actions.',
  },
]

export const exhibits: (Demo & { id: string; kind: string; name: string; pitch: string; action: string })[] = [
  {
    id: 'B-02',
    kind: 'Vendor risk',
    name: 'Recon',
    pitch: 'A vendor security screen that checks public signals before a detailed assessment. Six scanners run concurrently, with a hard-rules verdict before any AI interpretation.',
    action: 'Play walkthrough',
    title: 'Recon',
    type: 'video',
    src: '/img/projects/recon-demo.mp4',
    poster: '/img/projects/recon-demo-poster.webp',
    label: 'Recon vendor risk walkthrough',
    description: 'A live vendor-domain scan showing six completed security checks, deterministic rules, and a summarized risk tier.',
    github: 'https://github.com/saqlainmmomin/Recon',
  },
  {
    id: 'B-03',
    kind: 'AI signal',
    name: 'Velocity',
    pitch: 'An AI news tracker that scores developments against a professional profile: opportunity, disruption, or knowledge gap.',
    action: 'View dashboard',
    title: 'Velocity',
    type: 'image',
    src: '/img/projects/velocity-dashboard-crop.webp',
    label: 'Velocity dashboard with scored AI developments',
    description: 'A profile-aware dashboard that scores AI developments as opportunities, disruptions, or knowledge gaps.',
    github: 'https://github.com/saqlainmmomin/Velocity',
  },
  {
    id: 'B-04',
    kind: 'Experiment',
    name: 'RL Playground',
    pitch: "How systems learn from rules alone: a prisoner's dilemma tournament, autonomous game agents, and strategies evolving over generations.",
    action: 'Play experiment',
    title: 'RL Playground',
    type: 'video',
    src: '/img/projects/pd-evolution.mp4',
    poster: '/img/projects/pd-evolution-poster.webp',
    label: "Prisoner's-dilemma strategies evolving over generations",
    description: "A genetic algorithm evolving prisoner's-dilemma strategies across repeated tournaments and generations.",
    github: 'https://github.com/saqlainmmomin/Prisoners_dilemma',
  },
]
