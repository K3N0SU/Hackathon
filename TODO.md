# TODO (memory across /compact)

Update before ending every task. Keep terse.

## State
- Stack: Next 16, TS, Tailwind v4, shadcn, Gemini free tier via REST (no SDK). Everything must be free. Furrow vertical slice built: `src/app/api/scan/route.ts` (image + language to schema-constrained JSON via Gemini), `src/components/scanner.tsx` (start, reading, result, problem states, language switch, speech), `src/lib/scan.ts` (types, UI copy en/es/pa), `src/lib/samples.ts` (3 samples with cached results in 3 languages), `public/samples/*.svg`. Fonts Fraunces + Public Sans + Noto Sans Gurmukhi, warm palette with green primary in globals.css. Old /api/claude removed.
- Installed: Node 24, Git 2.56, Python 3.12 (winget, source winget only; msstore has a cert error).
- Theme: solve a real challenge in agriculture, transportation, education or community in the Central Valley (Manteca, CA). Tracks: Main and Best Use of AI/ML.
- Rubric (user): Innovation 30, Technical 25, Relevance and Impact 20, Presentation 50 (sums to 125), plus explanation and enjoyability. Submit to Devpost with screenshots, slides, demo video, link.
- Event: Hack Club lists it as in-person, high school, about 12 hours, small field (~22). Listed date Oct 24 vs user's Oct 25: confirm start and deadline at check-in. Official rubric not reachable online.

## Done
- Tooling, starter, CLAUDE.md, git, winning plan.
- Furrow scan flow, field clocks (src/lib/clocks.ts, src/components/clocks.tsx), remembered language, logo (src/components/mark.tsx, src/app/icon.svg), Poison Control call button, /deck slides (src/components/deck.tsx, print to PDF).
- README.md, DEVPOST.md, DEMO.md written (script, screenshot list, video plan).

- Landing page redesign at / (src/app/page.tsx, phone.tsx, field-rows.tsx); scanner moved to /scan. Scroll reveal is CSS only in globals.css. Name decision: keep Furrow, Surco is the alternative.

## Next
- User: Vercel 404 (check Framework Preset = Next.js, latest deployment Ready, open via Visit; send build log if Error). Delete Downloads/env.local.txt. Devpost account. Confirm deadline and sponsor credits at check-in. Record video and screenshots per DEMO.md. Have a Punjabi reader check the cached Punjabi in src/lib/samples.ts.
- Me: visual check on phone width (nothing verified in a browser yet), test es/en and other two samples live, then submit-early checklist.

## Decisions
- Repo: https://github.com/K3N0SU/Hackathon (branch main), linked to Vercel. Git identity K3N0SU / sefefarg@gmail.com, pushes via Git Credential Manager.
- Idea (approved plan): Furrow (working name), farmworkers photograph pesticide labels or re-entry signs, Claude vision returns re-entry time, gear, first aid, plain summary in Spanish, Punjabi or English with read-aloud. No accounts or database. Seeded samples plus cached fallback. Palette: neutral plus earthy green.
- Backups: crop-disease photo diagnosis; farmworker ride-pooling.

## Notes
- Folder name has capitals so package name is `sierrahacks-app`.
