// Minimal typing for the parts of Leon Sans (https://leon-sans.com) this site uses.
export interface LeonDrawing { value: number }

export interface LeonOptions {
  text?: string
  size?: number
  weight?: number
  color?: string[]
  tracking?: number
  leading?: number
  align?: 'left' | 'center' | 'right'
  pathGap?: number
  amplitude?: number
  fps?: number
  isPath?: boolean
  isWave?: boolean
}

export default class LeonSans {
  constructor(options?: LeonOptions)
  text: string
  size: number
  weight: number
  color: string[]
  isWave: boolean
  readonly rect: { x: number; y: number; w: number; h: number }
  readonly drawing: LeonDrawing[]
  position(x: number, y: number): void
  draw(ctx: CanvasRenderingContext2D): void
  wave(ctx: CanvasRenderingContext2D, time?: number): void
  /** Construction guides: glyph boxes, baselines and curve circles. */
  grid(ctx: CanvasRenderingContext2D): void
  /** Anchor points and bezier handles. */
  point(ctx: CanvasRenderingContext2D): void
  pattern(ctx: CanvasRenderingContext2D, w: number, h: number): void
}
