// Experience copy. Source of truth: ~/.claude/skills/cv-tailor/reference/content-evidence-map.md.
// Client names stay confidential; no figures that the evidence map does not support.

/** Tenure at KPMG as of Nov 2026 ("four and a half years"). The role itself is in the intro. */
export const kpmgTenure = '4.5 years'

export interface CycleStep {
  /** Tab label. */
  name: string
  /** One line under the tab: what this stage is for. */
  purpose: string
  points: { title: string; text: string }[]
}

// Plan, Do, Check, Act: the cycle most control standards use. Each point is one area of work.
export const cycle: CycleStep[] = [
  {
    name: 'Plan',
    purpose: 'Set the target, the rules, and how risk and progress are measured.',
    points: [
      { title: 'Cyber strategy and roadmaps', text: 'Maturity assessments for organizations across sectors, and the roadmap from where security stands to where it should be.' },
      { title: 'Policies, procedures and standards', text: 'Cyber policies, procedures and standards built on industry frameworks, including a suite for 300+ R&D labs in 6+ regions.' },
      { title: 'Risk assessment methodology', text: 'Scoring scales, risk tiers and risk appetite, agreed with each client, for process and application risk assessments.' },
      { title: 'Unified control frameworks', text: 'Designed one control set that overlaps ISO 27001, NIST CSF, PCI DSS, DPDPA and GDPR, so each control is tested once.' },
      { title: 'KPIs and service targets', text: 'Defined KPIs for cyber and IT operations run as a managed service, and for policy programs such as the R&D labs.' },
    ],
  },
  {
    name: 'Do',
    purpose: 'Turn the plan into owned controls, tracked risks and trained people.',
    points: [
      { title: 'Control implementation', text: 'Working groups with security, business and Legal to assign control owners, define evidence, and track gaps to closure.' },
      { title: 'Risk registers', text: 'Owned multiple risk registers, taking each risk from documentation through assignment and treatment to closure.' },
      { title: 'Third-party risk program', text: 'Vendor tiering that sets assessment depth, ISO- and NIST-mapped questionnaires, and security terms negotiated with Legal.' },
      { title: 'Privacy and continuity', text: 'Privacy impact assessments, data flow diagrams and RACI matrices, plus business impact analysis for ISO 22301.' },
      { title: 'Awareness and training', text: 'Role-based training plans and calendars, phishing simulation, and tabletop exercises for top management.' },
    ],
  },
  {
    name: 'Check',
    purpose: 'Test whether controls are designed well and work in practice.',
    points: [
      { title: 'ISO certification audits', text: 'Led 15+ ISO 27001 and 22301 engagements: internal, pre-certification and surveillance audits, zero-defect external audits.' },
      { title: 'Banks and insurers', text: 'Cyber compliance reviews against RBI and IRDAI requirements, for multiple banks and insurers.' },
      { title: 'IT general controls', text: 'Designed and tested these controls for privileged access, segregation of duties, change management, and backup and recovery.' },
      { title: 'Vendor audits and SOC 2 reviews', text: 'Audited vendors, reviewed their SOC 2 Type II reports, and followed up with vendors directly for missing evidence.' },
      { title: 'Technical assurance', text: 'Tested systems against CIS Benchmarks and reviewed code, vulnerability, cloud and SIEM evidence.' },
    ],
  },
  {
    name: 'Act',
    purpose: 'Fix what the checks find, report it, and keep controls current.',
    points: [
      { title: 'Remediation', text: 'Documented findings, validated the fixes, and reported results to CISOs and leadership.' },
      { title: 'Recurring control testing', text: 'Recurring control testing and monitoring between audits, to confirm controls keep working.' },
      { title: 'Regulatory change', text: 'Documented regulatory changes and updated client control sets to reflect them.' },
      { title: 'Governance cadence', text: 'Service review and steering decks, minutes and action logs, with vendor SLAs and KPI adherence tracked for managed services.' },
      { title: 'Training and mentoring', text: 'Trained the third-party risk team on the programs and frameworks built, and mentored 8–10+ junior analysts.' },
    ],
  },
]

export const internship = {
  org: 'Mitkat Advisory',
  place: 'Mumbai',
  period: 'May – Sep 2021',
  title: 'Risk Intelligence Analyst',
  summary: 'Geopolitical, operational, and supply-chain risk analysis across South Asia, turned into weekly leadership briefings.',
}
