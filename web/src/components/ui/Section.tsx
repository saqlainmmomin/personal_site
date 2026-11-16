import type { ReactNode } from 'react'

/** Every section opens with an index tab. The page thread crosses at the boundary, so content sits above it (z-1). */
export function Section({ id, index, label, warm, children }: { id: string; index: string; label: string; warm?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={warm ? 'surface-warm' : undefined}>
      <div className="relative z-[1] mx-auto max-w-[1440px] px-page">
        <p className="inline-block bg-ink px-4 py-2 font-mono text-xs tracking-[0.2em] text-paper uppercase">
          {index} / {label}
        </p>
      </div>
      <div className="relative z-[1] mx-auto max-w-[1440px] px-page pt-14 pb-section md:pt-20">{children}</div>
    </section>
  )
}
