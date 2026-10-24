# TODO (memory across /compact)

Update before ending every task. Keep terse.

## State
- Live: https://furrow-valley.vercel.app. Repo https://github.com/K3N0SU/Hackathon main, auto-deploys.
- Stack: Next 16, TS, Tailwind v4, shadcn, lucide, Gemini free tier via REST, Open-Meteo, Firebase (Auth + Firestore, Spark plan). Everything free.
- Firebase project `furrow-422fa` (account sefefarg@gmail.com, CLI logged in, global `firebase` installed). Web config hardcoded in src/lib/firebase.ts (public by design). Email/password + Google enabled, authorized domains include furrow-valley.vercel.app and localhost. Rules in firestore.rules (owner + email_verified only), deploy `firebase deploy --only firestore:rules`.
- Auth: /sign-in, /sign-up (auth-form.tsx), /verify (verify-email.tsx, polls reload, refreshes token), auth-provider.tsx (useSession, useSavedLanguage), user-menu.tsx in site-nav and app header. Copy en/es/pa in src/lib/auth-copy.ts.
- /scan requires a verified account (app-shell.tsx redirects). Tabs Labels, Heat, Exposed, Saved (saved-scans.tsx). Data in src/lib/cloud.ts: users/{uid} {language, clocks, lastScan}, users/{uid}/scans {createdAt, language, thumb 360px jpeg, result}. clocks.ts syncs to cloud.
- Live in-app camera: live-camera.tsx (getUserMedia, frame, shutter, retake, flip, gallery, fallback to capture input).
- Landing `/` remade dark: hero with word-mask headline + HeroDemo phone loop (hero-demo.tsx), crop marquee, ScrollWords story, sticky Tour of 5 tools (tour.tsx, phone-screens.tsx), CountUp numbers, spotlight bento, honest section with orbit ring, FAQ, CTA. No Punjabi script on landing (user). Motion helpers landing-motion.tsx, scroll-reveal.tsx (IntersectionObserver). Section dots ids: top story tour numbers features honest questions.
- Slides: C:/Users/sefef/Downloads/Furrow.pptx (scratchpad deck.js). Not updated for accounts/camera yet.
- Screenshots: scratchpad shoot.js (puppeteer-core + installed Chrome): `node shoot.js URL W H prefix stops...`.

## Next
- User: sign up once on the live site to confirm the verification email arrives (check spam), then a scan shows in Saved. Record video and screenshots per DEMO.md, submit on Devpost early. Delete Downloads/env.local.txt.
- Me if asked: refresh Furrow.pptx for accounts + camera; test signed-in /scan on phone.

## Decisions
- Name: Furrow. Rubric: Innovation 30, Technical 25, Relevance 20, Presentation 50.
- Accounts required (user). Photos saved as Firestore thumbnails because Firebase Storage needs Blaze.
- Heat thresholds: 80°F shade, 95°F high heat, 1 quart water per hour.

## Notes
- Local wifi DNS blocks vercel.app, netlify.app, github.io (resolve to 10.251.253.61, ERR_CONNECTION_CLOSED). Site is up (200 via 76.76.21.21). Use cellular/hotspot to demo. *.web.app resolves fine.
- Windows: bash has no python, use `py`; node patch scripts in scratchpad. Kill stale `next start` before restarting (PowerShell Get-CimInstance filter).
