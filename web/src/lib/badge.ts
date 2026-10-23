import qrcode from 'qrcode-generator'

/**
 * Paints the lanyard badge (front, back, strap) onto canvases and returns data URLs.
 * Rendering at runtime keeps the badge in the site's own fonts and makes the photo swappable.
 * Card art is 1024 × 1440, the Lanyard component's portrait aspect (1.6 : 2.25); the top
 * ~12% sits under the clip slot, so nothing important is drawn there.
 */

export const BADGE = {
  photo: '/img/badge/portrait.jpg',
  name: 'Saqlain Momin',
  role: 'Assistant Manager',
  practice: 'Cyber Strategy & Governance',
  employer: 'KPMG · Bangalore',
  since: 2021,
  cvUrl: 'https://saqlainswebsite.vercel.app/cv.pdf',
  status: 'Open to GRC roles',
}

export const yearsOfExperience = () => new Date().getFullYear() - BADGE.since

const W = 1024
const H = 1440
const PAD = 80
const C = {
  paper: '#F2EFE8',
  paper2: '#E8E4D9',
  ink: '#0D0D0D',
  muted: '#68645E',
  accent: '#F14920',
  line: 'rgba(13,13,13,.16)',
}
const SERIF = "'Instrument Serif', Georgia, serif"
const SANS = "'Inter', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

const canvas = (w: number, h: number) => {
  const el = document.createElement('canvas')
  el.width = w
  el.height = h
  return [el, el.getContext('2d')!] as const
}

const coverDraw = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
  const scale = Math.max(w / img.width, h / img.height)
  const sw = w / scale
  const sh = h / scale
  // Bias the crop upward so the face stays in frame.
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) * 0.3, sw, sh, x, y, w, h)
}

const tracked = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) => {
  ctx.letterSpacing = `${spacing}px`
  ctx.fillText(text, x, y)
  ctx.letterSpacing = '0px'
}

function paintFront(photo: HTMLImageElement | null) {
  const [el, ctx] = canvas(W, H)
  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, W, H)
  ctx.textBaseline = 'alphabetic'

  // Header strip, just below the clip slot.
  ctx.fillStyle = C.muted
  ctx.font = `500 26px ${MONO}`
  tracked(ctx, 'AUDIT FILE · ACCESS PASS', PAD, 228, 4)
  ctx.textAlign = 'right'
  tracked(ctx, `NO. ${BADGE.since}-SM`, W - PAD, 228, 4)
  ctx.textAlign = 'left'

  // Portrait, printed in monochrome like an ID photo.
  const px = PAD
  const py = 262
  const pw = W - PAD * 2
  const ph = 640
  ctx.fillStyle = C.paper2
  ctx.fillRect(px, py, pw, ph)
  if (photo) {
    ctx.save()
    ctx.filter = 'grayscale(1) contrast(1.08) brightness(1.04)'
    coverDraw(ctx, photo, px, py, pw, ph)
    ctx.restore()
  } else {
    ctx.fillStyle = C.muted
    ctx.font = `400 220px ${SERIF}`
    ctx.textAlign = 'center'
    ctx.fillText('SM', W / 2, py + ph / 2 + 70)
    ctx.textAlign = 'left'
  }

  // Status tab on the photo.
  ctx.font = `500 26px ${MONO}`
  ctx.letterSpacing = '3px'
  const status = `● ${BADGE.status.toUpperCase()}`
  const sw = ctx.measureText(status).width + 48
  ctx.fillStyle = C.accent
  ctx.fillRect(px, py + ph - 64, sw, 64)
  ctx.fillStyle = '#fff'
  ctx.fillText(status, px + 24, py + ph - 22)
  ctx.letterSpacing = '0px'

  // Role as the headline (the name already leads the page), fitted to the card width.
  ctx.fillStyle = C.ink
  let headline = 128
  ctx.font = `400 ${headline}px ${SERIF}`
  while (ctx.measureText(BADGE.role).width > W - PAD * 2 && headline > 60) {
    headline -= 4
    ctx.font = `400 ${headline}px ${SERIF}`
  }
  ctx.fillText(BADGE.role, PAD - 4, 1040)
  ctx.font = `500 38px ${SANS}`
  ctx.fillText(BADGE.practice, PAD, 1104)
  ctx.fillStyle = C.muted
  ctx.font = `400 34px ${SANS}`
  ctx.fillText(BADGE.employer, PAD, 1152)

  // Ledger of three facts.
  const top = 1206
  const cellW = (W - PAD * 2) / 3
  ctx.strokeStyle = C.line
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(PAD, top)
  ctx.lineTo(W - PAD, top)
  for (let i = 1; i < 3; i++) {
    ctx.moveTo(PAD + cellW * i, top)
    ctx.lineTo(PAD + cellW * i, top + 150)
  }
  ctx.stroke()
  const facts: [string, string][] = [
    [`${yearsOfExperience()}+ yrs`, `SINCE ${BADGE.since}`],
    ['ISO ×3', 'LEAD AUDITOR'],
    ['BLR', 'BANGALORE, IN'],
  ]
  facts.forEach(([big, small], i) => {
    const x = PAD + cellW * i + (i ? 28 : 0)
    ctx.fillStyle = C.ink
    ctx.font = `400 64px ${SERIF}`
    ctx.fillText(big, x, top + 82)
    ctx.fillStyle = C.muted
    ctx.font = `500 22px ${MONO}`
    tracked(ctx, small, x, top + 126, 3)
  })

  // Accent rule along the bottom edge.
  ctx.fillStyle = C.accent
  ctx.fillRect(0, H - 22, W, 22)
  return el.toDataURL('image/png')
}

