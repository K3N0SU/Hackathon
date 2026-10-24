# Devpost copy for Furrow

Paste each section into the matching Devpost field.

## Tagline (one line)

Photograph a pesticide label, hear what it means in Spanish or Punjabi.

## Inspiration

The Central Valley grows a huge amount of the country's fruit and nuts, and the people who pick, prune and irrigate it often read Spanish or Punjabi before English. The things that keep them safe, like how long to stay out of a sprayed orchard or what to do after getting a chemical on their skin, are printed on a label and a posted sign in small English print. I wanted something that works on the phone they already carry, with no account and no training session.

## What it does

You photograph a pesticide label or a re-entry sign. Furrow tells you the warning level, how long to stay out of the field, what to wear, what to do if someone is exposed, and what the label means in two or three plain sentences. You pick English, Spanish or Punjabi, and it can read the answer aloud. If the label gives a re-entry time in hours, you tell Furrow when the block was sprayed and it keeps a countdown on your phone, red until it's safe and green after. There is a button that calls Poison Control straight from the first aid section.

When the photo is too blurry or the label is ambiguous, Furrow doesn't guess. It marks the warning level unknown and tells the worker to ask a supervisor.

## How I built it

The front end is Next.js 16 and Tailwind, hosted on Vercel. A server route sends the photo to the Google Gemini API on the free tier and asks for a JSON response in a fixed schema, so the app always gets the same fields back and can render them without parsing prose. The system prompt covers the translation rules: product names and phone numbers stay exactly as printed, units are translated, and an unreadable label sets a flag instead of producing an answer. The browser shrinks the photo before upload so it works on a slow connection, and the Web Speech API handles read-aloud. Clocks and the language choice live in localStorage, so there is no database and nothing to sign up for. The three sample labels carry saved answers in all three languages, which means the demo still works if the network doesn't.

## Challenges

Getting Punjabi to come out fully in Punjabi was the hard part. Early answers left units like hours and minutes in English, so I tightened the prompt and tested the output in Gurmukhi. Making the answer fast was the other one. Turning off the model's extra thinking time brought a scan down to about five seconds, which matters when someone is standing in a row holding a phone.

## Accomplishments

It works end to end on a real phone with a real photo, and it handles the cases where it shouldn't answer. The countdown clock turned a one-time translation into something a worker would open again.

## What I learned

Structured output makes a language model feel like an ordinary API. And the interesting design question wasn't the translation, it was when the app should refuse to answer.

## What's next

Native Punjabi and Spanish speakers need to check every phrase, and I want to put it in front of crew leaders and farmworkers before anyone relies on it. After that, an installed version that works with no signal, and more languages as the community asks.

## Built with

Google Gemini API, Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Vercel, Web Speech API, Google Fonts

## Links to add

Live site: the Vercel URL
Code: https://github.com/K3N0SU/Hackathon
Slides: open the live site's /deck page and print to PDF, then upload the PDF
