import { useEffect, useRef } from 'react'
import type { Demo } from '@/content/builds'

/** Native modal for demo media. Closing unmounts the media, so video playback always stops. */
export function DemoDialog({ demo, onClose }: { demo: Demo | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current!
    if (demo && !dialog.open) dialog.showModal()
    if (!demo && dialog.open) dialog.close()
    document.body.style.overflow = demo ? 'hidden' : ''
  }, [demo])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
      aria-labelledby="demo-title"
      aria-describedby="demo-description"
      className="m-auto w-[min(1100px,calc(100vw-24px))] max-w-none bg-ink p-0 text-paper backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
    >
      {demo && (
        <div className="max-h-[calc(100svh-34px)] overflow-auto p-5 md:p-9">
          <header className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] text-paper/60 uppercase">Exhibit · {demo.label}</p>
              <h2 id="demo-title" className="mt-2 font-serif text-5xl leading-none md:text-6xl">
                {demo.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="border border-paper/30 px-3 py-2 font-mono text-[11px] tracking-[0.2em] uppercase hover:border-paper"
            >
              Close ✕
            </button>
          </header>
          <div className="mt-6 aspect-video overflow-hidden border border-paper/15 bg-[#0B0B0B]">
            {demo.type === 'video' ? (
              <video
                key={demo.src}
                src={demo.src}
                poster={demo.poster}
                controls
                autoPlay
                muted
                playsInline
                aria-label={demo.label}
                className="size-full object-contain"
              />
            ) : (
              <img src={demo.src} alt={demo.label} className="size-full object-contain" />
            )}
          </div>
          <footer className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <p id="demo-description" className="max-w-[65ch] text-sm leading-relaxed text-paper/75">
              {demo.description}
            </p>
            {demo.github && (
              <a href={demo.github} target="_blank" rel="noreferrer" className="font-mono text-[11px] tracking-[0.15em] text-accent uppercase">
                GitHub ↗
              </a>
            )}
          </footer>
        </div>
      )}
    </dialog>
  )
}
