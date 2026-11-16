import { useLayoutEffect, type ReactNode } from 'react'

// Media fades with its frame ([data-fade]): a <video> fading on its own repaints on every frame of the fade.
const REVEAL = 'h2, h3, p, li, img, [data-fade]'

/** Text and media fade in once as they scroll into view. Skipped under reduced motion. */
function useScrollReveal() {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = [...document.querySelectorAll<HTMLElement>(`main :is(${REVEAL}):not(li *, details *, [role=tabpanel] *, [data-fade] *)`)]
    items.forEach((el) => el.classList.add('reveal'))
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            const el = e.target as HTMLElement
            el.style.transitionDelay = `${Math.min(i, 3) * 50}ms`
            el.classList.add('reveal-in')
            io.unobserve(el)
          })
      },
      // Starts the moment an element enters, so content is never waiting on the animation.
      { threshold: 0 },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const navLinks: { id: string; label: string; href?: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
]

export function Layout({ children }: { children: ReactNode }) {
  useScrollReveal()
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-xs focus:left-xs focus:bg-paper focus:p-xs">
        Skip to content
      </a>
      <div className="mx-auto max-w-column px-page">
        <header className="flex flex-wrap items-baseline justify-between gap-x-sm gap-y-xs py-md">
          <a href="/" className="font-semibold text-ink no-underline">
            Saqlain Momin
          </a>
          <nav aria-label="Primary">
            <ul className="label flex gap-sm">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={l.href ?? `/#${l.id}`} className="text-grey no-underline hover:text-ink hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="label mt-2xl border-t border-line py-md text-grey">© 2026 Saqlain Momin · Bangalore</footer>
      </div>
    </>
  )
}

/** Every homepage section has the same anatomy: a bold heading, then content. */
export function Section({ id, title, children, className = 'mt-2xl' }: { id: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={className}>
      <h2 id={`${id}-title`}>{title}</h2>
      <div className="mt-sm">{children}</div>
    </section>
  )
}
