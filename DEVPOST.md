# Devpost copy for Milpa

Paste each section into the matching Devpost field. Upload the slides and the screenshots from your Downloads folder. Tracks: Main, Best AI/ML, Best Solo.

## Tagline

Point your phone at a pesticide label. Know when it's safe, in your language, and talk to it out loud.

## Inspiration

The Central Valley grows a huge share of the country's fruit and nuts, and the people who pick, prune and irrigate it often think in Spanish, Punjabi, Hmong or Mixteco before English. What keeps them safe is printed on a label and a posted sign in small English print. Summer heat here regularly passes 100°F, pay stubs are confusing, and when someone gets sprayed, the first fifteen minutes matter most. I wanted one free tool, on the phone they already carry, that answers the questions a worker actually has, out loud, in the language they think in.

## What it does

Milpa opens on the scanner. Photograph a pesticide label or a field sign, and in about five seconds you get the signal word, how long to stay out, what to wear and first aid, in plain words, read aloud in a natural voice. A badge says how clearly it read the label, and a drawer shows the exact words each answer came from. Start a countdown for the block and your phone buzzes when it is safe to go back in.

Then you can talk to it. The Ask Milpa button sits in the corner of every screen. Type, send a photo of a rash or a sign, or tap Talk and just speak, in any language. It writes down what you said, answers out loud, and keeps listening, like a phone call. It answers only from the label you scanned and California's farm safety rules. When the label doesn't say, it tells you who to ask instead of guessing. Every chat is saved to your account.

The smaller tools cover the rest of a worker's day. The interpreter lets a worker and a supervisor or nurse take turns talking while Milpa speaks each side in the other's language. On a phone, the top half flips so the person across the table can read it. Gear check looks at a photo of you and says which required gear is on or missing. Food check reads a food label, a produce sticker or the food itself, or takes a typed name when there is no label, and checks it for the family's allergies and says what the label tells you about pesticides. Pay check reads a pay stub and flags anything below minimum wage or missing overtime. There is also a symptom check, an exposure screen with a rinse timer, a heat check, a paper reader, a report writer, a spoken plan for the day, a spray map, a supervisor card and crew sharing. It works in 17 languages, with right-to-left layouts for Arabic, Urdu and Farsi.

## What the AI decides

In one sentence: Milpa looks at a photo or listens to a question and decides, using only what is printed on the label and California's rules, whether it is safe to go in, what to wear and who to call, and it says "I don't know" when the label doesn't say.

## How I built it

The front end is Next.js 16, React and Tailwind on Vercel. Every AI feature goes through one server helper that calls Google's Gemini API with a written system prompt and a response schema the API enforces, so the interface always gets typed fields.

Gemini 3.8 Flash does the seeing, hearing and reasoning. The label reader returns verbatim evidence quotes and a confidence level. The chat accepts text, a photo or a voice recording, which the phone captures with MediaRecorder, cuts off with a Web Audio silence detector, and resamples to 16 kHz WAV. It is grounded in the scanned label, the worker's re-entry clocks and a fixed block of California facts. Gear check, pay check, triage, the interpreter, the paper reader and the report writer each have their own prompt and schema. Gemini 3.8 Flash TTS turns answers into a warm, natural voice, and the browser's best local voice is the fallback.

Accounts and saved scans and chats use Firebase Authentication and Cloud Firestore, behind rules that only let a verified user read their own data. The interface was translated by Gemini once, checked to match the English structure exactly, and bundled, so switching languages is instant. The animated pixel-art farm is drawn on a canvas at low resolution and scaled up, with parallax layers for clouds, an almond orchard, crop rows and a tractor.

## Challenges

Making the chat useful without letting it make things up was the real design problem. The fix was to give it the label, the clock and a fixed set of facts, and to treat "I don't know, ask your supervisor" as a good answer. Voice in any language was the next one. The browser's speech recognition doesn't know Hmong or Mixteco, so I send the audio straight to the model instead, and it writes down what it heard in whatever language was spoken.

## Accomplishments

It works end to end on a real phone. You can ask a question in Spanish while the app is set to English, and it hears you and answers in Spanish out loud. Every answer about a label can be traced to the words printed on it.

## What I learned

Structured output makes a language model feel like an ordinary API, and grounding plus a written list of facts does more for safety than clever wording. The hardest design question was never the translation. It was when the app should say "I don't know."

## What's next

Native speakers and pesticide safety trainers need to check every phrase, and I want to put it in front of crew leaders and workers before anyone relies on it. After that: Mixteco, Zapoteco and Triqui, push alarms that fire with the browser closed, and offline label reading.

## Built with

Google Gemini API (gemini-3.8-flash, gemini-3.8-flash-tts), Firebase Authentication, Cloud Firestore, Open-Meteo, OpenStreetMap, Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Vercel, MediaRecorder, Web Audio API, Web Speech API, Canvas, Service Workers, Google Fonts. Coding help from Claude Code.

## Links

Live site: https://milpa-cali.vercel.app
Code: https://github.com/K3N0SU/Hackathon
