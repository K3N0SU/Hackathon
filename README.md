# Milpa

Milpa is a free phone app for farmworkers in the Central Valley. Point the camera at a pesticide label and Milpa says, in your language, when it is safe to go back into the field, what to wear, and what to do if it touches your skin. Then you can talk to it out loud, send it a photo, or hand the phone to a supervisor and let it interpret.

The name comes from the milpa, the traditional Mesoamerican field that many farmworker families grew up around. It was built solo at SierraHacks 2026 in Manteca for the Central Valley challenge, entered in the Main track, Best AI/ML and Best Solo. Live at https://furrow-valley.vercel.app.

**What the AI decides, in one sentence:** Milpa looks at a photo or listens to a question and decides, from only what is printed on the label and California's farm safety rules, whether it is safe to enter, what to wear, and who to call, and it says "I don't know" when the label doesn't say.

## What's in it

The app opens on the scanner, which is the heart of it. A floating "Ask Milpa" button sits in the corner of every screen, and the rest lives under Today, Tools and Saved.

The scanner reads a label or field sign in about five seconds and gives the re-entry time, signal word, gear, first aid and a plain summary, read aloud. A confidence badge and a "How Milpa read this" drawer show the exact words each answer came from. A countdown for the sprayed block buzzes when it is safe to go back in.

Ask Milpa is a chat you can type into, talk to, or send photos to. Voice mode works like a phone call: you speak in any language, it writes down what you said, answers out loud in a natural voice, and keeps listening. Every chat is saved to your account and you can start new ones.

The tools are smaller jobs a worker runs into during the day:

- Interpreter: two people take turns talking and Milpa says each side out loud in the other's language. On a phone the top half flips so the person across the table can read it.
- Gear check: a photo of yourself, checked against the gear the scanned label requires.
- Food check: a photo of a food label or produce sticker, checked against your own allergies, with what the label says about organic growing and pesticides. It never claims to detect residue it can't see.
- Pay check: a photo of a pay stub, checked against California's minimum wage, farmworker overtime and pay stub rules.
- I feel sick, Got sprayed, Heat check, Read a paper, Report a problem, Today's plan, Spray map, Supervisor card and Share with crew.

It works in 17 languages: English, Spanish, Punjabi, Hmong, Tagalog, Hindi, Urdu, Arabic, Farsi, Vietnamese, Chinese, Korean, Armenian, Russian, French, Portuguese and Japanese, with right-to-left layouts for Arabic, Urdu and Farsi. It installs to the home screen and keeps saved scans and clocks working offline.

## How the AI is used

Every model call goes through one server helper (`src/lib/gemini.ts`) with a written system prompt and a response schema the API enforces, so the interface gets typed fields, never prose.

- **Label reading** (`/api/scan`): Gemini 3.8 Flash vision returns fixed fields plus verbatim evidence quotes and a confidence level, and is told to report only what is printed.
- **Chat, photos and voice** (`/api/ask`): the same model gets the scanned label, the worker's clocks and a block of California facts. It accepts a photo or a 16 kHz WAV recording, writes down what it heard, and answers in the language the worker spoke.
- **Interpreter** (`/api/interpret`): audio in, transcript and translation out, then spoken.
- **Natural voice** (`/api/speak`): Gemini 3.8 Flash TTS, with the browser's best voice as a fallback.
- **Gear check, pay check, symptom triage, paper reader, report writer, daily plan and translation** each have their own prompt and schema.

The phone does work too. A Laplacian blur check and a brightness check coach the photo before upload. A silence detector built on the Web Audio API ends a voice turn when you stop talking.

## Technology

- Google Gemini API: `gemini-3.8-flash` for vision, audio and text, and `gemini-3.8-flash-tts` for speech
- Firebase Authentication and Cloud Firestore, with offline persistence
- Open-Meteo weather and OpenStreetMap tiles
- Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, lucide icons, on Vercel
- Browser APIs: MediaRecorder, Web Audio, Web Speech, Notifications, Vibration, Geolocation, Canvas for the pixel-art farm, and a service worker
- Fonts: Fraunces, Public Sans and Noto Sans Gurmukhi

Nothing here was written outside the event except the libraries above. AI coding help came from Claude Code.

## Run it

```
copy .env.example .env.local
npm install
npm run dev
```

Put a Gemini key in `.env.local` as `GEMINI_API_KEY`. Firestore rules are in `firestore.rules` and deploy with `firebase deploy --only firestore:rules`. After changing interface text, run `npm run translate` with the dev server running to regenerate the bundled translations.

## Limits

Translations are by machine and have not been reviewed by native speakers or pesticide safety trainers. Milpa explains a label; it does not replace the label, the training a grower must give, a doctor, or Poison Control at 1-800-222-1222. The pay and rights checks are plain language, not legal advice. The sample labels are made up for the demo.
