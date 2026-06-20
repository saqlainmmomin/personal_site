   # Content Review — What Is Live Right Now

   This file is for you to read, mark up, and send back.
   Every piece of copy that currently renders on the site is reproduced below, verbatim.

   **How to leave notes:** add a line starting with `> NOTE:` anywhere below.
   Placeholders are marked **[PLACEHOLDER]**.

   Issues I noticed are flagged with `**FLAG:**`.

   ---

   ## 0. Navigation bar

   **Links:** Window · Work · Notes · Who · Contact

   > NOTE:

   ---

   ## 1. Hero

   **Eyebrow — Auditor mode:** Cyber Strategy & Governance
   **Eyebrow — Builder mode:** Build & Ship

   **Name (always visible):** Saqlain Momin

   **Headline (always visible — the through-line):**
   I see risk at the enterprise level, and I build the tools to close the gaps I find.

   **Sub-paragraph — Auditor mode:**
   Four years auditing controls at enterprise scale — I know why a control exists, not just that someone ticked the box.
   >  NOTE: Four years inside enterprise controls — I know why a control exists, who owns it, and what breaks when it doesn't. ( UPDATED )

   **Sub-paragraph — Builder mode:**
   Async Python, FastAPI, the Anthropic SDK, Swift, n8n. Understand by shipping.

   **Toggle:** Auditor | Builder

   > NOTE:

   ---

   ## 2. The Argument (scroll-driven chart)

   **Eyebrow:** The argument

   **Heading:** The window is closing.

   **Lead:**
   Defenders run on human cycles. Quarterly scans, annual pentests, patch SLAs measured in weeks. Attackers now run on machine cycles. The gap between the two is the story of my work.

   ### Chart steps (4 captions that appear as you scroll)

   **Step 1:** Two timelines, same starting point.
   A decade ago, defenders and attackers moved at roughly the same pace. Both bounded by human effort, human review, human salaries.

   **Step 2:** Then one of them stopped being human.
   AI task autonomy is doubling every 89 days. Vulnerability discovery windows collapse from months to minutes.
   *Source: METR task-horizon data*

   **Step 3:** The defender's line barely moves.
   Frameworks lag reality by three to five years. ISO 27001 was updated in 2022, a decade overdue. NIST CSF only added Govern in 2024.
   *Source: ISO 27001:2022, NIST CSF 2.0*

   **Step 4:** This shaded gap is the risk.
   Every defensive delay is now measured against autonomous iteration. The structural disadvantage compounds daily. This is the space I build into.

   > NOTE:

   ### Stats (count-up on scroll)

   **89 days**
   The time it takes for AI task autonomy to **double**. Your patch cycle did not get twice as fast this quarter.
   *Source: METR*

   **97M**
   Downloads weaponised in a single PyPI supply-chain attack. It was caught only because it had a bug that crashed machines. **That is luck, not a control.**
   *Source: PyPI transitive dependency attack*

   **3–5 yrs**
   How far compliance frameworks lag the threats they are meant to govern. **The standards exist. The migration does not.**
   *Source: ISO 27001:2022 / NIST CSF 2.0 / post-quantum*

   > NOTE:

   ---

   ## 3. The Work

   **Eyebrow:** The work

   **Heading:** The response.

   **Lead:**
   Four years auditing controls at enterprise scale taught me where they fail. I build into the lag instead of writing about it.

   > NOTE:

   ---

   ### Project 1 — CyberAssess
   **Tag label:** compliance maturity platform

   **Auditor title:** It closes the self-attestation gap I watched repeat across every client.
   **Auditor body:** Most platforms accept what a company declares about itself. Self-attestation is not assurance. CyberAssess reads the evidence first, the way a seasoned auditor does, then asks only what a human still needs to answer. Validated against 15 planted gaps across three synthetic companies: zero missed.
   **Auditor meta:** 6 frameworks · 400 controls · 157 to 35 questions · 0 missed of 15

   **Builder title:** Six frameworks, 400 controls, one adaptive engine.
   **Builder body:** A three-phase engine cuts 157 questions to about 35. Desk review pre-fills from documents, a tier engine assigns depth, a screening pass infers the rest. Scoring is deterministic and server-side: the model writes language, code decides the number.
   **Builder meta:** Python 3.13 · FastAPI · Anthropic SDK · SQLAlchemy

   **Demo/link:** [PLACEHOLDER]

   > NOTE (what does the UI look like? what would show a reader what this does?): so lets position cyber assess as a full scope auditing tool that can be used by consultants of internal audit teams to simplify the auditing process. the idea is that the tool replicates what an auditor does natively- highlight context gatherig phase, call 0 desk review, UCC grouping for ensuring control covergage across multiple standards. Custom assessment frameworks based on company's scope and requirements. The tool also does evidence review takes human confirmation for any infered responses etc. ( read vault notes for the tool to get more details)

   ---

   ### Project 2 — CyberDD
   **Tag label:** cyber due diligence for M&A

   **Auditor title:** A three-day due-diligence review is already a control failure.
   **Auditor body:** Attackers iterate at machine speed. If it takes three days to know whether a target is sound, the answer arrives after it matters. Speed is a control. No certificate is a deal-breaker regardless of what the model thinks.
   **Auditor meta:** 6 concurrent scanners · 3 days to 60 seconds

   **Builder title:** Six scanners, running in parallel.
   **Builder body:** Async Python so the scanners run concurrently, because the speed is the product. A deterministic red-flag detector runs before the AI analysis. React 19 on the front for fast iteration.
   **Builder meta:** async Python · FastAPI · React 19

   **Demo/link:** [PLACEHOLDER]

   > NOTE (what does the UI look like? what would show a reader what this does?): as you perviously mentioned the first and second project are very similar, need to position this as something specific for conducting preliminary third party assessments using publiclally available information. we have to change the name of the project as well. this is the tool that does pre-onboarding assessment for vendors. Cyber Assess is the full scope audit platform. this is my view you can tell me if this is the right way to approach or if we should take a different approqch. 

   ---

   ### Project 3 — Verified
   **Tag label:** evidence-based compliance

   **Auditor title:** Built to kill self-attestation.
   **Auditor body:** An AI analyzes the actual document, a human confirms. That is the minimum standard that should exist, and almost no tooling meets it.
   **Auditor meta:** evidence first · human confirms

   **Builder title:** Full-stack on Next.js 14 and Supabase.
   **Builder body:** Auth, storage, and row-level security out of the box, Docker for deployment flexibility.
   **Builder meta:** Next.js 14 · Supabase · Docker

   **Demo/link:** [PLACEHOLDER]

   **FLAG:** Projects 1 and 3 both fight self-attestation. Right now they blur together — a reader sees the same thesis twice. Either sharpen the distinction (what does Verified do that CyberAssess doesn't? different scope? earlier stage?), or fold it in as a feature of CyberAssess rather than a standalone project. 

   > NOTE: lets remove this project completely from this scope. i was thingking after showing two tools related to compliance we can highlight somethings i am doing with AI. we can talk about the RL simulations i have build in my free time and show them off- there is a snake game, the priosers dilama etc. we can also talk throguh some other project ideas soecificly build for showing off on the website. 

   ---

   ### Project 4 — Velocity (AI Capability Tracker)
   **Tag label:** AI capability tracker

   **Auditor title:** I track AI capability the way I track a threat landscape.
   **Auditor body:** Quarterly shifts matter. Generic AI news is noise; relevance to the work is the signal.
   **Auditor meta:** quarterly shifts · signal over noise

   **Builder title:** A capability tracker scored against my own profile.
   **Builder body:** React, Express, SQLite, Gemini, an n8n workflow that ingests AI news automatically.
   **Builder meta:** React · Express · SQLite · Gemini · n8n

   **Demo/link:** [PLACEHOLDER]

   > NOTE (what does the UI look like? scoring UI? feed view? dashboard?): this tool was built so that i could track the ai progress relevant to me and get an overall sense of direction on all prohress in the field of AI and help me keep up by upskilling (refer to vault notes for moe details)

   ---

   ## 4. Field Notes

   **Eyebrow:** Field notes

   **Heading:** I publish a position, with the data attached.

   **Lead:** Sixteen articles for security and GRC practitioners. The recurring thesis: this is not IT security for AI tools, it is systems security for synthetic cognition.

   **FLAG:** The lead says "Sixteen articles" but only 7 are loaded in the content folder. Fix the number or add 9 more articles.

   ### Articles (in display order)

   1. Your CI/CD pipeline is an AI agent. You just haven't threat-modeled it like one.
      *A pipeline with publish tokens reads state, chains tools, and acts with little oversight. A Red Hat supply-chain compromise maps cleanly onto DeepMind's six classes of agent attack.*

   2. AI now surpasses human security researchers in vulnerability discovery.
      *Claude found thousands of zero-days across major operating systems and browsers, including a 16-year-old bug automated tools had missed five million times. The speed and scale move past human review.*

   3. Google DeepMind published a paper that reframes how to think about AI agent security.
      *The vulnerability is the environment, not the model. An attacker does not need model access if they can place content where the agent will read it.*

   4. 100 million weekly downloads. Zero warning. One compromised maintainer.
      *A hijacked axios npm account shipped a cross-platform backdoor that exfiltrated credentials, then self-destructed. The supply chain is a control surface most programs still treat as trusted.*

   5. The invisible exponential: why AI progress is moving faster than anyone can see.
      *Autonomous task complexity is doubling roughly every 89 days. Most security programs are still scoped against a pace that no longer exists.*

   6. Anthropic just tanked cybersecurity stocks. Here is what it actually means.
      *Claude Code Security reasons about vulnerabilities instead of pattern-matching, which pressures the SAST and DAST market and the vendor pricing built on tooling limits.*

   7. The control problem just became a deployment problem.
      *AI-generated production code, persistent agents, and inverted economics now favor the attacker. Human-speed security processes cannot keep the pace.*

   > NOTE (add more? reorder? any should be cut?): all the articles are in the obsidian vault. you can pick them up from there

   ---

   ## 5. Who

   **Heading:** The audit grounding.

   **Lead:** Pre-certification readiness for ISO 27001, 27701, and 22301. Third-party risk program design for financial services and fintech. Technology risk assessments and board-level reporting.

   **Fact rows:**

   | Label | Current value |
   |-------|--------------|
   | Role | Assistant Manager, Cyber Strategy & Governance, at a Big Four firm |
   | Certifications | ISO 27001, ISO 27701, ISO 22301 Lead Auditor |
   | Education | B.Tech in Information Technology and MBA in Finance, NMIMS |
   | Sectors | Financial services, fintech, SaaS |

   **CV link text:** Download CV (PDF)

   **FLAG:** The role says "a Big Four firm" — the original planning doc noted KPMG but left the naming as an open question. Decide: name the firm or keep it as-is. lets add KPMG's name to the site.

   > NOTE (anything to update — title, certs, sectors?):

   ---

   ## 6. Outside the Work

   **Heading:** The rest of it.

   Three strands — all **[PLACEHOLDER]**:

   - **Reading** — what you're reading now, and the recurring kind you read. Specific titles beat genres- currently reading the following- The Enigma of Reason: A New Theory of Human Understanding (2017) by cognitive scientists Hugo Mercier and Dan Sperber, The art of doing science and engineering by RIchard Hamming, The restaurant at the end of the universe by Douglas Adams, & Discourses of Epictetus. (rather than just writing names of all the books can we add a 3d book asset that users can flip around or amybe a picture or something)
   - **What I'm chasing** — where you're taking the work over the next few years. Concrete direction, not a mission statement. ( the one goal i have in life is to learn as much as posisble, stay curious, keep building, i resonate with the idea that there is no better time than today to have problems. (this can be discussed and paraphased further))
   - **Off the clock** — two or three specific things. Concrete beats categorical ("restoring a 1990s synth" over "music"). ( I go surfing any chance i get, )

   > NOTE (fill all three in — this is the most personal section and is currently 100% placeholder):  Reading- A New Theory of Human Understanding (2017) by cognitive scientists Hugo Mercier and Dan Sperber, The art of doing science and engineering by RIchard Hamming, The restaurant at the end of the universe by Douglas Adams, & Discourses of Epictetus. (rather than just writing names of all the books can we add a 3d book asset that users can flip around or amybe a picture or something) What I'm chasing- the one goal i have in life is to learn as much as posisble, stay curious, keep building, i resonate with the idea that there is no better time than today to have problems. (this can be discussed and paraphased further)- off the clock- I go surfing any chance i get, i am a huge coffee enthusiast, hotwheels collector.

   ---

   ## 7. Contact / Footer

   **Eyebrow:** Contact

   **Heading:** The frameworks will catch up eventually. I would rather be early.

   **Links:**
   - saqlainmmomin@gmail.com
   - linkedin.com/in/saqlain-musa/ *(live)*
   - github → https://github.com/saqlainmmomin

   > NOTE:

   ---

   ## 8. Still missing / needs a decision

   | Item | Status |
   |------|--------|
   | GitHub URL | Needed |
   | Real CV PDF | Needed |
   | Project demo/repo links | All 4 are "case study" placeholders |
   | Outside the Work copy | All 3 strands are placeholder |
   | Field Notes count | Says "16", only 7 exist |
   | Projects 1 & 3 overlap | Need clearer distinction or merge |
   | Name the employer (KPMG vs Big Four) | Open |
   | Screenshots for any project | None yet |
