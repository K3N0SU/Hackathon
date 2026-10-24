import {
  Droplets,
  HeartPulse,
  Phone as PhoneIcon,
  ShowerHead,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { HeroScene } from "@/components/hero-scene";
import { Phone } from "@/components/phone";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionDots } from "@/components/section-dots";
import { SiteNav } from "@/components/site-nav";
import { heatCopy } from "@/lib/heat";
import { samples } from "@/lib/samples";
import { copy } from "@/lib/scan";

const label = samples[0];

const answers = [
  { tag: "English", lang: "en", line: label.results.en.reentry },
  { tag: "Español", lang: "es", line: label.results.es.reentry },
  { tag: "ਪੰਜਾਬੀ", lang: "pa", line: label.results.pa.reentry },
] as const;

const proof = [
  { figure: "5 sec", note: "from photo to answer" },
  { figure: "3 tools", note: "labels, heat and exposure help" },
  { figure: "3 languages", note: "English, Spanish and Punjabi" },
  { figure: "$0", note: "no account, nothing to install" },
];

const questions = [
  {
    question: "Is it accurate?",
    answer:
      "It reads the label in the photo and says what is printed there, and it says so when it can't. The Spanish and Punjabi are machine translations that native speakers and pesticide safety trainers still need to review. Furrow explains a label. It does not replace the label, the training a grower has to give, or Poison Control.",
  },
  {
    question: "Where does the heat forecast come from?",
    answer:
      "From Open-Meteo, a free weather service, using the phone's location. If location is off, Furrow shows the weather in Manteca. The rules it explains are California's heat rules for outdoor work: shade above 80°F, and extra protections at 95°F.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. Every tool works without one, and your language and countdown clocks stay on the phone itself. If you want, you can make an account with your email or sign in with Google.",
  },
  {
    question: "What if I have no signal?",
    answer:
      "Scanning and the heat check need a connection. The exposure steps, the rinse timer and the sample labels work without one.",
  },
  {
    question: "What does it cost?",
    answer:
      "Nothing. It runs on free tiers, so there is nothing to charge for.",
  },
];

const heading =
  "font-display text-5xl font-extrabold uppercase leading-[0.95] sm:text-7xl";

const delay = (value: string) => ({ "--delay": value }) as React.CSSProperties;

