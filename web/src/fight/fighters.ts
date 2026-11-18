// Stickman fighters: kinematic platformer controller, hand-rolled combat, procedural poses, verlet ragdoll on KO.
import Matter from 'matter-js'
import type { World } from './world'
import { sfx } from './sound'
import * as ladder from './ladder'

export type FighterState = { kind: 'player' | 'enemy'; x: number; y: number; hp: number; ko: boolean; grounded: boolean; action: string }

export type Fighters = {
  add(kind: 'player' | 'enemy'): void
  /** dt in seconds; keys holds KeyboardEvent.code values currently held. */
  update(dt: number, keys: ReadonlySet<string>): void
  draw(ctx: CanvasRenderingContext2D): void
  state(): FighterState[]
  /** Game speed multiplier the shell applies to physics and fighters (1 normal, <1 slow-mo on the final KO). */
  timeScale?(): number
  destroy(): void
}

const GRAV = 2300
const RUN = 330
const JUMP = 930
const SC = 1.35 // figure scale vs the original 56px
const MAX_FALL = 1500
const HURT_W = 11
const HURT_H = 73

type Pt = { x: number; y: number }
type J = { head: Pt; neck: Pt; hip: Pt; elF: Pt; hdF: Pt; elB: Pt; hdB: Pt; knF: Pt; ftF: Pt; knB: Pt; ftB: Pt }
const JK = ['head', 'neck', 'hip', 'elF', 'hdF', 'elB', 'hdB', 'knF', 'ftF', 'knB', 'ftB'] as const
type Pair = [number, number]
/** hip: lift of the hips above standing height, figure px (uppercut hop, run bob); knees bending lowers them by itself. */
type Pose = { lean: number; aF: Pair; aB: Pair; lF: Pair; lB: Pair; hip: number }
type Plat = { l: number; r: number; t: number }

type Btn = 'punch' | 'kick'
type Name = 'jab' | 'cross' | 'uppercut' | 'slam' | 'kick' | 'roundhouse' | 'sweep' | 'lungekick'
type Move = {
  dur: number; hit: Pair; cancel: number // seconds from move start: active window; a buffered press may chain from `cancel`
  box: { reach: number; y0: number; y1: number }
  dmg: number; kb: number; pop: number; stun: number; lunge: number; shove: number; lift: number
  react: 'flinch' | 'launch' | 'knockdown'; sfx: Btn
  next?: Partial<Record<Btn, Name>>
  grab?: number // a throw: the hit binds the victim to the front hand until this time, then it lands on the floor
  keys: [number, Pose][] // pose keyframes (time, pose), smoothstepped between neighbours; the joint springs chase them
}

/** A pose as a flat vector, so springs and blends treat every angle alike. */
const vec = (p: Pose) => [p.lean, ...p.aF, ...p.aB, ...p.lF, ...p.lB, p.hip]
const pose = (a: number[]): Pose => ({ lean: a[0], aF: [a[1], a[2]], aB: [a[3], a[4]], lF: [a[5], a[6]], lB: [a[7], a[8]], hip: a[9] })
const lerp = (a: number, b: number, u: number) => a + (b - a) * u
/** u > 1 extrapolates past b: a keyframe's follow-through. */
function mix(a: Pose, b: Pose, u: number): Pose {
  const bv = vec(b)
  return pose(vec(a).map((x, i) => lerp(x, bv[i], u)))
}

const GUARD: Pose = { lean: 0.08, aF: [0.6, 2.2], aB: [0.2, 1.7], lF: [0.35, 0.15], lB: [-0.35, -0.15], hip: 0 }
const LIE: Pose = { lean: -1.25, aF: [-1.4, -1.2], aB: [-1, -1.5], lF: [1.4, 1.5], lB: [1.3, 1.45], hip: 0 }
const GETUP: [number, Pose][] = [[0, GUARD], [0.3, LIE]] // sampled by seconds left on the floor
const DOWN = 0.8
/** Keyframe at t: GUARD overridden by p, pushed s times as far from GUARD (s > 1 overshoots). */
const K = (t: number, p: Partial<Pose> = {}, s = 1): [number, Pose] => [t, mix(GUARD, { ...GUARD, ...p }, s)]
const PUNCH_LEGS: Partial<Pose> = { lF: [0.6, 0.3], lB: [-0.6, -0.3] } // front foot steps in
const KICK_ARMS: Partial<Pose> = { aF: [-1, -0.6], aB: [-2, -1.4], lB: [-0.12, -0.05] }
const DIP: Pair = [0.5, -0.45] // support knee bent: hips sink before a kick
const UP: Partial<Pose> = { lean: -0.1, aF: [2.7, 2.9], lF: [0.4, 0.1], lB: [-0.4, -0.1], hip: 6 }
const LUNGE: Partial<Pose> = { ...KICK_ARMS, lean: -0.3, lF: [1.5, 1.55] }
const JAB: Partial<Pose> = { ...PUNCH_LEGS, lean: 0.35, aF: [1.5, 1.5] }
const CROSS: Partial<Pose> = { ...PUNCH_LEGS, lean: 0.4, aB: [1.5, 1.5] }
const HIGH: Partial<Pose> = { ...KICK_ARMS, lean: -0.5, lF: [1.75, 1.7] }
const SWEEP: Partial<Pose> = { ...KICK_ARMS, lean: -0.3, lF: [1.25, 1.35], lB: [-1.2, 1] }
const CHAMBER: Partial<Pose> = { ...KICK_ARMS, lean: 0.12, lF: [1.2, 0.1], lB: DIP } // wind-up leans the other way
const GRAB: Partial<Pose> = { ...PUNCH_LEGS, lean: 0.3, aF: [1.45, 1.3], aB: [1.2, 1.2] }
const LIFT: Partial<Pose> = { lean: -0.3, aF: [3.05, 3.1], aB: [2.9, 3], hip: 2 }
const SLAM: Partial<Pose> = { lean: 0.8, aF: [0.5, 0.2], aB: [0.4, 0.2], lF: [0.9, 0.2], lB: [-0.9, -0.4] }

