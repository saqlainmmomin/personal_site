import { useEffect, useRef } from 'react'
import LeonSans from '@/vendor/leon.js'

const DRAW_SECONDS = 1.6
const STAGGER = 0.06
const easeOutQuart = (k: number) => 1 - Math.pow(1 - k, 4)

/**
 * The name, hand-drawn stroke by stroke with Leon Sans, then left to breathe in wave mode.
 * The real <h1> stays in the DOM for screen readers and search; the canvas is decorative.
 */
export function HeroName({ text = 'Saqlain\nMomin' }: { text?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current!
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--color-ink').trim() || '#0D0D0D'

    const leon = new LeonSans({
      text,
      size: 100,
      weight: 220,
      color: [ink],
      align: 'left',
      leading: -1,
      isWave: !reduce,
      pathGap: 0.3,
      amplitude: 0.04, // a faint ink tremor; higher values read as a scribble at hero size
      fps: 12,
    })

    let W = 0
    let H = 0
    const fit = () => {
      const width = wrap.clientWidth
      if (width < 2) return
      // Scale the font so the longest line spans the column.
      leon.size = 100
      leon.size = Math.max(56, (100 * width) / leon.rect.w) * 0.98
      const dpr = Math.min(devicePixelRatio || 1, 2)
      W = width
      H = Math.ceil(leon.rect.h + leon.size * 0.18)
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      leon.position(0, leon.size * 0.08)
      paint(performance.now())
    }

    let start = 0
    let raf = 0
    let visible = true
    const introEnd = DRAW_SECONDS + STAGGER * leon.drawing.length

    const paint = (now: number) => {
      ctx.clearRect(0, 0, W, H)
      if (reduce) {
        leon.drawing.forEach((d) => (d.value = 1))
        leon.draw(ctx)
        return
      }
      const t = start ? (now - start) / 1000 : 0
      if (t < introEnd) {
        leon.drawing.forEach((d, i) => {
          const k = Math.min(Math.max((t - i * STAGGER) / DRAW_SECONDS, 0), 1)
          d.value = easeOutQuart(k)
        })
        leon.draw(ctx)
      } else {
        // draw() animates strokes with line dashes and never clears them; wave() needs solid lines.
        ctx.setLineDash([])
        leon.wave(ctx, now)
      }
    }

    const tick = (now: number) => {
      start ||= now
      paint(now)
      raf = visible ? requestAnimationFrame(tick) : 0
    }

    const ro = new ResizeObserver(fit)
    ro.observe(wrap)
    fit()

    // Stop the loop when the hero is off-screen; resume when it returns.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf && !reduce) raf = requestAnimationFrame(tick)
    })
    io.observe(wrap)
    if (!reduce) raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [text])

  return (
    <div ref={wrapRef} className="w-full">
      <h1 className="sr-only">{text.replace(/\n/g, ' ')}</h1>
      <canvas ref={canvasRef} aria-hidden="true" className="block" />
    </div>
  )
}
