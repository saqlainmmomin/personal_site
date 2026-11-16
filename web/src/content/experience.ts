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
      'Cyber risk, ITGC and ISO audits for regulated enterprises, from first gap assessment to ongoing delivery.',
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
  /** Terms from `mapGroups` this engagement touched; each must be supported by the evidence map or by Saqlain. */
  touches: string[]
}

// Five engagement types chosen for range, with scopes that do not overlap. SOC 2 is report review only;
// Procurement work is assessing their vendor shortlist, not intake.
export const caseFiles: CaseFile[] = [
  {
    id: 'E-01',
    practice: 'Audit & certification',
    title: 'Internal and external audits for ISO certification',
    mandate: 'Take organizations from gap analysis to ISO 27001 ISMS and ISO 22301 BCMS certification, and keep them certified.',
    owned: 'Gap assessment, control design, evidence and remediation tracking; internal and pre-certification audits; surveillance audits after certification.',
    result: 'Zero-defect external audits on ISO 27001 and ISO 22301 programs.',
    touches: ['ISO 27001', 'ISO 22301', 'ISO 27701', 'NIST CSF', 'Internal audits', 'External audits', 'Banking and insurance', 'E-commerce', 'Real estate'],
  },
  {
    id: 'E-02',
    practice: 'Regulatory audit',
    title: 'Cyber audits for banks and insurers',
    mandate: 'Test cyber and IT controls against RBI and IRDAI requirements across multiple financial institutions.',
    owned: 'IT general controls (ITGC) design and testing across privileged access, segregation of duties, change, and backup and recovery.',
    result: 'Remediation validated; findings reported to CISOs and leadership.',
    touches: ['RBI', 'IRDAI', 'ITGC testing', 'Banking and insurance'],
  },
  {
    id: 'E-03',
    practice: 'Third-party risk',
    title: 'Third-party risk management (TPRM) program',
    mandate: 'Standardize fragmented vendor reviews into one risk-based program.',
    owned: 'Designed the vendor tiering and pre-onboarding assessments and the ISO- and NIST-mapped questionnaires; ran vendor audits and SOC 2 report reviews; agreed security terms with Legal and assessed shortlisted vendors for Procurement.',
    result: 'A repeatable path from pre-onboarding assessment to recurring review, with vendor SLAs tracked as a managed service.',
    touches: ['ISO 27001', 'NIST CSF', 'SOC 2', 'Vendor audits'],
  },
  {
    id: 'E-04',
    practice: 'Unified compliance',
    title: 'One control set for many standards',
    mandate: 'Build one control set that satisfies several standards and a regulation at once.',
    owned: 'Broke each requirement into common controls, added privacy controls where DPDPA asks for more, and updated the set as regulations changed.',
    result: 'Each control is tested once and counts for every framework it maps to.',
    touches: ['ISO 27001', 'NIST CSF', 'PCI DSS', 'OWASP Top 10', 'DPDPA', 'GDPR', 'Control mapping'],
  },
  {
    id: 'E-05',
    practice: 'Policy & standards',
    title: 'Policy suites for 300+ R&D labs',
    mandate: 'Write the security and operational-compliance policies for a semiconductor R&D estate of 300+ labs across 6+ regions.',
    owned: 'Policies, procedures and standards on ISO 27001 and NIST CSF baselines, a lab requirements library with coverage mapping, and KPIs for the labs.',
    result: 'Controls the labs could put into practice without disrupting their operations.',
    touches: ['ISO 27001', 'NIST CSF', 'Policy drafting', 'Semiconductors'],
  },
]

/** The right-hand side of the engagement map. Every term is touched by at least one case file. */
export const mapGroups = [
  { label: 'Standards', terms: ['ISO 27001', 'ISO 22301', 'ISO 27701', 'NIST CSF', 'PCI DSS', 'OWASP Top 10', 'SOC 2'] },
  { label: 'Regulation', terms: ['RBI', 'IRDAI', 'DPDPA', 'GDPR'] },
  { label: 'Assurance work', terms: ['Internal audits', 'External audits', 'ITGC testing', 'Vendor audits', 'Control mapping', 'Policy drafting'] },
  { label: 'Sectors', terms: ['Banking and insurance', 'E-commerce', 'Real estate', 'Semiconductors'] },
]
