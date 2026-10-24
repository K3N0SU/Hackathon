# Furrow

Furrow is a free phone app for farmworkers in the Central Valley. It does three things, in English, Spanish or Punjabi.

**Labels.** Photograph a pesticide label or a re-entry sign and Furrow says how long to stay out of the field, what to wear, what to do if someone is exposed, and what the label means in plain words. It can read the answer aloud and keeps a countdown clock for each sprayed block.

**Heat.** Furrow checks the forecast where you are standing, finds the hottest hour of the day, and explains what California's outdoor heat rules require at that temperature: water, shade, cool-down breaks, and the signs of heat illness that mean call 911.

**Exposed.** One tap for 911 or Poison Control, five clear steps, a 15-minute rinse timer that buzzes when it is done, and a card in English for the doctor with the last scanned product filled in and a line asking for an interpreter.

Workers sign in with email or Google, and every scan, its photo, the countdown clocks and the chosen language are saved to their account so they follow them to any phone. The camera opens right inside the app.

It was built solo at SierraHacks in Manteca for the Central Valley challenge. Live at https://furrow-valley.vercel.app.

## How it works

The browser shrinks the photo to 1600 pixels and sends it to a server route. The route asks the Gemini API to read it and return JSON in a fixed shape: signal word, re-entry interval in hours, a sentence about it, gear, first aid, a short summary, and a line telling the worker to ask a supervisor when the label can't be read with confidence. The response schema is enforced by the API, so the interface never parses prose. The prompt keeps product names and phone numbers exactly as printed and translates everything else.

The heat check calls Open-Meteo straight from the browser with the phone's location, or Manteca if location is off, and maps the day's high to California's 80°F shade and 95°F high-heat thresholds.

Sign-in uses Firebase Authentication with email and password (with email verification and password reset) or Google. Scans, photo thumbnails, clocks, the chosen language and the last scanned product are stored in Cloud Firestore under each user, and the security rules only let a signed-in user with a verified email read or write their own documents. Photos are shrunk to a small thumbnail before saving, so everything fits in Firestore's free tier with no paid storage bucket. The live camera uses getUserMedia with a fallback to the phone's camera app. If a photo is blurry, Furrow says so instead of guessing. If the connection fails while scanning one of the three built-in sample labels, it shows a saved answer and says it is saved.

## Technology

- Google Gemini API, free tier, for vision and structured output (`gemini-3.8-flash`, set with `GEMINI_MODEL`)
- Firebase Authentication (email and password, email verification, password reset, Google) and Cloud Firestore, both on the free Spark plan
- Open-Meteo, a free weather API with no key
- Next.js 16 with the App Router, React 19 and TypeScript
- Tailwind CSS 4, shadcn/ui and lucide icons
- Vercel for hosting, deployed from this repository
- Web Speech API for read-aloud, Vibration API for haptics, Geolocation API for the heat check, Media Capture API for the in-app camera
- Barlow Condensed, Fraunces, Public Sans and Noto Sans Gurmukhi from Google Fonts

Everything runs on free tiers. No card is needed anywhere.

## Run it

Get a free key at aistudio.google.com, then:

```
copy .env.example .env.local
npm install
npm run dev
```

Put the key in `.env.local` as `GEMINI_API_KEY`. The Firebase web config is public by design and lives in `src/lib/firebase.ts`; Firestore rules are in `firestore.rules` and deploy with `firebase deploy --only firestore:rules`. The landing page is at http://localhost:3000 and the app at /scan. On Vercel, add the same `GEMINI_API_KEY` under Environment Variables and redeploy.

## Limits

The Punjabi and Spanish are machine translations and have not been reviewed by native speakers or by anyone who works in pesticide safety. Furrow explains a label; it does not replace the label, the training a grower must give, or Poison Control at 1-800-222-1222. The heat rules are a plain summary, not legal advice. The sample labels are made up for the demo.
