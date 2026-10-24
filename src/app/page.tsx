import Link from "next/link";
import { FieldRows } from "@/components/field-rows";
import { Mark } from "@/components/mark";
import { Phone } from "@/components/phone";
import { samples } from "@/lib/samples";
import { copy } from "@/lib/scan";

const label = samples[0];

const answers = [
  { tag: "English", lang: "en", line: label.results.en.reentry },
  { tag: "Español", lang: "es", line: label.results.es.reentry },
  { tag: "ਪੰਜਾਬੀ", lang: "pa", line: label.results.pa.reentry },
] as const;

const questions = [
  {
    question: "Is it accurate?",
    answer:
      "It reads the label in the photo and says what is printed there, and it says so when it can't. The Spanish and Punjabi are machine translations that native speakers and pesticide safety trainers still need to review. Furrow explains a label. It does not replace the label, the training a grower has to give, or Poison Control.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. Furrow opens in the phone's browser and keeps your language and your countdown clocks on the phone itself. Nothing is saved on a server.",
  },
  {
    question: "What if I have no signal?",
    answer:
      "Scanning needs a connection. The sample labels keep saved answers so they still open without one. A version that scans with no signal at all is the next thing we want to build.",
  },
  {
    question: "What does it cost?",
    answer:
      "Nothing. It runs on free tiers, so there is nothing to charge for.",
  },
];

export default function Home() {
  return (
    <div className="flex-1">
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <FieldRows className="absolute inset-0 size-full text-primary-foreground opacity-[0.09]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <header className="flex items-center justify-between py-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-heading text-2xl font-semibold"
            >
              <Mark className="size-8 text-primary-foreground [--background:var(--primary)]" />
              Furrow
            </Link>
            <nav className="flex items-center gap-7 text-sm">
              <a href="#languages" className="hidden hover:underline sm:inline">
                Languages
              </a>
              <a href="#clock" className="hidden hover:underline sm:inline">
                The clock
              </a>
              <a href="#questions" className="hidden hover:underline sm:inline">
                Questions
              </a>
              <Link
                href="/scan"
                className="rounded-full bg-primary-foreground px-5 py-2 font-medium text-primary transition-transform hover:scale-105"
              >
                Open Furrow
              </Link>
            </nav>
          </header>

          <div className="grid items-center gap-12 pb-24 pt-12 lg:grid-cols-[1.15fr_1fr] lg:pb-32 lg:pt-20">
            <div>
              <h1 className="font-heading text-6xl font-semibold leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
                Know before you walk in.
              </h1>
              <p className="mt-8 max-w-lg text-xl leading-relaxed opacity-90">
                Photograph a pesticide label or a field sign. Furrow tells you
                how long to stay out, what to wear and what to do if something
                goes wrong, in English, Spanish or Punjabi.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/scan"
                  className="rounded-full bg-primary-foreground px-8 py-4 text-lg font-semibold text-primary transition-transform hover:scale-105"
                >
                  Scan a label
                </Link>
                <a
                  href="#languages"
                  className="px-4 py-4 text-lg font-medium underline underline-offset-4"
                >
                  See how it reads
                </a>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Phone className="rotate-3" />
            </div>
          </div>
        </div>
      </section>

      <section id="languages" className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <div className="reveal max-w-2xl">
          <h2 className="font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            The same label, in the language you think in.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A product label is written to satisfy a regulator. Furrow rewrites
            the parts that matter in plain words, and keeps product names and
            phone numbers exactly as printed.
          </p>
        </div>
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="reveal rounded-2xl border bg-card p-4 shadow-sm">
            <img
              src={label.image}
              alt="A pesticide label in small English print"
              className="w-full rounded-lg"
            />
            <p className="mt-3 px-1 text-sm text-muted-foreground">
              {label.detail}, a sample label made for the demo
            </p>
          </div>
          <ul className="space-y-4">
            {answers.map((answer) => (
              <li
                key={answer.lang}
                lang={answer.lang}
                className="reveal rounded-2xl border bg-card p-6"
              >
                <p className="text-sm font-medium text-primary">{answer.tag}</p>
                <p className="mt-2 font-heading text-2xl font-semibold leading-snug sm:text-3xl">
                  {answer.line}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="clock" className="bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:py-32">
          <div className="reveal">
            <h2 className="font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              A scan tells you once. The clock keeps telling you.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Tell Furrow when a block was sprayed and it counts down the
              re-entry interval on your phone. Red means stay out. Green means
              the interval is over. It is still there after you close the
              browser and open it again at lunch.
            </p>
          </div>
          <div className="reveal space-y-4">
            <div className="rounded-2xl bg-red-700 p-6 text-white">
              <p className="font-medium">Valley Guard 2EC, north block</p>
              <p className="mt-1 font-heading text-4xl font-semibold tabular-nums">
                7 h 18 min left
              </p>
              <p className="mt-1 text-sm opacity-90">
                {copy.en.safeAt} 4:30 PM
              </p>
            </div>
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
              <p className="font-medium">Rowkill, east block</p>
              <p className="mt-1 font-heading text-4xl font-semibold">
                {copy.en.safeNow}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:py-32">
        <div className="reveal rounded-2xl border-2 border-amber-400 bg-amber-50 p-7 text-amber-950">
          <p className="font-heading text-2xl font-semibold leading-snug">
            {copy.en.unreadable}
          </p>
        </div>
        <div className="reveal">
          <h2 className="font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            When it can&apos;t tell, it says so.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            A blurry photo or an unclear label never gets a guess about
            someone&apos;s safety. Furrow stops and tells the worker to ask a
            supervisor. A wrong answer here is worse than no answer.
          </p>
        </div>
      </section>

      <section id="questions" className="mx-auto max-w-3xl px-6 pb-24 lg:pb-32">
        <h2 className="reveal font-heading text-4xl font-semibold tracking-tight">
          Questions
        </h2>
        <div className="mt-8 divide-y border-y">
          {questions.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                {item.question}
                <span className="text-2xl text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <FieldRows className="absolute inset-0 size-full text-primary-foreground opacity-[0.09]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="font-heading text-5xl font-semibold tracking-tight sm:text-6xl">
            Try it on a label.
          </h2>
          <Link
            href="/scan"
            className="mt-10 inline-block rounded-full bg-primary-foreground px-9 py-4 text-lg font-semibold text-primary transition-transform hover:scale-105"
          >
            Scan a label
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
        <p>Built at SierraHacks in Manteca. Poison Control: 1-800-222-1222.</p>
        <Link href="/deck" className="underline underline-offset-4">
          Slides
        </Link>
      </footer>
    </div>
  );
}
