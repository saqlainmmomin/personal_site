// Synthesised Web Audio sounds, no files. One shared context, master gain, throttled so brawls don't clip.
export type Sfx = 'punch' | 'kick' | 'hit' | 'ko' | 'jump' | 'land' | 'whoosh' | 'knock' | 'grab' | 'throw' | 'boom'

const KEY = 'fight-muted'
const MASTER = 0.35
const MAX_VOICES = 8
const GAP: Record<Sfx, number> = { punch: 0.05, kick: 0.05, hit: 0.04, ko: 0.4, jump: 0.08, land: 0.1, whoosh: 0.07, knock: 0.06, grab: 0.08, throw: 0.08, boom: 0.6 }

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuf: AudioBuffer | null = null
let isMuted = false
let voices = 0
const lastAt: Partial<Record<Sfx, number>> = {}

try {
  isMuted = localStorage.getItem(KEY) === '1'
} catch {
  /* storage blocked */
}

/** Create/resume the AudioContext. Called from the launch click (a user gesture). */
export function unlock() {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return
      ctx = new AC()
      master = ctx.createGain()
      master.gain.value = isMuted ? 0 : MASTER
      master.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') void ctx.resume()
  } catch {
    ctx = null
  }
}
export function muted() {
  return isMuted
}
export function setMuted(m: boolean) {
  isMuted = m
  try {
    localStorage.setItem(KEY, m ? '1' : '0')
  } catch {
    /* ignore */
  }
  if (master && ctx) master.gain.setTargetAtTime(m ? 0 : MASTER, ctx.currentTime, 0.01)
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a)

function noise(c: AudioContext) {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  return noiseBuf
}

/** Filtered noise burst with an exponential decay. */
function burst(c: AudioContext, t: number, dur: number, gain: number, type: BiquadFilterType, f0: number, f1: number, q = 1) {
  const src = c.createBufferSource()
  src.buffer = noise(c)
  const fl = c.createBiquadFilter()
  fl.type = type
  fl.Q.value = q
  fl.frequency.setValueAtTime(f0, t)
  fl.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(fl).connect(g).connect(master!)
  src.start(t, Math.random() * 0.3)
  src.stop(t + dur + 0.02)
  return src
}

/** Pitched oscillator that glides f0 -> f1 and decays. */
function tone(c: AudioContext, t: number, dur: number, gain: number, f0: number, f1: number, type: OscillatorType = 'sine') {
  const o = c.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(f0, t)
  o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(master!)
  o.start(t)
  o.stop(t + dur + 0.02)
  return o
}

/** Fire-and-forget. `strength` 0..1 scales loudness/pitch. */
export function sfx(name: Sfx, strength = 1) {
  if (isMuted || !ctx || !master) return
  try {
    if (ctx.state === 'suspended') void ctx.resume()
    const now = ctx.currentTime
    if (voices >= MAX_VOICES) return
    if (now - (lastAt[name] ?? -1) < GAP[name]) return
    lastAt[name] = now
    const s = Math.max(0, Math.min(1, strength))
    const p = rnd(0.92, 1.08) // pitch jitter
    const c = ctx
    const t = now + 0.001
    let end: AudioScheduledSourceNode | null = null
    switch (name) {
      case 'punch':
        burst(c, t, 0.06, 0.5 * s, 'bandpass', 2400 * p, 700, 0.9)
        end = tone(c, t, 0.12, 0.7 * s, 130 * p, 75 * p)
        break
      case 'kick':
        burst(c, t, 0.09, 0.6 * s, 'lowpass', 3000 * p, 500)
        end = tone(c, t, 0.2, 0.9 * s, 95 * p, 42 * p)
        break
      case 'hit':
        burst(c, t, 0.08, 0.45 * s, 'bandpass', 1500 * p, 400, 0.7)
        end = tone(c, t, 0.1, 0.35 * s, 220 * p, 110 * p, 'triangle')
        break
      case 'ko':
        burst(c, t, 0.25, 0.5 * s, 'lowpass', 1800, 200)
        tone(c, t, 0.35, 0.9 * s, 90 * p, 35)
        end = tone(c, t + 0.04, 0.55, 0.3 * s, 420 * p, 90, 'triangle')
        break
      case 'jump':
        end = tone(c, t, 0.09, 0.18 * (0.5 + s * 0.5), 330 * p, 560 * p)
        break
      case 'land':
        burst(c, t, 0.05, 0.25 * s, 'lowpass', 900, 300)
        end = tone(c, t, 0.08, 0.35 * s, 85 * p, 55)
        break
      case 'whoosh':
        end = burst(c, t, 0.14, 0.16 * (0.4 + s * 0.6), 'bandpass', 700 * p, 2600 * p, 0.8)
        break
      case 'knock':
        burst(c, t, 0.05, 0.4 * s, 'highpass', 1800 * p, 1400)
        end = tone(c, t, 0.07, 0.3 * s, 520 * p, 300 * p, 'square')
        tone(c, t + 0.045, 0.06, 0.2 * s, 400 * p, 260 * p, 'square')
        break
      case 'grab':
        tone(c, t, 0.05, 0.2 * s, 380 * p, 620 * p, 'triangle')
        end = tone(c, t + 0.04, 0.06, 0.16 * s, 620 * p, 880 * p, 'triangle')
        break
      case 'throw':
        burst(c, t, 0.22, 0.3 * s, 'bandpass', 500 * p, 3200 * p, 0.9)
        end = tone(c, t, 0.16, 0.12 * s, 180 * p, 90 * p, 'triangle')
        break
      case 'boom':
        burst(c, t, 0.5, 0.25 * s, 'lowpass', 600, 80)
        end = tone(c, t, 0.9, 0.7 * s, 62, 28)
        break
    }
    voices++
    if (end) end.onended = () => void voices--
    else voices--
  } catch {
    /* audio must never break the game */
  }
}
