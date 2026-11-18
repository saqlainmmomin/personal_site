import { EmailCopy } from '@/components/EmailCopy'
import { Layout, Section } from '@/components/Layout'
import { WorkCycle } from '@/components/WorkCycle'
import { contact } from '@/content/contact'
import { certifications, degrees, school } from '@/content/credentials'
import { internship, kpmgTenure } from '@/content/experience'
import { profile } from '@/content/profile'

const external = { target: '_blank', rel: 'noopener' } as const

export default function Home() {
  const linkedin = contact.links.find((l) => l.name === 'LinkedIn')!

  return (
    <Layout>
      <img src={profile.portrait} alt={profile.portraitAlt} width={96} height={96} className="size-24 rounded-sm border border-line object-cover object-top" />
      <h1 className="sr-only">{profile.name}</h1>
      <div className="mt-md max-w-text space-y-xs">
        {profile.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <Section id="contact" title="Get in touch" className="mt-lg">
        <ul className="max-w-text space-y-xs">
          <li>
            Email: <EmailCopy email={contact.email} />
          </li>
          <li>
            <a href={linkedin.href} {...external}>
              LinkedIn
            </a>
          </li>
          <li>
            <a href="/cv.pdf">CV (PDF)</a>
          </li>
        </ul>
      </Section>

      <Section id="work" title="Work">
        <p className="text-grey">KPMG · {kpmgTenure}</p>
        <div className="mt-md">
          <WorkCycle />
        </div>
        <div className="mt-xl">
          <p className="label text-grey">
            Internship before KPMG · {internship.period}
          </p>
          <p className="mt-xs font-semibold">
            {internship.org}, {internship.place}
          </p>
          <p className="max-w-text text-grey">{internship.title}. {internship.summary}</p>
        </div>
      </Section>

      <Section id="projects" title="Projects">
        <p className="max-w-text text-grey">
          Software for the parts of audit work I found slow: assessing controls and screening vendors. Also apps I built because I wanted them.{' '}
          <a href="/projects">See the projects</a>.
        </p>
      </Section>

      <Section id="credentials" title="Credentials">
        <ul className="max-w-text list-['–_'] space-y-xs ps-sm text-grey marker:text-grey/50">
          {certifications.map((c) => (
            <li key={c}>ISO {c} Lead Auditor</li>
          ))}
          {degrees.map((d) => (
            <li key={d}>
              {d} · {school}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="writing" title="Writing">
        <p className="max-w-text text-grey">
          Short notes on AI agents and what they mean for security controls.{' '}
          <a href="/writing">Read the writing</a>.
        </p>
      </Section>
    </Layout>
  )
}
