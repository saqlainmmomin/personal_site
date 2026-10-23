import { allNotesHref, featured, intro, notes, takeaway } from '@/content/notes'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'

function Featured() {
  return (
    <a
      href={featured.href}
      target="_blank"
      rel="noopener"
      className="group relative mt-16 grid gap-8 border border-ink bg-paper p-5 transition-shadow hover:shadow-[8px_8px_0_0_var(--color-ink)] focus-visible:shadow-[8px_8px_0_0_var(--color-ink)] md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-12 md:p-8"
    >
      <span className="absolute -top-4 right-6 rotate-[5deg] border-[3px] border-double border-stamp-ink bg-paper px-3 py-1 font-mono text-sm tracking-[0.2em] text-stamp-ink uppercase">
        Declassified
      </span>
      <div className="self-start">
        <img src={featured.image} width={featured.width} height={featured.height} alt={featured.alt} className="w-full border border-line-2" />
      </div>
      <div className="flex flex-col">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
          <time dateTime={featured.date}>{featured.label}</time>
        </p>
        <h3 className="mt-5 font-serif text-4xl leading-[1.05] md:text-5xl">{featured.title}</h3>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2">{featured.summary}</p>
        <span className="mt-8 w-max border-b-2 border-accent pb-1 font-mono text-xs tracking-[0.18em] uppercase transition-[padding] group-hover:pr-3">
          Read the timeline →
        </span>
      </div>
    </a>
  )
}

/** A black bar covers each note's thesis until hover or focus; coarse pointers and reduced motion always see it. */
function Row({ note }: { note: (typeof notes)[number] }) {
  return (
    <li className="border-b border-line-2">
      <a
        href={note.href}
        target="_blank"
        rel="noopener"
        className="note-row grid gap-x-8 gap-y-4 py-8 transition-colors hover:bg-paper-2/60 focus-visible:bg-paper-2/60 md:grid-cols-[15rem_minmax(0,1fr)] lg:grid-cols-[22rem_minmax(0,1fr)] md:px-4"
      >
        <div>
          <time dateTime={note.date} className="font-mono text-[11px] tracking-[0.2em] text-ink-2 uppercase block">
            {note.label}
          </time>
          <img
            src={note.image}
            alt={note.alt}
            loading="lazy"
            width={240}
            height={180}
            className="mt-3 aspect-[16/10] w-full border border-line-2 bg-ink object-cover object-top md:aspect-[4/3]"
          />
        </div>
        <div>
          <h3 className="font-serif text-3xl leading-tight">{note.title}</h3>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">
            <span className="redact">{note.thesis}</span>
          </p>
          <span className="mt-3 block font-mono text-[11px] tracking-[0.18em] text-accent-dark uppercase">Read on LinkedIn →</span>
        </div>
      </a>
    </li>
  )
}

export function FieldNotes() {
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

        <div className="mt-20 flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-3xl">Index of earlier notes</h3>
          <p className="redact-hint font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Hover or focus to declassify</p>
        </div>
        <ol className="mt-4 border-t border-ink">
          {notes.map((n) => (
            <Row key={n.href} note={n} />
          ))}
        </ol>

        <aside className="mt-14 grid gap-4 border-l-2 border-accent pl-5 md:grid-cols-[12rem_minmax(0,1fr)] md:items-baseline">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase">From research to practice</p>
          <p className="max-w-2xl font-serif text-2xl leading-snug">{takeaway}</p>
        </aside>
        <p className="mt-8">
          <a href={allNotesHref} target="_blank" rel="noopener" className="font-mono text-xs tracking-[0.18em] text-accent-dark uppercase underline-offset-4 hover:underline">
            All field notes on LinkedIn ↗
          </a>
        </p>
    </Section>
  )
}
