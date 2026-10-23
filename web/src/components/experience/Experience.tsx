import { Section } from '@/components/ui/Section'
import { CaseFiles } from './CaseFiles'
import { PersonnelRecord } from './PersonnelRecord'

export function Experience() {
  return (
    <Section id="experience" index="01" label="Experience">
      <h2 className="sr-only">Experience</h2>

      <PersonnelRecord />

      <CaseFiles />
    </Section>
  )
}
