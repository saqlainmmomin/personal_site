# Kickoff prompt - personal site design and build

Paste the section below into a fresh Claude Code session, run from the `personal-site/` directory. It assumes `CONTENT.md` and `prototypes/` exist alongside it.

---

I am building my personal website. It goes on job applications and has to work for three audiences at once: GRC and security leadership, research and advisory firms, and startup and product builder roles. One site, one narrative that reads differently depending on who is looking. The thread: "I see risk at the enterprise level, and I build the tools to close the gaps I find."

Read these first, in order, before responding:
1. `CONTENT.md` in this directory. It is the source of truth for concept, narrative, information architecture, and copy. Do not restate it back to me.
2. The three prototypes in `prototypes/` (`a.html`, `b.html`, `c.html`). The chosen direction is a merge of `b.html` (The Lens) and `c.html` (The Closing Window). I rejected `a.html` as too self-congratulatory. Understand why the merge works before proposing anything.

My background, projects, certifications, writing, and voice are already captured in `CONTENT.md` and in my Obsidian vault. Pull from there. Do not ask me to repeat anything that is already written down.

Hard ground rules, non-negotiable:
- Never use em dashes in any content.
- No emojis anywhere.
- No LinkedIn cliches ("passionate about", "leveraging", "driving impact").
- Bold used sparingly.
- Every design decision needs a reason beyond "it looks nice."
- Accessibility, sub-1s LCP, SEO, mobile-first. Deployable to Vercel or Netlify.

How I want you to work:

**Phase 0 - Questions first. Do not write any code yet.** Before you propose design guidelines or touch a single file, ask me about everything in the "Open decisions" list at the end of `CONTENT.md`, plus anything else genuinely ambiguous that will require my attention. Ask in focused rounds of two to four questions at a time, highest-leverage decisions first, using the structured question tool. For each question give me two or three real alternatives with the trade-offs, and your recommendation. Do not silently pick defaults on anything that changes the outcome. Do not proceed to the next phase until I have answered.

The decisions that must be settled in Phase 0 include, at minimum:
- Tone tier: personality-forward or professional with edge. Show me the same line written both ways so I can feel the difference.
- Primary audience right now and which lens loads by default.
- Lens scope: global persistent control across the site, or hero plus project cards only.
- Whether to name my current employer on a public, job-search-facing site.
- Repo and demo link strategy per project: public link, private case study, or described without a link.
- Canonical article URLs and whether to embed or link out.
- Photo or headshot, and CV or resume PDF download: include or not.
- Visual system: confirm the dual treatment (dark builder, light auditor) or a unified palette, and the type direction.
- Stack and host: give me your recommendation with reasoning, then confirm.
- Which figures from the data section I am comfortable publishing.
- v1 scope: what ships first, what is deferred.

**Phase 1 - Design guidelines.** Once my answers are in, write a `DESIGN.md`: the visual system (color, type scale, spacing, grid), the interaction model for the lens and the scroll viz, motion and reduced-motion behavior, accessibility approach for both mechanics (the lens drag and the scroll-driven chart need keyboard and reduced-motion fallbacks), responsive behavior, and the component inventory. No code yet. Get my sign-off.

**Phase 2 - Build.** Pick the stack you recommended and build the real thing against `DESIGN.md` and `CONTENT.md`. Serve it locally and verify in a browser as you go: check console for errors, screenshot key states, test the lens interaction and the scroll viz, test mobile and reduced-motion. Share proof, do not ask me to check manually. Then prepare it for deployment.

State your assumptions before implementing. For non-trivial choices, ask whether there is a more elegant approach before committing. Touch only what is necessary and match a consistent style throughout.

Start with Phase 0 now. Ask your first round of questions.
