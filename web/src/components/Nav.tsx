import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

export interface NavSection {
  id: string
  index: string
  label: string
}

/** Id of the section crossing the middle band of the viewport; empty above the first section. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const visible = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        setActive(ids.find((id) => visible.has(id)) ?? '')
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

export function Nav({ sections }: { sections: NavSection[] }) {
  const ids = useMemo(() => sections.map((s) => s.id), [sections])
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)
  const list = useRef<HTMLUListElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  // Slide the indicator under the active tab (desktop list only); re-measure when the list resizes.
  useLayoutEffect(() => {
    const el = bar.current
    const ul = list.current
    if (!el || !ul) return
    const place = () => {
      const link = ul.querySelector<HTMLElement>('a[aria-current="true"]')
      el.style.opacity = link ? '1' : '0'
      if (!link) return
      el.style.width = `${link.offsetWidth}px`
      el.style.transform = `translateX(${link.offsetLeft}px)`
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(ul)
    document.fonts?.ready.then(place)
    return () => ro.disconnect()
  }, [active])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggle.current?.focus()
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  return (
    <nav aria-label="Primary" className="sticky top-0 z-40 border-b border-line bg-paper/97 backdrop-blur">
      <div className="flex items-center justify-between px-page py-4">
        <a href="#top" className="font-mono text-xs tracking-widest uppercase">S. Momin / Audit file</a>

        <ul ref={list} className="relative hidden gap-6 md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? 'true' : undefined}
                className="font-mono text-xs tracking-widest text-muted uppercase hover:text-ink aria-[current=true]:text-ink"
              >
                {s.index} · {s.label}
              </a>
            </li>
          ))}
          <span ref={bar} aria-hidden="true" className="absolute -bottom-[17px] left-0 h-0.5 bg-accent opacity-0 transition-[transform,width,opacity] duration-300 ease-out" />
        </ul>

        <button
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="border border-line-2 px-3 py-1.5 font-mono text-xs tracking-widest uppercase md:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <ul id="mobile-menu" hidden={!open} className="border-t border-line bg-paper px-page pb-3 md:hidden">
        {sections.map((s) => (
          <li key={s.id} className="border-b border-line last:border-b-0">
            <a
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              aria-current={active === s.id ? 'true' : undefined}
              className="flex items-baseline justify-between py-3.5 font-mono text-xs tracking-widest text-ink-2 uppercase aria-[current=true]:text-ink"
            >
              <span>
                {active === s.id && <span aria-hidden="true" className="mr-2 text-accent-dark">●</span>}
                {s.index} · {s.label}
              </span>
              <span aria-hidden="true">↓</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
