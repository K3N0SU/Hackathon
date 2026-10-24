# Furrow

Furrow reads pesticide labels and field signs for people who don't read English first. A farmworker photographs the label or the re-entry sign, and Furrow says, in English, Spanish or Punjabi, how long to stay out of the field, what to wear, what to do if someone is exposed, and what the label means in a couple of plain sentences. It can read the answer aloud, and it keeps a countdown for each sprayed block so the answer is still there an hour later.

It was built solo at SierraHacks in Manteca for the Central Valley challenge. San Joaquin County grows almonds, walnuts, cherries and grapes, and a lot of the people in those rows read Spanish or Punjabi before English. The details that keep them safe are on a label and a sign, in small print.

## How it works

The browser shrinks the photo to 1600 pixels and sends it to a server route. The route asks the Gemini API to read it and return JSON in a fixed shape: signal word, re-entry interval in hours, a sentence about it, gear, first aid, a short summary, and a line telling the worker to ask a supervisor when the label can't be read with confidence. The response schema is enforced by the API, so the interface never has to guess at the format. The prompt tells the model to keep product names and phone numbers exactly as printed and to translate everything else.

When the label gives an interval in hours, the result page offers to start a clock. The clock needs the time the block was sprayed, which the label can't know, so the worker enters it. Clocks and the chosen language are stored in the phone's localStorage. There are no accounts and no database.

If a photo is blurry, Furrow says so instead of guessing. If the connection fails while scanning one of the three built-in sample labels, it shows a saved answer and says it is saved.

## Technology

- Google Gemini API, free tier, for vision and structured output (`gemini-3.8-flash`, set with `GEMINI_MODEL`)
- Next.js 16 with the App Router and TypeScript
- Tailwind CSS 4 and shadcn/ui
- Vercel for hosting, deployed from this repository
- Web Speech API for read-aloud
- Fraunces, Public Sans and Noto Sans Gurmukhi from Google Fonts

Everything runs on free tiers. No card is needed anywhere.

## Run it

Get a free key at aistudio.google.com, then:

```
copy .env.example .env.local
npm install
npm run dev
```

Put the key in `.env.local` as `GEMINI_API_KEY`. The app is at http://localhost:3000 and the slides are at http://localhost:3000/deck (arrow keys to move, print to PDF to export).

On Vercel, add the same `GEMINI_API_KEY` under Environment Variables, as a secret, and redeploy.

## Limits

The Punjabi and Spanish are machine translations and have not been reviewed by native speakers or by anyone who works in pesticide safety. Furrow explains a label; it does not replace the label, the training a grower must give, or Poison Control at 1-800-222-1222. The sample labels are made up for the demo.
