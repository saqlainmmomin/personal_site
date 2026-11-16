import { useEffect, useRef } from 'react'

const REACH = 56 // how far above and below a section boundary each crossing starts and ends
const SAMPLES = 600

/**
 * One orange thread for the whole page. It leaves the hero beside the lanyard, runs down the page gutter,
 * crosses to the other side at every section boundary, and ends in the scribble under the contact heading.
 * It draws itself as the page scrolls; a node on each section lights up as the line reaches it.
 *
 * Render it as the first child of a `relative` <main>. The route is measured from the layout and rebuilt
 * whenever <main> changes size. Scrolling only does a table lookup, never a layout read.
 */
export function Thread() {
  const svgRef = useRef<SVGSVGElement>(null)
  const guideRef = useRef<SVGPathElement>(null)
  const inkRef = useRef<SVGPathElement>(null)
  const nodesRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const svg = svgRef.current!
    const guide = guideRef.current!
    const ink = inkRef.current!
    const nodeLayer = nodesRef.current!
    const main = svg.parentElement!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    let total = 0
    let table: { len: number; y: number }[] = [] // path length → y, sampled; y only ever increases
    let nodeLens: number[] = []
    let mainTop = 0 // page offset of <main>
    let current = 0
    let raf = 0

    /** Path length drawn once the pen has reached page-y `y`. */
    const lenAt = (y: number) => {
      let lo = 0
      let hi = table.length - 1
      if (!table.length || y <= table[0].y) return 0
      if (y >= table[hi].y) return total
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1
        if (table[mid].y <= y) lo = mid
        else hi = mid
      }
      return table[lo].len
    }

    const paint = () => {
      ink.style.strokeDashoffset = String(total - current)
      const nodes = nodeLayer.children
      for (let i = 0; i < nodes.length; i++) nodes[i].toggleAttribute('data-lit', current >= nodeLens[i] - 1)
    }

    const target = () => {
      if (reduce) return total
      const maxScroll = Math.max(document.documentElement.scrollHeight - innerHeight, 1)
      // The pen sits just past mid-screen and slides to the bottom edge by the end of the page, so the line always finishes.
      const pen = scrollY + innerHeight * (0.55 + 0.45 * Math.min(scrollY / maxScroll, 1))
      return lenAt(pen - mainTop)
    }

    // The pen trails the scroll slightly, so the line eases after it instead of snapping.
    const tick = () => {
      const to = target()
      current = Math.abs(to - current) < 0.5 ? to : current + (to - current) * 0.16
      paint()
      raf = current === to ? 0 : requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const build = () => {
      const sections = [...main.querySelectorAll<HTMLElement>(':scope > section')]
      const inner = sections[1]?.querySelector<HTMLElement>(':scope > div')
      if (!inner) return
      const box = main.getBoundingClientRect()
      const W = main.clientWidth
      const H = main.scrollHeight
      mainTop = box.top + scrollY
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      svg.style.height = `${H}px`

      // The thread lives in the page gutter, just outside the text column.
      const col = inner.getBoundingClientRect()
      const pad = parseFloat(getComputedStyle(inner).paddingLeft)
      const left = col.left - box.left + pad * 0.45
      const right = col.right - box.left - pad * 0.45
      const tops = sections.slice(1).map((s) => s.getBoundingClientRect().top - box.top)
      const scribble = main.querySelector('.scribble svg')?.getBoundingClientRect()

      let x = right
      let d = `M${x} 20`
      const nodes: [number, number][] = []
      tops.forEach((top, i) => {
        const y0 = top - REACH
        if (i === tops.length - 1 && scribble) {
          // Last section: curl in from the gutter and land on the end of the heading's underline.
          // The underline's path ends at (356, 5) in its 360 × 20 viewBox.
          const ex = scribble.left - box.left + scribble.width * (356 / 360)
          const ey = scribble.top - box.top + scribble.height * (5 / 20)
          d += ` L${x} ${y0} C${x} ${y0 + (ey - y0) * 0.7} ${ex + (x - ex) * 0.5} ${ey} ${ex} ${ey}`
          nodes.push([ex, ey])
          return
        }
        const to = x === right ? left : right
        d += ` L${x} ${y0} C${x} ${top + REACH * 0.8} ${to} ${top - REACH * 0.8} ${to} ${top + REACH}`
        nodes.push([to, top + REACH])
        x = to
      })

      guide.setAttribute('d', d)
      ink.setAttribute('d', d)
      total = ink.getTotalLength()
      ink.style.strokeDasharray = `${total} ${total}`
      table = Array.from({ length: SAMPLES + 1 }, (_, i) => {
        const len = (total * i) / SAMPLES
        return { len, y: ink.getPointAtLength(len).y }
      })
      nodeLens = nodes.map(([, y]) => lenAt(y))
      nodeLayer.replaceChildren(
        ...nodes.map(([cx, cy]) => {
          const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          c.setAttribute('cx', String(cx))
          c.setAttribute('cy', String(cy))
          c.setAttribute('r', '4.5')
          c.setAttribute('class', 'thread-node')
          return c
        }),
      )
      current = Math.min(current, total)
      paint()
      wake()
    }

    let pending = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(pending)
      pending = requestAnimationFrame(build)
    })
    ro.observe(main)
    build()
    addEventListener('scroll', wake, { passive: true })
    return () => {
      ro.disconnect()
      cancelAnimationFrame(pending)
      cancelAnimationFrame(raf)
      removeEventListener('scroll', wake)
    }
  }, [])

  return (
    <svg ref={svgRef} className="thread" aria-hidden="true" preserveAspectRatio="none">
      <path ref={guideRef} className="thread-guide" />
      <path ref={inkRef} className="thread-ink" />
      <g ref={nodesRef} />
    </svg>
  )
}
