// Field notes, ported from site-v2 with original dates and LinkedIn links.

export interface Note {
  date: string // ISO, for <time datetime>
  label: string
  title: string
  thesis: string
  href: string
  image: string
  alt: string
}

export const featured = {
  date: '2026-08-23',
  label: '23 Aug 2026',
  title: "OpenAI's models breached Hugging Face. The goal was only to pass a test.",
  summary:
    'The task was narrow: solve a cybersecurity benchmark. Instead, the model chained zero-day vulnerabilities and stolen credentials out of an isolated test environment into Hugging Face\'s production systems. The goal stayed narrow. The route did not.',
  href: 'https://the-slow-escape.vercel.app',
  image: '/img/notes/the-slow-escape.webp',
  width: 1200,
  height: 1594,
  alt: 'A glitched, angel-winged figure rendered in a fractured terminal interface, evoking an AI escaping its sandboxed environment',
}

export const intro =
  'Research on AI systems that can act, remember, and access production environments. I examine what their behavior means for security controls and assurance.'

export const takeaway =
  'My focus: make agent identities, permissions, evidence trails, and human approval part of the governance design.'

export const allNotesHref = 'https://www.linkedin.com/in/saqlain-musa/'

export const notes: Note[] = [
  {
    date: '2026-02-09',
    label: '9 Feb 2026',
    title: 'The control problem became a deployment problem.',
    thesis: 'Persistent agents and inverted economics increasingly favor the attacker. Human-speed security cannot match machine-speed deployment.',
    href: 'https://www.linkedin.com/posts/saqlain-musa_the-control-problem-just-became-a-deployment-activity-7426515938872844288-mT7B',
    image: '/img/notes/control-problem-deployment.webp',
    alt: 'An illustrated analysis of AI-generated production code and the expanding deployment attack surface',
  },
  {
    date: '2026-03-12',
    label: '12 Mar 2026',
    title: 'The invisible exponential.',
    thesis: 'Autonomous task complexity is compounding faster than the governance programs meant to contain it.',
    href: 'https://www.linkedin.com/posts/saqlain-musa_the-invisible-exponential-why-ai-progress-activity-7437731625154756608-oCW8',
    image: '/img/notes/invisible-exponential.webp',
    alt: 'A chart showing the rapid increase in autonomous AI task complexity over time',
  },
  {
    date: '2026-03-25',
    label: '25 Mar 2026',
    title: 'A widely used PyPI package was weaponized.',
    thesis: 'One installation path exposed credentials through a transitive dependency several layers deep.',
    href: 'https://www.linkedin.com/posts/saqlain-musa_sdlc-zerodayvulnerabilities-dependencies-activity-7442417422755704832-S7Lv',
    image: '/img/notes/pypi-weaponized.webp',
    alt: 'A supply-chain diagram tracing credential theft through a compromised Python dependency',
  },
  {
    date: '2026-03-30',
    label: '30 Mar 2026',
    title: 'Everything is a context problem.',
    thesis: 'The answer is not always a smarter model. Often it is a memory system that compounds useful context.',
    href: 'https://www.linkedin.com/posts/saqlain-musa_ai-llm-claudecode-activity-7444300049968320513-ecxW',
    image: '/img/notes/everything-context.webp',
    alt: 'A layered diagram showing how durable context and memory improve AI-agent work',
  },
  {
    date: '2026-04-06',
    label: '6 Apr 2026',
    title: 'The recursion is tightening.',
    thesis: 'AI agents now have inboxes, credentials, memory, and production access. Most security programs were designed for a pre-agent threat landscape.',
    href: 'https://www.linkedin.com/posts/saqlain-musa_artificialabrintelligence-cybersecurity-activity-7422552460696698880-RLNL?utm_source=share&utm_medium=member_desktop&rcm=ACoAACD3yM8BSyqSc7F2ugwZkJdAE3Rl_HWABmA',
    image: '/img/notes/recursion-tightening.webp',
    alt: 'A visual map of the tightening feedback loop between increasingly capable AI agents and the systems they can access',
  },
  {
    date: '2026-04-08',
    label: '8 Apr 2026',
    title: 'AI now surpasses human security researchers.',
    thesis: 'Automated vulnerability discovery is changing what secure development and assurance must be designed to handle.',
    href: 'https://www.linkedin.com/posts/saqlain-musa_project-glasswing-just-changed-what-secure-activity-7447472798601519105-4dHh',
    image: '/img/notes/ai-surpasses-researchers.webp',
    alt: 'An editorial graphic about AI systems discovering vulnerabilities missed by conventional analysis',
  },
]
