import { Layout } from '@/components/Layout'
import { usePinnedHeader } from '@/components/usePinnedHeader'
import { allNotesHref, notes } from '@/content/notes'

const external = { target: '_blank', rel: 'noopener' } as const

export default function Writing() {
  usePinnedHeader()
  return (
    <Layout>
      <p className="label">
        <a href="/">← Home</a>
      </p>
      <h1 className="mt-md">Writing</h1>
      <ul className="mt-lg max-w-text space-y-lg">
        {notes.map((n) => (
          <li key={n.href}>
            <time dateTime={n.date} className="label text-grey">
              {n.label}
            </time>
            <p>
              <a href={n.href} {...external}>
                {n.title}
              </a>
            </p>
            <p className="text-grey">{n.thesis}</p>
          </li>
        ))}
      </ul>
      <p className="mt-lg max-w-text">
        More on{' '}
        <a href={allNotesHref} {...external}>
          LinkedIn
        </a>
        .
      </p>
      <p className="label mt-2xl">
        <a href="/">← Back to home</a>
      </p>
    </Layout>
  )
}