// Angles are radians from straight down, positive toward facing. Each strike: wind-up the other way, overshoot, settle.
// Combos: J>J>J (every 3rd is a slam), J>K, K>K>K, down+K.
const MOVES: Record<Name, Move> = {
  jab: {
    dur: 0.32, hit: [0.09, 0.16], cancel: 0.16, box: { reach: 51, y0: 62, y1: 40 },
    dmg: 6, kb: 110, pop: 120, stun: 0.45, lunge: 150, shove: 7, lift: 3, react: 'flinch', sfx: 'punch',
    next: { punch: 'cross', kick: 'lungekick' },
    keys: [K(0), K(0.06, { lean: -0.1, aF: [-0.8, 2.34] }), K(0.1, JAB, 1.15), K(0.16, JAB), K(0.32)],
  },
  cross: {
    dur: 0.4, hit: [0.11, 0.19], cancel: 0.22, box: { reach: 58, y0: 62, y1: 40 },
    dmg: 9, kb: 130, pop: 140, stun: 0.5, lunge: 170, shove: 8, lift: 3, react: 'flinch', sfx: 'punch',
    next: { punch: 'uppercut', kick: 'lungekick' },
    keys: [K(0), K(0.08, { lean: -0.18, aF: [0.9, 2.4], aB: [-0.9, 2.34] }), K(0.12, CROSS, 1.15), K(0.19, CROSS), K(0.4)],
  },
  uppercut: {
    dur: 0.5, hit: [0.13, 0.28], cancel: 0.5, box: { reach: 56, y0: 82, y1: 30 },
    dmg: 12, kb: 120, pop: 950, stun: 0.5, lunge: 260, shove: 5, lift: 10, react: 'launch', sfx: 'punch',
    keys: [K(0), K(0.09, { lean: 0.35, aF: [-0.3, 0.5], lF: [0.9, 0.3], lB: [-0.8, 0.5] }), K(0.13, UP, 1.1), K(0.28, UP), K(0.5)],
  },
  slam: {
    dur: 0.95, hit: [0.07, 0.18], cancel: 0.95, box: { reach: 56, y0: 70, y1: 20 }, grab: 0.64,
    dmg: 20, kb: 60, pop: 420, stun: 0.3, lunge: 240, shove: 6, lift: 4, react: 'knockdown', sfx: 'punch',
    keys: [K(0), K(0.08, GRAB), K(0.16, GRAB), K(0.4, LIFT), K(0.52, { ...LIFT, lean: -0.4 }), K(0.62, SLAM, 1.1), K(0.75, SLAM), K(0.95)],
  },
  kick: {
    dur: 0.46, hit: [0.14, 0.22], cancel: 0.26, box: { reach: 70, y0: 49, y1: 11 },
    dmg: 12, kb: 140, pop: 160, stun: 0.5, lunge: 200, shove: 13, lift: 7, react: 'flinch', sfx: 'kick',
    next: { kick: 'roundhouse' },
    keys: [K(0), K(0.11, CHAMBER), K(0.15, LUNGE, 1.12), K(0.22, LUNGE), K(0.46)],
  },
  roundhouse: {
    dur: 0.55, hit: [0.17, 0.28], cancel: 0.3, box: { reach: 72, y0: 74, y1: 40 },
    dmg: 14, kb: 180, pop: 220, stun: 0.55, lunge: 220, shove: 16, lift: 6, react: 'flinch', sfx: 'kick',
    next: { kick: 'sweep' },
    keys: [K(0), K(0.13, { ...CHAMBER, lean: 0.25, lF: [1.3, 0.2] }), K(0.19, HIGH, 1.1), K(0.28, HIGH), K(0.55)],
  },
  sweep: {
    dur: 0.55, hit: [0.17, 0.3], cancel: 0.55, box: { reach: 62, y0: 16, y1: 0 },
    dmg: 10, kb: 450, pop: 250, stun: 0.3, lunge: 120, shove: 10, lift: 2, react: 'knockdown', sfx: 'kick',
    keys: [K(0), K(0.14, { ...KICK_ARMS, lean: 0.15, lF: [1.2, 0.2], lB: [-1, 0.8] }), K(0.2, SWEEP, 1.1), K(0.3, SWEEP), K(0.55)],
  },
  lungekick: {
    dur: 0.6, hit: [0.14, 0.3], cancel: 0.6, box: { reach: 95, y0: 58, y1: 20 },
    dmg: 16, kb: 750, pop: 560, stun: 0.5, lunge: 560, shove: 16, lift: 7, react: 'knockdown', sfx: 'kick',
    keys: [K(0), K(0.11, CHAMBER), K(0.16, LUNGE, 1.15), K(0.3, LUNGE), K(0.6)],
  },
}

/** Where a hit lands on the victim: picks the hurt pose and the spring kick. */
type Zone = 'high' | 'body' | 'low' | 'held'
const HURT: Record<Zone, Pose> = {
  high: { lean: -0.5, aF: [2.4, 2.9], aB: [-2.2, -2.7], lF: [0.5, 0.9], lB: [-0.7, -0.5], hip: 0 }, // head snaps back
  body: { lean: 0.6, aF: [0.9, 0.3], aB: [0.6, 0.2], lF: [0.3, -0.1], lB: [-0.6, -0.3], hip: 0 }, // folds over
  low: { lean: -0.35, aF: [2, 2.6], aB: [-1.8, -2.4], lF: [1.3, 1.4], lB: [1, 1.2], hip: 0 }, // legs go first
  held: LIE,
}
/** Joint velocity kick (rad/s per 10 damage) in vec order: lean, aF, aB, lF, lB, hip. */
const JOLT: Record<Zone, number[]> = {
  high: [-14, 6, 9, -6, -9, 2, 3, -2, -3, 0],
  body: [12, -6, -8, -5, -8, 0, -3, 0, 3, 0],
  low: [-5, 4, 6, -4, -6, 16, 18, 20, 18, 0],
  held: [-6, 8, 8, 8, 8, 10, 12, 10, 12, 0],
}
/** Joint spring [natural frequency rad/s, damping ratio] per action: stiff to strike and run, loose to recover and reel. */
const TONE: Record<string, Pair> = {
  strike: [42, 0.6], recover: [20, 0.6], run: [55, 0.9], idle: [18, 0.7], jump: [16, 0.6], fall: [16, 0.6],
  hit: [24, 0.3], held: [18, 0.4], down: [14, 0.8], throw: [40, 0.6], carry: [20, 0.7],
}
const ROOT: Record<Btn, Name> = { punch: 'jab', kick: 'kick' }
/** What an enemy that commits to a string presses after its opening button; each is a valid chain from that opener. */
const TAILS: Record<Btn, Btn[][]> = { punch: [['punch'], ['kick'], ['punch', 'punch']], kick: [['kick'], ['kick', 'kick']] }

type Input = { dir: number; jump: boolean; jumpHeld: boolean; down: boolean; punch: boolean; kick: boolean; grab: boolean; up: boolean }

/** A thrown word in flight: hurts the other side until it slows down or lands. */
type Proj = { b: Matter.Body; owner: Fighter; t: number; hit: Set<Fighter>; pvx: number; pvy: number; pspd: number }

type Ragdoll = { p: Pt[]; q: Pt[]; rest: [number, number, number][]; acc: number; bd: boolean[] }