export default function Home() {
  return (
    <div className="flex-1 overflow-x-clip">
      <SiteNav />
      <SectionDots />
      <ScrollReveal />

      <section
        id="top"
        className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#08130e] px-6 text-center text-primary-foreground"
      >
        <HeroScene />
        <div className="relative z-10 pb-56 pt-28">
          <p
            className="enter text-xs font-semibold uppercase tracking-[0.35em] text-amber-100/80 sm:text-sm"
            style={delay("0.1s")}
          >
            For the people who work the rows
          </p>
          <h1 className="mt-6 font-display text-[clamp(3.6rem,14vw,12rem)] font-extrabold uppercase leading-[0.84]">
            <span className="enter block" style={delay("0.25s")}>
              Know before
            </span>
            <span className="enter block text-amber-100" style={delay("0.4s")}>
              you walk in.
            </span>
          </h1>
          <p
            className="enter mx-auto mt-8 max-w-xl text-lg leading-relaxed text-primary-foreground/85 sm:text-xl"
            style={delay("0.6s")}
          >
            Read any pesticide label in Spanish, Punjabi or English. Check
            today&apos;s heat and your rights. Get step-by-step help if you are
            exposed.
          </p>
          <div
            className="enter mt-10 flex flex-wrap items-center justify-center gap-4"
            style={delay("0.75s")}
          >
            <Link
              href="/scan"
              className="button-glow rounded-full bg-harvest px-9 py-4 text-lg font-semibold text-harvest-foreground transition-transform hover:-translate-y-1 active:translate-y-0"
            >
              Open Furrow
            </Link>
            <a
              href="#field"
              className="rounded-full border border-white/30 px-8 py-4 text-lg font-medium transition-colors hover:bg-white/10"
            >
              See what it does
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#0b1710] text-primary-foreground">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 lg:grid-cols-4">
          {proof.map((item, index) => (
            <li
              key={item.figure}
              className="reveal py-8 pr-4"
              style={delay(`${index * 90}ms`)}
            >
              <p className="font-display text-4xl font-extrabold uppercase text-harvest sm:text-5xl">
                {item.figure}
              </p>
              <p className="mt-1 text-sm text-primary-foreground/70 sm:text-base">
                {item.note}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="field"
        className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-36"
      >
        <div className="reveal">
          <p className="font-semibold text-primary">One. Labels</p>
          <h2 className={`mt-3 ${heading}`}>Point. Read. Listen.</h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Photograph a pesticide label or a re-entry sign. In about five
            seconds Furrow tells you the warning level, how long to stay out,
            what to wear and what to do if something goes wrong, then reads it
            aloud in your language.
          </p>
          <Link
            href="/scan"
            className="mt-8 inline-block rounded-full bg-primary px-8 py-3.5 text-lg font-semibold text-primary-foreground transition-transform hover:-translate-y-1"
          >
            Scan a label
          </Link>
        </div>
        <div
          className="reveal flex justify-center lg:justify-end"
          style={delay("0.15s")}
        >
          <Phone className="floating" />
        </div>
      </section>

      <section id="languages" className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-36">
          <div className="reveal max-w-3xl">
            <h2 className={heading}>
              The same label, in the language you think in.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              A product label is written for a regulator. Furrow rewrites the
              parts that matter in plain words, and keeps product names and
              phone numbers exactly as printed.
            </p>
          </div>
          <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div
              className="reveal relative overflow-hidden rounded-2xl border bg-card p-4 shadow-sm"
              style={delay("0.1s")}
            >
              <img
                src={label.image}
                alt="A pesticide label in small English print"
                className="w-full rounded-lg"
              />
              <div className="scan-line pointer-events-none absolute inset-x-0 h-24" />
              <p className="mt-3 px-1 text-sm text-muted-foreground">
                {label.detail}, a sample label made for the demo
              </p>
            </div>
            <ul className="space-y-4">
              {answers.map((answer, index) => (
                <li
                  key={answer.lang}
                  lang={answer.lang}
                  style={delay(`${0.2 + index * 0.15}s`)}
                  className="reveal rounded-2xl border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <p className="text-sm font-medium text-primary">
                    {answer.tag}
                  </p>
                  <p className="mt-2 font-heading text-2xl font-semibold leading-snug sm:text-3xl">
                    {answer.line}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="clock" className="bg-[#0b1710] text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:py-36">
          <div className="reveal">
            <h2 className={heading}>
              A scan tells you once. The clock keeps telling you.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-primary-foreground/75">
              Tell Furrow when a block was sprayed and it counts down the
              re-entry interval on your phone. Red means stay out. Green means
              the interval is over. It is still there after you close the
              browser and open it again at lunch.
            </p>
          </div>
          <div className="space-y-4">
            <div
              className="reveal rounded-2xl bg-red-700 p-6 text-white shadow-2xl shadow-red-950/50"
              style={delay("0.1s")}
            >
              <p className="font-medium">Valley Guard 2EC, north block</p>
              <p className="mt-1 font-heading text-4xl font-semibold tabular-nums">
                7 h 18 min left
              </p>
              <p className="mt-1 text-sm opacity-90">
                {copy.en.safeAt} 4:30 PM
              </p>
            </div>
            <div
              className="reveal rounded-2xl bg-primary p-6 text-primary-foreground ring-1 ring-white/15"
              style={delay("0.25s")}
            >
              <p className="font-medium">Rowkill, east block</p>
              <p className="mt-1 font-heading text-4xl font-semibold">
                {copy.en.safeNow}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="heat"
        className="relative overflow-hidden bg-[linear-gradient(160deg,#fbe3b8_0%,#f6c27a_55%,#e9954a_100%)] text-[#2a1606]"
      >
        <div className="absolute -right-40 -top-40 size-[36rem] rounded-full bg-[radial-gradient(circle,#fff3d6_0%,rgba(255,243,214,0)_65%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:py-36">
          <div className="reveal">
            <p className="flex items-center gap-2 font-semibold">
              <Sun className="size-5" />
              Two. Heat
            </p>
            <h2 className={`mt-3 ${heading}`}>
              The Valley gets hot. Know your rights before noon.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#2a1606]/80">
              Furrow checks the forecast where you are standing, tells you the
              hottest hour of the day, and explains what California requires at
              that temperature: water, shade, cool-down breaks, and the signs of
              heat illness that mean call 911.
            </p>
          </div>
          <div className="space-y-4">
            <div
              style={delay("0.1s")}
              className="reveal grid grid-cols-3 divide-x divide-[#2a1606]/15 rounded-2xl bg-white/70 text-center shadow-xl backdrop-blur"
            >
              {[
                { value: "91°", label: heatCopy.en.now },
                { value: "96°", label: heatCopy.en.feels },
                { value: "99°", label: `${heatCopy.en.high}, 4 PM` },
              ].map((item) => (
                <div key={item.label} className="px-2 py-5">
                  <p className="font-display text-5xl font-extrabold">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs">{item.label}</p>
                </div>
              ))}
            </div>
            <div
              className="reveal rounded-2xl bg-red-700 p-6 text-white shadow-xl"
              style={delay("0.25s")}
            >
              <p className="font-display text-3xl font-extrabold uppercase">
                {heatCopy.en.levels.high.title}
              </p>
              <p className="mt-2 leading-snug">
                {heatCopy.en.levels.high.body}
              </p>
            </div>
            <div
              className="reveal flex gap-3 rounded-2xl bg-white/70 p-5 shadow-xl backdrop-blur"
              style={delay("0.4s")}
            >
              <Droplets className="mt-0.5 size-6 shrink-0 text-sky-700" />
              <p className="leading-snug">{heatCopy.en.water}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="exposed" className="bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:py-36">
          <div className="order-2 space-y-3 lg:order-1">
            <div className="reveal rounded-2xl bg-red-700 p-5 text-white shadow-xl">
              <p className="font-medium">
                Trouble breathing, passed out or a seizure? Call 911 now.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <span className="flex h-11 items-center justify-center gap-2 rounded-lg bg-white font-semibold text-red-800">
                  <PhoneIcon className="size-4" />
                  911
                </span>
                <span className="flex h-11 items-center justify-center rounded-lg border-2 border-white/80 text-sm font-semibold">
                  Poison Control
                </span>
              </div>
            </div>
            <div
              className="reveal rounded-2xl border bg-card p-5 shadow-sm"
              style={delay("0.15s")}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary font-display text-xl font-extrabold text-primary-foreground">
                  3
                </span>
                <p className="font-medium">Rinse for 15 minutes</p>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-2/3 rounded-full bg-sky-600" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="font-display text-4xl font-extrabold tabular-nums">
                  4:52
                </p>
                <span className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium">
                  <ShowerHead className="size-4" />
                  Keep rinsing
                </span>
              </div>
            </div>
            <div
              className="reveal rounded-2xl bg-white p-5 text-neutral-950 shadow-xl ring-1 ring-black/5"
              style={delay("0.3s")}
            >
              <p className="font-display text-3xl font-extrabold uppercase">
                Pesticide exposure
              </p>
              <p className="mt-2">Product: Valley Guard 2EC insecticide</p>
              <p className="mt-3 rounded-xl bg-amber-100 p-3 font-semibold">
                I speak Punjabi. Please get me an interpreter.
              </p>
            </div>
          </div>
          <div className="reveal order-1 lg:order-2">
            <p className="flex items-center gap-2 font-semibold text-red-700">
              <HeartPulse className="size-5" />
              Three. Exposed
            </p>
            <h2 className={`mt-3 ${heading}`}>
              When it goes wrong, every minute counts.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Big buttons for 911 and Poison Control. Five clear steps in your
              language, with a 15-minute rinse timer that buzzes when you are
              done. Then a card in English for the doctor, with the product you
              last scanned already filled in and a line asking for an
              interpreter.
            </p>
          </div>
        </div>
      </section>

      <section id="honest" className="bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:py-36">
          <div className="reveal rounded-2xl border-2 border-amber-400 bg-amber-50 p-7 text-amber-950 shadow-sm">
            <p className="font-heading text-2xl font-semibold leading-snug">
              {copy.en.unreadable}
            </p>
          </div>
          <div className="reveal" style={delay("0.15s")}>
            <h2 className={heading}>When it can&apos;t tell, it says so.</h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              A blurry photo or an unclear label never gets a guess about
              someone&apos;s safety. Furrow stops and tells the worker to ask a
              supervisor. A wrong answer here is worse than no answer.
            </p>
          </div>
        </div>
      </section>

      <section id="questions" className="mx-auto max-w-3xl px-6 py-24 lg:py-36">
        <h2 className={`reveal ${heading}`}>Questions</h2>
        <div className="mt-8 divide-y border-y">
          {questions.map((item, index) => (
            <details
              key={item.question}
              className="reveal group py-5"
              style={delay(`${index * 0.08}s`)}
            >
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

      <section className="relative overflow-hidden bg-[#08130e] text-primary-foreground">
        <HeroScene still />
        <div className="relative mx-auto max-w-6xl px-6 pb-48 pt-28 text-center">
          <h2 className="reveal font-display text-6xl font-extrabold uppercase leading-[0.9] sm:text-8xl">
            Try it on a label.
          </h2>
          <Link
            href="/scan"
            style={delay("0.2s")}
            className="reveal button-glow mt-10 inline-block rounded-full bg-harvest px-10 py-4 text-lg font-semibold text-harvest-foreground transition-transform hover:-translate-y-1"
          >
            Open Furrow
          </Link>
        </div>
      </section>

      <footer className="bg-[#0b1710] text-sm text-primary-foreground/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <p>Built at SierraHacks in Manteca.</p>
          <p>Poison Control: 1-800-222-1222</p>
        </div>
      </footer>
    </div>
  );
}
