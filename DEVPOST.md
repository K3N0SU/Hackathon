# Devpost copy for Milpa

Paste each section into the matching Devpost field. Upload the slides and the screenshots from your Downloads folder. Tracks: Main, Best Solo, Best Use of AI/ML, Best Beginner, Best Middle School.

## Tagline

Point your phone at a pesticide label. Know when it's safe, in your language, and talk to it out loud.

## Inspiration

The Central Valley grows a huge share of the country's fruit and nuts, and the people who pick, prune and irrigate it often think in Spanish, Punjabi, Hmong or Mixteco before English. What keeps them safe is printed on a label and a posted sign in small English print. Summer heat here regularly passes 100°F, pay stubs are confusing, and when someone gets sprayed, the first fifteen minutes matter most. I wanted one free tool, on the phone they already carry, that answers the questions a worker actually has, out loud, in the language they think in.

## Try it yourself (put this at the very top of the story)

Milpa is live and free. Open **https://milpa-california.vercel.app** on your phone or laptop, sign in with Google or an email, and try this in under two minutes:

1. On the scanner, tap **Almond insecticide label**. You don't need a real label. In a few seconds you'll see when it is safe to go back in, what to wear and the first aid, plus the exact words from the label each answer came from. Tap **Start the clock**.
2. Tap **Ask Milpa** in the corner, then **Talk**, and ask out loud, in any language, "Can I eat lunch between the rows?" It answers out loud in the language you spoke.
3. Tap the globe and switch to **Español**, **Hmoob** or **العربية**. The whole app changes, and Arabic flips right to left.
4. Open **Tools** and try **Food pesticide check** (type "strawberries"), **Farm pay check** or **Sick after spraying?**.
5. Tap the sun button for **Field mode**, the high-contrast setting made for bright sun.

## What it does

Milpa is a free web app that keeps California farmworkers safe from pesticides and heat, and helps with the paperwork side of farm work, in 17 languages. It runs in the browser on any phone, installs to the home screen like an app, and the safety steps keep working with no signal.

**The scanner.** Photograph a pesticide label or a posted field sign, or try one of three sample labels. In about five seconds Milpa gives the signal word, how long to stay out of the field, what to wear and the first aid, in plain words, read aloud in a natural voice. A badge says how clearly it read the label, and a drawer shows the exact words from the label behind every answer, so nothing has to be taken on faith. One tap starts a re-entry countdown for that block, and the phone buzzes when it is safe. A supervisor card shows the label's rules in English to hand to a boss, and crew sharing sends the result to the rest of the crew.

**Ask Milpa.** A chat button sits in the corner of every screen. Workers can type, send a photo of a rash, a sign or a label, or tap Talk and just speak, in any language. Voice mode works like a phone call: it hears you, answers out loud and keeps listening. Answers come only from the scanned label and California's farm safety rules, and when the label doesn't say, Milpa tells you who to ask instead of guessing. If someone types words like "he passed out" or "no puedo respirar", a 911 button appears before the AI even answers. Every chat is saved to the worker's account.

**Today.** The home screen opens with one plain line about the day: how many treated blocks are still closed and which heat rules apply right now. Below that sit the re-entry clocks with rings that fill as each block gets closer to safe, the heat right now, the last label scanned and recent chats, over a small animated farm.

**Pesticide tools.**
- **Spray gear check:** take a photo of yourself, and Milpa checks it against the gear the label requires and says what's missing.
- **Pesticide got on me:** big 911 and Poison Control buttons, the rinse steps, a 15-minute rinse timer and a card in English for the doctor with the product filled in. It works offline.
- **Report spray drift:** say what happened in your own language, and Milpa writes a clear report in English for the grower or the county, noting what's missing to make it stronger.
- **Spray map:** every label you scan is pinned where you were standing.
- **Food pesticide check:** photograph a food label, a produce sticker or the food itself, or just type its name. Milpa checks it against your family's allergies and explains what it says about pesticides.

**Heat and health tools.**
- **Field heat check:** uses your location and today's forecast to show the hottest hour and what California requires at that heat: shade above 80°F, cool-down breaks and someone watching the crew at 95°F, and water every hour.
- **Sick after spraying?:** tap the symptoms you feel, and Milpa says how urgent it is and who to call: 911, Poison Control or a doctor.
- **Today's field plan:** Gemini looks at your clocks and the heat and tells you the plan for the day, out loud.

**Work and pay tools.**
- **Farm pay check:** photograph a pay stub, and Milpa checks it against California farmwork pay law, such as minimum wage and overtime after 8 hours, and gives the Labor Commissioner's number if something is off.
- **Read a work paper:** photograph any notice or form from the grower, and Milpa explains it in your language, with what you need to do and every date and dollar amount.
- **Crew interpreter:** a worker and a supervisor, nurse or clerk take turns talking, and Milpa says each side out loud in the other's language. The top half flips so the person across the table can read it.
- **Use it in the field:** add Milpa to the home screen so saved scans, clocks and the exposure steps work with no signal.

**Built for the field.** Every screen and every AI answer works in 17 languages: English, Spanish, Punjabi, Hmong, Tagalog, Hindi, Arabic, Vietnamese, Chinese, Korean, Urdu, Farsi, Armenian, Russian, French, Portuguese and Japanese. Arabic, Urdu and Farsi get full right-to-left layouts. Field mode makes text bigger and contrast stronger for bright sun. Every photo tool opens a live camera with a hint that fits the job and a flashlight for early mornings. Scans, clocks and chats are saved to the worker's account, so they follow them to any phone.

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

Live site: https://milpa-california.vercel.app (free, sign in with Google or email)
Code: https://github.com/K3N0SU/Milpa-Safety-for-Workers

## Closing line (put at the end of the story)

The best way to judge Milpa is to use it. Open https://milpa-california.vercel.app on your phone, tap the sample label, and ask it a question out loud in any language.
