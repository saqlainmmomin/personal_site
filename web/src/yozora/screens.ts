// The six key moments of a Yozora assessment. Each one is a static product screen in
// public/yozora/screens/, built from the approved mockups. A screen with a reveal holds a
// "before" and an "after" state (data-state blocks) and one [data-reveal] button between them.

export type ScreenName = 'scope' | 'rfi' | 'evidence' | 'questionnaire' | 'review' | 'report'
export type ScreenState = 'before' | 'after'

export interface Stage {
  screen: ScreenName
  title: string
  text: string[]
  /** Label of the in-screen button that shows the result, and what to announce when it does. */
  reveal?: { button: string; announce: string }
  /** Height to reserve before the screen has loaded, to keep the page from jumping. */
  estimate: number
}

export const STAGES: Stage[] = [
  {
    screen: 'scope',
    title: 'Scope the engagement',
    text: [
      'A new engagement starts with its type, the standards to assess against and a few scope questions. Here: a gap assessment against ISO 27001 and DPDPA, for a client that uses third-party processors and sends data outside India.',
      'What you pick here drives everything after: which requirements apply, which evidence to ask for and which questions the questionnaire holds.',
    ],
    estimate: 600,
  },
  {
    screen: 'rfi',
    title: 'Request the evidence',
    text: [
      'The request list is generated from the scope. Each item is either design evidence, such as a policy or procedure, or operating evidence, such as logs and samples.',
      'Every item shows which questionnaire section it feeds and which scope answer asked for it. Items go to the client contact by magic link, which opens an upload page for those items only.',
    ],
    estimate: 600,
  },
  {
    screen: 'evidence',
    title: 'Analyse the evidence',
    text: [
      'The client has uploaded a policy and an access review log. Analysis rates the policy on design effectiveness and checks whether the log shows the control working, with the reason.',
      'It also lists the questionnaire questions each file answers.',
    ],
    reveal: { button: 'Analyse', announce: 'Analysis shown in the screen: one verdict per file and the questions each file answers.' },
    estimate: 600,
  },
  {
    screen: 'questionnaire',
    title: 'Complete the questionnaire',
    text: [
      'Each answer is marked Implemented, Partially implemented or Not implemented, and links to the evidence behind it.',
      'Run analysis drafts a conclusion for each section from all the answers.',
    ],
    reveal: { button: 'Run analysis', announce: 'Draft conclusions shown in the screen, one per section.' },
    estimate: 600,
  },
  {
    screen: 'review',
    title: 'Review every conclusion',
    text: [
      'Each observation sits next to the evidence it rests on. The consultant approves, edits or rejects it, and nothing moves on without that decision.',
    ],
    reveal: { button: 'Approve', announce: 'Access rights approved by Priya Sharma. Three conclusions still need a decision.' },
    estimate: 600,
  },
  {
    screen: 'report',
    title: 'Release the report',
    text: ['The report uses the approved conclusions exactly as they were signed off. The consultant releases it, and the release is recorded with their name and the date.'],
    estimate: 600,
  },
]

export const screenUrl = (name: ScreenName) => `/yozora/screens/${name}.html`

/** Shows the blocks for one state and hides the rest. */
export function applyState(doc: Document, state: ScreenState) {
  doc.querySelectorAll<HTMLElement>('[data-state]').forEach((el) => (el.hidden = el.dataset.state !== state))
}

/** Makes a screen static: nothing in it can be focused or changed, except the reveal button. */
export function makeStatic(doc: Document) {
  doc.documentElement.classList.add('yz-static')
  doc.querySelectorAll<HTMLElement>('a, button, input, select, textarea, summary, [tabindex]').forEach((el) => {
    if (el.hasAttribute('data-reveal') || el.hasAttribute('data-reveal-focus')) return
    el.tabIndex = -1
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.readOnly = true
  })
  // Checkboxes and radios ignore readOnly, so keep their clicks from changing them.
  doc.addEventListener('click', (e) => {
    if (!(e.target as Element).closest?.('[data-reveal]')) e.preventDefault()
  }, true)
  doc.addEventListener('mousedown', (e) => (e.target as Element).closest?.('select, label, input') && e.preventDefault(), true)
  doc.addEventListener('submit', (e) => e.preventDefault(), true)
}
