// Credentials copy. The practice/range groups are added separately once approved.

export const seals = [
  { id: 'iso-27001', standard: 'ISO 27001', edition: '2022', topic: 'Information security' },
  { id: 'iso-27701', standard: 'ISO 27701', edition: '2019', topic: 'Privacy information' },
  { id: 'iso-22301', standard: 'ISO 22301', edition: '2019', topic: 'Business continuity' },
]

export const degrees = [
  { name: 'MBA, Finance', school: 'NMIMS' },
  { name: 'B.Tech, IT', school: 'NMIMS' },
]

export const githubUser = 'saqlainmmomin'

export interface PracticeItem {
  name: string
  /** Standards or tools named inside the piece of work, shown as chips beneath it. */
  terms?: string[]
}

export interface PracticeGroup {
  area: string
  items?: PracticeItem[]
  /** Heading shown above `items` when the group also has term lists. */
  itemsLabel?: string
  /** Labelled term lists (standards, tools, stack) shown as chips. */
  sets?: { label: string; terms: string[] }[]
}

/** Range of work, grouped for scanning and search. Each piece of work is named once, in one group. */
export const practice: PracticeGroup[] = [
  {
    area: 'Advisory & assessment',
    items: [
      { name: 'Cyber maturity assessment' },
      { name: 'Gap assessment' },
      { name: 'Cyber strategy and transformation' },
      { name: 'Unified control frameworks', terms: ['ISO 27001', 'NIST CSF', 'DPDPA', 'PCI DSS', 'GDPR'] },
      { name: 'Policies, procedures and standards' },
      { name: 'Risk registers' },
    ],
  },
  {
    area: 'Audit & assurance',
    items: [
      { name: 'ISO 27001 and ISO 22301 certification audits' },
      { name: 'Surveillance audits, pre-certification reviews and internal audit' },
      { name: 'Control design and operating-effectiveness testing' },
      { name: 'ITGC design and testing' },
      { name: 'RBI and IRDAI cyber-compliance reviews' },
      { name: 'Remediation validation' },
    ],
  },
  {
    area: 'Third-party risk',
    items: [
      { name: 'Vendor tiering and due diligence' },
      { name: 'Vendor audits' },
      { name: 'SOC 2 Type II report review' },
      { name: 'Security terms negotiated with Legal' },
    ],
  },
  {
    area: 'Privacy',
    items: [{ name: 'Data protection impact assessments' }, { name: 'Consent and notice flows' }],
  },
  {
    area: 'Standards & tools',
    sets: [
      { label: 'Standards', terms: ['ISO 27001', 'ISO 27701', 'ISO 22301', 'NIST CSF', 'PCI DSS', 'OWASP'] },
      { label: 'Regulations', terms: ['DPDPA', 'GDPR'] },
      {
        label: 'Tools and platforms',
        terms: ['Qualys', 'Nessus', 'Snyk', 'Microsoft Sentinel', 'ServiceNow GRC', 'OneTrust', 'AWS', 'Azure', 'Active Directory'],
      },
    ],
  },
  {
    area: 'AI & emergent tech',
    itemsLabel: 'Focus areas',
    items: [
      { name: 'Prompt engineering' },
      { name: 'Reinforcement learning from human feedback' },
      { name: 'Loop engineering' },
      { name: 'AI agent design' },
    ],
    sets: [
      { label: 'Models and APIs', terms: ['Claude API', 'OpenAI API', 'Gemini API'] },
      { label: 'Agent tooling', terms: ['Claude Code', 'Codex'] },
      { label: 'Machine learning', terms: ['PyTorch', 'Gymnasium', 'PPO', 'DQN'] },
      { label: 'Backend', terms: ['Python', 'FastAPI', 'SQLAlchemy', 'Alembic', 'Pydantic', 'Docker'] },
      { label: 'Frontend and mobile', terms: ['TypeScript', 'React', 'Next.js', 'Vite', 'Tailwind CSS', 'Swift'] },
      { label: 'Data and hosting', terms: ['Supabase', 'Railway', 'Vercel'] },
    ],
  },
]
