import { GithubActivity } from '@/components/GithubActivity'
import { Layout, Section } from '@/components/Layout'
import { ProjectTile } from '@/components/ProjectTile'
import { projects, type Project } from '@/content/projects'

function Tiles({ group }: { group: Project['group'] }) {
  return (
    <div className="space-y-xl">
      {projects
        .filter((p) => p.group === group)
        .map((p) => (
          <ProjectTile key={p.slug} project={p} />
        ))}
    </div>
  )
}

export default function Projects() {
  return (
    <Layout>
      <p className="label">
        <a href="/">← Home</a>
      </p>
      <h1 className="mt-md">Projects</h1>
      <div className="mt-lg">
        <Tiles group="compliance" />
      </div>
      <Section id="coding" title="For the love of coding">
        <Tiles group="coding" />
      </Section>
      <Section id="activity" title="GitHub activity">
        <GithubActivity />
      </Section>
      <p className="label mt-2xl">
        <a href="/">← Back to home</a>
      </p>
    </Layout>
  )
}
