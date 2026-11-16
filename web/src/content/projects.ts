// Project tiles for the homepage. Facts come from the old builds.ts (Yozora, Recon, RL Playground).

export interface ProjectMedia {
  type: 'video' | 'image'
  src: string
  poster?: string
  width: number
  height: number
  /** A phone screen recording: shown inside an iPhone frame. */
  device?: 'phone'
}

export interface Project {
  slug: string
  title: string
  group: 'compliance' | 'coding'
  /** One plain line, 20 words at most. */
  line: string
  media: ProjectMedia
  links: { label: string; href: string }[]
  status?: string
  /** Several clips shown side by side instead of `media`, at one shared height. */
  gallery?: ProjectMedia[]
}

export const projects: Project[] = [
  {
    slug: 'yozora',
    title: 'Yozora',
    group: 'compliance',
    line: 'Assessment workspace for boutique GRC firms, covering ISO 27001, NIST CSF and DPDPA. The AI proposes from evidence; the consultant approves.',
    media: {
      type: 'video',
      src: '/img/projects/yozora-demo.mp4',
      poster: '/img/projects/yozora-demo-poster.webp',
      width: 1200,
      height: 750,
    },
    links: [
      { label: 'See how it works →', href: '/yozora' },
      { label: 'GitHub', href: 'https://github.com/saqlainmmomin/Cyber' },
    ],
    status: 'In development · synthetic demo data',
  },
  {
    slug: 'recon',
    title: 'Recon',
    group: 'compliance',
    line: "Vendor security screen. Six scanners check a vendor's public footprint; fixed rules set the risk tier before a full assessment.",
    media: {
      type: 'video',
      src: '/img/projects/recon-walkthrough.mp4',
      poster: '/img/projects/recon-walkthrough-poster.webp',
      width: 1200,
      height: 750,
    },
    links: [{ label: 'GitHub', href: 'https://github.com/saqlainmmomin/Recon' }],
  },
  {
    slug: 'unshrimp',
    title: 'Unshrimp',
    group: 'coding',
    line: 'iOS posture-correction app: AirPods head tracking flags slouching. Built on AirPosture, extended from one axis to full tracking.',
    media: {
      type: 'video',
      src: '/img/projects/airposture-demo.mp4',
      poster: '/img/projects/airposture-demo-poster.webp',
      width: 1280,
      height: 960,
    },
    gallery: [
      { type: 'video', src: '/img/projects/unshrimp-camera.mp4', poster: '/img/projects/unshrimp-camera-poster.webp', width: 770, height: 896 },
      { type: 'video', src: '/img/projects/unshrimp-screen.mp4', poster: '/img/projects/unshrimp-screen-poster.webp', width: 414, height: 896, device: 'phone' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/saqlainmmomin/unshrimp' },
      { label: 'AirPosture (original)', href: 'https://github.com/allenv0/AirPosture' },
    ],
  },
  {
    slug: 'tell-me-how',
    title: 'Tell Me How',
    group: 'coding',
    line: 'iOS app of short, voice-narrated explainers on how things work. A content engine writes each script and generates the animation.',
    media: {
      type: 'video',
      src: '/img/projects/tell-me-how-1.mp4',
      poster: '/img/projects/tell-me-how-1-poster.webp',
      width: 588,
      height: 1280,
    },
    gallery: [
      { type: 'video', src: '/img/projects/tell-me-how-1.mp4', poster: '/img/projects/tell-me-how-1-poster.webp', width: 588, height: 1280, device: 'phone' },
      { type: 'video', src: '/img/projects/tell-me-how-2.mp4', poster: '/img/projects/tell-me-how-2-poster.webp', width: 588, height: 1280, device: 'phone' },
      { type: 'video', src: '/img/projects/tell-me-how-3.mp4', poster: '/img/projects/tell-me-how-3-poster.webp', width: 588, height: 1280, device: 'phone' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/saqlainmmomin/Polymath' }],
  },
  {
    slug: 'munshi',
    title: 'Munshi',
    group: 'coding',
    line: 'Agentic flat-hunting for India: the AI shortlists flats to your needs, talks to owners or brokers, and books visits.',
    media: {
      type: 'video',
      src: '/img/projects/munshi-walkthrough.mp4',
      poster: '/img/projects/munshi-walkthrough-poster.webp',
      width: 1200,
      height: 750,
    },
    links: [{ label: 'GitHub', href: 'https://github.com/saqlainmmomin/Munshi' }],
  },
  {
    slug: 'rl-playground',
    title: 'RL Playground',
    group: 'coding',
    line: "A genetic algorithm evolving prisoner's dilemma strategies over repeated tournaments, to show how systems learn from rules alone.",
    media: {
      type: 'video',
      src: '/img/projects/pd-walkthrough.mp4',
      poster: '/img/projects/pd-walkthrough-poster.webp',
      width: 1200,
      height: 750,
    },
    links: [{ label: 'GitHub', href: 'https://github.com/saqlainmmomin/Prisoners_dilemma' }],
  },
]
