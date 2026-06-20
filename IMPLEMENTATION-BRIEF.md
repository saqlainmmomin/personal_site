# Implementation Brief — Personal Site Content Update

This document contains all finalized copy decisions. Implement every change below. Do not re-discuss or re-draft — all copy is locked.

Read the full current site codebase before starting. Understand the component structure, content data model, and rendering before making changes.

---

## 1. Hero — Auditor sub-paragraph

**Replace the current Auditor sub-paragraph with:**
> Four years building controls at enterprise scale — I know why a control exists, who owns it, and what breaks when it doesn't.

No other Hero changes.

---

## 2. Project 1 — CyberAssess (repositioned)

**Tag:** full-scope audit platform

**Auditor title:** Built for the way an auditor actually works — not the way software vendors assume they do.

**Auditor body:** CyberAssess reads the evidence before it asks a single question. Every uploaded document is reviewed first — the tool arrives with a picture of what's already answered, what's partial, and what's missing. Questions then adapt to what actually requires human judgement. Controls that map to multiple frameworks are assessed once, not once per standard. The result is end-to-end coverage across an organisation's compliance landscape without the time it would normally cost.

**Auditor meta:** DPDPA · ISO 27001 · GDPR · HIPAA · NIST CSF · PCI-DSS · SOC 2 + GLBA planned

**Builder title:** Multi-call Claude pipeline with a strict rule: the model writes language, the code decides the number.

**Builder body:** Six compliance frameworks defined as Python dicts — version-controlled, embeddable directly into Claude's system prompt, never stored in the database. A framework abstraction layer maps overlapping controls into Unified Control Clusters so the questionnaire de-duplicates at the data level. The Claude pipeline separates evidence extraction from gap analysis, with prompt caching on the static requirements block to keep cost flat across assessments. Every response tracks its source — human, document, inferred, or overridden — from input through to the final PDF. A dependency DAG sequences the remediation roadmap so fixes respect implementation order. Root cause clustering groups gaps by category (policy, process, technology, people, governance) to generate strategic initiatives, not just a list of findings. No SPA — Jinja2 + HTMX, full server round-trips, zero client state.

**Builder meta:** Python 3.13 · FastAPI · Anthropic SDK · SQLAlchemy · Jinja2 + HTMX

---

## 3. Project 2 — Rename CyberDD → Recon

**Tag:** vendor pre-onboarding screen

**Auditor title:** Know what a vendor's external signals say before you open the door.

**Auditor body:** Before a vendor questionnaire, before a contract, before access is granted — Recon reads what's already publicly visible. Six scanners run against a domain simultaneously: DNS configuration, SSL/TLS posture, tech stack, breach exposure, security headers, and organisational signals. A red-flag detector runs before any AI interpretation. No access required, no questionnaire to fill. One domain, 60 seconds.

**Auditor meta:** 6 scanners · public signals only · 60 seconds

**Builder title:** Six async scanners and a hard-rules detector that runs before the AI.

**Builder body:** Scanners run concurrently — speed is the product. A deterministic red-flag layer fires first (NEGOTIATE / INVESTIGATE / WALK_AWAY verdicts), keeping the model in its lane: interpretation, not gatekeeping. React 19 on the front for fast iteration.

**Builder meta:** async Python · FastAPI · React 19

**Important:** Rename every occurrence of "CyberDD" to "Recon" across the codebase — component names, file names, content strings, alt text, everything.

---

## 4. Project 3 — Remove Verified, replace with Lab

**Remove all Verified content.** Replace the entire Project 3 slot with:

**Tag:** reinforcement learning · game theory

**Auditor title:** What happens when you let a system learn from rules alone.

**Auditor body:** A snake that taught itself to survive. A prisoner's dilemma you can play — pick a strategy, run it against a population, watch cooperation emerge or collapse. A landing sequence a reinforcement agent learned without being told what "landing" looks like. These are experiments, not products. Simple environments, emergent behaviour, and the occasional surprise when the agent finds something you didn't plan for.

**Auditor meta:** Python · PyTorch · reinforcement learning

**Builder title:** Reinforcement learning environments built in free time.

**Builder body:** Each simulation: define an environment, set a reward signal, let the agent learn. The prisoner's dilemma is interactive — pick a strategy and watch it run against a population over thousands of iterations. A grid-world snake agent, a spacecraft landing sequence, a car-driving environment. Built in Python and PyTorch. Some finished, some still in progress.

**Builder meta:** Python · PyTorch · RL environments

---

## 5. Project 4 — Velocity (revised copy)

**Tag:** personal AI signal tracker

**Auditor title:** I track AI capability the way I track a threat landscape — against what actually affects my work.

**Auditor body:** AI developments are everywhere — posts, threads, announcements, most of it hype, very little of it signal. And almost none of it helps you work out what any of it means for your specific work. Velocity filters against a professional profile: each development is scored as an opportunity, a disruption, or a knowledge gap — relative to what you actually do. Before taking on work AI might already handle, a calibration test answers it directly.

**Auditor meta:** relevance scoring · personal profile · weekly digest

**Builder title:** A relevance engine for AI news, scored against your own profile.

**Builder body:** n8n ingests AI developments automatically. Gemini classifies each one as opportunity, disruption, or knowledge gap and scores its relevance against your uploaded CV or manual profile. Calibration mode lets you query specific upcoming tasks. React + Express front, SQLite back, weekly digest output.

