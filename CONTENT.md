# Personal Site - Content Document

Working source of truth for the site. Concept, narrative, information architecture, and the actual copy. Pulled from the Obsidian vault. This is the input to the design/build session. It is not final: tone tier and several decisions are deliberately left open for the kickoff question round (see the end).

Ground rules for all copy: no em dashes, no emojis, no LinkedIn cliches ("passionate about", "leveraging", "driving impact"), bold used sparingly. Sourced claims over vague assertions. Voice: confident practitioner, not thought leader. Direct, specific, occasionally dry, never preachy.

---

## 1. The concept (merge of "The Lens" and "The Closing Window")

Two mechanics, one site:

- **The Lens (perspective).** You build and you audit. Most people pick a lane. The site lets the reader hold both readings of the same work at once: a Builder reading (what I made, the stack, the architecture) and an Auditor reading (what risk it closes, why the control exists). A control the reader operates, not a theme toggle.
- **The Closing Window (pace).** A scroll-driven data section that argues why the build-and-audit combination matters now: defenders run on human cycles, attackers run on machine cycles, frameworks lag by years, and the gap compounds. The work is then plotted as the response to that gap.

The synthesis: **the lens is how you read the site, the window is why it matters.** Identity and projects are dual-readable through the lens. The argument section is the data narrative. The projects sit between them as the answer.

The single thread that ties it together:

> I see risk at the enterprise level, and I build the tools to close the gaps I find.

---

## 2. Audiences and how the site serves each

One site, three readings. Nothing on the page should pander to one and alienate another.

| Audience | What they need to see | Where the site delivers it |
|----------|----------------------|----------------------------|
| GRC / security leadership (CISO, Head of Risk) | Understands why controls exist, communicates risk to a board, evidence over checkbox | Auditor lens default, the Closing Window argument in their language, projects framed as risk closed |
| Research / advisory firm | A point of view, sourced, externalized as structure | The Closing Window reads like a publishable interactive thesis; the writing section is the output |
| Startup / product / builder | Can actually build, ships, treats speed as a feature | Builder lens, real stacks and architecture, the parallel-scanner and adaptive-engine detail |

Open question for kickoff: which audience is primary right now, and which lens loads by default.

---

## 3. Information architecture (scroll order)

1. **Hero / The Lens** - identity in two readings, the seam, the thread line.
2. **The Closing Window** - the argument: human vs machine pace, framework lag, the widening gap. Scroll-driven data viz. Numbers, sourced.
3. **The Work** - projects as the response to the gap. Each card readable through both lenses.
4. **Field notes** - selected published analysis with its hooks and links.
5. **Who** - the audit grounding: role, certifications, sectors, education. Compact and factual.
6. **Contact** - email, LinkedIn, GitHub.

The lens control persists across Hero and The Work (and optionally section intros). The Closing Window is single-voice. Who and Contact are neutral.

---

## 4. Copy

### 4.1 Hero (dual reading)

**Builder reading**
- Headline: I build security tools.
- Sub: Async Python, FastAPI, the Anthropic SDK, Swift, n8n. Understand by shipping.

**Auditor reading**
- Headline: I assess where systems break.
- Sub: Four years auditing controls at enterprise scale. I know why a control exists, not just that someone ticked the box.

**Thread line (shown at the seam, or persistent regardless of lens)**
- I see risk at the enterprise level, and I build the tools to close the gaps I find.

### 4.2 The Closing Window (single voice)

Section opener:
- Eyebrow: The argument
- Headline: The window is closing.
- Lead: Defenders run on human cycles. Quarterly scans, annual pentests, patch SLAs measured in weeks. Attackers now run on machine cycles. The gap between the two is the story of my work.

Scroll steps (caption stack that drives the chart):
1. Two timelines, same starting point. A decade ago, defenders and attackers moved at roughly the same pace. Both bounded by human effort, human review, human salaries.
2. Then one of them stopped being human. AI task autonomy is doubling every 89 days. Vulnerability discovery windows collapse from months to minutes. Source: METR task-horizon data.
3. The defender's line barely moves. Frameworks lag reality by three to five years. ISO 27001 was updated in 2022, a decade overdue. NIST CSF only added Govern in 2024. Sources: ISO 27001:2022, NIST CSF 2.0.
4. This shaded gap is the risk. Every defensive delay is now measured against autonomous iteration. The structural disadvantage compounds daily. This is the space I build into.

