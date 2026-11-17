# Handoff 2 of 3: Yozora guided demo

Run order: start **after handoff 1** (`2026-11-16-plain-letter-foundation.md`) has written its
Results: the tokens and the project data shape. It can run in parallel with handoff 3. Run as a
Sonnet session; use Sonnet subagents for exploring the reference code and for browser checks.

## Goal

Build a clickable demo of the **ideal** version of Yozora, an assessment workspace for boutique
GRC consulting firms, as a page on Saqlain Momin's portfolio (`/yozora`). A visitor should be
able to use it like the real app, with a light guide showing what to click next. It shows what
the tool should do, not what the current prototype does, so it is labelled
**"Concept · sample data"**. It runs entirely in the browser on fictional sample data: no
backend, no AI calls and no uploads leaving the page.

**Done means:**
- `/yozora` works end to end at 1440px and is usable at 390px.
- A visitor can finish the guided path, or click freely and restart it.
- A small looping preview component exists for the homepage tile.
- `npm run build` and `npm test` pass.
- Results are written below.

## The workflow to show (from Saqlain, simplified)

Saqlain's full description:

> Home screen with a table of existing engagements grouped by client name. Option to create a
> new engagement. New engagement follows the standard process: select the scope (type of
> engagement, standards to assess against, other scope questions) and generate an RFI list from
> that scope. RFI items can be shared with engagement stakeholders via magic links. Evidence can
> be uploaded. As evidence is submitted the user sees design effectiveness for a document, or,
> for operational-control evidence, whether it holds up from a compliance perspective. Then the
> questionnaire: pre-fill from uploaded evidence; the user answers and follow-up questions
> trigger; option to request additional evidence or responses before locking a response for a
> finding. Then review: add, edit and review findings. Then the final report.

He asked for this to be simplified. Use **six steps** as the guided path:

1. **Engagements.** A table grouped by client, with 2–3 fictional clients and a few
   engagements each, showing status and progress. Primary action: "New engagement".
2. **Scope.** Engagement type, standards (for example ISO 27001, DPDPA) and 2–3 scope
   questions. On submit, an RFI list is generated from these answers. Show that the list
   changes with the scope.
3. **RFI and sharing.** The generated RFI items. Sharing an item with a stakeholder by magic
   link is simulated (show the link and a "sent" state; nothing is sent).
4. **Evidence review.** Sample evidence "arrives". A policy document gets a
   design-effectiveness view; an operating-control sample (for example access review logs)
   gets a verdict on whether it holds up, with the reason.
5. **Questionnaire.** Answers pre-fill from the evidence, with each pre-filled answer marked
   as from evidence. The visitor answers one question, and that triggers a follow-up. Show a
   "request more evidence" option before the response is locked.
6. **Findings and report.** Review, edit and approve findings, then a final report preview.
   The consultant approves every conclusion.

Keep each screen shallow: one clear thing to do, with sample data that reads as real but is
clearly fictional. Don't use real client or firm names.

## Current state and references

- Site: `/Users/saqlainmomin/personal-site/web`. After handoff 1 it is a plain single-column
  site: one text serif, Inter for UI labels, off-white background, near-black ink, one grey,
  and one red for links. Inner pages are separate Vite HTML entries (for example `kpmg.html`),
  served without `.html` because of `vercel.json` `cleanUrls`.
- Locked plan: the top section of `/Users/saqlainmomin/personal-site/tasks/todo.md`.
- Earlier Yozora material:
  - `/Users/saqlainmomin/cyberassess-reference/` (the reference prototype; Yozora was
    previously called CyberAssess)
  - the current prototype video at `web/public/img/projects/cyberassess-demo.mp4`
  - the old site's 5-step illustration in git history (`web/src/components/builds/EvidenceTrail.tsx`
    at commit 68a1c9b)

  Use these for domain vocabulary and screen ideas only. Don't copy their visual style.
- Related local domain repos (read-only, for realistic control and RFI wording):
  - `/Users/saqlainmomin/dpdpa-gap-tool/`
  - `/Users/saqlainmomin/dpdpa-ucf/`
  - `/Users/saqlainmomin/iam-mapping-review/`

## Where to build

- `web/yozora.html` plus `web/src/yozora/**`. This session owns those paths.
- Register the HTML entry in `web/vite.config.ts`. This is the only shared file to touch;
  re-read it before editing.
