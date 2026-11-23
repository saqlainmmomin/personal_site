import { useLayoutEffect } from 'react'

/**
 * The homepage's header without the intro (see Landing.tsx): pinned, full at the top, and once you
 * scroll it shrinks to just the stickman, which slides into the right-hand margin. index.css styles it.
 */
export function usePinnedHeader() {
  useLayoutEffect(() => {
    const root = document.documentElement
    const update = () => (root.dataset.landing = window.scrollY > 40 ? 'past' : 'open')
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      delete root.dataset.landing
    }
  }, [])
}
