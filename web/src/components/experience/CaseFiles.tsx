import { useEffect, useRef, type CSSProperties } from 'react'
import { caseFiles, type CaseFile } from '@/content/experience'
import { useInViewOnce } from '@/lib/motion'

// Slightly different manila per folder so the stack reads as separate files.
const SHADES = ['#E6D8B6', '#DDCCA2', '#E9DDBF', '#D8C598']

function Stamp() {
  const ref = useRef<HTMLSpanElement>(null)
  const stamped = useInViewOnce(ref, '0px 0px -35% 0px')
  return (
    <span ref={ref} className="stamp" data-stamped={stamped || undefined}>
      NDA{' '}
      <small>Client confidential</small>
    </span>
  )
}

function Folder({ file, index }: { file: CaseFile; index: number }) {
  const rows: [string, string][] = [
    ['Mandate', file.mandate],
    ['Owned', file.owned],
    ['Result', file.result],
  ]
  return (
    <article
      className="folder relative rounded-b-xl rounded-tr-xl px-6 pt-8 pb-8 md:px-10 md:pt-10"
      style={{ '--shade': SHADES[index % SHADES.length], '--i': index } as CSSProperties}
      aria-labelledby={`${file.id}-title`}
    >
      <div className="folder-tab absolute -top-9 left-0 flex h-9 max-w-[calc(100%-2rem)] items-center rounded-t-lg px-5 font-mono text-xs tracking-[0.2em] text-ink-2 uppercase md:left-[calc(var(--i)*25%)] md:max-w-[calc(25%-8px)]">
        <span className="truncate">
          {file.practice}
        </span>
      </div>
      <div className="folder-body grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="relative">
          <Stamp />
          <h3 id={`${file.id}-title`} className="max-w-md font-serif text-4xl leading-[1.02] md:pr-52 md:text-5xl lg:pr-48">
            {file.title}
          </h3>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Focus areas">
            {file.tags.map((tag) => (
              <li key={tag} className="border border-ink/25 px-2.5 py-1 font-mono text-xs tracking-[0.15em] text-ink-2 uppercase">
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <dl className="border-t border-ink/20">
          {rows.map(([label, text]) => (
            <div key={label} className="grid gap-1 border-b border-ink/20 py-4 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-6">
              <dt className={`font-mono text-xs tracking-[0.2em] uppercase ${label === 'Result' ? 'text-stamp-ink' : 'text-folder-muted'}`}>
                {label}
              </dt>
              <dd className={`leading-[1.45] ${label === 'Result' ? 'text-ink' : 'text-ink-2'}`}>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}

/** Four anonymized engagements as manila case files that stack as you scroll. */
export function CaseFiles() {
  const listRef = useRef<HTMLOListElement>(null)

  // Once the next folder slides over a file, fade that file's contents so only its edge and tab show.
  useEffect(() => {
    const items = [...listRef.current!.children] as HTMLElement[]
    let raf = 0
    const update = () => {
      raf = 0
      items.forEach((item, i) => {
        const next = items[i + 1]
        // Start fading as soon as the next file overlaps the top 70% of this one.
        const covered = !!next && next.getBoundingClientRect().top - item.getBoundingClientRect().top < item.offsetHeight * 0.7
        item.toggleAttribute('data-covered', covered)
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <h3 className="font-serif text-3xl">Selected engagements</h3>
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">Anonymized · client names withheld</p>
      </div>
      <ol ref={listRef} className="mt-16 space-y-16 md:space-y-[14vh]">
        {caseFiles.map((file, i) => (
          <li key={file.id} className="md:sticky" style={{ top: `calc(110px + ${i * 30}px)` }}>
            <Folder file={file} index={i} />
          </li>
        ))}
      </ol>
    </div>
  )
}
