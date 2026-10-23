import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { CaseFiles } from './CaseFiles'
import { PersonnelRecord } from './PersonnelRecord'

export function Experience() {
  return (
    <Section id="experience" index="01" label="Engagements">
      <SectionHead
        title={
          <>
            Assurance depth, <em className="text-accent">operational instinct</em>.
          </>
        }
        intro="From control design and evidence review to executive reporting and remediation, across Big Four advisory and risk intelligence."
      />

      <PersonnelRecord />

      <CaseFiles />
    </Section>
  )
}
