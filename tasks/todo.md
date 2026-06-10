# Personal site - build plan

## Phase 0 - Decisions (in progress)
- [x] Round 1: tone (professional with edge), default lens (Auditor first), lens scope (hero + cards), visual system (dual treatment confirmed)
- [x] Round 2: stack (Astro + Vercel), employer ("a Big Four firm"), demo links (mixed per project), articles (hook + link out)
- [x] Round 3: photo (text-only), CV PDF (include), figures (publish as written), v1 scope (full IA)
- [x] Type + palette: Direction 1 "Ledger" (JetBrains Mono / Source Serif 4, teal+blue, amber machine)
- [x] Window section palette: dark builder palette, blue human / amber machine
- [ ] Free-text inputs (needed for Phase 2, not blocking DESIGN): LinkedIn URL, GitHub URL, 5 article URLs, per-project repo/demo map, domain, CV PDF source

## Phase 1 - DESIGN.md
- [x] Visual system, type scale, spacing, grid
- [x] Lens interaction model + a11y/keyboard/reduced-motion fallback
- [x] Closing Window scroll viz + a11y/reduced-motion fallback
- [x] Responsive behavior, component inventory
- [x] Added "Outside the work" section per user request
- [~] Sign-off: approved with the Outside-the-work addition

## Phase 2 - Build (Astro) - DONE
- [x] Scaffold, self-hosted fonts, tokens
- [x] Hero/Lens (drag + keyboard slider + toggle, auditor-first, hint, mobile crossfade)
- [x] Closing Window (sticky chart, count-up, SSR/no-JS/reduced-motion static fallback)
- [x] Work rows (dual-readable, shared reading state, register swap)
- [x] Field Notes, Who (Big Four, CV), Outside (placeholders), Contact
- [x] Verified in browser: no console errors, screenshots of all sections + all lens states + mobile
- [x] Reduced-motion/no-JS fallback verified complete in built HTML
- [x] Build clean: ~4.6KB JS, CSS inlined, font preload, JSON-LD, sitemap, robots
- [x] Deploy prep: README, .gitignore, Vercel-ready static output

## Still needs user input before launch (see README)
- [ ] LinkedIn + GitHub URLs; 5 article URLs; per-project link map; real CV pdf; Outside copy; domain

## Ground rules
No em dashes. No emojis. No LinkedIn cliches. Bold sparingly. Every decision needs a reason.
Accessibility, sub-1s LCP, SEO, mobile-first.
