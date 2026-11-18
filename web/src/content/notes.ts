// Writing: field notes with their original dates and LinkedIn links, newest first, plus one link to all of them.

export interface Note {
  date: string // ISO, for <time datetime>
  label: string
  title: string
  thesis: string
  href: string
}

export const allNotesHref = 'https://www.linkedin.com/in/saqlain-musa/'

export const notes: Note[] = [
  {
    date: '2026-08-23',
    label: '23 Aug 2026',
    title: "OpenAI's models breached Hugging Face. The goal was only to pass a test.",
    thesis:
      "The task was narrow: solve a cybersecurity benchmark. Instead, the model chained zero-day vulnerabilities and stolen credentials out of an isolated test environment into Hugging Face's production systems.",
    href: 'https://the-slow-escape.vercel.app',
  },
  {
    date: '2026-04-08',
    label: '8 Apr 2026',
    title: 'AI now surpasses human security researchers.',
    thesis: 'Automated vulnerability discovery is changing what secure development and assurance must be designed to handle.',
    href: 'https://www.linkedin.com/posts/saqlain-musa_project-glasswing-just-changed-what-secure-activity-7447472798601519105-4dHh',
  },
  {
    date: '2026-03-25',
    label: '25 Mar 2026',
    title: 'A widely used PyPI package was weaponized.',
    thesis: 'One installation path exposed credentials through a transitive dependency several layers deep.',
    href: 'https://www.linkedin.com/posts/saqlain-musa_sdlc-zerodayvulnerabilities-dependencies-activity-7442417422755704832-S7Lv',
  },
  {
    date: '2026-03-12',
    label: '12 Mar 2026',
    title: 'The invisible exponential.',
    thesis: 'Autonomous task complexity is compounding faster than the governance programs meant to contain it.',
    href: 'https://www.linkedin.com/posts/saqlain-musa_the-invisible-exponential-why-ai-progress-activity-7437731625154756608-oCW8',
  },
  {
    date: '2026-02-09',
    label: '9 Feb 2026',
    title: 'The control problem became a deployment problem.',
    thesis: 'Persistent agents and inverted economics increasingly favor the attacker. Human-speed security cannot match machine-speed deployment.',
    href: 'https://www.linkedin.com/posts/saqlain-musa_the-control-problem-just-became-a-deployment-activity-7426515938872844288-mT7B',
  },
]