**Builder meta:** React · Express · SQLite · Gemini · n8n

---

## 6. Field Notes — add all 16 articles

**Update the lead to:** "Fifteen articles for security and GRC practitioners."

Remove Article 14 (carousel repost of Article 13). Add 8 articles that are currently missing from the site. The full ordered list with titles and summaries:

1. **The recursion is tightening.**
   *AI agents now have inboxes, credentials, and production access. Most security programs are designed for a pre-LLM threat landscape. This is not IT security for AI tools — it is systems security for synthetic cognition.*

2. **The control problem just became a deployment problem.**
   *AI-generated production code, persistent agents, and inverted economics now favor the attacker. Human-speed security processes cannot keep the pace.*

3. **Dario Amodei says the AI diffusion bottleneck is literally GRC.**
   *Amodei named security permissions, legal review, and compliance cycles as the primary friction slowing enterprise AI adoption. That makes our domain both a gatekeeper and an accelerator.*

4. **Anthropic just tanked cybersecurity stocks. Here is what it actually means.**
   *Claude Code Security reasons about vulnerabilities instead of pattern-matching, which pressures the SAST and DAST market and the vendor pricing built on tooling limits.*

5. **The ghost and the dish: the week biology and machines started merging.**
   *A fruit fly's brain was uploaded into a computer and moved a virtual body. Living human neurons learned to play DOOM. Nobody is governing any of this.*

6. **The invisible exponential: why AI progress is moving faster than anyone can see.**
   *Autonomous task complexity is doubling roughly every 89 days. Most security programs are still scoped against a pace that no longer exists.*

7. **Claude Skills: the system layer most AI users don't know exists.**
   *Skills are modular instruction sets that give Claude domain-specific expertise. For anyone in GRC, where consistency is non-negotiable, it is the difference between using AI as a novelty and as infrastructure.*

8. **A PyPI package with 97 million downloads was weaponized yesterday.**
   *A single pip install exfiltrated SSH keys, cloud credentials, and crypto wallets through a transitive dependency three layers deep. It was caught only because it had a bug that crashed machines.*

9. **Anthropic's leaked Mythos model turned into a malware factory within eight hours.**
   *The Capybara tier scores dramatically higher than Opus 4.6 in cybersecurity benchmarks. Traditional perimeter tools are structurally inadequate against models that reason about architecture, not patterns.*

10. **Everything is a context problem.**
    *Every AI session starts from zero. The fix is not a smarter model — it is giving the model a memory system. Two layers built on Obsidian and MCP that compound on each other.*

11. **100 million weekly downloads. Zero warning. One compromised maintainer.**
    *A hijacked axios npm account shipped a cross-platform backdoor that exfiltrated credentials, then self-destructed. The supply chain is a control surface most programs still treat as trusted.*

12. **Google just published a whitepaper claiming they can break Bitcoin's encryption in 9 minutes.**
    *A quantum computer capable of breaking Bitcoin's curve is capable of breaking TLS. The standards exist. The migration doesn't. Most enterprises haven't completed a cryptographic inventory.*

13. **Google DeepMind published a paper that reframes how to think about AI agent security.**
    *The vulnerability is the environment, not the model. An attacker does not need model access if they can place content where the agent will read it.*

14. **AI now surpasses human security researchers in vulnerability discovery.**
    *Claude found thousands of zero-days across major operating systems and browsers, including a 16-year-old bug automated tools had missed five million times. The speed and scale move past human review.*

15. **Your CI/CD pipeline is an AI agent. You just haven't threat-modeled it like one.**
    *A pipeline with publish tokens reads state, chains tools, and acts with little oversight. A Red Hat supply-chain compromise maps cleanly onto DeepMind's six classes of agent attack.*

**Full article text** for all 16 is in the Obsidian vault at `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Brain/all articles.md`.

---

## 7. Who — name KPMG

Change role line from:
> Assistant Manager, Cyber Strategy & Governance, at a Big Four firm

To:
> Assistant Manager, Cyber Strategy & Governance, at KPMG

---

## 8. Outside the Work

### Reading
Display these four books with **3D CSS flip card interaction** (hover/click to flip, show title + author on front, could show a short note on back):
- The Enigma of Reason — Hugo Mercier & Dan Sperber
- The Art of Doing Science and Engineering — Richard Hamming
- The Restaurant at the End of the Universe — Douglas Adams
- Discourses of Epictetus

### What I'm chasing
> Everything I'm building comes from trying to understand something I don't yet. I've landed on the belief that the best moment to have a hard problem is today. Not because it gets easier, but because you're already in it.

### Off the clock
> I surf when the ocean cooperates. I take coffee too seriously and I collect Hot Wheels — the latter started in childhood and I've never found a good reason to stop.

---

## 9. Contact — GitHub URL

Set GitHub link to: https://github.com/saqlainmmomin

---

## Implementation notes

- Read the full codebase before starting. Understand the component structure, data model, and how content is currently rendered.
- The site uses an Auditor/Builder toggle — every project has two versions of its copy. Make sure both are updated.
- For the 3D book flip cards: build as a reusable CSS component. Pure CSS transform preferred over JS animation libraries.
- For the 9 new articles: match the data format of the 7 existing articles exactly. Full article text is in the Obsidian vault file referenced above.
- Search for all occurrences of "CyberDD", "Verified", "Big Four firm", and the old hero sub-paragraph to ensure nothing is missed.
