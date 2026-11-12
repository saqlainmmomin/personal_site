import { HeroBadge } from './HeroBadge'
import { HeroName } from './HeroName'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-[1440px] gap-10 px-page pt-10 lg:min-h-[calc(100svh-65px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6 lg:pt-14">
        <div className="relative z-10 flex flex-col justify-center pb-6 lg:pointer-events-none [&_a]:pointer-events-auto">
          <div className="max-w-[min(560px,48svh)]">
            <HeroName />
          </div>
          <p className="mt-6 max-w-xl font-serif text-4xl leading-[1.05] md:text-5xl">
            I design security programs, and audit whether they <em className="text-accent">hold</em>.
          </p>
          <p className="mt-4 max-w-xl text-lg text-ink-2">GRC, cyber risk and security assurance consultant at KPMG.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="bg-ink px-5 py-3 font-mono text-xs tracking-[0.18em] text-paper uppercase transition-colors hover:bg-accent">
              Contact me ↓
            </a>
            <a href="/cv.pdf" className="border border-line-2 px-5 py-3 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:border-ink">
              Download CV ↗
            </a>
          </div>
        </div>

        {/* On desktop the badge canvas spans the whole hero, so the card can swing over the name without clipping. */}
        <div className="relative pb-6 lg:absolute lg:inset-0 lg:pb-0">
          <HeroBadge />
        </div>
      </div>

    </section>
  )
}
