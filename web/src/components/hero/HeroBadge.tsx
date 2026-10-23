import { lazy, Suspense, useEffect, useState } from 'react'
import { BADGE, renderBadge, yearsOfExperience, type BadgeArt } from '@/lib/badge'

// three.js only loads for the physics badge, never in the critical path.
const Lanyard = lazy(() => import('@/components/Lanyard'))

const hasWebGL = () => {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

/** True at lg and up, where the badge canvas spans the whole hero and the card hangs on the right. */
function useWide() {
  const [wide, setWide] = useState(() => matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const mq = matchMedia('(min-width: 1024px)')
    const onChange = () => setWide(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return wide
}

/**
 * The access badge: a physics lanyard (drag it, tap to flip) wherever WebGL is available, and a still
 * card hanging from a strap where it is not.
 */
export function HeroBadge() {
  const [art, setArt] = useState<BadgeArt | null>(null)
  const [physics] = useState(hasWebGL)
  const wide = useWide()

  useEffect(() => {
    let live = true
    renderBadge().then((a) => live && setArt(a))
    return () => {
      live = false
    }
  }, [])

  const still = art && (
    <div className="badge-still mx-auto flex w-[min(80vw,340px)] flex-col items-center" aria-hidden="true">
      <div className="h-24 w-6 bg-accent" />
      <img src={art.front} alt="" className="-mt-1 w-full rounded-[18px] shadow-[0_24px_60px_-20px_rgb(13_13_13/0.45)]" />
    </div>
  )

  return (
    <figure className={`relative w-full lg:h-full ${physics ? 'h-[520px]' : ''}`}>
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
            anchor={wide ? 'right' : 'center'}
            size={0.7}
            strapLength={0.3}
            strapWidth={0.6}
            metal="silver"
            breeze={0.35}
          />
        </Suspense>
      ) : (
        <div className="flex items-start justify-center lg:h-full">{still}</div>
      )}
    </figure>
  )
}
