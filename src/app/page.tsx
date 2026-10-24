import {
  ArrowRight,
  Camera,
  CloudCheck,
  Languages,
  ShieldAlert,
  SignalLow,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { HeroDemo } from "@/components/hero-demo";
import { HeroScene } from "@/components/hero-scene";
import { CountUp, PointerGlow, ScrollWords } from "@/components/landing-motion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionDots } from "@/components/section-dots";
import { SiteNav } from "@/components/site-nav";
import { Tour } from "@/components/tour";
import { samples } from "@/lib/samples";

const label = samples[0];

const crops = [
  "Almonds",
  "Walnuts",
  "Table grapes",
  "Tomatoes",
  "Cherries",
  "Peaches",
  "Pistachios",
  "Sweet potatoes",
  "Wine grapes",
  "Apricots",
];

const numbers = [
  { to: 5, suffix: " sec", note: "from photo to answer" },
  { to: 3, suffix: "", note: "languages: English, Spanish and Punjabi" },
  { to: 15, suffix: " min", note: "rinse timer when someone is exposed" },
  { to: 0, prefix: "$", suffix: "", note: "free for every worker, always" },
];

const features = [
  {
    icon: Camera,
    title: "Camera built in",
    body: "The camera opens inside Furrow with a frame to line up the label. Or pick a photo you already took.",
    wide: true,
  },
  {
    icon: Volume2,
    title: "Reads it out loud",
    body: "Tap Listen and hear the answer in your language. Useful with gloves on or in bright sun.",
  },
  {
    icon: ShieldAlert,
    title: "Never guesses",
    body: "A blurry photo or unclear label gets no answer. Furrow says to ask a supervisor instead.",
  },
  {
    icon: CloudCheck,
    title: "Saved to your account",
    body: "Scans with their photos, countdown clocks and your language follow you to any phone.",
  },
  {
    icon: SignalLow,
    title: "Built for one bar",
    body: "Photos shrink before upload, and the exposure steps and rinse timer work with no signal.",
    wide: true,
  },
  {
    icon: Languages,
    title: "Your language",
    body: "English, Spanish or Punjabi. Product names and phone numbers stay exactly as printed.",
  },
];

const questions = [
  {
    question: "Is it accurate?",
    answer:
      "It reads the label in the photo and says what is printed there, and it says so when it can't. The Spanish and Punjabi are machine translations that native speakers and pesticide safety trainers still need to review. Furrow explains a label. It does not replace the label, the training a grower has to give, or Poison Control.",
  },
  {
    question: "Why do I need an account?",
    answer:
      "So nothing gets lost. Your scans, their photos, your countdown clocks and your language are saved to your account and come back on any phone you sign in on. Sign up with an email or with Google. It is free.",
  },
  {
    question: "Where does the heat forecast come from?",
    answer:
      "From Open-Meteo, a free weather service, using the phone's location. If location is off, Furrow shows the weather in Manteca. The rules it explains are California's heat rules for outdoor work.",
  },
  {
    question: "What if I have no signal?",
    answer:
      "Scanning and the heat check need a connection. The exposure steps, the rinse timer and the sample labels still work without one.",
  },
  {
    question: "What does it cost?",
    answer:
      "Nothing. It runs on free tiers, so there is nothing to charge for.",
  },
];

const delay = (value: string) => ({ "--delay": value }) as React.CSSProperties;

const story =
  "Every spray comes with a label. It says how long to stay out of the rows, what to wear, and what to do if it gets on your skin. It is printed small, in English, on the back of a drum most workers never see. Furrow puts that label in your pocket, in the language you think in.";

function Words({ text, start }: { text: string; start: number }) {
  return text.split(" ").map((word, index) => (
    <span key={index} className="word-mask mr-[0.22em]">
      <span style={delay(`${start + index * 0.08}s`)}>{word}</span>
    </span>
  ));
}

export default function Home() {
  return (
    <div className="flex-1 overflow-x-clip bg-[#07110c] text-[#f3efe4]">
      <SiteNav />
      <SectionDots />
      <ScrollReveal />
      <PointerGlow />

      <section
        id="top"
        className="relative flex min-h-svh items-center overflow-hidden"
      >
        <HeroScene />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pb-40 pt-32 lg:grid-cols-[1.3fr_0.7fr] lg:pb-48">
          <div className="text-center lg:text-left">
            <p
              className="enter inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-amber-100/90 backdrop-blur"
              style={delay("0.1s")}
            >
              <span className="size-2 rounded-full bg-harvest" />
              Free for Central Valley farmworkers
            </p>
            <h1 className="mt-7 font-display text-[clamp(3.4rem,14vw,5.5rem)] lg:text-[clamp(4rem,7vw,6.5rem)] font-extrabold uppercase leading-[0.86]">
              <span className="block">
                <Words text="Know before" start={0.2} />
              </span>
              <span className="block text-harvest">
                <Words text="you walk in." start={0.42} />
              </span>
            </h1>
            <p
              className="enter mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl lg:mx-0"
              style={delay("0.8s")}
            >
              Point your phone at any pesticide label and hear what it means in
              plain words. Check the heat. Get help fast if you are exposed.
            </p>
            <div
              className="enter mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
              style={delay("0.95s")}
            >
              <Link
                href="/sign-up"
                className="button-glow group flex items-center gap-2 rounded-full bg-harvest px-8 py-4 text-lg font-semibold text-harvest-foreground transition-transform hover:-translate-y-1 active:translate-y-0"
              >
                Get started free
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#tour"
                className="rounded-full border border-white/25 px-8 py-4 text-lg font-medium backdrop-blur transition-colors hover:bg-white/10"
              >
                See how it works
              </a>
            </div>
          </div>
          <div
            className="enter flex justify-center lg:justify-end"
            style={delay("0.6s")}
          >
            <HeroDemo />
          </div>
        </div>
        <a
          href="#story"
          aria-label="Scroll down"
          className="absolute bottom-8 left-1/2 z-10 hidden h-12 w-7 -translate-x-1/2 justify-center rounded-full border-2 border-white/40 pt-2 sm:flex"
        >
          <span className="h-2.5 w-1 animate-bounce rounded-full bg-white/80" />
        </a>
      </section>

      <div className="relative overflow-hidden border-y border-white/10 bg-[#0b1710] py-5">
        <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-2xl font-extrabold uppercase text-white/35 sm:text-3xl">
          {[...crops, ...crops].map((crop, index) => (
            <span key={index} className="flex items-center gap-12">
              {crop}
              <span className="size-2 rounded-full bg-harvest/70" />
            </span>
          ))}
        </div>
      </div>

      <section id="story" className="relative">
        <div className="mx-auto max-w-5xl px-6 py-32 lg:py-48">
          <p className="reveal mb-8 font-display text-lg uppercase tracking-wider text-harvest">
            The problem
          </p>
          <ScrollWords
            text={story}
            className="font-display text-4xl font-bold leading-[1.1] sm:text-6xl"
          />
        </div>
      </section>

      <section id="tour" className="relative">
        <div className="aurora pointer-events-none absolute left-1/4 top-1/3 size-[40rem] rounded-full bg-[radial-gradient(circle,oklch(0.45_0.09_150/0.35),transparent_65%)] blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 pt-10">
          <p className="reveal font-display text-lg uppercase tracking-wider text-harvest">
            What it does
          </p>
          <h2 className="reveal mt-4 max-w-3xl font-display text-6xl font-extrabold uppercase leading-[0.9] sm:text-8xl">
            Five tools. One free app.
          </h2>
        </div>
        <Tour />
      </section>

      <section
        id="numbers"
        className="relative border-y border-white/10 bg-[#0b1710]"
      >
        <ul className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
          {numbers.map((item, index) => (
            <li
              key={item.note}
              className="reveal border-white/10 px-6 py-14 [&:not(:first-child)]:border-l max-lg:[&:nth-child(3)]:border-l-0 max-lg:[&:nth-child(n+3)]:border-t"
              style={delay(`${index * 0.1}s`)}
            >
              <p className="whitespace-nowrap font-display text-5xl font-extrabold uppercase text-harvest sm:text-7xl">
                <CountUp
                  to={item.to}
                  prefix={item.prefix}
                  suffix={item.suffix}
                />
              </p>
              <p className="mt-3 max-w-[14rem] text-white/60">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-32 lg:py-44">
        <p className="reveal font-display text-lg uppercase tracking-wider text-harvest">
          Made for the rows
        </p>
        <h2 className="reveal mt-4 max-w-3xl font-display text-6xl font-extrabold uppercase leading-[0.9] sm:text-7xl">
          Small details that matter at 6 AM.
        </h2>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`reveal spotlight group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-harvest/40 ${feature.wide ? "lg:col-span-2" : ""}`}
                style={delay(`${(index % 3) * 0.1}s`)}
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-harvest/10 text-harvest ring-1 ring-harvest/25 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="size-7" />
                </span>
                <h3 className="mt-8 font-display text-3xl font-extrabold uppercase">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-md text-lg leading-relaxed text-white/60">
                  {feature.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="honest" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-32 lg:grid-cols-2 lg:pb-44">
          <div className="reveal relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-px overflow-hidden rounded-3xl">
              <div className="ring-glow orbit absolute -inset-[60%]" />
            </div>
            <div className="relative rounded-3xl bg-[#0d1a12] p-6">
              <img
                src={label.image}
                alt="A pesticide label"
                className="h-56 w-full rounded-xl object-cover object-top opacity-60 blur-[3px]"
              />
              <div className="mt-5 rounded-2xl border-2 border-amber-400/70 bg-amber-400/10 p-5 text-amber-100">
                <p className="font-heading text-xl font-semibold leading-snug">
                  This photo is too blurry to read safely. Ask your supervisor
                  what the label says.
                </p>
              </div>
            </div>
          </div>
          <div className="reveal" style={delay("0.15s")}>
            <p className="font-display text-lg uppercase tracking-wider text-harvest">
              Honest by design
            </p>
            <h2 className="mt-4 font-display text-6xl font-extrabold uppercase leading-[0.9] sm:text-7xl">
              When it can&apos;t tell, it says so.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
              A wrong answer about re-entry time is worse than no answer. If the
              photo is blurry or the label is unclear, Furrow stops and tells
              the worker to ask a supervisor. It never fills in a guess about
              someone&apos;s safety.
            </p>
          </div>
        </div>
      </section>

      <section id="questions" className="mx-auto max-w-3xl px-6 pb-32 lg:pb-44">
        <h2 className="reveal font-display text-6xl font-extrabold uppercase leading-[0.9] sm:text-7xl">
          Questions
        </h2>
        <div className="mt-10 space-y-3">
          {questions.map((item, index) => (
            <details
              key={item.question}
              className="reveal group rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 transition-colors open:border-harvest/40 open:bg-white/[0.05]"
              style={delay(`${index * 0.07}s`)}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                {item.question}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-xl text-harvest transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="rise mt-4 max-w-2xl leading-relaxed text-white/65">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <HeroScene still />
        <div className="relative mx-auto max-w-6xl px-6 pb-52 pt-32 text-center">
          <h2 className="font-display text-[clamp(3.5rem,10vw,8.5rem)] font-extrabold uppercase leading-[0.86]">
            <span className="reveal block">Try it on</span>
            <span className="reveal block text-harvest" style={delay("0.12s")}>
              a real label.
            </span>
          </h2>
          <div
            className="reveal mt-12 flex flex-wrap items-center justify-center gap-4"
            style={delay("0.25s")}
          >
            <Link
              href="/sign-up"
              className="button-glow group flex items-center gap-2 rounded-full bg-harvest px-9 py-4 text-lg font-semibold text-harvest-foreground transition-transform hover:-translate-y-1"
            >
              Make a free account
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full border border-white/25 px-8 py-4 text-lg font-medium backdrop-blur transition-colors hover:bg-white/10"
            >
              I already have one
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#07110c] text-sm text-white/50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <p>Built at SierraHacks in Manteca.</p>
          <p>Poison Control: 1-800-222-1222</p>
        </div>
      </footer>
    </div>
  );
}