Stat band (count-up, each sourced):
- 89 days. The time it takes for AI task autonomy to double. Your patch cycle did not get twice as fast this quarter. Source: METR.
- 97M. Downloads weaponized in a single PyPI supply-chain attack. It was caught only because it had a bug that crashed machines. That is luck, not a control. Source: PyPI transitive dependency attack.
- 3 to 5 years. How far compliance frameworks lag the threats they are meant to govern. The standards exist. The migration does not. Sources: ISO 27001:2022, NIST CSF 2.0, post-quantum standards.

### 4.3 The Work (dual reading per project)

**CyberAssess** - tag: compliance maturity platform
- Builder: Six frameworks, 400 controls, one adaptive engine. A three-phase engine cuts 157 questions to about 35. Desk review pre-fills from documents, a tier engine assigns depth, a screening pass infers the rest. Scoring is deterministic and server-side: the model writes language, code decides the number. Python 3.13, FastAPI, Anthropic SDK, SQLAlchemy.
- Auditor: It closes the self-attestation gap I watched repeat across every client. Most platforms accept what a company declares about itself. Self-attestation is not assurance. CyberAssess reads the evidence first, the way a seasoned auditor does, then asks only what a human still needs to answer. Validated against 15 planted gaps across three synthetic companies: zero missed.
- Numbers: 6 frameworks, 400 controls, 157 to 35 questions, 5.2 hrs to 1.5 hrs, 0 missed of 15.

**CyberDD** - tag: cyber due diligence for M&A
- Builder: Six scanners, running in parallel. Async Python so the scanners run concurrently, because the speed is the product. A deterministic red-flag detector runs before the AI analysis. React 19 on the front for fast iteration.
- Auditor: A three-day due-diligence review is already a control failure. Attackers iterate at machine speed. If it takes three days to know whether a target is sound, the answer arrives after it matters. Speed is a control. No certificate is a deal-breaker regardless of what the model thinks.
- Numbers: 6 concurrent scanners, 3 days to 60 seconds.

**Verified** - tag: evidence-based compliance
- Builder: Full-stack on Next.js 14 and Supabase. Auth, storage, and row-level security out of the box, Docker for deployment flexibility.
- Auditor: Built to kill self-attestation. An AI analyzes the actual document, a human confirms. That is the minimum standard that should exist, and almost no tooling meets it.

**Velocity** - tag: AI capability tracker
- Builder: A capability tracker scored against my own profile. React, Express, SQLite, Gemini, an n8n workflow that ingests AI news automatically.
- Auditor: I track AI capability the way I track a threat landscape. Quarterly shifts matter. Generic AI news is noise; relevance to the work is the signal.

Note: CyberAssess and CyberDD are the lead projects. Verified and Velocity are secondary. Repo visibility and live links are an open question (see section 7).

### 4.4 Field notes (writing)

Intro: I publish a position, with the data attached. Sixteen articles for security and GRC practitioners. The recurring thesis: this is not IT security for AI tools, it is systems security for synthetic cognition.

Selected pieces (need canonical LinkedIn URLs, see section 7):
- The recursion is tightening. AI agents are no longer tools. They have inboxes, credentials, execution budgets, and production access. The relevant security object is an autonomous system, not a chatbot.
- The control problem just became a deployment problem. Code autonomy, agent persistence, and silicon economics colliding in the threat landscape.
- CI/CD pipelines are already autonomous agents. A pipeline with publish tokens reads environmental state, chains tools, and executes with minimal human oversight. If your agent security excludes CI/CD, it threat-models the demo while production stays exposed.
- The standards exist. The migration does not. Post-quantum cryptography is not a cryptography problem for enterprises. It is an inventory, vendor-management, and migration-timeline problem.
- The environment is part of the attack surface. On the Google DeepMind agent-traps research: an attacker does not need model access if they can place content where the agent will read it.

