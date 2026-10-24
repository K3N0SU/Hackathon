# TODO (memory across /compact)

Update before ending every task. Keep terse.

## State
- Live: https://furrow-valley.vercel.app (Vercel 404 resolved). Repo https://github.com/K3N0SU/Hackathon main, auto-deploys.
- Stack: Next 16, TS, Tailwind v4, shadcn, lucide, Gemini free tier via REST, Open-Meteo (no key). Everything free.
- User dropped the anti-vibecode visual rules: "just make it look good and work really good".
- `/` landing (src/app/page.tsx): dusk orchard hero (hero-scene.tsx, CSS parallax, grain, motes), site-nav.tsx, section-dots.tsx, Phone mockup, sections for labels, languages, clock, heat, exposed, honest, FAQ. Display font Barlow Condensed (`font-display`), accent `harvest` amber in globals.css.
- `/scan` = AppShell (app-shell.tsx): header with language, bottom tabs Labels (scanner.tsx), Heat (heat-check.tsx, src/lib/heat.ts), Exposed (exposure-help.tsx, src/lib/exposure.ts). Hash #heat / #exposed opens a tab. Scanner saves last scan to localStorage `furrow-last-scan` for the doctor card.
- No slides on the website (user). Slides are C:/Users/sefef/Downloads/Furrow.pptx, built by scratchpad deck.js (pptxgenjs, NODE_PATH=scratchpad/node_modules), checked via PowerPoint COM export.
- README.md, DEVPOST.md, DEMO.md updated for three tools.

## Next
- User: record video and screenshots per DEMO.md, upload Furrow.pptx, submit on Devpost early. Delete Downloads/env.local.txt. Punjabi reader check if possible.
- Me: test a live scan and the heat tab on the deployed site, check landing sections below the hero at phone width, fix anything found.

## Decisions
- Name: Furrow (Surco as alternative, not used).
- Rubric (user): Innovation 30, Technical 25, Relevance 20, Presentation 50.
- Heat thresholds: 80°F shade, 95°F high heat with 10-minute cool-down every 2 hours for ag, 1 quart water per hour.

## Notes
- Windows: bash has no python, use `py`; node patch scripts in scratchpad. Headless Chrome screenshots work (min width ~500px).
