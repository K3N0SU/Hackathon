# SierraHacks solo hackathon project

Goal: win. Judges reward a working live demo, a clear story, and polish. Theme is announced at kickoff and the user will paste it. Until then, nothing project-specific is decided.

## Session workflow (token discipline)
- First action every session: read `TODO.md`. It is the memory across `/compact`. Do not re-explore the repo to rediscover what it says.
- The user runs `/compact` after every task. Before finishing a task, update `TODO.md`: mark done, record decisions, file paths touched, env/setup state, the exact next step. Keep it terse.
- One task at a time. Finish, update `TODO.md`, stop, and say "ready for /compact".
- Read only what is needed: Grep first, then Read with offset/limit. Never re-read a file just edited. Batch independent tool calls in one message.
- Do not spawn agents or plan mode for small tasks. Only delegate broad multi-file searches.
- Replies: short, decisions and results only. No recaps of the diff, no restating the request, no option surveys. Recommend one thing.
- Ask the user only when blocked on a decision that is theirs. Otherwise pick the default and note it.

## Stack
Next.js 16 (App Router, `src/`), TypeScript, Tailwind v4, shadcn/ui (`src/components/ui`), Google Gemini free tier via REST. Scan route at `src/app/api/scan/route.ts` takes a base64 image and language and returns schema-constrained JSON. Default model `gemini-3.8-flash` (env `GEMINI_MODEL`, key `GEMINI_API_KEY`). Everything must stay free. Secrets in `.env.local`, never committed; `.env.example` is the template.
- Next 16 differs from older versions. For unfamiliar APIs read `node_modules/next/dist/docs/01-app/` before writing code.
- Windows + PowerShell. Refresh PATH if a tool is missing: `$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')`. No `&&`.
- Verify with `npm run build` and `npm run lint`. Run dev with `npm run dev` only when needed.

## Code rules
- No comments in code. Names carry the meaning. This includes JSX, CSS, config files.
- Match existing style and structure. Reuse components in `src/components/ui` before writing new ones.
- No speculative abstractions, dead code, placeholder TODOs, or unused deps.
- Handle real failure paths in the demo flow (loading, empty, error). Skip defensive code elsewhere.
- Small commits when something works. Never leave main broken. Deploy early; a live URL must always exist.

## Must not look AI-generated or vibecoded
- No faux-tech naming or styling: no `COOLAPP // SUBTITLE`, no slash/pipe-separated title lockups, no ALL-CAPS tracking-wide labels everywhere, no `[ BRACKETED ]` text, no terminal-cursor gimmicks, no "powered by AI" badges.
- No emoji in UI, headings, commit messages, or code. No sparkle icons for AI features.
- No purple-to-blue gradients, glassmorphism, neon glows, or gradient text. Pick one restrained palette (neutral base plus one accent), real typography scale, consistent spacing and radius.
- No filler marketing copy ("revolutionize", "seamless", "supercharge", "unlock the power of"). Write plain, specific copy a human would write. Use the product's real nouns.
- No generic hero-with-three-feature-cards layout unless the product genuinely needs it. Design around the actual core flow, with real content and seeded realistic data, not lorem ipsum or "John Doe".
- Prose and docs (README, Devpost, UI text): no numbered paragraphs, no bullet-everything, no headings on every paragraph, no bolded lead-ins on every item, no "Here's a breakdown". Write in normal paragraphs with a human voice. Use lists only for genuinely list-like content.
- Product name: short, one word or two, memorable, no suffixes like -ify, -ly, -AI, -GPT, no emoji, no slashes.

## Hackathon rules of thumb
- Demo path over feature breadth. If it is not in the demo, do not build it.
- Build the vertical slice first, then polish. Seed demo data so the demo never depends on live luck. Keep a fallback if the API or wifi dies.
- Mention every sponsor technology used in README and Devpost.
- Submit early, then only fix critical bugs.
