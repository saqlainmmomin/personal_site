import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Project, ProjectMedia } from '@/content/projects'

/**
 * One tile plays at a time: the one with the most of itself on screen. The rest show their posters.
 * Letting every visible clip play had up to five videos decoding at once mid-scroll, which made scrolling stutter.
 */
const onScreen = new Map<Element, number>()
const listeners = new Set<(active: Element | null) => void>()
let activeTile: Element | null = null
let tileObserver: IntersectionObserver | undefined

function watchTile(el: Element, onChange: (active: Element | null) => void) {
  tileObserver ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.set(e.target, e.intersectionRect.height)
        else onScreen.delete(e.target)
      }
      let next: Element | null = null
      for (const [tile, px] of onScreen) if (!next || px > onScreen.get(next)!) next = tile
      if (next !== activeTile) {
        activeTile = next
        listeners.forEach((l) => l(activeTile))
      }
    },
    { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] },
  )
  listeners.add(onChange)
  tileObserver.observe(el)
  return () => {
    listeners.delete(onChange)
    tileObserver?.unobserve(el)
    onScreen.delete(el)
  }
}

const Playing = createContext(false)

/** Plays while its tile is the active one, never under reduced motion (the poster stays). */
function Clip({ media, title, frame }: { media: ProjectMedia; title: string; frame: string }) {
  const video = useRef<HTMLVideoElement>(null)
  const playing = useContext(Playing)

  useEffect(() => {
    const el = video.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (playing) void el.play().catch(() => {})
    else el.pause()
  }, [playing])

  if (media.type === 'image') {
    return <img src={media.src} width={media.width} height={media.height} alt={`${title} screenshot`} loading="lazy" className={frame} />
  }
  return (
    <video
      ref={video}
      src={media.src}
      poster={media.poster}
      width={media.width}
      height={media.height}
      aria-label={`${title} demo`}
      muted
      loop
      playsInline
      preload="none"
      className={frame}
    />
  )
}

export function ProjectTile({ project }: { project: Project }) {
  const frame = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = frame.current
    if (!el) return
    return watchTile(el, (active) => setPlaying(active === el))
  }, [])

  return (
    <article>
      <div ref={frame} className={mat} data-fade>
        <Playing.Provider value={playing}>
          {project.gallery ? <Gallery clips={project.gallery} title={project.title} /> : <Clip media={project.media} title={project.title} frame={screen} />}
        </Playing.Provider>
      </div>
      <h3 className="mt-sm">{project.title}</h3>
      {project.status && <p className="label text-grey">{project.status}</p>}
      <p className="mt-xs max-w-text text-grey">{project.line}</p>
      {project.links.length > 0 && (
        <p className="label mt-sm flex flex-wrap gap-x-sm gap-y-xs">
          {project.links.map((l) =>
            l.href.startsWith('/') ? (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ) : (
              <a key={l.href} href={l.href} target="_blank" rel="noopener">
                {l.label}
              </a>
            ),
          )}
        </p>
      )}
    </article>
  )
}

/** The same paper-grey mat and inset screen as the Yozora page frames. */
const mat = 'border border-line bg-mat p-[10px] sm:p-[14px]'
const screen = 'block w-full border border-line bg-white'

/** A phone recording inside a plain iPhone body. The recordings already include the Dynamic Island. */
function Phone({ children }: { children: ReactNode }) {
  return <div className="rounded-[15%/7%] bg-[#1C1C1E] p-[3.5%] shadow-[inset_0_0_0_1px_#3A3A3C]">{children}</div>
}

/** Several clips side by side at one height: each one's share of the row follows its aspect ratio. */
function Gallery({ clips, title }: { clips: ProjectMedia[]; title: string }) {
  return (
    <div className="flex items-center gap-xs sm:gap-sm">
      {clips.map((m, i) => (
        <div key={m.src} className="min-w-0" style={{ flex: `${m.width / m.height} 1 0` }}>
          {m.device === 'phone' ? (
            <Phone>
              <Clip media={m} title={`${title} clip ${i + 1}`} frame="block w-full rounded-[12%/5.5%]" />
            </Phone>
          ) : (
            <Clip media={m} title={`${title} clip ${i + 1}`} frame={screen} />
          )}
        </div>
      ))}
    </div>
  )
}
