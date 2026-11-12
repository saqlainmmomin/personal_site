import { useCallback, useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

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
 * Plays the site's one reveal: marks every [data-reveal] element with data-shown the first time it
 * scrolls into view. The hidden state and transition live in index.css.
 */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.shown = ''
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
export const FINE_POINTER = '(hover: hover) and (pointer: fine)'

/** Live result of a media query. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => false)
}

/** Reads a motion token such as --dur-slow in milliseconds, so JS-driven motion keeps to the CSS durations. */
export function tokenMs(name: string, fallback: number) {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name))
  return Number.isFinite(v) ? v : fallback
}

/** Counts from 0 up to `target` over --dur-slow once `run` turns true. Reduced motion shows the target at once. */
export function useCountUp(target: number, run: boolean) {
  const [value, setValue] = useState(0)
  const reduced = useMediaQuery(REDUCED_MOTION)
  useEffect(() => {
    if (!run || reduced) return
    const duration = tokenMs('--dur-slow', 800)
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // Exponential ease-out, like --ease-out-expo; lands exactly on the target.
      setValue(t === 1 ? target : Math.round(target * (1 - Math.pow(2, -10 * t))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, reduced])
  return run && reduced ? target : value
}

/**
 * Pointer tilt for fine pointers: writes --tx and --ty (-0.5 to 0.5, the pointer's position over `surface`) onto
 * `target`, and data-tilting while the pointer is over it. The CSS turns those into the tilt; skipped under reduced motion.
 */
export function usePointerTilt(surface: RefObject<HTMLElement | null>, target: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = surface.current
    const t = target.current
    if (!el || !t || !matchMedia(FINE_POINTER).matches || matchMedia(REDUCED_MOTION).matches) return
    let raf = 0
    const set = (x: number, y: number, on: boolean) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        t.style.setProperty('--tx', x.toFixed(3))
        t.style.setProperty('--ty', y.toFixed(3))
        t.toggleAttribute('data-tilting', on)
      })
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      set((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5, true)
    }
    const leave = () => set(0, 0, false)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [surface, target])
}
