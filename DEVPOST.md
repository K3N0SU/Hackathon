# Devpost copy for Milpa

Paste each section into the matching Devpost field. Upload `Milpa.pptx` from your Downloads folder as the slides and the images in `Downloads/Milpa screenshots` to the gallery. Tracks: Main and Best Use of AI/ML.

## Tagline

Point your phone at a pesticide label. Know when it's safe, in your language, and ask it anything.

## Inspiration

The Central Valley grows a huge share of the country's fruit and nuts, and the people who pick, prune and irrigate it often read Spanish, Punjabi, Hmong or another language before English. What keeps them safe is printed on a label and a posted sign in small English print. Summer heat here regularly passes 100°F, and when someone does get sprayed, the first fifteen minutes matter most. I wanted one free tool on the phone they already carry that answers the questions a worker actually has, out loud, in the language they think in.

## What it does

Milpa opens straight to the camera. Photograph a pesticide label or a field sign and in about five seconds you get the signal word, how long to stay out, what to wear and first aid, in plain words, read aloud. A badge says how clearly it read the label, and a drawer shows the exact words on the label each answer came from. Start a countdown for the block and your phone buzzes when it is safe to go back in.

Then you can ask. "Can I eat lunch in the rows?" "My gloves ripped, can I keep working?" Ask Milpa answers by text or voice from the label you scanned and California's farm safety rules, and when the label doesn't say, it tells you who to ask instead of guessing.

The Tools tab holds the rest of a worker's day: a symptom check that sorts urgency into 911, Poison Control, a doctor or rest; an exposure screen with a 15-minute rinse timer and an English card for the doctor; a heat check with hourly water reminders; a paper reader for notices and pay stubs that flags anything unfair; a report writer that turns a spoken story in any language into a factual English incident report; a spoken plan for the day; and a spray map of where you scanned. One tap shows a supervisor card in English, and one more shares the scan with your crew as a link they can open in their own language. It works in eight languages, installs to the home screen, and keeps saved scans, clocks and the exposure steps working with no signal.

## How I built it

The front end is Next.js 16, React and Tailwind on Vercel. Every AI feature goes through one server helper that calls the Google Gemini API on the free tier with a written system prompt and a response schema the API enforces, so the interface gets typed fields, never prose.

The label reader is told to report only what is printed and returns an evidence array of verbatim quotes plus a confidence level, which is what powers the "How Milpa read this" drawer. The chat is grounded in the scanned result, the worker's clocks and a short block of California facts (re-entry intervals, free protective gear, the heat standard, anti-retaliation, Poison Control); it must lead with yes, no, not yet or I don't know, send emergencies to 911, and never invent label facts. Symptom triage, paper reading, report writing and the daily plan each have their own prompt and schema. On the phone, a Laplacian blur check and a brightness check coach the photo before it is sent. The interface in Hmong, Tagalog, Hindi, Arabic and Vietnamese was translated by Gemini, validated to have exactly the same structure as the English, and bundled so switching is instant; shared scans are translated on the fly for whoever opens them.

Accounts use Firebase Authentication with email verification, password reset and Google. Scans, thumbnails, clocks and language live in Cloud Firestore behind rules that only let a verified user touch their own data, with a public read-only collection for crew links. Open-Meteo provides the forecast and OpenStreetMap the map tiles. The Web Speech API reads answers and takes dictation, and a service worker makes it installable and offline. The sample labels carry saved answers so the demo works even if the network doesn't.

## Challenges

Getting Punjabi to come out fully in Punjabi took several rounds; early answers left units like hours in English. Making the chat useful without letting it make things up was the real design problem, and the answer was to give it the label, the clock and a fixed set of facts, and to make "I don't know, ask your supervisor" an acceptable answer. Translating the whole interface live took almost 30 seconds per language, so I moved it to a one-time step whose output is checked for shape before it is bundled.

## Accomplishments

It works end to end on a real phone, in eight languages including right-to-left Arabic, and it refuses to answer when it shouldn't. Every answer about a label can be traced to the words printed on it.

## What I learned

Structured output makes a language model feel like an ordinary API, and grounding plus a written list of facts does more for safety than any amount of clever wording. The most important design question was never the translation; it was when the app should say "I don't know."

## What's next

Native speakers and pesticide safety trainers need to check every phrase, and I want to put it in front of crew leaders and workers before anyone relies on it. After that: Mixteco and other Indigenous languages spoken in the fields, push alarms that fire with the browser closed, and offline label reading.

## Built with

Google Gemini API, Firebase Authentication, Cloud Firestore, Open-Meteo, OpenStreetMap, Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Vercel, Web Speech API, Service Workers, Google Fonts

## Links

Live site: https://furrow-valley.vercel.app
Code: https://github.com/K3N0SU/Hackathon
