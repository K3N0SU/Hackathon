# Devpost copy for Furrow

Paste each section into the matching Devpost field. Upload `Furrow.pptx` from your Downloads folder as the slides.

## Tagline

Read pesticide labels, check the heat and get exposure help, in Spanish, Punjabi or English.

## Inspiration

The Central Valley grows a huge share of the country's fruit and nuts, and the people who pick, prune and irrigate it often read Spanish or Punjabi before English. The things that keep them safe are printed on a label and a posted sign in small English print. Summer heat here regularly passes 100°F, and when someone does get sprayed, the first fifteen minutes matter most. I wanted one free tool on the phone they already carry that covers all three moments, with no account and no training session.

## What it does

Furrow has three tools. Labels: photograph a pesticide label or re-entry sign and Furrow gives the warning level, how long to stay out, what to wear, first aid and a plain summary in the worker's language, read aloud. If the label gives a re-entry time, Furrow keeps a countdown clock on the phone, red until it's safe and green after. Heat: it checks the forecast where you are standing, finds the hottest hour, and explains what California requires at that temperature, like shade above 80°F and a 10-minute cool-down every two hours at 95°F, plus the signs of heat illness that mean call 911. Exposed: one tap for 911 or Poison Control, five steps, a 15-minute rinse timer that buzzes when done, and a card in English for the doctor with the last scanned product filled in and a line asking for an interpreter.

Workers sign in with email or Google. The camera opens inside the app with a frame to line up the label, and every scan, with its photo, is saved to the worker's account along with their clocks and language, so a lost or borrowed phone loses nothing.

When a photo is too blurry or a label is ambiguous, Furrow doesn't guess. It marks the warning level unknown and tells the worker to ask a supervisor.

## How I built it

The front end is Next.js 16, React and Tailwind, hosted on Vercel. A server route sends the photo to the Google Gemini API on the free tier and asks for JSON in a fixed schema, so the app always gets the same fields back and never has to parse prose. The system prompt sets the translation rules: product names and phone numbers stay exactly as printed, units are translated, and an unreadable label sets a flag instead of producing an answer. The heat check calls Open-Meteo, a free weather API, with the phone's location. The browser shrinks photos before upload so scans work on a weak signal, the Web Speech API reads answers aloud, and the Vibration API buzzes when a result arrives or the rinse timer ends. Accounts run on Firebase Authentication with email verification, password reset and Google sign-in. Scans, photo thumbnails, clocks and language are stored in Cloud Firestore, and the security rules only allow a verified user to touch their own documents. Photos are shrunk to thumbnails so everything stays on Firebase's free plan. The sample labels carry saved answers in all three languages, so the demo works even if the network doesn't.

## Challenges

Getting Punjabi to come out fully in Punjabi was the hard part. Early answers left units like hours and minutes in English, so I tightened the prompt and checked the output in Gurmukhi. Speed was the other one. Turning off the model's extra thinking time brought a scan down to about five seconds, which matters when someone is standing in a row holding a phone.

## Accomplishments

It works end to end on a real phone with a real photo, and it handles the cases where it shouldn't answer. The countdown clock, the heat check and the doctor card turned a one-time translation into something a worker would open every day.

## What I learned

Structured output makes a language model feel like an ordinary API. The interesting design question wasn't the translation, it was when the app should refuse to answer.

## What's next

Native Punjabi and Spanish speakers and pesticide safety trainers need to check every phrase, and I want to put it in front of crew leaders and farmworkers before anyone relies on it. After that, an installed version that scans with no signal, and more languages as the community asks.

## Built with

Google Gemini API, Firebase Authentication, Cloud Firestore, Open-Meteo, Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Vercel, Web Speech API, Google Fonts

## Links

Live site: https://furrow-valley.vercel.app
Code: https://github.com/K3N0SU/Hackathon