### 4.5 Who (credentials, compact and factual)

- Assistant Manager, Cyber Strategy and Governance, KPMG.
- ISO 27001, ISO 27701, ISO 22301 Lead Auditor.
- B.Tech in Information Technology and MBA in Finance, NMIMS.
- Work: pre-certification readiness (ISO 27001 / 27701 / 22301), third-party risk program design for financial services and fintech, technology risk assessments, and board-level reporting.
- Sectors: financial services, fintech, SaaS.

Open question: whether to name the current employer on a public, job-search-facing site (see section 7).

### 4.6 Outside the work (TO FILL - placeholders in build)

New section, added in the build session. Single voice, light/serif register, sits between Who and Contact. Dry and specific, no "passionate about". Three strands. All copy below is PLACEHOLDER and flagged for Saqlain to replace before launch (section title and strand labels also adjustable).

- Reading (intellectual inputs; can tie to the "track AI capability like a threat landscape" thesis):
  - [PLACEHOLDER] What you are reading now, and the recurring kind of thing you read. One or two specific titles or domains beat a vague genre.
- What I'm chasing (ambitions / goals, forward-looking, on-thesis):
  - [PLACEHOLDER] Where you are taking the work over the next few years. Concrete direction, not a mission statement.
- Off the clock (a few concrete personal notes):
  - [PLACEHOLDER] Two or three specific things. Concrete beats categorical ("restoring a 1990s synth" over "music").

### 4.7 Contact

- Email: saqlainmmomin@gmail.com
- LinkedIn: [URL needed]
- GitHub: [URL needed]
- Closing line option: The frameworks will catch up eventually. I would rather be early.

---

## 5. Data and sources (for the Closing Window)

| Figure | Claim | Source |
|--------|-------|--------|
| 89 days | AI task-autonomy doubling period | METR task-horizon data |
| months to minutes | Vulnerability discovery/exploitation window collapse | Article corpus, agentic AI security thesis |
| 3 to 5 years | Framework lag behind threats | ISO 27001:2022 (decade overdue), NIST CSF 2.0 added Govern in 2024 |
| 97M | Downloads weaponized in one PyPI attack | PyPI transitive dependency attack |
| 157 to 35 | CyberAssess questions answered by a human | CyberAssess validation, adaptive engine |
| 0 of 15 | Gaps missed in validation | CyberAssess validation run, 3 synthetic companies |
| 3 days to 60s | CyberDD turnaround | CyberDD |

All figures are the candidate's own published claims or project metrics. Confirm comfort with publishing each (section 7).

---

## 6. Voice and tone

Two tiers to decide between in the kickoff:

- **Personality-forward.** Sharper hooks, more visible point of view, compression-heavy lines ("The recursion is tightening"). More bite.
- **Professional with edge.** Restrained and credible, selective bite, safer for enterprise eyes.

Patterns to keep regardless of tier: reframing lines (state what the event is really about), assumption-break framing (name the control assumption that no longer holds), concrete to structural (one event, then the system-level implication), and a sharp question over a call to action.

---

## 7. Open decisions (deferred to the kickoff question round)

These need the candidate's input before design guidelines are locked or code is written:

1. Tone tier: personality-forward or professional with edge.
2. Primary audience right now, and which lens loads by default.
3. Lens scope: global persistent control, or hero plus project cards only.
4. Naming the current employer (KPMG) on a public job-search site.
5. Repo and demo links: which projects are public, which are described as case studies without a live link, and whether private repos can be referenced.
6. Article links: canonical LinkedIn URLs for the selected pieces, and whether to embed or link out.
7. Photo or headshot: include or stay text-only.
8. Resume or CV download: include a PDF or not.
9. Visual system: confirm the dual treatment (dark builder, light auditor) or pick a unified palette. Typography direction (mono plus serif from the prototypes, or new).
10. Stack and deployment: framework choice, host, custom domain name.
11. Comfort publishing each figure in section 5.
12. v1 scope: which sections ship first, what is deferred.