- Don't edit `web/src/content/projects.ts` or `web/public/img/projects/`; handoff 3 owns them.
  Instead, export a `YozoraPreview` component (a scaled-down, non-interactive, looping
  autoplay of the guided path, with a static frame under reduced motion) and report in Results
  how to wire it into the homepage tile.

## Design constraints (decided, do not relitigate)

- The app sits in a plain frame: hairline border, no fake macOS window dots, no offset shadow.
- The app UI may have its own neutral product styling (Inter, greys, a single status color),
  but nothing gimmicky.
- The guide is a small, dismissable step indicator ("Step 2 of 6: Generate the RFI list"),
  with the next thing to click highlighted. Visitors can click freely. "Restart tour" is always
  available.
- The page gets a short plain intro above the demo (2–3 sentences: what Yozora is, who it's
  for, and that the consultant approves every conclusion), plus links to GitHub and the
  earlier prototype video. Copy is plain and factual, with no catchphrases.
- Accessibility: everything works by keyboard, with visible focus. Respect reduced motion.
- At 390px: a usable, simplified layout. It doesn't have to match desktop, but nothing can be
  cut off and nothing can scroll sideways.
- No new heavy dependencies; React state is enough. Don't commit (Saqlain ships with `/ship`).

## Verification

- Show it in the browser while building (`npm run dev` from `web/`).
- A Sonnet subagent clicks through the full guided path and a free-click path at 1440×900 and
  390×844 using playwright-core (in the repo root's node_modules), takes screenshots, and
  checks for console errors and overflow.
- Add `/yozora` checks to `web/smoke-test.mjs`: the page loads, the tour can be completed, and
  there is no overflow.
- Run `npm run build` and `npm test` from `/Users/saqlainmomin/personal-site`.

## Report back

Append `## Results` to this file containing:
- screenshots of each step
- how to wire `YozoraPreview` into the homepage tile
- the proposed intro copy and one-line tile description for Saqlain to edit
- the test output
- any simplifications you made to the workflow, and why

## Results

Built and checked at 1440×900 and 390×844. Nothing is committed. `projects.ts` and `public/img/projects/` were not touched.

### Files

- New: `web/yozora.html`, `web/src/yozora/` (`main.tsx` entry, `YozoraPage.tsx`, `App.tsx` frame + guide + tabs, `screens.tsx` six screens, `state.ts` reducer + tour cues, `data.ts` sample data and RFI rules, `ctx.ts`, `ui.tsx`, `yozora.css`, `YozoraPreview.tsx`).
- Shared edits: `web/vite.config.ts` (clean-urls plugin now rewrites `/kpmg` and `/yozora`; `yozora` input added), `web/public/sitemap.xml` (`/yozora` added), `web/smoke-test.mjs` (additive, see below).

### How it works

- All state sits in one reducer (`state.ts`). The guide is derived from that state: the current cue is the first one not yet done, so free clicking in any order keeps the guide correct. If the next cue is on another screen, the guide says so and highlights that screen's tab. "Hide" dismisses it; "Show guide" and "Restart tour" sit in the top bar.
- Scope answers drive the RFI list live: cloud adds 2 requests, third parties 2, in-house development 2, DPDPA 4, and "Gap assessment" drops the internal-audit request. Added items are tagged "Added: Cloud hosting" etc. (8 → 14 requests in the check). The cloud answer also changes the policy design review and adds finding F-04. The question-4 answer changes finding F-03.
- Responsive layout uses container queries on the frame, so the homepage preview at 680px shows the desktop layout. At 390 the tabs become a 3×2 grid and tables stack.
- Keyboard: the scope and answer chips are native radios, so arrow keys work. Focus has a 2px ink outline, drawn on top of the blue cue ring. On a screen change, focus moves to the screen heading and the frame scrolls into view. Under reduced motion the cue does not pulse and scrolling is instant.
- One status colour (blue `#1F5FAD`) for positive states and the cue ring. Problems use an ink outline. No extra reds; the smoke test's "one red" check passes.

### Screenshots (`tasks/handoffs/screens/yozora/`)

| Step | 1440 | 390 |
|---|---|---|
| 1 Engagements | step1-1440.png | step1-390.png |
| 2 Scope (cloud = Yes, list shows added items) | step2-1440.png | step2-390.png |
| 3 RFI, share panel with magic link | step3-1440.png | step3-390.png |
| 4 Evidence, access review "Does not hold up" | step4-1440.png | step4-390.png |
| 5 Questionnaire, follow-up, requested, locked | step5-1440.png | step5-390.png |
| 6 Findings approved + report preview | step6-1440.png | step6-390.png |

Also: keyboard-focus-1440.png and keyboard-radio-1440.png (focus visible over the cue ring), plus preview-no-preference-1440.png, preview-reduce-1440.png and preview-390.png. I looked at all six 1440 shots, steps 1, 2, 4 and 6 at 390, and the previews. Fixes made after looking: on page load the screen heading took focus with a visible outline (a StrictMode double effect); the preview cropped away the guide and tabs (now only the screen area scrolls); the RFI ask and control ref ran together; and on phones the evidence detail now scrolls into view when you pick a file.

### Wiring `YozoraPreview` into the homepage tile (handoff 3)

`import { YozoraPreview } from '@/yozora/YozoraPreview'` and render `<YozoraPreview />` in place of the Yozora tile's `<video>`. It fills the column width at a 680:440 aspect ratio and draws its own hairline border. Wrap it in `<a href="/yozora">` to make the tile open the demo. The simplest route is to add an optional `preview?: 'yozora'` field to `Project`, or to special-case `slug === 'yozora'` in `ProjectTile`'s `Media`. Also change the tile's `status` to "Concept · sample data" and add a "Try the demo" link to `/yozora`.

Note: the smoke-test static check `bundle.includes('synthetic demo data')` currently passes because of the projects.ts status string. Update that check when the status changes.

Behaviour: it plays the guided path by replaying real reducer actions, 1.6 s per frame, holds on the report, then loops. It runs only while in view and keeps the highlighted control in view. Under reduced motion it shows one still frame (the access-review verdict). The wrapper is `role="img"` with an `aria-label`, and the inner app is `aria-hidden` and `inert`. Text keeps its computed size under the CSS scale, so the "no text under 12px" check still passes. At 390 the preview text is very small (scale ~0.51). I think that is fine for a looping tile, but it is your call.

### Proposed copy (edit freely)

- Intro (`src/yozora/YozoraPage.tsx`): "Yozora is an assessment workspace I am building for small GRC consulting firms. It takes an engagement from scope to report: the scope sets the evidence requests, evidence is checked as it arrives, and findings are drafted from it. The consultant reviews and approves every conclusion before it reaches the report." Second, grey line: "This is a clickable concept of the finished product, not the current prototype. It runs in your browser on made-up sample data, and nothing is sent anywhere." Links: Code on GitHub (`https://github.com/saqlainmmomin/Cyber`, from projects.ts) · Earlier prototype (video) (`/img/projects/cyberassess-demo.mp4`, a direct file link).
- Tile line: "An assessment workspace for small GRC firms, from scope to report. The consultant approves every conclusion."

### Test output

- `npm run build` (repo root): passes. New `dist/yozora.html`; yozora chunk 41.9 kB (11.9 kB gzip); shared chunk unchanged at ~221 kB.
- `npm test` (repo root): exit 0, "52 checks passed" (it was 38 before this session's additions plus whatever handoff 3 has added). New checks: `/yozora` is a dist entry and is in the sitemap. `/yozora` at 1440 and 390 is also in the generic page loop (no overflow, no text under 12px, one red, rel=noopener, images, one h1, no console errors or 4xx). And per viewport, the guided tour is completed by clicking the cue (18 clicks) with an overflow check before every click; it must end on "Tour complete" with the report visible, then Restart resets to step 1.
- `tsc -b` and `oxlint src/yozora` are clean.
- Separate Playwright run (my script, not committed): no console errors at either size. No element overflows the frame at any step. Free-click to Findings after a restart points the guide at the Engagements tab. Hide removes the cue and Show brings it back. Keyboard Tab reaches New engagement with a visible 2px outline, and Enter moves focus to the Scope heading. The preview advances frames, stays still under reduced motion, and causes no overflow at 390.

### Simplifications, and why

- One new engagement, fixed to the fictional client "Tamarind Lending". There is no client picker or naming form, because the point is scope → RFI, not data entry.
- Two standards (ISO 27001:2022, DPDPA 2023) and three scope questions, so the RFI change stays readable.
- Evidence "arrives" with one button and three fixed files: a policy (design view) and two operating controls, one that fails and one that holds up. No upload UI, so nothing appears to leave the page.
- The questionnaire covers one control area: three answers pre-filled from evidence and one open question. Any answer raises a follow-up with its own wording. "Request evidence" adds RFI-11 to the RFI list as already sent.
- Findings are rule-based from the visitor's choices (3 or 4 findings). Edits change the report text and require re-approval. There is no "add finding" button: it adds a form without showing anything new.
- The demo stays inside the 720px page column rather than breaking out wider. That keeps the one-column rule and avoids 100vw overflow risk. The trade-off is a fairly compact app at 1440.

### Not verified

- Not tested in Safari or Firefox (Chromium only), or with a real screen reader. ARIA is set (live guide, aria-current tabs, aria-pressed, labelled regions), but I have not listened to it.
- Not checked on Vercel. `/yozora` relies on the existing `cleanUrls`, as `/kpmg` does.
- The preview is not mounted on the homepage (handoff 3 owns that). I tested it through a temporary HTML page, which I have since deleted.

### v2: rebuilt on the approved product mockups (2026-11-16)

The v1 React-state mini-app was judged visually weak. v2 replaces it with the approved Yozora screen designs from `dpdpa-gap-tool/docs/product/2026-10-01-app-design-mockups/screens/`, shown as a strictly guided click-through. Nothing is committed. `projects.ts` and `public/img/projects/` were not touched; `vite.config.ts` was not changed in v2.

**How it works**
- Each screen is a static HTML file in `web/public/yozora/screens/`, built from the product's own markup and classes, with the product CSS (`yozora-tokens.css`, `yozora-components.css`, `yozora-patterns.css`), Inter woff2 files and an icon sprite copied into `web/public/yozora/`. Nothing references paths outside `web/`. Mockup chrome was removed: the Mockup/Home/Assessment/Review bar, accent dots, Light/Dark toggle, every "Screen state" switcher and "State" specimen label, and the mockup scripts.
- `SceneStack.tsx` shows each screen in a same-origin iframe (one per screen, mounted on first need, the next one preloaded so changes have no blank load). Product CSS stays inside the iframes and cannot clash with Tailwind. Screen states are `data-state` blocks the runtime toggles.
- `tour.ts` lists 24 beats over the 6 steps. Each beat names a screen, a state and one `data-tour` element. The runtime gives that element an amber ring (the product's own medium colour) and makes it the only focusable element. Every other click, key, select or input in the screen is blocked, so nothing opens an unrelated screen. A small dark caption ("3/6 · Send the link to Ananya Rao") is placed under or over the target from its rect in the iframe document and follows scrolling. Back, Next (fallback, and the cue on the one beat with nothing to click) and Restart tour sit above the frame. The step title, cue and explanation are in an `aria-live` region.
- Keyboard: Tab from the guide buttons goes straight to the highlighted element. Enter or Space advances, and focus moves to the next target. Focus shows as a 3px dark ring over the amber one. Double clicks and held keys do not skip beats. Under reduced motion the ring does not pulse and scrolling is instant.
- Layout: the frame breaks out of the 720px column to `min(1200px, 100vw − 48px)` so the product shows its desktop layout. Hairline border, no window dots, no shadow. At 390 the iframe is phone width (358px), so the product's own responsive CSS shows its narrow layout (hamburger top bar, stacked tables), not a shrunken desktop.

**Screens per step (source files in `.../2026-10-01-app-design-mockups/screens/`)**

| Step | Demo screen and states | Built from |
|---|---|---|
| 1 Engagements | `engagements` (table grouped by client), `new-engagement` | `b2-engagement_list.html`, `b2-new_engagement.html` |
| 2 Scope | `scope`: ask → answered → done (scope confirmed, generated evidence request) | `b3-scope.html`, `b3-scope-complete.html` |
| 3 RFI and sharing | `requests`: new link → sent (link shown, items it was provisioned for); `client-upload`: open → uploading → done | `b6-magic_links.html`, `b6-magic_upload.html` |
| 4 Evidence review | `evidence`: inventory → policy (design effectiveness) → confirmed → access review (operating verdict "Does not hold up") → confirmed | `b4-evidence.html`, `b4-evidence_detail.html`, review detail and criteria from `b5-review-queue.html` / `b5-requirement-card.html` |
| 5 Questionnaire | `questionnaire`: ready → pre-filled ("From evidence" with quoted source) → answered (AI follow-ups, "Request more evidence") → requested → lock | `b3-questionnaire.html`, `b3-followups.html` |
| 6 Findings and report | `review`: pending → approved → findings; `report`: ready → released, with a board report page | `b5-review-queue.html`, `b5-findings.html`, `b5-release.html`; image cropped from `yozora-launch-film/web/assets/pages/p-05.jpg` (footer with the other client's name cut off) |

**Adaptations to the mockups (product components only, no new styling)**
- Engagements: client group header rows use the table's own `th` style. The "FY2026 privacy readiness" row is removed because the tour creates it.
- Scope: one new question (third-party processors) is the visitor's answer. A one-line count under the form shows the request grow from 8 to 10 items. Items added by that answer carry a status line saying so.
- Requests: the RFI items are pre-ticked in the New link form and the contact is pre-filled. The success alert shows the link and says which items it opens. "Preview as Ananya" was added next to "Copy link" to open the client page. Per the approval notes, the link card lists the evidence it was provisioned for.
- Client page: firm unified to "Northgate Advisory" (the mockups used both Northgate and Kestrel). Three items are already sent and the visitor uploads the fourth.
- Evidence: no design-effectiveness screen existed. The policy and access-review panels reuse the review-detail components (`rq-detail`, `block`, `checks`, `cite`, `fw-grid`, `rec`, `warn`) inside the central evidence inventory. Per the approval note there is no separate AWS tab. "Confirm verdict / Edit / Reject" mirrors the review queue's Approve bar, and the confirmed state names Priya Sharma.
- Questionnaire: the section is now Access control, so it ties to the evidence. "Request more evidence" and "Save and lock section" were added as product buttons.
- Review: one review item ("Access rights") moves from To review to Decided on approval. The findings table includes the finding drafted from it, credited to the approver.
- Report: "Ready to release" copy states that nothing AI-proposed reaches the report without approval. "Released by Priya Sharma" is shown with the board report page.
- No retention dialog on any client page, per the approvals.

**Files**
- New: `web/src/yozora/tour.ts`, `SceneStack.tsx`, `YozoraDemo.tsx`; rewritten `YozoraPreview.tsx`, `yozora.css`; `YozoraPage.tsx` now renders `<YozoraDemo />` and its second intro line says it is a click-through of the approved screen designs. Static assets under `web/public/yozora/` (`css/`, `fonts/` with OFL licence, `img/board-report-p05.jpg` 169 KB, `screens/*.html`); about 744 KB in total.
- Deleted (v1): `App.tsx`, `ctx.ts`, `data.ts`, `screens.tsx`, `state.ts`, `ui.tsx`.
- The screens were generated by a scratch script that is not in the repo. The HTML in `public/yozora/screens/` is now the source to edit.

**Screenshots** in `tasks/handoffs/screens/yozora-v2/`: `stepN-<beat letter>-1440.png` and `-390.png` for every beat (step1-a,b · step2-a–c · step3-a–e · step4-a–e · step5-a–d · step6-a–e), plus `keyboard-focus-1440.png`, `keyboard-radio-1440.png`, `preview-1440.png`, `preview-reduce-1440.png`, `preview-390.png`. I looked at most of them. Fixes made after looking:
- The evidence panels hid their Confirm bar below the frame, so they now have a fixed height with an inner scroll, like the review queue.
- Three status lines overflowed the phone screen.
- The follow-up block was cramped.
- On phones the magic link scrolled out of view before its preview button, so the button moved into the link alert.
- The frame was taller than the phone viewport.

**Tile wiring (unchanged API)**
`import { YozoraPreview } from '@/yozora/YozoraPreview'` and render `<YozoraPreview />` in the Yozora tile in place of the `<video>`, wrapped in `<a href="/yozora">`. It is 16:10 with its own hairline border.
- It loops through the beats (1.8 s each) using the same screens, and only while in view. It mounts its iframes the first time it scrolls near the viewport.
- On tiles of 600px and wider it renders the desktop layout at 1280px, scaled. Narrower tiles render the product's narrow layout at 600px, so phone text stays legible.
- Under reduced motion it shows one still frame: the access-review verdict.
- `role="img"` with an `aria-label`. The inner screens are `aria-hidden` and `inert`.

**Test output**
- `npm run build`: passes. The yozora JS chunk is 11.95 kB (4.69 kB gzip), down from 41.9 kB.
- `npm test`: exit 0, **52 checks passed**. The `/yozora` block in `web/smoke-test.mjs` was rewritten. For each viewport it:
  - clicks the highlighted element inside the active iframe, or Next when there is nothing to click, for 23 beats until "Tour complete";
  - checks page overflow and overflow inside the product screen before every beat;
  - checks that "Released by Priya Sharma" is visible at the end and that Restart returns to Step 1 of 6;
  - asserts no console errors, 4xx responses or failed requests, including those from the iframes.

  It runs with reduced motion emulated, so a click never lands while a screen is still smooth-scrolling.
- My own Playwright runs against the dev server (not committed) covered:
  - the full tour with normal motion at 1440×900 and 390×844 (no console errors, 4xx or overflow);
  - the keyboard path (Tab into the target, Enter through 4 beats, focus following);
  - a click on a non-target sidebar link, which does nothing;
  - under reduced motion, the ring animation is `none`;
  - the preview through a temporary harness page (since deleted): frames advance, a single still frame under reduced motion, no overflow at 390.
- `tsc -b` and `oxlint src/yozora` are clean.

**Not verified**
- Safari, Firefox and real phones (Chromium only). No real screen-reader pass.
- Vercel: `public/yozora/` is a directory next to `yozora.html`. With `cleanUrls`, `/yozora` should still serve `yozora.html`, but I have not checked it on a deploy. If it redirects to `/yozora/`, rename the asset folder (for example `public/yozora-app/`) and update the paths in `SceneStack.tsx` and the screen files.
- If someone clicks very fast during the smooth scroll, the click can land on the wrong spot and is ignored. The visitor clicks again or uses Next.
- The preview is not mounted on the homepage (handoff 3 owns `projects.ts`).
- "Northgate Advisory" and "Kestrel Advisory" are the mockups' made-up firm names. I kept Northgate. I did not check them against real firms.

### v3 (narrative stages)

The owner found the 23-beat guided tour hard to follow. v3 replaces it with a scrolling page: a short intro, then six stages. Each stage has a "Stage N of 6" label, a plain heading, 2–3 factual sentences and **one** framed product screen. Short grey connector lines sit between stages. Nothing is committed. `projects.ts`, `public/img/projects/` and `vite.config.ts` were not touched.

**How it works**
- `StageFrame.tsx` loads one same-origin iframe per stage. Its height follows the screen's content through a ResizeObserver inside the iframe, so the page scrolls and the frame never does. The frame has a hairline border, no dots and no shadow. It breaks out to `min(1200px, 100vw − 48px)` on desktop and `100vw − 32px` on phones, where the product's own narrow layout renders.
- `makeStatic()` (in `screens.ts`) makes every link and input in a screen unfocusable and inert. The one exception is the `[data-reveal]` button, which is a real product `<button>`: Tab reaches it, and it has a dark 2px focus ring.
  - Clicking it switches the screen's `data-state` blocks from `before` to `after` and moves focus to the result heading.
  - A **Reset** button under the frame restores the screen and puts focus back on the reveal button. Reset is disabled until something has been revealed.
  - A polite live line under the frame says what appeared.
- Static frames (stages 1, 2 and 6) have `tabIndex=-1`.
- Revealed blocks fade in over 0.4 s, only without reduced motion. The product CSS already turns off all animation under reduced motion.
- `public/yozora/css/yozora-story.css` is new. It removes every rule that depended on the viewport height (`html`/`body`/`.app` min-height, the sticky sidebar height, the `.rq` height), so screens can size to their content. It also holds a few layout helpers (`yz-cols`, the RFI row tags, a fix that keeps the legend inside its question group, wrapping on narrow screens).

**Stage → screen** (`web/public/yozora/screens/`, generated from the mockup chrome plus product components)

| Stage | Screen | Reveal |
|---|---|---|
| 1 Scope | `scope.html`: engagement card (client, type Gap assessment, ISO 27001:2022 + DPDPA 2023 ticked) next to four answered scope questions, plus a summary (118 of 132 requirements, 10 RFI items, 24 questions) | none |
| 2 RFI | `rfi.html`: 6 of 10 items, each tagged Design or Operating evidence, with "Feeds questionnaire" and "Asked for because" (the scope answer) in `.kv`; Sent / Not sent status; item 1 expanded with the magic-link alert, the link and Copy link | none |
| 3 Evidence | `evidence.html`: two uploaded files marked "Not analysed" | **Analyse** shows each file's verdict in the table, plus two cards: the policy is "Design partly effective"; the access log "Does not hold up", with the reason. Each card lists the questionnaire questions it answers and the suggested answer |
| 4 Questionnaire | `questionnaire.html`: 24 of 24 answered. Access control shows 4 questions, each with an Implemented / Partially / Not implemented pill and an evidence link; the other 3 sections are summarised | **Run analysis** shows 4 AI-proposed draft conclusions, one per section, with a note that each goes to review |
| 5 Review | `review.html`: queue of 4 items, all under "Needs your decision", with progress at 0 of 4. The Access rights observation sits next to two evidence citations, with Approve / Edit / Reject | **Approve** moves it to Decided, sets progress to 1 of 4 and shows "Approved by Priya Sharma on 16 Mar 2026. 3 conclusions still need a decision." |
| 6 Report | `report.html`: "Released by Priya Sharma" sign-off alert and the cropped p-05 board-report page | none |

Deleted as obsolete: `src/yozora/tour.ts`, `SceneStack.tsx`, `YozoraDemo.tsx`; `screens/engagements.html`, `new-engagement.html`, `client-upload.html`, `requests.html` (replaced by `rfi.html`). New: `src/yozora/screens.ts` (stage data and helpers) and `StageFrame.tsx`. Rewritten: `YozoraPage.tsx`, `YozoraPreview.tsx`, `yozora.css`. The screens come from a scratch generator that is not in the repo, so edit the HTML directly.

**Intro copy** (`YozoraPage.tsx`): "Yozora is an assessment workspace I am building for small GRC consulting firms." / "It runs a whole assessment end to end: scoping, the evidence request, evidence analysis, the questionnaire, review, tracking and the report. The AI drafts; the consultant approves every conclusion. This page shows six key moments." The grey line under it says these are approved designs on made-up data. The GitHub and prototype video links are kept, and "Concept · sample data" sits under the h1.

**Tile wiring (same API)**: `import { YozoraPreview } from '@/yozora/YozoraPreview'` and render `<YozoraPreview />` in place of the tile's `<video>`, wrapped in `<a href="/yozora">`. It is a 16:10 box with a hairline border.
- It loops through 9 frames, 2.2 s each, only while in view: scope, RFI, evidence before and after, questionnaire before and after, review before and after (scrolled to the approval line), and the report. Each revealed frame is scrolled so the result shows.
- It renders at 1200px on tiles 600px and wider, and at 600px on narrower tiles, then scales to fit.
- Under reduced motion it mounts one iframe and shows one still frame: the evidence analysis result.
- It is `role="img"` with an aria-label; the inner content is `aria-hidden` and `inert`.

**Screenshots** in `tasks/handoffs/screens/yozora-v3/`:
- `full-1440.png`, `full-390.png`
- `stageN-<vw>.png` for every stage, plus `stage3/4/5-after-<vw>.png` after the reveal
- `keyboard-focus-1440.png` (focus ring on Analyse)
- `preview-1440-1…9.png`, `preview-390-1…9.png`, `preview-1440-reduce-1.png`

I looked at all of the stage shots and fixed what I saw:
- The scope question legends sat on the group border.
- The engagement type select showed two chevrons.
- On phones, the scope button and the magic-link field were cramped.
- On phones, the conclusion rows squeezed the text beside the pill, so they now stack.
- On phones, the review title wrapped against its status.
- The approval line had an unstyled check icon.

**Test output**
- `npm run build`: passes. The yozora JS chunk is 6.77 kB (2.84 kB gzip).
- `npm test`: exit 0, **52 checks passed**. The `/yozora` block in `web/smoke-test.mjs` was rewritten. For each viewport it checks that:
  - the page has six stages and every screen loads;
  - Analyse, Run analysis and Approve each reveal their result, which was hidden before;
  - Reset hides the result and brings the button back, and revealing works again after a reset;
  - there is no overflow on the page, no sideways overflow in any screen, and no inner vertical scroll in any frame, both before and after the reveals;
  - the report sign-off is visible;
  - there are no console errors and no 4xx or failed requests.
- My own runs at 1440×900 and 390×844 found no overflow, no inner scroll and no console errors. They also covered the keyboard path: Tab goes into the frame and lands on Analyse, Enter reveals the result and focuses its heading, and Reset restores the screen and returns focus to Analyse. The preview was tested through a temporary harness page (since deleted): 6 iframes when playing, 1 under reduced motion, no overflow at 390.
- `tsc -b` and `oxlint src/yozora` are clean.

**Not verified / notes**
- Safari, Firefox, real phones and a real screen-reader pass. Chromium only.
- The site `Layout` still fades text in on scroll for every page. I did not change it because it is shared, so the page itself adds no effects of its own. If "no page-level effects" was meant to cover that fade too, Layout needs an opt-out.
- Frames are tall on phones (about 700 to 2,150px each) because there is no inner scrolling. The page scrolls normally.
- The Vercel caveat about `/yozora` next to `public/yozora/` still applies (unchecked).
- The preview is still not mounted on the homepage (handoff 3).

### v4 (trimmed + fitted)

**Text cut** (all screens): sidebar lost Home, Clients, Search and Settings; every `meta-line` under the h1 removed; "AI proposed" tags and helper/sub paragraphs removed.
- Scope: engagement name field, standards helper, GDPR and NIST options, question helper lines, scope-card intro; summary keeps 3 rows (24 questions, no section count). On phones the summary rows are hidden, the button stays.
- RFI: intro, design/operating explainer, sent counts, "showing 6 of 10"; 6 items cut to 4; kv labels now "Feeds" and "Because"; magic-link alert is one line plus the link and Copy link (link field hidden on phones).
- Evidence: upload dates, file size/type metadata; result cards cut to a one-line reason and one answered question ref each.
- Questionnaire: section intro, ISO refs, the "goes to review" footer; questions 4 to 2 with short refs; the three other-section rows removed; conclusions are one short line each.
- Review: subtitle, ISO refs in the queue, recommended action; observation one line; second citation reduced to the verdict (hidden on phones); approved line is "Approved by Priya Sharma · 16 Mar 2026".
- Report: AI-approval sentence, "Report versions", board report caption. Queue still 4 items, "0 of 4"/"1 of 4".

**Sizing**: `StageFrame.tsx` renders the iframe at a fixed design width (1200px desktop, 360px phones) and scales it with `transform: scale()` (origin top left) inside a wrapper sized to the scaled box, so clicks and focus map natively. Scale = min(1, column width / design width, height left / content height); on desktop the height left is the viewport minus the caption above and the Reset row, so caption plus frame fit one viewport; it re-fits after each reveal. Outer frame: 14px padding (10px phones), hairline border, paper-grey `#EFEEEA`; inner hairline-bordered panel; no dots or shadow. `yozora-story.css` also tightens page/card padding. Preview now renders at 1200px. Smoke test: reveal text check updated, new `fits` assertion (frame top/bottom inside the viewport, scale >= 0.6, before and after reveals).

**Effective text** (14px product base): 1440x900: 11.6 to 13.6px (scope 11.6, RFI 12.3, evidence 13.6, questionnaire 13.6, review ~13.5, report 12.2). 390x844: 10.7 to 13px (scope 10.8, RFI 10.7, review 11.8, others 12.7 to 13).

**Screenshots**: `tasks/handoffs/screens/yozora-v4/` (`stageN-1440.png`, `stageN-390.png`, `stage3/4/5-after-*.png`, `keyboard-focus-1440.png`).

**Tests**: `npm run build` passes; `npm test` 52 checks passed. Keyboard: Analyse focus ring visible, Enter moves focus to the result heading.

**Not verified / limits**: Phones cannot hold caption plus frame in one viewport (caption is ~40% of the screen), so only the frame is held to one viewport; scope and RFI stay under 12px there (10.7 to 10.8). Chromium only; no real device or screen reader. The preview was not re-screenshotted after the width change.
