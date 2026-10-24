# TODO (memory across /compact)

Update before ending every task. Keep terse.

## State
- Name: Milpa (renamed from Furrow, briefly Rowen/Fieldwise). Storage keys still `furrow-*`, Firebase project `furrow-422fa`, Vercel URL furrow-valley.vercel.app (user said Vercel works fine, keep it).
- Live: https://furrow-valley.vercel.app. Repo https://github.com/K3N0SU/Hackathon (public) main, auto-deploys. Push with `git -c http.curloptResolve=github.com:443:140.82.112.3 push origin main`.
- Hackathon facts: Downloads/IntroSlides.pdf, summarized in memory judging-rubric. Submissions close 6:30 PM Oct 24. Official weights: innovation 30, technical 25, design/UX 20, impact 15, presentation 10. Tracks to enter: Main, Best AI/ML, Best Solo.
- Design: vibrant palette in globals.css (cobalt primary, poppy accent, sunflower harvest, leaf, ink navy, warm white). Fraunces + Public Sans. Pixel farm canvas src/components/pixel-farm.tsx only on the Today hero (user: pixel art nowhere else). Scroll zoom classes zoom-hero/zoom-depth/zoom-band/zoom-rise (KAWAKAWA = user wants it removed). hover-word effect on headings.
- Landing src/app/page.tsx: plain hero + LabelReader, language/crop marquees, problem, tour, #ai bento (8 AI jobs with model chips), ask, numbers (cobalt band), heat, honest, 15 tools, FAQ, ink closing. Section rail 2xl only.
- App /scan app-shell.tsx: scanner is default tab; Today (today-home.tsx), Tools (compact grid), Saved, Spray map; dark sidebar on lg, floating pill nav with raised Scan on mobile. Ask Milpa is a floating bubble + panel (ask-chat.tsx): saved multi-chats (src/lib/chats.ts, Firestore users/{uid}/chats, rules deployed), photo attach, voice mode (voice-chat.tsx, ChatGPT-style orb on light screen, mute + end buttons, short spoken answers), retry.
- New AI: /api/speak (gemini-3.8-flash-tts, WAV), /api/ask accepts audio + image, /api/interpret, /api/gear, /api/pay. Speech helpers src/lib/speech.ts (useSpeaker natural voice + browser fallback, recordUtterance with silence detection, 16k WAV).
- Tools: food (/api/food, food-check.tsx, allergies saved in localStorage furrow-allergies), interpret, gear, pay, symptoms, exposed, heat, brief, paper, report, map, install. Copy in app-copy.ts + tools-copy.ts.
- 17 languages (scan.ts): en es pa hmn tl hi ar vi zh ko ur fa hy ru fr pt ja; RTL ar ur fa. i18n in-memory cache + preload on language button hover. After copy changes: dev server on 3100, `FURROW_URL=http://localhost:3100 node scripts/translate.mjs`.
- QA account in scratchpad qa.json. Screenshot scripts: scratchpad app2.js (app), shoot.js (landing).

- Food check also takes a typed name (no label/barcode); "Check another" returns to start. Google sign-in: unauthorized-domain shows a "use furrow-valley.vercel.app" message, popup failures fall back to redirect, getRedirectResult surfaces errors.
- Devpost media done: Downloads/media/images (30: 17 square posters + 13 desktop shots), Downloads/media/videos (5 silent 1080p mp4s with captions), Downloads/Milpa.pptx (20 slides, notes). Generators in scratchpad: cap.js (captures), poster.js, panel.js, deck3.js (run with NODE_PATH=scratchpad/node_modules), videos.js (CDP frame recorder, fake mic qes.wav), compose.js (ffmpeg via imageio-ffmpeg).

## Next
- User: submit on Devpost (Main, Best AI/ML, Best Solo) with media folder + Milpa.pptx, optionally add voiceover to videos, delete Downloads/env.local.txt. If Google sign-in still fails, read the new on-screen message (likely wrong site URL).

## Decisions
- Accounts required. No Punjabi script on landing. Pay check facts: CA min wage $16.90 (2026), ag overtime after 8h/day or 40h/week, double after 12h. Labor Commissioner 1-833-526-4636.
- Scanner is the main feature; everything else is a sub-tool. Chat is a bubble, not a tab.
