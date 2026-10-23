import { useEffect, useState, type RefObject } from 'react'

/** True once the element has crossed into view (stays true). */
export function useInViewOnce(ref: RefObject<Element | null>, rootMargin = '0px 0px -20% 0px') {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin, seen])
  return seen
}

/**
 * Calls `onProgress` with the element's scroll progress (0–1): 0 when its top reaches `start`
 * of the viewport, 1 when its bottom reaches `end`. Under reduced motion it reports 1 once.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  start = 0.85,
  end = 0.6,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onProgress(1)
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const from = innerHeight * start
      const to = innerHeight * end - r.height
      onProgress(Math.min(Math.max((from - r.top) / (from - to), 0), 1))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [ref, onProgress, start, end])
}
