// Experience copy. Source of truth: ~/.claude/skills/cv-tailor/reference/content-evidence-map.md.
// Client names stay confidential; no figures that the evidence map does not support.

export interface Area {
  area: string
  /** The scannable phrase: what the area is, in the fewest words. `detail` adds the rest. */
  key: string
  detail: string
  /** Lifecycle stage 1-4 (design, implement, assure, run). Omitted for work that runs through all of them. */
  stage?: 1 | 2 | 3 | 4
}

export interface Role {
  /** "YYYY-MM"; `end` is omitted for the current role. */
  start: string
  end?: string
  period: string
  org: string
  place: string
  title: string
  summary: string
  /** Areas of work, elaborated for the current role only. */
  areas?: Area[]
}

export const roles: Role[] = [
  {
    start: '2022-07',
    period: 'Jul 2022 – Present',
    org: 'KPMG',
    place: 'Bangalore',
    title: 'Assistant Manager, Cyber Strategy & Governance',
    summary:
      'Risk-based cyber and IT-audit engagements for regulated enterprises, from first gap assessment to running the program.',
    areas: [
      {
        area: 'Program design',
        key: 'One control set, many standards',
        detail: 'Gap and maturity assessments, then unified control frameworks across ISO 27001, NIST CSF, and DPDPA.',
        stage: 1,
      },
      {
        area: 'Program implementation',
        key: 'Policy, technology, operations',
        detail: 'Phased cyber transformation plans, carried through all three.',
        stage: 2,
      },
      {
        area: 'Regulatory audits',
        key: 'RBI and IRDAI',
        detail: 'Cyber-compliance reviews for banks and insurers, plus ITGC design and testing.',
        stage: 3,
      },
      {
        area: 'Certification audits',
        key: 'ISO\u00a027001 and ISO\u00a022301',
        detail: 'Programs taken through certification, and ISO 27001 surveillance audits after it.',
        stage: 3,
      },
      {
        area: 'Managed services',
        key: 'KPIs and vendor SLAs',
        detail: 'Cyber transformation and TPRM run as managed services, with steering reviews.',
        stage: 4,
      },
      {
        area: 'Client leadership',
        key: 'CISO-level reporting',
        detail: 'Primary client contact across concurrent engagements: kickoffs, status, and escalations.',
      },
    ],
  },
  {
    start: '2021-05',
    end: '2021-09',
    period: 'May – Sep 2021',
    org: 'Mitkat Advisory',
    place: 'Mumbai',
    title: 'Risk Intelligence Analyst',
    summary:
      'Geopolitical, operational, and supply-chain risk analysis across South Asia, turned into weekly leadership briefings.',
  },
]

export interface CaseFile {
  id: string
  practice: string
  title: string
  mandate: string
  owned: string
  result: string
  tags: string[]
}

export const caseFiles: CaseFile[] = [
  {
    id: 'E-01',
    practice: 'Assurance',
    title: 'From gap analysis to zero-defect certification',
    mandate: 'Take organizations from gap analysis to ISO 27001 and ISO 22301 certification, aligned with NIST CSF.',
    owned: 'Requirement mapping, gap assessment, control design, evidence collection, and remediation tracking through external audit.',
    result: 'Zero-defect external audits on ISO 27001 and ISO 22301 programs.',
    tags: ['ISO 27001', 'ISO 22301', 'NIST CSF', 'Certification'],
  },
  {
    id: 'E-02',
    practice: 'Third-party risk',
    title: 'Vendor risk programs, designed end to end',
    mandate: 'Centralize scattered vendor reviews into one risk-based program.',
    owned: 'Risk appetite, onboarding criteria, vendor tiering, risk assessments and vendor audits, recurring reviews, and security terms agreed with Legal.',
    result: 'One standardized path from onboarding to recurring review, with vendor SLAs tracked as a managed service.',
    tags: ['TPRM', 'Risk Appetite', 'Vendor Audits', 'SOC 2 Review'],
  },
  {
    id: 'E-03',
    practice: 'Regulatory audit',
    title: 'Cyber audits for banks and insurers',
    mandate: 'Test cyber and IT controls against RBI and IRDAI requirements across multiple financial institutions.',
    owned: 'ITGC design and testing across privileged access, segregation of duties, change, and backup and recovery.',
    result: 'Validated remediation and findings reported to CISOs and leadership.',
    tags: ['RBI', 'IRDAI', 'ITGC', 'BFSI'],
  },
  {
    id: 'E-04',
    practice: 'Policy & procedure',
    title: 'Security policy suites, drafted to be implemented',
    mandate: 'Write the policies, procedures, and standards behind security programs, across clients and sectors.',
    owned: 'Drafting, control mapping, and review cycles for organizations in financial services, e-commerce, semiconductors, and real estate.',
    result: 'Audit-ready documentation that control owners could put into practice without disrupting operations.',
    tags: ['Policies', 'Procedures', 'Standards', 'Control Mapping'],
  },
]
