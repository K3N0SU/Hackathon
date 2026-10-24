# TODO (memory across /compact)

Update before ending every task. Keep terse.

## State
- Live: https://furrow-valley.vercel.app. Repo https://github.com/K3N0SU/Hackathon (public) main, auto-deploys.
- Venue wifi DNS blocks vercel.app, github.com, netlify.app, github.io (resolve to 10.251.253.61). Push with `git -c http.curloptResolve=github.com:443:140.82.112.3 push origin main`. Test site with `curl --resolve furrow-valley.vercel.app:443:76.76.21.21`. Demo on mobile data.
- Stack: Next 16, TS, Tailwind v4, lucide, Gemini free tier via REST (src/lib/gemini.ts helper), Firebase Auth + Firestore (Spark), Open-Meteo, OSM tiles. npm registry also blocked on this wifi (motion/lenis not installed; motion helpers hand-written in src/components/motion.tsx).
- Design: light "field card" (cream, ink green, amber, Fraunces display, Public Sans). Tokens + motion CSS in globals.css (sweep, sheen, lift, tilt, reveal/reveal-left/reveal-pop, seen, stamp, heat-flip, draw, label-scan, callout).
- Landing src/app/page.tsx: hero LabelReader, marquee, LabelHighlight (#problem), Tour 6 steps (#tour), AskDemo (#ask), numbers Odometer (#numbers), heat (#heat), Stamp (#honest), 12 tools (#features), FAQ, closing. AccountCta swaps sign-up CTAs to Open Rowen when signed in.
- App /scan (app-shell.tsx): tabs Scan, Ask, Tools, Saved; Tools = symptoms, exposed, heat (+water reminders), brief, paper, report, map, install. Language picker sheet, 8 languages (en es pa hmn tl hi ar vi), RTL for ar.
- AI routes: /api/scan (evidence, confidence, others), /api/ask, /api/symptoms, /api/read, /api/report, /api/brief, /api/translate.
- i18n: core en/es/pa static; others via useCopy -> bundled src/lib/translations/*.json (keyed by fingerprint of en dict) -> localStorage -> /api/translate. After changing any copy: run server, `FURROW_URL=http://localhost:3100 npm run translate`.
- Data: users/{uid} {language, clocks, lastScan{result}}, users/{uid}/scans {+latitude,longitude}, shares/{id} public get (/s/[id] page translates live). Rules deployed.
- PWA: src/app/manifest.ts, public/sw.js, icons in public; alarms src/lib/alarms.ts.
- QA account furrow-qa@example.com (verified, password in scratchpad qa.json). Scratchpad: app.js/gallery.js/lang.js puppeteer flows, deck2.js slides, translate-all.js.
- Submission assets: Downloads/Rowen.pptx (11 slides, new design), Downloads/Rowen screenshots (01-11 png). DEVPOST.md, DEMO.md, README.md updated.

## Next
- User: check live site on mobile data after deploy, record demo video per DEMO.md, submit on Devpost (tracks Main + Best Use of AI/ML), delete Downloads/env.local.txt.

## Decisions
- Name: Rowen. Rubric: Innovation 30, Technical 25, Relevance 20, Presentation 50.
- Accounts required (user). Photos saved as Firestore thumbnails (Storage needs Blaze).
- No Punjabi script on landing (user). Mixteco skipped (MT quality).
- Heat thresholds: 80°F shade, 95°F high heat, 1 quart water per hour.

## Notes
- Windows: bash has no python, use `py`; kill stale `next start` via PowerShell Get-CimInstance before rebuild. Slides render via PowerPoint COM export.
- Tour step dots moved left of the phone (they crossed the fixed section dots on xl screens).
