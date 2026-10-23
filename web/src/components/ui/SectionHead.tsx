import type { ReactNode } from 'react'

/** Serif section title with an optional one-paragraph intro. */
export function SectionHead({ title, intro }: { title: ReactNode; intro?: ReactNode }) {
  return (
    <header className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:items-end">
      <h2 className="font-serif text-5xl leading-[0.98] md:text-7xl">{title}</h2>
      {intro && <p className="max-w-md text-base text-ink-2 md:justify-self-end">{intro}</p>}
    </header>
  )
}
