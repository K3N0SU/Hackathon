# TODO (memory across /compact)

Update before ending every task. Keep terse.

## State
- Stack: Next 16, TS, Tailwind v4, shadcn, Gemini free tier via REST (no SDK). Everything must be free. Furrow vertical slice built: `src/app/api/scan/route.ts` (image + language to schema-constrained JSON via Gemini), `src/components/scanner.tsx` (start, reading, result, problem states, language switch, speech), `src/lib/scan.ts` (types, UI copy en/es/pa), `src/lib/samples.ts` (3 samples with cached results in 3 languages), `public/samples/*.svg`. Fonts Fraunces + Public Sans + Noto Sans Gurmukhi, warm palette with green primary in globals.css. Old /api/claude removed.
- Installed: Node 24, Git 2.56, Python 3.12 (winget, source winget only; msstore has a cert error).
- Theme: solve a real challenge in agriculture, transportation, education or community in the Central Valley (Manteca, CA). Tracks: Main and Best Use of AI/ML.
- Rubric (user): Innovation 30, Technical 25, Relevance and Impact 20, Presentation 50 (sums to 125), plus explanation and enjoyability. Submit to Devpost with screenshots, slides, demo video, link.
- Event: Hack Club lists it as in-person, high school, about 12 hours, small field (~22). Listed date Oct 24 vs user's Oct 25: confirm start and deadline at check-in. Official rubric not reachable online.

## Done
- Tooling, starter, CLAUDE.md, git pushed to origin/main (a3822e5), winning plan approved (plan file in `~/.claude/plans/`).

## Next
- User: Devpost account, free `GEMINI_API_KEY` from aistudio.google.com (no card) in `.env.local` and Vercel env, confirm deadline and sponsor credits at check-in, 3 label or sign photos (else I seed samples).
- Done: GEMINI_API_KEY in `.env.local` (gitignored), live scan verified in Punjabi on valley-guard sample (about 5s, model gemini-3.8-flash because 2.5 was retired). Dev server may still be running on :3000.
- Me next: add GEMINI_API_KEY to Vercel (user), test es and en plus the other 2 samples, check layout on phone, fix issues. Then polish (favicon, logo, spacing), README, Devpost copy, slides outline, demo script.
- Not yet verified visually in a browser; lint and build pass.

## Decisions
- Repo: https://github.com/K3N0SU/Hackathon (branch main), linked to Vercel. Git identity K3N0SU / sefefarg@gmail.com, pushes via Git Credential Manager.
- Idea (approved plan): Furrow (working name), farmworkers photograph pesticide labels or re-entry signs, Claude vision returns re-entry time, gear, first aid, plain summary in Spanish, Punjabi or English with read-aloud. No accounts or database. Seeded samples plus cached fallback. Palette: neutral plus earthy green.
- Backups: crop-disease photo diagnosis; farmworker ride-pooling.

## Notes
- Folder name has capitals so package name is `sierrahacks-app`.