type Fighter = {
  kind: 'player' | 'enemy'
  x: number; y: number; vx: number; vy: number
  face: 1 | -1
  hp: number; ko: boolean; koT: number
  grounded: boolean; onLedge: boolean
  coyote: number; jumpBuf: number; dropT: number
  stun: number; flash: number; inv: number
  gy: number; combo: number; comboT: number
  bp: number; bk: number
  atk: { name: Name; t: number; hit: boolean; shoved: boolean; vic: Fighter | null } | null
  q: number[]; w: number[]; hurt: Zone; n3: number // sprung pose vector and its velocity; last hit's zone; J J J count
  down: number; fall: boolean; plan: Btn[] // seconds left on the floor; launched/knocked down and not yet landed; AI's queued presses
  phase: number; t: number
  rag: Ragdoll | null
  // enemy ai
  cd: number; retreat: number; jumpCd: number; runMul: number; wander: number; wanderT: number
  side: 1 | -1; standoff: number; goal: Plat | null; goalT: number; perch: number; hop: number
  carry: Matter.Body | null; carryT: number; throwT: number; grabCd: number
  grip: { o: Fighter; t: number } | null // a fighter held overhead
  fly: { by: Fighter; hit: Set<Fighter>; pvx: number } | null // thrown: a body in flight that hurts its own side
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const approach = (v: number, target: number, step: number) => (v < target ? Math.min(v + step, target) : Math.max(v - step, target))

function sample(keys: [number, Pose][], t: number): Pose {
  let i = 1
  while (i < keys.length - 1 && t > keys[i][0]) i++
  const [t0, a] = keys[i - 1]
  const [t1, b] = keys[i]
  const u = clamp((t - t0) / (t1 - t0), 0, 1)
  return mix(a, b, u * u * (3 - 2 * u))
}

function poseOf(f: Fighter): Pose {
  const p = basePose(f)
  if (f.stun > 0) return p
  if (f.throwT > 0) return { ...p, lean: 0.3, aF: [1.7, 1.6], aB: [1.3, 1.45] }
  if ((f.carry || f.grip) && !f.atk) return { ...p, aF: [2.75, 3.05], aB: [2.55, 2.95] } // both hands up, holding the word overhead
  return p
}

function basePose(f: Fighter): Pose {
  const ph = f.phase
  const s = Math.sin(ph)
  const c = Math.cos(ph)

  if (f.stun > 0) return HURT[f.hurt]
  if (f.down > 0) return sample(GETUP, f.down)
  if (f.atk) return sample(MOVES[f.atk.name].keys, f.atk.t)
  if (!f.grounded) {
    if (f.vy < 0) return { lean: 0.12, aF: [2.3, 2.7], aB: [-2.2, -2.6], lF: [0.8, -0.3], lB: [-0.3, -0.9], hip: 0 }
    return { lean: 0.04, aF: [2.6, 2.9], aB: [-2.5, -2.8], lF: [0.35, 0.2], lB: [-0.45, -0.2], hip: 0 }
  }
  if (Math.abs(f.vx) > 60) {
    return {
      lean: 0.22,
      aF: [-s * 0.9, -s * 0.9 + 1.3],
      aB: [s * 0.9, s * 0.9 + 1.3],
      lF: [s * 0.95, s * 0.95 - 0.7 * Math.max(0, c)],
      lB: [-s * 0.95, -s * 0.95 - 0.7 * Math.max(0, -c)],
      hip: 2 * c * c, // bob: up at each passing stride
    }
  }
  const br = Math.sin(f.t * 3.2)
  return {
    ...GUARD,
    lean: GUARD.lean + br * 0.03,
    aF: [GUARD.aF[0] + br * 0.06, GUARD.aF[1] - br * 0.06],
    aB: [GUARD.aB[0] + br * 0.05, GUARD.aB[1]],
  }
}

function buildJoints(f: Fighter, p: Pose): J {
  const s = f.face
  const seg = (o: Pt, a: number, l: number): Pt => ({ x: o.x + Math.sin(a) * l * s * SC, y: o.y + Math.cos(a) * l * SC })
  const drop = SC * Math.max(12.5 * Math.cos(p.lF[0]) + 12.5 * Math.cos(p.lF[1]), 12.5 * Math.cos(p.lB[0]) + 12.5 * Math.cos(p.lB[1]))
  const hip = { x: f.x, y: f.y - drop - Math.max(0, p.hip) * SC }
  const neck = { x: hip.x + s * Math.sin(p.lean) * 18 * SC, y: hip.y - Math.cos(p.lean) * 18 * SC }
  const head = { x: neck.x + s * Math.sin(p.lean * 1.4) * 7 * SC, y: neck.y - Math.cos(p.lean * 1.4) * 7 * SC }
  const sh = { x: neck.x, y: neck.y + 2 * SC }
  const elF = seg(sh, p.aF[0], 9)
  const elB = seg(sh, p.aB[0], 9)
  const knF = seg(hip, p.lF[0], 12.5)
  const knB = seg(hip, p.lB[0], 12.5)
  return { head, neck, hip, elF, hdF: seg(elF, p.aF[1], 9), elB, hdB: seg(elB, p.aB[1], 9), knF, ftF: seg(knF, p.lF[1], 12.5), knB, ftB: seg(knB, p.lB[1], 12.5) }
}

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y)

function makeRagdoll(j: J, vx: number, vy: number): Ragdoll {
  const p = JK.map((k) => ({ ...j[k] }))
  // launch velocity plus angular spin about the hip: head and feet get opposite sideways kicks so it tumbles
  const om = (vx >= 0 ? 1 : -1) * (5 + Math.random() * 3)
  const q = p.map((pt) => {
    const rx = pt.x - j.hip.x
    const ry = pt.y - j.hip.y
    return { x: pt.x - (vx - om * ry) / 60, y: pt.y - (vy + om * rx) / 60 }
  })
  const I = (k: (typeof JK)[number]) => JK.indexOf(k)
  const pairs: [(typeof JK)[number], (typeof JK)[number]][] = [
    ['head', 'neck'], ['neck', 'hip'], ['head', 'hip'], ['neck', 'elF'], ['elF', 'hdF'], ['neck', 'elB'], ['elB', 'hdB'],
    ['hip', 'knF'], ['knF', 'ftF'], ['hip', 'knB'], ['knB', 'ftB'],
  ]
  const rest = pairs.map(([a, b]) => [I(a), I(b), dist(p[I(a)], p[I(b)])] as [number, number, number])
  return { p, q, rest, acc: 0, bd: p.map(() => false) }
}

function stepRagdoll(r: Ragdoll, dt: number, plats: Plat[], w: number, h: number) {
  r.acc += dt
  let n = 0
  while (r.acc >= 1 / 60 && n++ < 4) {
    r.acc -= 1 / 60
    const g = (GRAV * 0.8) / 3600
    for (let i = 0; i < r.p.length; i++) {
      const p = r.p[i]
      const q = r.q[i]
      const vx = (p.x - q.x) * 0.992
      const vy = (p.y - q.y) * 0.992
      q.x = p.x
      q.y = p.y
      p.x += vx
      p.y += vy + g
    }
    for (let it = 0; it < 8; it++) {
      for (const [a, b, len] of r.rest) {
        const pa = r.p[a]
        const pb = r.p[b]
        const dx = pb.x - pa.x
        const dy = pb.y - pa.y
        const d = Math.hypot(dx, dy) || 1e-6
        const k = ((d - len) / d) * 0.5
        pa.x += dx * k; pa.y += dy * k
        pb.x -= dx * k; pb.y -= dy * k
      }
      for (let i = 0; i < r.p.length; i++) {
        const p = r.p[i]
        const q = r.q[i]
        p.x = clamp(p.x, 4, w - 4)
        let hit = false
        const vin = p.y - q.y
        if (p.y > h) { p.y = h; hit = true }
        else {
          for (const pl of plats) {
            if (p.x >= pl.l && p.x <= pl.r && q.y <= pl.t + 2 && p.y > pl.t) { p.y = pl.t; hit = true; break }
          }
        }
        if (hit) {
          q.x = p.x - (p.x - q.x) * 0.55
          // one real bounce per joint, then it settles
          if (!r.bd[i] && vin > 3) { r.bd[i] = true; q.y = p.y + vin * 0.5 }
        }
      }
    }
  }
}

