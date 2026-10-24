import {
  ArrowRight,
  BellRing,
  Camera,
  ClipboardPen,
  FileText,
  HeartPulse,
  Languages,
  MapPinned,
  MessageCircleQuestion,
  Smartphone,
  Stethoscope,
  Sun,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import { AskDemo } from "@/components/ask-demo";
import { FieldLines } from "@/components/field-lines";
import { LabelHighlight } from "@/components/label-highlight";
import { LabelReader } from "@/components/label-reader";
import { Magnetic, Odometer, ScrollProgress, Tilt } from "@/components/motion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionDots } from "@/components/section-dots";
import { SiteNav } from "@/components/site-nav";
import { Stamp } from "@/components/stamp";
import { Tour } from "@/components/tour";
import { heatCopy } from "@/lib/heat";
import { samples } from "@/lib/samples";

const heat = heatCopy.en;

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
  { value: "5", unit: "sec", note: "from photo to answer" },
  { value: "12", unit: "", note: "tools in one free app" },
  { value: "15", unit: "min", note: "rinse timer when someone is exposed" },
  { value: "0", unit: "$", note: "cost to any worker, ever" },
];

const tools = [
  {
    icon: Camera,
    title: "Scan a label",
    body: "Re-entry time, gear and first aid from one photo. Several labels in one shot each get their own card.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Ask Furrow",
    body: "Ask anything about the label you scanned, by typing or talking. Answers come only from what is printed.",
  },
  {
    icon: BellRing,
    title: "Re-entry alarms",
    body: "A countdown for each block that buzzes your phone when it is safe to go back in.",
  },
  {
    icon: Sun,
    title: "Heat check",
    body: "The hottest hour today where you stand, what the law says your employer owes you, and water reminders.",
  },
  {
    icon: Stethoscope,
    title: "Symptom check",
    body: "Tap what you feel. Furrow says whether to call 911, call Poison Control, or rinse and rest.",
  },
  {
    icon: HeartPulse,
    title: "Exposed",
    body: "911 and Poison Control in one tap, a 15-minute rinse timer and an English card for the doctor.",
  },
  {
    icon: FileText,
    title: "Read any paper",
    body: "Training sheets, notices, pay stubs. A plain summary and what you need to do, in your language.",
  },
  {
    icon: ClipboardPen,
    title: "Report writer",
    body: "Say what happened in your language. Furrow writes a clear English report for the grower or Cal/OSHA.",
  },
  {
    icon: UserRoundCheck,
    title: "Supervisor card",
    body: "One tap shows a big English card with the product and re-entry time, so you can ask without translating.",
  },
  {
    icon: MapPinned,
    title: "Spray map",
    body: "Every scan is pinned where you stood, so you can see which blocks were sprayed and when.",
  },
  {
    icon: Languages,
    title: "Your language",
    body: "Spanish, Punjabi, Hmong, Tagalog, Hindi, Arabic, Vietnamese and more. Read out loud on tap.",
  },
  {
    icon: Smartphone,
    title: "Works like an app",
    body: "Add it to your home screen. Saved scans, clocks and the exposure steps still work with no signal.",
  },
];

const questions = [
  {
    question: "Is it accurate?",
    answer:
      "It reads the label in the photo and says what is printed there, and it says so when it can't. Translations are by machine and still need review by native speakers and pesticide safety trainers. Furrow explains a label. It does not replace the label, your training or Poison Control.",
  },
  {
    question: "What can I ask the chat?",
    answer:
      "Anything about the label you scanned: can I eat here, do I need goggles, what if it gets in my eyes. Furrow answers only from the label and California's rules, and tells you to ask a supervisor or doctor when the label doesn't say.",
  },
  {
    question: "Why do I need an account?",
    answer:
      "So nothing gets lost. Your scans, photos, clocks and language are saved and come back on any phone you sign in on. Sign up with an email or Google. It is free.",
  },
  {
    question: "What if I have no signal?",
    answer:
      "Saved scans, clocks, the exposure steps, the rinse timer and the sample labels work offline. Scanning, chat and the heat check need a connection.",
  },
  {
    question: "What does it cost?",
    answer: "Nothing. It runs on free tiers, so there is nothing to charge for.",
  },
];

const delay = (value: string) => ({ "--delay": value }) as React.CSSProperties;

function Words({ text, start }: { text: string; start: number }) {
  return text.split(" ").map((word, index) => (
    <span key={index} className="word-mask mr-[0.22em]">
      <span style={delay(`${start + index * 0.07}s`)}>{word}</span>
    </span>
  ));
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="reveal font-display text-xl italic text-primary">{children}</p>
  );
}

