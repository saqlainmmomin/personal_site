import type { ReactNode } from 'react'

/** Every section opens with a thick ink rule and an index tab hanging from it, like a file divider. */
export function Section({ id, index, label, warm, children }: { id: string; index: string; label: string; warm?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`border-t-4 border-ink ${warm ? 'surface-warm' : ''}`}>
      <div className="mx-auto max-w-[1440px] px-page">
        <p className="inline-block bg-ink px-4 py-2 font-mono text-xs tracking-[0.2em] text-paper uppercase">
          {index} / {label}
        </p>
      </div>
      <div className="mx-auto max-w-[1440px] px-page pt-14 pb-section md:pt-20">{children}</div>
    </section>
  )
}