export function createFighters(world: World, engine: Matter.Engine): Fighters {
  void engine
  const list: Fighter[] = []
  const sparks: { x: number; y: number; t: number; k: number }[] = []
  let freeze = 0
  let shake = 0
  let atkGate = 0
  let prevKeys = new Set<string>()
  const pressed = new Set<string>()
  let plats: Plat[] = []
  const projectiles: Proj[] = []
  const bursts: { x: number; y: number; born: number }[] = []
  let slowAt = 0 // performance.now() of the final KO, 0 when not in slow-mo
  let respawnAt = 0
  let wave = 1

  const rnd = (a: number, b: number) => a + Math.random() * (b - a)
  /** Enemies are a bit quieter than the player. */
  const snd = (f: Fighter, name: Parameters<typeof sfx>[0], k = 1) => sfx(name, k * (f.kind === 'enemy' ? 0.7 : 1))

  function spawn(f: Fighter, avoid?: number) {
    let x = rnd(60, world.width - 60)
    for (let i = 0; i < 6 && avoid !== undefined && Math.abs(x - avoid) < 200; i++) x = rnd(60, world.width - 60)
    f.x = x; f.y = -70; f.vx = 0; f.vy = 0; f.grounded = false
  }

  function add(kind: 'player' | 'enemy') {
    const f: Fighter = {
      kind, x: 0, y: 0, vx: 0, vy: 0, face: Math.random() < 0.5 ? 1 : -1, hp: 100, ko: false, koT: 0,
      grounded: false, onLedge: false, coyote: 0, jumpBuf: 0, dropT: 0, stun: 0, flash: 0, inv: 0, gy: world.height, combo: 0, comboT: 0, bp: 0, bk: 0,
      atk: null, q: vec(GUARD), w: vec(GUARD).map(() => 0), hurt: 'high', n3: 0, down: 0, fall: false, plan: [], phase: 0, t: Math.random() * 10, rag: null,
      cd: rnd(0.8, 1.6), retreat: 0, jumpCd: 0, runMul: rnd(0.6, 0.82), wander: 0, wanderT: 0,
      side: Math.random() < 0.5 ? 1 : -1, standoff: rnd(50, 72), goal: null, goalT: 0, perch: 0, hop: rnd(1.5, 3.5),
      carry: null, carryT: 0, throwT: 0, grabCd: rnd(3, 7), grip: null, fly: null,
    }
    const pl = list.find((o) => o.kind === 'player')
    spawn(f, kind === 'enemy' ? pl?.x : undefined)
    list.push(f)
  }

  function startMove(f: Fighter, name: Name) {
    if (name === 'uppercut' && ++f.n3 % 3 === 0) name = 'slam' // every third J J J ends in a slam
    const m = MOVES[name]
    f.atk = { name, t: 0, hit: false, shoved: false, vic: null }
    f.bp = f.bk = 0
    snd(f, 'whoosh', m.sfx === 'kick' ? 1 : 0.7)
    if (f.grounded) f.vx = f.face * m.lunge
  }

  /** Let go of a carried word (hit, KO, exit): collisions come back and it drops. */
  function dropCarry(f: Fighter) {
    if (f.grip) { const o = f.grip.o; f.grip = null; o.vx = f.vx; o.vy = -200; o.stun = 0.4 } // a held fighter slips free
    const b = f.carry
    if (!b) return
    f.carry = null
    b.isSensor = false
    Matter.Sleeping.set(b, false)
    Matter.Body.setVelocity(b, { x: f.vx / 60, y: -3 })
    Matter.Body.setAngularVelocity(b, f.face * 0.2)
  }

  function koFighter(f: Fighter) {
    dropCarry(f)
    f.ko = true
    f.koT = 0
    f.atk = null
    f.rag = makeRagdoll(jointsOf(f), f.vx, f.vy)
    snd(f, 'ko')
    if (f.kind === 'enemy') ladder.kill(f.x, f.y - 40, world)
    if (f.kind === 'enemy' && !list.some((o) => o !== f && o.kind === 'enemy' && !o.ko)) {
      // last enemy down: slow-mo, heavy hitstop, big shake, red burst
      slowAt = performance.now()
      respawnAt = slowAt + 2500
      freeze = 0.08 // sim seconds; ~0.3s real at the slow-mo scale
      shake = Math.max(shake, 20)
      bursts.push({ x: f.x, y: f.y - 40, born: slowAt })
      sfx('boom', 1)
    }
  }

  function tryGrab(f: Fighter): boolean {
    if (f.carry || f.grip || f.ko || f.stun > 0 || f.atk) return false
    // an opponent right in front beats any word
    const v = list.find((o) => o.kind !== f.kind && !o.ko && o.inv <= 0 && !o.fly && !heldBy(o) && (o.x - f.x) * f.face > -4 && Math.abs(o.x - f.x) < 46 && Math.abs(o.y - f.y) < 40)
    if (v) {
      dropCarry(v)
      v.atk = null
      v.hurt = 'held'
      v.stun = 2
      v.fall = true
      v.vx = v.vy = 0
      v.face = (f.face * -1) as 1 | -1
      f.grip = { o: v, t: 0 }
      f.grabCd = rnd(8, 14)
      snd(f, 'grab')
      return true
    }
    const pts = [{ x: f.x, y: f.y - 6 }, { x: f.x + f.face * 20, y: f.y - 40 }]
    let best: Matter.Body | null = null
    let bd = 60
    for (const b of world.debris) {
      if (b.isStatic || b.bounds.max.x - b.bounds.min.x > 220) continue
      if (list.some((o) => o.carry === b) || projectiles.some((p) => p.b === b)) continue
      for (const pt of pts) {
        const d = Math.hypot(Math.max(b.bounds.min.x - pt.x, 0, pt.x - b.bounds.max.x), Math.max(b.bounds.min.y - pt.y, 0, pt.y - b.bounds.max.y))
        if (d < bd) { bd = d; best = b }
      }
    }
    if (!best) return false
    best.isSensor = true // no collisions while held
    Matter.Sleeping.set(best, false)
    f.carry = best
    f.carryT = 0
    f.grabCd = rnd(8, 14)
    snd(f, 'grab')
    return true
  }

  function holdCarry(f: Fighter) {
    const b = f.carry!
    const j = jointsOf(f)
    Matter.Body.setAngle(b, 0)
    const h = b.bounds.max.y - b.bounds.min.y
    Matter.Body.setPosition(b, { x: (j.hdF.x + j.hdB.x) / 2, y: Math.min(j.hdF.y, j.hdB.y) - h / 2 + 2 })
    Matter.Body.setVelocity(b, { x: 0, y: 0 })
    Matter.Body.setAngularVelocity(b, 0)
  }

  function throwWord(f: Fighter, up: boolean) {
    const b = f.carry!
    f.carry = null
    b.isSensor = false
    Matter.Body.setPosition(b, { x: f.x + f.face * 18, y: f.y - 62 })
    const v = { x: f.face * (1050 / 60) + (f.vx / 60) * 0.4, y: up ? -11 : -3.2 }
    Matter.Sleeping.set(b, false)
    Matter.Body.setVelocity(b, v)
    Matter.Body.setAngularVelocity(b, f.face * 0.45)
    projectiles.push({ b, owner: f, t: 0, hit: new Set(), pvx: v.x, pvy: v.y, pspd: Math.hypot(v.x, v.y) * 60 })
    f.throwT = 0.22
    snd(f, 'throw')
  }

  /** Hold the victim overhead; let go in a throw after 1.5s. */
  function holdGrip(f: Fighter, dt: number) {
    const g = f.grip!
    if (g.o.ko) { f.grip = null; return }
    g.t += dt
    const j = jointsOf(f)
    g.o.x = clamp((j.hdF.x + j.hdB.x) / 2, 8, world.width - 8)
    g.o.y = Math.min(j.hdF.y, j.hdB.y) + 4
  }

  function throwGrip(f: Fighter, up: boolean) {
    const o = f.grip!.o
    f.grip = null
    o.x = clamp(f.x + f.face * 18, 8, world.width - 8)
    o.y = f.y - 50
    o.vx = f.face * 820 + f.vx * 0.4
    o.vy = up ? -820 : -320
    o.hurt = 'high'
    o.stun = 0.5
    o.fall = true
    o.grounded = false
    o.fly = { by: f, hit: new Set(), pvx: o.vx }
    f.throwT = 0.22
    snd(f, 'throw')
  }

  /** A thrown fighter hurts the others on its own side in flight, and itself on a wall or the floor. */
  function updateFlights() {
    for (const o of list) {
      const fl = o.fly
      if (!fl) continue
      const k = fl.by.kind === 'enemy' ? 0.75 : 1
      const hurt = (t: Fighter, dmg: number) => {
        t.hp = Math.max(0, t.hp - dmg * k)
        t.flash = 0.12
        freeze = t.hp <= 0 ? 0.16 : 0.08
        sparks.push({ x: t.x, y: t.y - 40, t: 0.18, k: 1.6 })
        snd(t, 'hit', 0.9)
        if (t.hp <= 0) koFighter(t)
      }
      if (o.ko || heldBy(o)) { o.fly = null; continue }
      if (!o.fall) { // landed
        o.fly = null
        hurt(o, 12)
        shake = Math.max(shake, 8)
        sfx('boom', 0.7)
        continue
      }
      if (Math.abs(fl.pvx) > 350 && o.vx * fl.pvx < 0) { // bounced off a wall
        const before = world.debris.length
        world.knock({ x: o.x - 30, y: o.y - 70, w: 60, h: 70 }, fl.pvx * 0.8, -100)
        if (world.debris.length > before) sfx('knock', 1)
        hurt(o, 10)
        shake = Math.max(shake, 8)
        sfx('boom', 0.8)
      }
      fl.pvx = o.vx
      if (Math.abs(o.vx) < 150) continue
      for (const t of list) {
        if (t === o || t.kind !== o.kind || t.ko || t.inv > 0 || fl.hit.has(t)) continue
        if (Math.abs(t.x - o.x) > HURT_W * 2 || o.y < t.y - HURT_H || o.y - HURT_H > t.y) continue
        fl.hit.add(t)
        const dir = o.vx >= 0 ? 1 : -1
        t.combo = t.comboT > 0 ? t.combo + 1 : 1
        t.comboT = 1
        t.atk = null
        dropCarry(t)
        t.hurt = 'high'
        jolt(t, 14)
        t.stun = 0.5
        t.fall = true
        t.face = (dir * -1) as 1 | -1
        t.vx = dir * 450
        t.vy = -480
        t.grounded = false
        t.coyote = 0
        t.dropT = 0
        o.vx *= 0.6
        shake = Math.max(shake, 8)
        sfx('knock', 0.9)
        hurt(t, 14)
        if (t.hp <= 0) { t.vx = dir * 600; t.vy = -800 }
      }
    }
  }

  function updateProjectiles(dt: number) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i]
      const b = p.b
      p.t += dt
      const spd = Math.hypot(b.velocity.x, b.velocity.y) * 60
      // a sudden stop at speed means it smashed into something: knock bricks loose
      if (p.pspd > 650 && spd < p.pspd * 0.55) {
        const before = world.debris.length
        world.knock({ x: b.bounds.min.x - 6, y: b.bounds.min.y - 6, w: b.bounds.max.x - b.bounds.min.x + 12, h: b.bounds.max.y - b.bounds.min.y + 12 }, p.pvx * 60 * 0.8, p.pvy * 60 * 0.8 - 100)
        if (world.debris.length > before) { snd(p.owner, 'knock', 1); shake = Math.max(shake, 4) }
      }
      p.pvx = b.velocity.x
      p.pvy = b.velocity.y
      p.pspd = spd
      if (p.t > 2 || spd < 300 || list.some((o) => o.carry === b)) { projectiles.splice(i, 1); continue }
      const w = b.bounds.max.x - b.bounds.min.x
      for (const o of list) {
        if (o.kind === p.owner.kind || o.ko || o.inv > 0 || p.hit.has(o)) continue
        if (b.bounds.max.x < o.x - HURT_W || b.bounds.min.x > o.x + HURT_W || b.bounds.max.y < o.y - HURT_H || b.bounds.min.y > o.y) continue
        p.hit.add(o)
        const dir = b.velocity.x >= 0 ? 1 : -1
        const dmg = clamp(6 + spd / 250 + w / 30, 10, 14) * (p.owner.kind === 'enemy' ? 0.75 : 1)
        o.combo = o.comboT > 0 ? o.combo + 1 : 1
        o.comboT = 1.0
        o.hp = Math.max(0, o.hp - dmg)
        o.atk = null
        dropCarry(o)
        o.hurt = 'high'
        jolt(o, dmg)
        o.stun = 0.4
        o.flash = 0.12
        o.face = (dir * -1) as 1 | -1
        o.vx = dir * 450
        o.vy = -520
        o.grounded = false
        o.coyote = 0
        o.dropT = 0
        freeze = o.hp <= 0 ? 0.16 : 0.09
        shake = Math.max(shake, o.hp <= 0 ? 11 : 6)
        sparks.push({ x: o.x, y: o.y - 40, t: 0.18, k: 1.5 })
        sfx('knock', 0.9)
        snd(o, 'hit', 0.9)
        Matter.Body.setVelocity(b, { x: -dir * 2, y: -3 }) // the word drops off the body
        Matter.Body.setAngularVelocity(b, -dir * 0.3)
        if (o.hp <= 0) { o.vx = dir * 600 * 1.6; o.vy = -900; koFighter(o) }
      }
    }
  }

  function shoveDebris(f: Fighter, hb: { x0: number; x1: number; y0: number; y1: number }, d: Move) {
    for (const b of world.debris) {
      if (b.isStatic || b.isSensor) continue
      const m = 8
      if (b.bounds.max.x < hb.x0 - m || b.bounds.min.x > hb.x1 + m || b.bounds.max.y < hb.y0 - m || b.bounds.min.y > hb.y1 + m) continue
      Matter.Sleeping.set(b, false)
      Matter.Body.setVelocity(b, { x: b.velocity.x + f.face * d.shove, y: b.velocity.y - d.lift })
      Matter.Body.setAngularVelocity(b, b.angularVelocity + f.face * 0.12 * (Math.random() + 0.5))
    }
  }

  function processAttack(f: Fighter, dt: number) {
    const a = f.atk!
    const m = MOVES[a.name]
    a.t += dt
    if (a.vic) {
      // throw: the victim's root rides the front hand, then lands on the floor at our feet
      const o = a.vic
      const h = jointsOf(f).hdF
      o.x = clamp(h.x, 8, world.width - 8)
      o.y = h.y
      if (a.t < m.grab!) return
      a.vic = null
      o.y = f.y
      strike(f, o, m, 'held', { x: o.x, y: f.y - 6 })
      sfx('boom', 0.6)
    }
    if (a.t >= m.dur || (m.grab && a.t >= m.hit[1] && !a.hit)) { f.atk = null; return } // a missed grab lets go early
    if (a.t < m.hit[0] || a.t >= m.hit[1]) return
    const x0 = f.face > 0 ? f.x + 2 : f.x - 2 - m.box.reach
    const hb = { x0, x1: x0 + m.box.reach, y0: f.y - m.box.y0, y1: f.y - m.box.y1 }
    const kk = m.sfx === 'kick'
    if (!a.shoved) {
      a.shoved = true
      shoveDebris(f, hb, m)
      // knock word bricks loose, at most once per attack
      const before = world.debris.length
      world.knock({ x: hb.x0, y: hb.y0, w: hb.x1 - hb.x0, h: hb.y1 - hb.y0 }, f.face * (kk ? 420 : 260), kk ? -380 : -150)
      if (world.debris.length > before) snd(f, 'knock', kk ? 1 : 0.7)
    }
    if (a.hit) return
    for (const o of list) {
      if (o === f || o.kind === f.kind || o.ko || o.inv > 0) continue
      if (hb.x1 < o.x - HURT_W || hb.x0 > o.x + HURT_W || hb.y1 < o.y - HURT_H || hb.y0 > o.y) continue
      a.hit = true
      if (m.grab) {
        a.vic = o
        o.atk = null
        dropCarry(o)
        o.hurt = 'held'
        o.stun = m.stun
        o.fall = true
        o.face = (f.face * -1) as 1 | -1
        o.vx = o.vy = 0
        snd(f, 'grab')
        break
      }
      const y = (Math.max(hb.y0, o.y - HURT_H) + Math.min(hb.y1, o.y)) / 2 // middle of the overlap
      strike(f, o, m, o.y - y > 48 ? 'high' : o.y - y < 22 ? 'low' : 'body', { x: clamp(o.x, hb.x0, hb.x1), y })
      break
    }
  }

  /** Kick the victim's joint springs, scaled by damage: the body reacts to where it was hit. */
  function jolt(o: Fighter, dmg: number) {
    JOLT[o.hurt].forEach((v, i) => (o.w[i] += (v * dmg) / 10))
  }

  /** f lands move m on o at point `at` in zone z: damage, reaction, hitstop, shake, spark. */
  function strike(f: Fighter, o: Fighter, m: Move, z: Zone, at: Pt) {
    o.combo = o.comboT > 0 ? o.combo + 1 : 1
    o.comboT = 1.0
    const react = o.combo >= 5 ? 'knockdown' : m.react // no endless juggles
    o.hp = Math.max(0, o.hp - m.dmg * (f.kind === 'enemy' ? 0.75 : 1))
    const ko = o.hp <= 0
    const big = ko || react !== 'flinch'
    const heavy = m.grab ? 1.8 : 1
    o.atk = null
    dropCarry(o)
    o.hurt = z
    jolt(o, m.dmg)
    o.stun = m.stun
    o.fall = o.fall || react !== 'flinch'
    o.flash = 0.12
    o.face = (f.face * -1) as 1 | -1
    o.vx = f.face * m.kb
    o.vy = -m.pop
    o.grounded = false
    o.coyote = 0
    o.dropT = 0
    freeze = (ko ? 0.16 : big ? 0.12 : 0.03 + m.dmg / 300) * heavy
    shake = Math.max(shake, (ko ? 11 : big ? 9 : m.dmg / 3) * heavy)
    sparks.push({ x: at.x, y: at.y, t: 0.18, k: (big ? 1.8 : 1 + m.dmg / 30) * heavy })
    snd(f, m.sfx, big ? 1 : m.sfx === 'kick' ? 0.8 : 0.6)
    snd(o, 'hit', big ? 1 : 0.6)
    if (ko) { o.vx = f.face * m.kb * 1.8; o.vy = -(m.pop * 1.3 + 100); koFighter(o) }
  }

  /** Semi-implicit spring-damper on every pose angle toward this frame's target pose: acc = k(target - cur) - c·vel. */
  function spring(f: Fighter, dt: number) {
    const tgt = vec(poseOf(f))
    const a = f.atk && MOVES[f.atk.name]
    const [om, z] = TONE[a ? (f.atk!.t < a.hit[1] ? 'strike' : 'recover') : actionOf(f)]
    const n = Math.ceil(dt * 120)
    const h = dt / n
    for (let s = 0; s < n; s++) {
      for (let i = 0; i < tgt.length; i++) {
        f.w[i] += (om * om * (tgt[i] - f.q[i]) - 2 * z * om * f.w[i]) * h
        f.q[i] += f.w[i] * h
      }
    }
  }

  function step(f: Fighter, dt: number, inp: Input) {
    f.t += dt
    f.flash = Math.max(0, f.flash - dt)
    f.inv = Math.max(0, f.inv - dt)
    f.comboT = Math.max(0, f.comboT - dt)
    f.stun = Math.max(f.fall ? 0.1 : 0, f.stun - dt) // a launched fighter stays hurt until they land
    f.down = Math.max(0, f.down - dt)
    f.coyote = Math.max(0, f.coyote - dt)
    f.jumpBuf = Math.max(0, f.jumpBuf - dt)
    f.dropT = Math.max(0, f.dropT - dt)
    f.bp = Math.max(0, f.bp - dt)
    f.bk = Math.max(0, f.bk - dt)
    if (inp.punch) f.bp = 0.25
    if (inp.kick) f.bk = 0.25
    if (inp.jump) f.jumpBuf = 0.12
    f.throwT = Math.max(0, f.throwT - dt)
    if (f.carry || f.grip) { f.carryT += dt; f.bp = f.bk = 0 } // hands full: no punching or kicking

    const stunned = f.stun > 0 || f.down > 0
    if (!stunned && !f.atk && inp.dir !== 0) f.face = inp.dir > 0 ? 1 : -1
    if (!stunned && (f.bp > 0 || f.bk > 0)) {
      const b: Btn = f.bk > f.bp ? 'kick' : 'punch'
      const m = f.atk && MOVES[f.atk.name]
      const nx = m ? (f.atk!.t >= m.cancel ? m.next?.[b] : undefined) : b === 'kick' && inp.down && f.grounded ? 'sweep' : ROOT[b]
      if (nx) startMove(f, nx)
    }

    const maxv = RUN * (f.kind === 'enemy' ? f.runMul : 1) * (f.atk ? 0.15 : 1)
    const target = stunned ? 0 : inp.dir * maxv
    const acc = stunned ? (f.grounded ? 1400 : 60) : f.atk ? 1500 : f.grounded ? (inp.dir === 0 ? 3600 : 3400) : 1900
    f.vx = approach(f.vx, target, acc * dt)

    if (!stunned && f.jumpBuf > 0 && (f.grounded || f.coyote > 0)) {
      f.vy = -JUMP
      snd(f, 'jump')
      f.grounded = false
      f.coyote = 0
      f.jumpBuf = 0
    } else if (!stunned && !f.atk && inp.down && f.grounded && f.onLedge) {
      f.dropT = 0.18
      f.vy = 140
      f.grounded = false
      f.coyote = 0
    }

    const gm = f.vy < 0 && !inp.jumpHeld && !stunned ? 2.6 : f.vy > 0 ? 1.15 : 1
    const prevY = f.y
    f.vy = Math.min(MAX_FALL, f.vy + GRAV * gm * dt)
    f.x += f.vx * dt
    f.y += f.vy * dt
    const cx = clamp(f.x, 8, world.width - 8)
    if (cx !== f.x && f.fall && Math.abs(f.vx) > 350) {
      f.vx *= -0.5 // wall bounce
      freeze = Math.max(freeze, 0.05)
      shake = Math.max(shake, 6)
      sparks.push({ x: cx, y: f.y - 40, t: 0.18, k: 1.2 })
      snd(f, 'hit', 0.8)
    }
    f.x = cx

    let landed = false
    f.onLedge = false
    if (f.vy >= 0) {
      let best: number | null = null
      if (f.dropT <= 0) {
        for (const p of plats) {
          if (f.x >= p.l - 2 && f.x <= p.r + 2 && prevY <= p.t + 2 && f.y >= p.t && (best === null || p.t < best)) best = p.t
        }
      }
      if (best !== null) { f.y = best; f.onLedge = true; landed = true }
      else if (f.y >= world.height) { f.y = world.height; landed = true }
      if (landed) { if (f.vy > 700) snd(f, 'land', clamp((f.vy - 600) / 900, 0.3, 1)); f.vy = 0; f.coyote = 0.1; f.gy = f.y }
    }
    f.grounded = landed
    if (landed && f.fall) { f.fall = false; f.stun = 0; f.down = f.inv = DOWN }

    if (f.atk) processAttack(f, dt)
    if (f.grounded && Math.abs(f.vx) > 60) f.phase += Math.abs(f.vx) * dt * 0.07
  }

  function curPlat(f: Fighter): Plat | null {
    if (!f.grounded || !f.onLedge) return null
    for (const p of plats) if (f.x >= p.l - 2 && f.x <= p.r + 2 && Math.abs(f.y - p.t) < 3) return p
    return null
  }

  /** Reachable ledge (within one jump) closest in height to goalY and near in x. */
  function pickGoal(f: Fighter, goalY: number): Plat | null {
    let best: Plat | null = null
    let bs = Infinity
    for (const p of plats) {
      const rise = f.y - p.t
      if (rise < 28 || rise > 165 || p.r - p.l < 18) continue
      const hx = f.x < p.l ? p.l - f.x : f.x > p.r ? f.x - p.r : 0
      if (hx > 340) continue
      const sc = Math.abs(p.t - goalY) + hx * 0.5 + Math.random() * 12
      if (sc < bs) { bs = sc; best = p }
    }
    return best
  }

  function aiInput(f: Fighter, dt: number): Input {
    const inp: Input = { dir: 0, jump: false, jumpHeld: true, down: false, punch: false, kick: false, grab: false, up: false }
    f.cd -= dt
    f.jumpCd -= dt
    f.perch -= dt
    f.hop -= dt
    f.goalT -= dt
    const t = list.find((o) => o.kind === 'player' && !o.ko)
    if (!t) {
      f.wanderT -= dt
      if (f.wanderT <= 0) { f.wander = [-1, 0, 0, 1][Math.floor(Math.random() * 4)]; f.wanderT = rnd(0.8, 2) }
      inp.dir = f.wander
      return inp
    }
    const dx = t.x - f.x
    const dy = t.y - f.y
    const ad = Math.abs(dx)
    const sgn = dx >= 0 ? 1 : -1
    const free = !f.atk && f.stun <= 0 && f.down <= 0
    if (!f.atk) f.plan.length = 0
    else if (f.plan.length && f.atk.t >= MOVES[f.atk.name].cancel) inp[f.plan.shift()!] = true
    const onFloor = f.y >= world.height - 1
    const lvl = t.gy

    // climb: go up when below the player's level, or now and then hop off the floor onto a ledge
    const wantUp = f.y > lvl + 45 || (onFloor && f.hop <= 0 && ad < 520)
    if (wantUp && free && f.grounded) {
      if (!f.goal || f.goalT <= 0) { f.goal = pickGoal(f, f.y > lvl + 45 ? lvl - 20 : f.y - 95); f.goalT = 0.4 }
      const g = f.goal
      if (g) {
        if (f.x < g.l + 4 || f.x > g.r - 4) inp.dir = f.x < g.l + 4 ? 1 : -1
        else if (f.jumpCd <= 0) { inp.jump = true; f.jumpCd = 0.8 }
        if (f.onLedge && Math.abs(f.y - g.t) < 3) { f.goal = null; f.perch = rnd(1, 2.2); f.hop = rnd(3, 6) }
        if (inp.dir !== 0 || inp.jump) return inp
      }
    }
    if (!wantUp) f.goal = null

    const tx = t.x + f.side * f.standoff
    const gap = tx - f.x
    if (f.retreat > 0) {
      f.retreat -= dt
      inp.dir = -sgn
      if (f.x < 50 || f.x > world.width - 50) f.retreat = 0
    } else if (Math.abs(gap) > 12) {
      inp.dir = gap > 0 ? 1 : -1
    }

    const cur = curPlat(f)
    if (cur && inp.dir !== 0) {
      const edge = inp.dir > 0 ? cur.r - f.x : f.x - cur.l
      if (edge < 12) {
        if (dy > 50 && f.perch <= 0) { /* player is lower: walk off to fight */ }
        else if (Math.abs(dy) < 80 && ad > 70 && f.jumpCd <= 0) { inp.jump = true; f.jumpCd = 0.9 }
        else inp.dir = 0
      }
    }
    if (free && inp.dir === 0) f.face = sgn

    if (free && f.cd <= 0 && atkGate <= 0 && ad < 80 && Math.abs(dy) < 46) {
      f.face = sgn
      const b: Btn = ad > 60 || Math.random() < 0.35 ? 'kick' : 'punch'
      inp[b] = true
      if (Math.random() < 0.35) f.plan = [...TAILS[b][Math.floor(Math.random() * TAILS[b].length)]]
      f.cd = rnd(0.6, 1.3)
      atkGate = 0.3
      f.standoff = rnd(50, 72)
      if (Math.random() < 0.5) f.side = (f.side * -1) as 1 | -1
      f.retreat = Math.random() < 0.5 ? rnd(0.3, 0.65) : 0
      inp.dir = 0
    }
    if (f.grounded && f.jumpCd <= 0 && dy < -50 && ad < 220 && !f.goal) { inp.jump = true; f.jumpCd = rnd(0.5, 1.1) }
    if (f.grounded && f.onLedge && dy > 60 && ad < 110 && f.perch <= 0) inp.down = true
    // now and then pick up a loose word and lob it
    if (f.grip) { f.face = sgn; if (f.grip.t > 0.6) inp.grab = true; return inp }
    if (free && f.grabCd <= 0 && f.cd <= 0 && ad < 40 && Math.abs(dy) < 36 && t.inv <= 0 && Math.random() < 0.03) {
      f.face = sgn; inp.grab = true; f.cd = rnd(1.5, 2.5); atkGate = 0.5
      return inp
    }
    if (f.carry) {
      if ((f.carryT > 0.7 && ad < 520 && Math.abs(dy) < 90) || f.carryT > 6) { f.face = sgn; inp.grab = true }
    } else {
      f.grabCd -= dt
      if (f.grabCd <= 0 && free) { f.grabCd = rnd(1.5, 3); if (ad > 120 && Math.random() < 0.5) inp.grab = true }
    }
    return inp
  }

  function separate(dt: number) {
    const k = Math.min(1, dt * 12)
    for (let i = 0; i < list.length; i++) {
      const a = list[i]
      if (a.ko || a.stun > 0) continue
      for (let j = i + 1; j < list.length; j++) {
        const b = list[j]
        if (b.ko || b.stun > 0 || Math.abs(a.y - b.y) > HURT_H * 0.7) continue
        const ddx = b.x - a.x
        const min = 32
        if (Math.abs(ddx) >= min) continue
        const dir = ddx === 0 ? (j % 2 ? 1 : -1) : ddx > 0 ? 1 : -1
        const push = (min - Math.abs(ddx)) * 0.5 * k
        a.x = clamp(a.x - dir * push, 8, world.width - 8)
        b.x = clamp(b.x + dir * push, 8, world.width - 8)
      }
    }
  }

  function update(dt: number, keys: ReadonlySet<string>) {
    for (const k of keys) if (!prevKeys.has(k)) pressed.add(k)
    prevKeys = new Set(keys)
    const any = (s: ReadonlySet<string>, ...c: string[]) => c.some((k) => s.has(k))
    shake = Math.max(0, shake - dt * 40)
    atkGate -= dt
    if (respawnAt && performance.now() >= respawnAt) {
      respawnAt = 0
      const n = wave
      wave = Math.min(4, wave + 1)
      for (let i = 0; i < n; i++) add('enemy')
    }
    if (freeze > 0) { freeze -= dt; return }

    plats = world.ledges.map((r) => ({ l: r.x, r: r.x + r.w, t: r.y }))
    for (const b of world.debris) if (!b.isSensor) plats.push({ l: b.bounds.min.x, r: b.bounds.max.x, t: b.bounds.min.y })

    const pIn: Input = {
      dir: (any(keys, 'ArrowRight', 'KeyD') ? 1 : 0) - (any(keys, 'ArrowLeft', 'KeyA') ? 1 : 0),
      jump: any(pressed, 'ArrowUp', 'KeyW', 'Space'),
      jumpHeld: any(keys, 'ArrowUp', 'KeyW', 'Space'),
      down: any(keys, 'ArrowDown', 'KeyS'),
      punch: pressed.has('KeyJ'),
      kick: pressed.has('KeyK'),
      grab: pressed.has('KeyL'),
      up: any(keys, 'ArrowUp', 'KeyW'),
    }
    pressed.clear()

    for (const f of list) {
      if (f.ko) {
        f.koT += dt
        f.flash = Math.max(0, f.flash - dt)
        f.t += dt
        stepRagdoll(f.rag!, dt, plats, world.width, world.height)
        const r = f.rag!
        f.x = r.p[2].x
        f.y = Math.max(...r.p.map((p) => p.y))
        f.grounded = r.p.every((p, i) => Math.hypot(p.x - r.q[i].x, p.y - r.q[i].y) < 0.4)
        if (f.kind === 'player' && f.koT > 2) {
          f.ko = false; f.rag = null; f.hp = 100; f.stun = 0; f.fall = false; f.atk = null; f.inv = 1.5
          spawn(f)
        }
        continue
      }
      if (heldBy(f)) { spring(f, dt); continue } // its holder moves it
      const inp = f.kind === 'player' ? { ...pIn } : aiInput(f, dt)
      if (f.carry) {
        if (inp.grab || (f.kind === 'player' && inp.punch)) { throwWord(f, inp.up); inp.punch = false }
      } else if (f.grip) {
        if (inp.grab || f.grip.t > 1.5) throwGrip(f, inp.up)
      } else if (inp.grab) tryGrab(f)
      step(f, dt, inp)
      spring(f, dt)
      if (f.carry) holdCarry(f)
      if (f.grip) holdGrip(f, dt)
    }
    updateFlights()
    updateProjectiles(dt)
    separate(dt)
    for (let i = sparks.length - 1; i >= 0; i--) if ((sparks[i].t -= dt) <= 0) sparks.splice(i, 1)
  }

  const heldBy = (f: Fighter) => list.find((o) => o.atk?.vic === f || o.grip?.o === f)

  function actionOf(f: Fighter) {
    if (f.ko) return 'ko'
    if (heldBy(f)) return 'held'
    if (f.down > 0) return 'down'
    if (f.stun > 0) return 'hit'
    if (f.atk) return f.atk.name
    if (f.throwT > 0) return 'throw'
    if (f.carry) return 'carry'
    if (!f.grounded) return f.vy < 0 ? 'jump' : 'fall'
    return Math.abs(f.vx) > 60 ? 'run' : 'idle'
  }

  function jointsOf(f: Fighter): J {
    if (f.rag) {
      const o = {} as J
      JK.forEach((k, i) => { o[k] = f.rag!.p[i] })
      return o
    }
    return buildJoints(f, pose(f.q))
  }

  function drawFighter(ctx: CanvasRenderingContext2D, f: Fighter) {
    if (f.inv > 0 && f.down <= 0 && Math.floor(f.t * 20) % 2 === 0) return
    const j = jointsOf(f)
    const pal = ladder.palette()
    const base = f.kind === 'player' ? pal.player : pal.enemy
    const col = f.flash > 0 ? pal.spark : base
    ctx.strokeStyle = col
    ctx.fillStyle = col
    ctx.lineWidth = f.flash > 0 ? 5.5 : 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const sh = { x: j.neck.x, y: j.neck.y + 2 * SC }
    ctx.beginPath()
    ctx.moveTo(j.neck.x, j.neck.y); ctx.lineTo(j.hip.x, j.hip.y)
    ctx.moveTo(sh.x, sh.y); ctx.lineTo(j.elF.x, j.elF.y); ctx.lineTo(j.hdF.x, j.hdF.y)
    ctx.moveTo(sh.x, sh.y); ctx.lineTo(j.elB.x, j.elB.y); ctx.lineTo(j.hdB.x, j.hdB.y)
    ctx.moveTo(j.hip.x, j.hip.y); ctx.lineTo(j.knF.x, j.knF.y); ctx.lineTo(j.ftF.x, j.ftF.y)
    ctx.moveTo(j.hip.x, j.hip.y); ctx.lineTo(j.knB.x, j.knB.y); ctx.lineTo(j.ftB.x, j.ftB.y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(j.head.x, j.head.y, 6 * SC, 0, Math.PI * 2)
    if (f.kind === 'player') ctx.fill()
    else ctx.stroke()
    if (!f.ko) {
      const bx = f.x
      const by = j.head.y - 22
      ctx.fillStyle = 'rgba(0,0,0,0.13)'
      ctx.fillRect(bx - 17, by, 34, 4)
      ctx.fillStyle = base
      ctx.fillRect(bx - 17, by, 34 * (f.hp / 100), 4)
    }
  }

  function draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    if (shake > 0.3) ctx.translate((Math.random() - 0.5) * 2 * shake, (Math.random() - 0.5) * 2 * shake)
    for (const f of list) if (f.ko) drawFighter(ctx, f)
    for (const f of list) if (!f.ko && f.kind === 'enemy') drawFighter(ctx, f)
    for (const f of list) if (!f.ko && f.kind === 'player') drawFighter(ctx, f)
    ctx.strokeStyle = ladder.palette().spark
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    for (const s of sparks) {
      const k = 1 - s.t / 0.18
      const m = s.k
      ctx.strokeStyle = ladder.palette().spark
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + 0.4
        ctx.moveTo(s.x + Math.cos(a) * (6 + k * 6) * m, s.y + Math.sin(a) * (6 + k * 6) * m)
        ctx.lineTo(s.x + Math.cos(a) * (13 + k * 16) * m, s.y + Math.sin(a) * (13 + k * 16) * m)
      }
      ctx.stroke()
      ctx.strokeStyle = ladder.palette().enemy
      ctx.lineWidth = 1.8
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + 1.1
        ctx.moveTo(s.x + Math.cos(a) * (10 + k * 10) * m, s.y + Math.sin(a) * (10 + k * 10) * m)
        ctx.lineTo(s.x + Math.cos(a) * (16 + k * 20) * m, s.y + Math.sin(a) * (16 + k * 20) * m)
      }
      ctx.stroke()
    }
    const now = performance.now()
    for (let i = bursts.length - 1; i >= 0; i--) {
      const u = (now - bursts[i].born) / 800
      if (u >= 1) { bursts.splice(i, 1); continue }
      const e = 1 - Math.pow(1 - u, 3)
      const { x, y } = bursts[i]
      ctx.save()
      ctx.globalAlpha = 1 - u
      ctx.strokeStyle = ladder.palette().spark
      ctx.lineCap = 'round'
      ctx.lineWidth = 5 * (1 - u) + 1
      ctx.beginPath()
      for (let k = 0; k < 24; k++) {
        const a = (k / 24) * Math.PI * 2 + 0.2
        const len = k % 2 ? 40 : 70
        ctx.moveTo(x + Math.cos(a) * (30 + e * 120), y + Math.sin(a) * (30 + e * 120))
        ctx.lineTo(x + Math.cos(a) * (30 + e * 120 + len * (1 - u)), y + Math.sin(a) * (30 + e * 120 + len * (1 - u)))
      }
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(x, y, 20 + e * 150, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
    ctx.restore()
  }

  /** Slow-mo on the final KO: 0.25 for 0.9s of real time, then ease back to 1 over 0.4s. */
  function timeScale() {
    const v = slowScale()
    return v
  }
  function slowScale() {
    if (!slowAt) return 1
    const e = performance.now() - slowAt
    if (e < 900) return 0.25
    if (e < 1300) {
      const u = (e - 900) / 400
      return 0.25 + 0.75 * u * u * (3 - 2 * u)
    }
    slowAt = 0
    return 1
  }

  if (import.meta.env.DEV) {
    // test hook: KO the live enemy nearest the player, as if a hit landed
    ;(window as unknown as { __fightKO?: () => void }).__fightKO = () => {
      const pl = list.find((o) => o.kind === 'player')
      const t = list.filter((o) => o.kind === 'enemy' && !o.ko).sort((a, b) => Math.abs(a.x - (pl?.x ?? 0)) - Math.abs(b.x - (pl?.x ?? 0)))[0]
      if (!t) return
      t.hp = 0
      t.vx = (pl?.face ?? 1) * 600; t.vy = -700
      koFighter(t)
    }
  }

  return {
    timeScale,
    add,
    update,
    draw,
    state: () => list.map((f) => ({ kind: f.kind, x: f.x, y: f.y, hp: f.hp, ko: f.ko, grounded: f.grounded, action: actionOf(f) })),
    destroy() {
      for (const f of list) dropCarry(f)
      ladder.reset()
      delete (window as unknown as { __fightKO?: unknown }).__fightKO
      list.length = 0; sparks.length = 0; projectiles.length = 0; bursts.length = 0; slowAt = 0; respawnAt = 0
    },
  }
}
