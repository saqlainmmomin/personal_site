// Experience copy. Source of truth: ~/.claude/skills/cv-tailor/reference/content-evidence-map.md.
// Client names stay confidential; no figures that the evidence map does not support.

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
  areas?: { area: string; detail: string }[]
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
        area: 'Regulatory audits',
        detail: 'Cyber-compliance reviews against RBI and IRDAI requirements for banks and insurers; ITGC design and testing.',
      },
      {
        area: 'Certification audits',
        detail: 'ISO 27001 and ISO 22301 programs taken through certification, and ISO 27001 surveillance audits after it.',
      },
      {
        area: 'Program design',
        detail: 'Gap and maturity assessments, and unified control frameworks across ISO 27001, NIST CSF, and DPDPA.',
      },
      {
        area: 'Program implementation',
        detail: 'Phased cyber transformation plans carried through policy, technology, and operations.',
      },
      {
        area: 'Managed services',
        detail: 'Cyber transformation and TPRM run as managed services: KPIs for cyber and IT operations, vendor SLAs, steering reviews.',
      },
      {
        area: 'Client leadership',
        detail: 'Primary client contact across concurrent engagements: kickoffs, status, escalations, and CISO-level reporting.',
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
