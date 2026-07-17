# Handoff: Build a chat-only "handoff" skill for claude.ai Projects

> Audience: Claude (chat interface, work laptop — no Claude Code, no filesystem).
> Paste this whole file into the chat, or add it as a Project document, then say "execute this handoff".

## Goal

Saqlain works on his work laptop through claude.ai **chat only** (no Claude Code). He uses
Projects to draft policies and GRC deliverables. Long tasks span multiple chat sessions, and
each new session starts cold. Build a **handoff protocol** he can invoke by typing a keyword
(e.g. `/handoff`) that lets him:

1. **Stop a session while preserving context** — the assistant produces a compact,
   self-contained handoff block capturing the task state.
2. **Resume in a fresh session** — pasting that block (or pointing at it in the Project)
   restores enough context to continue the same task without re-explaining anything.

Definition of done: a finished **Project custom-instructions snippet** (and, if useful, a
companion "handoff template" document to keep in the Project) that Saqlain pastes once into
his Project settings. After that, typing `/handoff` in any chat in that Project triggers the
save-context behavior, and pasting a handoff block into a new chat triggers the resume
behavior automatically.

## Current state

- Saqlain's personal machine runs Claude Code with a filesystem `handoff` skill that writes
  `tasks/handoffs/<date>-<slug>.md` files (Goal / Current state / Key files / Constraints /
  Verification / Report back). That pattern works well — mirror its structure.
- Nothing exists yet on the chat side. Work-laptop constraint is hard: chat + Projects only.
  No files, no git, no MCP assumed.

## Constraints

- Must work purely inside claude.ai chat: the "skill" is really Project custom instructions
  plus a copy-paste ritual. Don't propose anything requiring Claude Code, git, or local files.
- The handoff block must **stand alone** — assume the resuming session has zero prior context
  beyond the Project's documents.
- Keep the block compact (aim under ~500 words) but include: goal + definition of done,
  decisions already made (so they aren't relitigated), current state / progress, next steps
  in order, and any exact text/wording already agreed on (quote it verbatim — drafts are the
  main artifact in policy work).
- Never include client names or credentials in handoff blocks; use placeholders and note
  where the real values live.
- Two trigger phrases, both defined in the Project instructions:
  - `/handoff` (or "handoff") → emit the handoff block in a copy-ready code fence.
  - A pasted block starting with `## HANDOFF` → silently ingest it, confirm understanding in
    2–3 lines, and continue the task.

## Suggested shape (starting point, refine as needed)

Project custom instructions addition:

```
When I type "/handoff": produce a handoff block in a single markdown code fence with these
sections — TASK (goal + definition of done), DECISIONS (choices already made; do not reopen),
STATE (what's drafted/approved so far; include agreed wording verbatim), NEXT (ordered next
steps), NOTES (open questions, placeholders for sensitive names). Keep it under 500 words.
Start it with the line "## HANDOFF <date> — <task slug>".

When a message begins with "## HANDOFF": treat it as a session resume. Read it fully, confirm
your understanding of TASK and NEXT in 2–3 lines, then continue from the first NEXT step.
Do not relitigate anything under DECISIONS.
```

## Verification

Smoke-test before calling it done: in the Project, run one real task for a few turns, type
`/handoff`, open a brand-new chat, paste the block, and check the new session (a) states the
task correctly, (b) doesn't reopen decided items, (c) continues from the right next step.
Fix the instruction wording until all three pass.

## Report back

Append a `## Results` section to this document (or reply with one) containing the final
instruction snippet actually installed in the Project and any deviations from the plan.
