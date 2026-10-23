import { useState } from 'react'
import LogoLoop from '@/components/LogoLoop'
import { roles } from '@/content/experience'
import { fullYearsSince, yearsInWords } from '@/lib/dates'
import { HeroBadge } from './HeroBadge'
import { HeroName } from './HeroName'

const frameworks = ['ISO 27001', 'ISO 27701', 'ISO 22301', 'NIST CSF', 'DPDPA', 'PCI DSS', 'OWASP', 'SOC 2'].map((name) => ({
  node: <span className="font-mono text-sm tracking-[0.2em] text-ink-2 uppercase">{name}</span>,
  title: name,
}))

export function Hero() {
  const [paused, setPaused] = useState(false)
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-[1440px] gap-10 px-page pt-10 lg:min-h-[calc(100svh-120px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6 lg:pt-14">
        <div className="relative z-10 flex flex-col justify-center pb-6 lg:pointer-events-none [&_a]:pointer-events-auto">
          <div className="max-w-[min(560px,48svh)]">
            <HeroName />
          </div>
          <p className="mt-6 max-w-xl font-serif text-4xl leading-[1.05] md:text-5xl">
            I design security programs, and audit whether they <em className="text-accent">hold</em>.
          </p>
          <p className="mt-3 max-w-xl text-lg text-ink-2">
            {yearsInWords(fullYearsSince(roles[0].start))} years at KPMG Bangalore across banks, insurers, and regulated enterprises. I also build software for the
            parts of GRC that still run on spreadsheets.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#contact" className="bg-ink px-5 py-3 font-mono text-xs tracking-[0.18em] text-paper uppercase transition-colors hover:bg-accent">
              Contact me ↓
            </a>
            <a href="#experience" className="border border-line-2 px-5 py-3 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:border-ink">
              Open the case files ↓
            </a>
            <a href="/cv.pdf" className="border border-line-2 px-5 py-3 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:border-ink">
              Download CV ↗
            </a>
          </div>


        </div>

        {/* On desktop the badge canvas spans the whole hero, so the card can swing over the name without clipping. */}
        <div className="relative h-[440px] sm:h-[520px] lg:absolute lg:inset-0 lg:h-auto">
          <HeroBadge />
        </div>
      </div>

      <div className="relative mt-10 border-y border-line py-5">
        <LogoLoop
          logos={frameworks}
          speed={paused ? 0 : 50}
          gap={56}
          logoHeight={20}
          pauseOnHover
          fadeOut
          fadeOutColor="#F2EFE8"
          ariaLabel="Frameworks and standards I work with"
        />
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((v) => !v)}
          className="absolute top-1/2 right-[var(--spacing-page)] z-10 -translate-y-1/2 border border-line-2 bg-paper px-3 py-2 font-mono text-xs tracking-[0.15em] uppercase hover:border-ink"
        >
          {paused ? 'Play' : 'Pause'} scroll
        </button>
      </div>
    </section>
  )
}