function paintBack() {
  const [el, ctx] = canvas(W, H)
  ctx.fillStyle = C.ink
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = 'rgba(242,239,232,.6)'
  ctx.font = `500 26px ${MONO}`
  tracked(ctx, 'VERIFY HOLDER', PAD, 228, 4)

  // QR to the CV, drawn as crisp modules.
  const qr = qrcode(0, 'M')
  qr.addData(BADGE.cvUrl)
  qr.make()
  const count = qr.getModuleCount()
  const size = 560
  const cell = size / (count + 2)
  const qx = (W - size) / 2
  const qy = 290
  ctx.fillStyle = C.paper
  ctx.fillRect(qx, qy, size, size)
  ctx.fillStyle = C.ink
  for (let r = 0; r < count; r++)
    for (let c = 0; c < count; c++)
      if (qr.isDark(r, c)) ctx.fillRect(qx + (c + 1) * cell, qy + (r + 1) * cell, Math.ceil(cell), Math.ceil(cell))

  ctx.textAlign = 'center'
  ctx.fillStyle = C.paper
  ctx.font = `400 64px ${SERIF}`
  ctx.fillText('Scan for the CV', W / 2, qy + size + 100)

  ctx.textAlign = 'left'
  const creds = ['ISO 27001:2022', 'ISO 27701:2019', 'ISO 22301:2019']
  const top = 1090
  ctx.strokeStyle = 'rgba(242,239,232,.18)'
  ctx.lineWidth = 2
  creds.forEach((cred, i) => {
    const y = top + i * 72
    ctx.beginPath()
    ctx.moveTo(PAD, y - 48)
    ctx.lineTo(W - PAD, y - 48)
    ctx.stroke()
    ctx.fillStyle = C.paper
    ctx.font = `400 34px ${SANS}`
    ctx.fillText(cred, PAD, y)
    ctx.textAlign = 'right'
    ctx.fillStyle = C.accent
    ctx.font = `500 24px ${MONO}`
    tracked(ctx, 'LEAD AUDITOR', W - PAD, y, 3)
    ctx.textAlign = 'left'
  })

  ctx.fillStyle = C.accent
  ctx.fillRect(0, H - 22, W, 22)
  return el.toDataURL('image/png')
}

function paintStrap() {
  // A horizontal tile; the Lanyard component rotates it to run along the strap.
  const [el, ctx] = canvas(1400, 192)
  ctx.fillStyle = C.accent
  ctx.fillRect(0, 0, 1400, 192)
  ctx.fillStyle = C.ink
  ctx.font = `500 64px ${MONO}`
  ctx.textBaseline = 'middle'
  tracked(ctx, 'SAQLAIN MOMIN · AUDIT FILE · ', 40, 100, 10)
  return el.toDataURL('image/png')
}

export interface BadgeArt {
  front: string
  back: string
  strap: string
}

export async function renderBadge(): Promise<BadgeArt> {
  await Promise.all([
    document.fonts.load(`400 128px ${SERIF}`),
    document.fonts.load(`500 38px ${SANS}`),
    document.fonts.load(`500 26px ${MONO}`),
  ])
  const photo = await loadImage(BADGE.photo).catch(() => null)
  return { front: paintFront(photo), back: paintBack(), strap: paintStrap() }
}
