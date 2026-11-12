import { useEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import type { notes } from '@/content/notes'
import { FINE_POINTER, REDUCED_MOTION, useMediaQuery } from '@/lib/motion'

// Outer size of .note-preview: a 260px 4:3 image plus 7px of paper and a 1px border on each side.
const W = 276
const H = 211
const OFFSET = 28
const EDGE = 8
/** How much of the remaining distance the card covers each frame: the little lag behind the cursor. */
const FOLLOW = 0.16

/**
 * Hovering a row of `list` shows a larger copy of that note's cover, pinned to the cursor with a slight lag.
 * Decoration only: aria-hidden, no pointer events, images as CSS backgrounds (no extra <img>), fine pointers only.
 */
export function NotePreview({ list, items }: { list: RefObject<HTMLElement | null>; items: typeof notes }) {
  const fine = useMediaQuery(FINE_POINTER)
  const reduced = useMediaQuery(REDUCED_MOTION)
  const card = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [armed, setArmed] = useState(false)
  const enabled = fine && !reduced

  useEffect(() => {
    const el = list.current
    if (!el || !enabled) return
    const pos = { x: 0, y: 0, tx: 0, ty: 0, placed: false }
    let raf = 0

    const frame = () => {
      const dx = pos.tx - pos.x
      const dy = pos.ty - pos.y
      pos.x += dx * FOLLOW
      pos.y += dy * FOLLOW
      // Leans into the direction of travel, like a card dragged across a desk.
      const lean = Math.max(-6, Math.min(6, dx * 0.06))
      if (card.current) card.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${-3 + lean}deg)`
      raf = Math.abs(dx) + Math.abs(dy) > 0.3 ? requestAnimationFrame(frame) : 0
    }

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const row = (e.target as Element).closest<HTMLElement>('[data-note]')
      if (!row) {
        setActive(null)
        return
      }
      setArmed(true)
      setActive(Number(row.dataset.note))
      // Sit to the lower right of the cursor; flip left near the right edge; stay inside the viewport.
      const x = e.clientX + OFFSET + W > innerWidth - EDGE ? e.clientX - OFFSET - W : e.clientX + OFFSET
      pos.tx = Math.max(EDGE, Math.min(x, innerWidth - W - EDGE))
      pos.ty = Math.max(EDGE, Math.min(e.clientY - H / 2, innerHeight - H - EDGE))
      if (!pos.placed) {
        pos.x = pos.tx
        pos.y = pos.ty
        pos.placed = true
      }
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const leave = () => {
      setActive(null)
      pos.placed = false
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [list, enabled])

  if (!enabled) return null

  return createPortal(
    <div ref={card} className="note-preview" data-on={active !== null ? '' : undefined} aria-hidden="true">
      {armed &&
        items.map((n, i) => (
          <div key={n.href} className="note-preview-img" data-on={i === active ? '' : undefined} style={{ backgroundImage: `url('${n.image}')` }} />
        ))}
    </div>,
    document.body,
  )
}
