import { lazy, Suspense, useEffect, useState } from 'react'
import { BADGE, renderBadge, yearsOfExperience, type BadgeArt } from '@/lib/badge'

// three.js only loads for the physics badge, never in the critical path.
const Lanyard = lazy(() => import('@/components/Lanyard'))

const DESKTOP = '(min-width: 1024px) and (pointer: fine)'

const hasWebGL = () => {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches)
  useEffect(() => {
    const mq = matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/**
 * The access badge: a physics lanyard on desktop, a still card hanging from a strap on
 * touch screens, small viewports, or browsers without WebGL.
 */
export function HeroBadge() {
  const [art, setArt] = useState<BadgeArt | null>(null)
  const desktop = useMedia(DESKTOP)
  const physics = desktop && hasWebGL()

  useEffect(() => {
    let live = true
    renderBadge().then((a) => live && setArt(a))
    return () => {
      live = false
    }
  }, [])

  const still = art && (
    <div className="badge-still mx-auto flex w-[min(72vw,300px)] flex-col items-center" aria-hidden="true">
      <div className="h-24 w-6 bg-accent" />
      <img src={art.front} alt="" className="-mt-1 w-full rounded-[18px] shadow-[0_24px_60px_-20px_rgb(13_13_13/0.45)]" />
    </div>
  )

  return (
    <figure className="relative h-full w-full">
      <figcaption className="sr-only">
        Access badge: {BADGE.name}, {BADGE.role}, {BADGE.practice}, {BADGE.employer}. {yearsOfExperience()}+ years
        of experience since {BADGE.since}. ISO 27001, 27701 and 22301 Lead Auditor. {BADGE.status}.
      </figcaption>
      {art && physics ? (
        <Suspense fallback={still}>
          <Lanyard
            frontImage={art.front}
            backImage={art.back}
            strapImage={art.strap}
            cardColor="#F2EFE8"
            finish="metallic"
            anchor="right"
            size={0.6}
            strapLength={0.3}
            strapWidth={0.6}
            metal="silver"
            breeze={0.35}
          />
        </Suspense>
      ) : (
        <div className="flex h-full items-start justify-center pt-0 lg:pt-0">{still}</div>
      )}
    </figure>
  )
}
