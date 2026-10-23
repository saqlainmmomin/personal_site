import { useRef } from 'react'
import { exhibits, type Demo } from '@/content/builds'

type Exhibit = (typeof exhibits)[number]

/** Poster that previews its video on hover (fine pointers only); a click always opens the full demo. */
function ExhibitMedia({ exhibit, onOpen }: { exhibit: Exhibit; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null)
  const canHover = () => matchMedia('(hover: hover) and (pointer: fine)').matches
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => canHover() && video.current?.play().catch(() => {})}
      onMouseLeave={() => {
        const v = video.current
        if (v) {
          v.pause()
          v.currentTime = 0
        }
      }}
      aria-label={`${exhibit.action}: ${exhibit.name}`}
      className="group relative block aspect-[16/10] w-full overflow-hidden border border-line bg-[#0B0B0B]"
    >
      {exhibit.type === 'video' ? (
        <video
          ref={video}
          src={exhibit.src}
          poster={exhibit.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="size-full object-cover opacity-90 transition-[opacity,transform] duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
        />
      ) : (
        <img
          src={exhibit.src}
          alt=""
          loading="lazy"
          className="size-full object-cover object-top opacity-90 transition-[opacity,transform] duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
        />
      )}
      <span className="absolute bottom-3 left-3 bg-paper px-2.5 py-1 font-mono text-xs tracking-[0.18em] text-ink uppercase">
        {exhibit.action} ↗
      </span>
    </button>
  )
}

export function Exhibits({ onOpen }: { onOpen: (demo: Demo) => void }) {
  return (
    <div className="mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <h3 className="font-serif text-3xl">Other projects</h3>
      </div>
      <ul className="mt-8 grid gap-8 md:grid-cols-3">
        {exhibits.map((ex) => (
          <li key={ex.id}>
            <article aria-labelledby={`${ex.id}-name`}>
              <ExhibitMedia exhibit={ex} onOpen={() => onOpen(ex)} />
              <p className="mt-4 font-mono text-xs tracking-[0.2em] text-accent-dark uppercase">
                {ex.kind}
              </p>
              <h4 id={`${ex.id}-name`} className="mt-2 font-serif text-4xl leading-none">
                {ex.name}
              </h4>
              <p className="mt-3 text-[15px] leading-[1.45] text-ink-2">{ex.pitch}</p>
              <a href={ex.github} target="_blank" rel="noreferrer" className="mt-2 inline-block py-2 font-mono text-xs tracking-[0.18em] uppercase underline decoration-line-2 underline-offset-4 hover:decoration-ink">
                GitHub ↗
              </a>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
