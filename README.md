# Furrow

Furrow is a free phone app for farmworkers in the Central Valley. Point the camera at a pesticide label and Furrow says, in your language, when it is safe to go back into the field, what to wear, and what to do if it touches your skin. Then you can ask it questions out loud.

It was built solo at SierraHacks in Manteca for the Central Valley challenge, aiming at the main track and Best Use of AI/ML. Live at https://furrow-valley.vercel.app.

## What's in it

The app opens on the camera. Everything else is one tap away under four tabs: Scan, Ask, Tools and Saved.

- **Scan a label.** Re-entry time, signal word, gear, first aid and a plain summary from one photo. A confidence badge and a "How Furrow read this" drawer show the exact words on the label each answer came from. If the photo holds more than one product, the others are listed too.
- **Re-entry clocks and alarms.** Start a countdown for a sprayed block; the phone buzzes and shows a notification when it is safe.
- **Ask Furrow.** A chat about the label you just scanned, typed or spoken, answered in your language from the label and California's farm safety rules, with suggested follow-up questions and read-aloud.
- **I feel sick.** Tap symptoms; Furrow sorts urgency into 911, Poison Control, see a doctor, or rest and drink water. Emergency symptoms show a 911 button before the AI even answers.
- **Got sprayed.** 911 and Poison Control, five steps, a 15-minute rinse timer and an English card for the doctor.
- **Heat check.** The hottest hour where you stand, what California requires at that temperature, and hourly water reminders.
- **Read a paper.** Photograph a notice, pay stub or form for a plain summary, what you need to do, the dates that matter, and a warning if it asks you to sign something unfair.
- **Report a problem.** Say what happened in your own language; Furrow writes a factual English incident report for the grower, the county or Cal/OSHA.
- **Today's plan.** A spoken morning brief from your clocks and today's forecast.
- **Supervisor card.** A full-screen English card with the product, re-entry time and three questions to ask.
- **Share with crew.** A public link to a scan that a coworker can open without an account and switch into their own language.
- **Spray map.** Every scan is pinned where you stood.
- **Photo coach.** Checks the photo for blur and light on the phone before it is sent.
- **Eight languages.** English, Spanish, Punjabi, Hmong, Tagalog, Hindi, Arabic (right to left) and Vietnamese.
- **Installable and offline.** Add to home screen; saved scans, clocks, exposure steps and sample labels work with no signal.

## How the AI is used

Every Gemini call goes through one server helper (`src/lib/gemini.ts`) with a written system prompt and, where the output feeds the interface, a response schema the API enforces, so the app never parses prose.

The label reader returns fixed fields plus an `evidence` array of verbatim quotes from the label and a `confidence` level, and is told to report only what is printed. The chat gets the scanned result, the worker's clocks and a block of California facts (re-entry intervals, free PPE, the heat standard, anti-retaliation, Poison Control) and is told to lead with yes, no, not yet or I don't know, to send emergencies to 911, and never to invent label facts. The symptom triage, paper reader, report writer and daily brief each have their own prompt and schema. The interface for Hmong, Tagalog, Hindi, Arabic and Vietnamese is translated by Gemini once, checked to have exactly the same shape as the English, and bundled in `src/lib/translations`; a shared scan is translated on the fly into the viewer's language. Blur and brightness are checked on the phone with a Laplacian variance before any photo is uploaded.

## Technology

- Google Gemini API, free tier (`gemini-3.8-flash`, set with `GEMINI_MODEL`)
- Firebase Authentication (email and password with verification and reset, Google) and Cloud Firestore, free Spark plan
- Open-Meteo weather API and OpenStreetMap tiles, both free with no key
- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, lucide icons
- Vercel hosting, deployed from this repository
- Web Speech API for read-aloud and dictation, Notifications and Vibration APIs for alarms, Geolocation, Media Capture for the in-app camera, a service worker and web manifest for install and offline
- Fraunces, Public Sans and Noto Sans Gurmukhi from Google Fonts

Everything runs on free tiers. No card is needed anywhere.

## Run it

Get a free key at aistudio.google.com, then:

```
copy .env.example .env.local
npm install
npm run dev
```

Put the key in `.env.local` as `GEMINI_API_KEY`. The Firebase web config is public by design and lives in `src/lib/firebase.ts`; Firestore rules are in `firestore.rules` and deploy with `firebase deploy --only firestore:rules`. On Vercel, add `GEMINI_API_KEY` under Environment Variables. After changing any interface text, run `npm run translate` while the dev server is running to regenerate the bundled translations.

## Limits

Translations are by machine and have not been reviewed by native speakers or pesticide safety trainers. Furrow explains a label; it does not replace the label, the training a grower must give, a doctor, or Poison Control at 1-800-222-1222. The heat and rights summaries are plain-language, not legal advice. Alarms only fire while the app or browser is running on the phone. The sample labels are made up for the demo.
