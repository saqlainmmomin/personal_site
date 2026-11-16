import { useRef, type CSSProperties } from 'react'
import { allNotesHref, featured, intro, notes } from '@/content/notes'
import { useInViewOnce, usePointerTilt } from '@/lib/motion'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { NotePreview } from './NotePreview'

/** The cover story: the image tilts toward a fine pointer and the Declassified tag stamps on once in view. */
function Featured() {
  const box = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLAnchorElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const stamped = useInViewOnce(box)
  usePointerTilt(card, frame)

  return (
    <div ref={box} data-reveal data-stamped={stamped ? '' : undefined}>
    <a
      ref={card}
      href={featured.href}
      target="_blank"
      rel="noopener"
      className="group relative mt-16 grid gap-8 border border-ink bg-paper p-5 transition-shadow hover:shadow-[8px_8px_0_0_var(--color-ink)] focus-visible:shadow-[8px_8px_0_0_var(--color-ink)] md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-12 md:p-8"
    >
      <span className="declass absolute -top-4 right-6 z-[1] border-[3px] border-double border-stamp-ink bg-paper px-3 py-1 font-mono text-sm tracking-[0.2em] text-stamp-ink uppercase">
        Declassified
      </span>
      <div className="self-start">
        <div ref={frame} className="cover-frame border border-line-2">
          <img src={featured.image} width={featured.width} height={featured.height} alt={featured.alt} className="block w-full" />
        </div>
      </div>
      <div className="flex flex-col">
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
          <time dateTime={featured.date}>{featured.label}</time>
        </p>
        <h3 className="mt-5 font-serif text-4xl leading-[1.05] md:text-5xl">{featured.title}</h3>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2">{featured.summary}</p>
        <span className="mt-8 w-max border-b-2 border-accent pb-1 font-mono text-xs tracking-[0.18em] uppercase transition-[padding] group-hover:pr-3">
          Read the timeline →
        </span>
      </div>
    </a>
    </div>
  )
}

/** One earlier note: thumbnail, date and title. The whole row links out; data-note feeds the hover preview. */
function Row({ note, index }: { note: (typeof notes)[number]; index: number }) {
  return (
    <li data-reveal data-note={index} className="border-b border-line-2" style={{ '--i': index } as CSSProperties}>
      <a
        href={note.href}
        target="_blank"
        rel="noopener"
        className="group flex items-center gap-5 py-4 transition-colors hover:bg-paper/60 focus-visible:bg-paper/60 md:px-3"
      >
        <img src={note.image} alt={note.alt} loading="lazy" width={240} height={180} className="aspect-[4/3] w-24 shrink-0 border border-line-2 bg-ink object-cover object-top" />
        <span className="min-w-0 flex-1">
          <time dateTime={note.date} className="block font-mono text-xs tracking-[0.2em] text-ink-2 uppercase">
            {note.label}
          </time>
          <h3 className="mt-1.5 font-serif text-2xl leading-tight transition-transform duration-(--dur-fast) ease-out-expo group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
            {note.title}
          </h3>
        </span>
        <span
          className="font-mono text-sm text-accent-dark transition-transform duration-(--dur-fast) ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1"
          aria-hidden="true"
        >
          ↗
        </span>
      </a>
    </li>
  )
}

export function FieldNotes() {
  const list = useRef<HTMLOListElement>(null)

  return (
    <Section id="writing" index="04" label="Field notes" warm>
        <SectionHead
          title={
            <>
              Field notes, with the <em className="text-accent">data attached</em>.
            </>
          }
          intro={intro}
        />

        <Featured />

        <h3 className="mt-20 font-serif text-3xl">Earlier notes</h3>
        <ol ref={list} className="mt-4 grid border-t border-ink md:grid-cols-2 md:gap-x-10">
          {notes.map((n, i) => (
            <Row key={n.href} note={n} index={i} />
          ))}
        </ol>
        <NotePreview list={list} items={notes} />

        <p className="mt-8">
          <a href={allNotesHref} target="_blank" rel="noopener" className="inline-block py-2 font-mono text-xs tracking-[0.18em] text-accent-dark uppercase underline-offset-4 hover:underline">
            All field notes on LinkedIn ↗
          </a>
        </p>
    </Section>
  )
}