export default function Home() {
  return (
    <div className="flex-1 overflow-x-clip bg-background">
      <ScrollProgress />
      <SiteNav />
      <SectionDots />
      <ScrollReveal />

      <section id="top" className="relative overflow-hidden">
        <div className="parallax absolute inset-0" style={{ "--shift": "120px" } as React.CSSProperties}>
          <FieldLines className="text-primary/15" horizon={false} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-32 lg:min-h-svh lg:grid-cols-[1.15fr_0.85fr] lg:pb-16 lg:pt-28">
          <div className="text-center lg:text-left">
            <p
              className="enter inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-primary shadow-sm"
              style={delay("0.1s")}
            >
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-harvest" />
                <span className="relative size-2 rounded-full bg-harvest" />
              </span>
              Free for farmworkers, in your language
            </p>
            <h1 className="mt-7 font-display text-[clamp(3rem,9vw,5.6rem)] font-semibold leading-[0.95] text-primary lg:text-[clamp(3.5rem,5.6vw,5.2rem)]">
              <span className="block">
                <Words text="The label says" start={0.2} />
              </span>
              <span className="block">
                <Words text="12 hours." start={0.42} />
              </span>
              <span className="block italic text-foreground">
                <Words text="Now you can read it." start={0.6} />
              </span>
            </h1>
            <p
              className="enter mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0"
              style={delay("1s")}
            >
              Point your phone at a pesticide label. Furrow tells you when it is
              safe to go back in, what to wear, and answers your questions out
              loud.
            </p>
            <div
              className="enter mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              style={delay("1.15s")}
            >
              <Magnetic>
                <Link
                  href="/sign-up"
                  className="sweep group flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 [--sweep-color:var(--harvest)] hover:text-harvest-foreground active:scale-95"
                >
                  Get started free
                  <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <a
                  href="#tour"
                  className="sweep flex h-14 items-center rounded-full border-2 border-primary/20 px-7 text-lg font-medium text-primary transition-colors [--sweep-color:var(--paper)] hover:border-primary/40 active:scale-95"
                >
                  See how it works
                </a>
              </Magnetic>
            </div>
          </div>
          <div className="enter" style={delay("0.5s")}>
            <LabelReader />
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden border-y bg-paper py-5">
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-2xl italic text-primary/45 sm:text-3xl">
          {[...crops, ...crops].map((crop, index) => (
            <span key={index} className="flex items-center gap-10">
              {crop}
              <span className="size-1.5 rounded-full bg-harvest" />
            </span>
          ))}
        </div>
      </div>

      <section id="problem" className="relative py-28 lg:py-24">
        <LabelHighlight />
      </section>

      <section id="tour" className="relative bg-paper/60 pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="reveal mt-3 max-w-3xl font-display text-5xl font-semibold leading-[0.98] text-primary sm:text-7xl">
            One photo. Every answer you need.
          </h2>
        </div>
        <Tour />
      </section>

      <section id="ask" className="relative py-28 lg:py-40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Ask Furrow</Eyebrow>
            <h2 className="reveal mt-3 font-display text-5xl font-semibold leading-[0.98] text-primary sm:text-6xl">
              Ask the label anything.
            </h2>
            <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground" style={delay("0.1s")}>
              After a scan, ask questions in your own words, typed or spoken.
              Furrow answers from what the label actually says and from
              California&apos;s farm safety rules, in your language. When the
              label doesn&apos;t say, it tells you who to ask.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Answers only from the label you scanned",
                "Talk instead of typing, hear the answer out loud",
                "Says \"I don't know\" instead of guessing",
              ].map((item, index) => (
                <li
                  key={item}
                  className="reveal-left flex items-center gap-3 text-lg"
                  style={delay(`${0.15 + index * 0.1}s`)}
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-harvest text-sm font-bold text-harvest-foreground">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal" style={delay("0.15s")}>
            <Tilt max={5}>
              <AskDemo />
            </Tilt>
          </div>
        </div>
      </section>

      <section id="numbers" className="relative overflow-hidden bg-ink text-ink-foreground">
        <FieldLines className="text-white/[0.07]" draw={false} />
        <ul className="relative mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
          {numbers.map((item, index) => (
            <li
              key={item.note}
              className="reveal border-white/10 px-6 py-16 [&:not(:first-child)]:border-l max-lg:[&:nth-child(3)]:border-l-0 max-lg:[&:nth-child(n+3)]:border-t"
              style={delay(`${index * 0.1}s`)}
            >
              <p className="flex items-baseline gap-1 whitespace-nowrap font-display text-6xl font-semibold text-harvest sm:text-7xl">
                {item.unit === "$" && <span>$</span>}
                <Odometer value={item.value} />
                {item.unit && item.unit !== "$" && (
                  <span className="text-3xl sm:text-4xl">{item.unit}</span>
                )}
              </p>
              <p className="mt-4 max-w-[14rem] text-white/70">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="heat" className="relative py-28 lg:py-40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <div className="reveal order-2 lg:order-1">
            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Manteca, today</p>
                <Sun className="spin-slow size-8 text-harvest" />
              </div>
              <div className="mt-6 grid grid-cols-3 divide-x rounded-xl border bg-background text-center">
                {[
                  { value: "91", label: heat.now },
                  { value: "96", label: heat.feels },
                  { value: "99", label: "High, 4 PM" },
                ].map((item) => (
                  <div key={item.label} className="px-2 py-5">
                    <p className="font-display text-4xl font-semibold text-primary sm:text-5xl">
                      <Odometer value={item.value} />°
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="heat-flip mt-4 rounded-xl bg-harvest p-5 text-harvest-foreground">
                <p className="font-display text-2xl font-semibold">
                  {heat.levels.high.title}
                </p>
                <p className="mt-2 leading-snug">{heat.levels.high.body}</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Eyebrow>Heat</Eyebrow>
            <h2 className="reveal mt-3 font-display text-5xl font-semibold leading-[0.98] text-primary sm:text-6xl">
              Know the hottest hour before it hits.
            </h2>
            <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground" style={delay("0.1s")}>
              Furrow checks the forecast where you stand and tells you what
              California requires at that temperature: shade above 80°F,
              cool-down breaks at 95°F, and water every hour. On hot days your
              phone reminds you to drink.
            </p>
          </div>
        </div>
      </section>

      <section id="honest" className="relative bg-paper/60 py-28 lg:py-40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <div className="reveal relative mx-auto w-full max-w-sm">
            <div className="card relative overflow-hidden p-5">
              <img
                src={samples[0].image}
                alt="A blurry pesticide label"
                className="h-64 w-full rounded-xl object-cover object-top opacity-70 blur-[3px] transition-all duration-700 hover:blur-[1.5px]"
              />
              <Stamp text="Unreadable" />
              <div className="mt-5 rounded-xl border-2 border-harvest bg-harvest/15 p-4">
                <p className="font-heading text-lg font-semibold leading-snug">
                  This photo is too blurry to read safely. Ask your supervisor
                  what the label says.
                </p>
              </div>
            </div>
          </div>
          <div>
            <Eyebrow>Honest by design</Eyebrow>
            <h2 className="reveal mt-3 font-display text-5xl font-semibold leading-[0.98] text-primary sm:text-6xl">
              When it can&apos;t tell, it says so.
            </h2>
            <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground" style={delay("0.1s")}>
              A wrong re-entry time is worse than none. Furrow checks the photo
              for blur before it sends it, shows exactly which words on the
              label each answer came from, and stops when a detail is unclear.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-28 lg:py-40">
        <Eyebrow>Everything in it</Eyebrow>
        <h2 className="reveal mt-3 max-w-3xl font-display text-5xl font-semibold leading-[0.98] text-primary sm:text-6xl">
          Twelve tools. One free app.
        </h2>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div key={tool.title} className="reveal" style={delay(`${(index % 3) * 0.08}s`)}>
                <Tilt max={8} className="h-full">
                  <div className="card lift sheen spin-once relative h-full overflow-hidden p-7 hover:border-primary/30">
                    <span className="spin-target flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold text-primary">
                      {tool.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                      {tool.body}
                    </p>
                  </div>
                </Tilt>
              </div>
            );
          })}
        </div>
      </section>

      <section id="questions" className="mx-auto max-w-3xl px-6 pb-28 lg:pb-40">
        <h2 className="reveal font-display text-5xl font-semibold text-primary sm:text-6xl">
          Questions
        </h2>
        <div className="mt-10 space-y-3">
          {questions.map((item, index) => (
            <details
              key={item.question}
              className="reveal group card overflow-hidden px-6 py-5 transition-colors open:border-primary/30"
              style={delay(`${index * 0.06}s`)}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                {item.question}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xl text-primary transition-all duration-500 [transition-timing-function:var(--ease-spring)] group-open:rotate-[135deg] group-open:bg-primary group-open:text-primary-foreground group-hover:scale-110">
                  +
                </span>
              </summary>
              <p className="rise mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div className="reveal absolute inset-0">
          <FieldLines className="text-harvest/30" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pb-40 pt-32 text-center">
          <h2 className="font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.92]">
            <span className="reveal block">Know before</span>
            <span className="reveal block italic text-harvest" style={delay("0.12s")}>
              you walk in.
            </span>
          </h2>
          <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-3" style={delay("0.25s")}>
            <Magnetic>
              <Link
                href="/sign-up"
                className="sweep group flex h-14 items-center gap-2 rounded-full bg-harvest px-9 text-lg font-semibold text-harvest-foreground [--sweep-color:var(--ink-foreground)] active:scale-95"
              >
                Make a free account
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link
                href="/sign-in"
                className="flex h-14 items-center rounded-full border-2 border-white/25 px-8 text-lg font-medium transition-colors hover:border-white/60 hover:bg-white/10 active:scale-95"
              >
                I already have one
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      <footer className="border-t bg-background text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <p>Built at SierraHacks in Manteca.</p>
          <a href="tel:18002221222" className="underline-draw font-medium text-primary">
            Poison Control: 1-800-222-1222
          </a>
        </div>
      </footer>
    </div>
  );
}
