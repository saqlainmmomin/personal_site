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

/** Range of work, grouped for scanning and search. Each piece of work is named once, in one group. */
export const practice = [
  {
    area: 'Advisory & assessment',
    items: [
      'Cyber maturity assessment',
      'Gap assessment',
      'Cyber strategy and transformation',
      'Unified control frameworks (ISO 27001, NIST CSF, DPDPA, PCI DSS, GDPR)',
      'Policies, procedures and standards',
      'Risk registers',
    ],
  },
  {
    area: 'Audit & assurance',
    items: [
      'ISO 27001 and ISO 22301 certification audits',
      'Surveillance audits, pre-certification reviews and internal audit',
      'Control design and operating-effectiveness testing',
      'ITGC design and testing',
      'RBI and IRDAI cyber-compliance reviews',
      'Remediation validation',
    ],
  },
  {
    area: 'Third-party risk',
    items: ['Vendor tiering and due diligence', 'Vendor audits', 'SOC 2 Type II report review', 'Security terms negotiated with Legal'],
  },
  {
    area: 'Privacy',
    items: ['Data protection impact assessments', 'Consent and notice flows'],
  },
  {
    area: 'Standards & tools',
    items: [
      'ISO 27001, ISO 27701, ISO 22301',
      'NIST CSF, PCI DSS, OWASP',
      'DPDPA, GDPR',
      'Qualys, Nessus, Snyk, Microsoft Sentinel, ServiceNow GRC, OneTrust, AWS, Azure, Active Directory',
    ],
  },
  {
    area: 'AI & emergent tech',
    items: [
      'Prompt engineering',
      'Reinforcement learning from human feedback',
      'Loop engineering',
      'AI agent design',
      'Python, FastAPI, TypeScript, the Claude API, Claude Code',
    ],
  },
]
