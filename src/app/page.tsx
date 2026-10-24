import {
  AudioLines,
  Banknote,
  BellRing,
  Camera,
  Check,
  ClipboardPen,
  FileText,
  HeartPulse,
  ImagePlus,
  Languages,
  MapPinned,
  MessageCircleQuestion,
  ScanLine,
  Shirt,
  Smartphone,
  Stethoscope,
  Sun,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { AccountCta } from "@/components/account-cta";
import { AskDemo } from "@/components/ask-demo";
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

const spoken = [
  "Spanish",
  "Punjabi",
  "Hmong",
  "Tagalog",
  "Hindi",
  "Urdu",
  "Arabic",
  "Farsi",
  "Vietnamese",
  "Chinese",
  "Korean",
  "Armenian",
  "Russian",
  "French",
  "Portuguese",
  "Japanese",
  "English",
];

const numbers = [
  { value: "5", unit: "sec", note: "from photo to answer" },
  { value: "17", unit: "", note: "languages, read and spoken" },
  { value: "8", unit: "", note: "jobs the AI does for you" },
  { value: "0", unit: "$", note: "cost to any worker, ever" },
];

type Brain = {
  icon: LucideIcon;
  title: string;
  decides: string;
  model: string;
  tone: string;
  span?: string;
};

const brains: Brain[] = [
  {
    icon: ScanLine,
    title: "Reads the label",
    decides:
      "Looks at a photo of a pesticide label or field sign and decides the warning level, the re-entry time, the gear and the first aid, quoting the exact words it used.",
    model: "Gemini 3.8 Flash, vision",
    tone: "bg-primary text-primary-foreground",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    icon: AudioLines,
    title: "Hears you, in any language",
    decides: "Listens to a question out loud, writes down what you said, and answers in the language you spoke.",
    model: "Gemini 3.8 Flash, audio",
    tone: "bg-poppy text-poppy-foreground",
  },
  {
    icon: Languages,
    title: "Interprets both ways",
    decides: "Translates a worker and a supervisor back and forth, out loud, so neither needs the other's language.",
    model: "Gemini 3.8 Flash + TTS",
    tone: "bg-white/10 text-ink-foreground ring-1 ring-white/15",
  },
  {
    icon: Shirt,
    title: "Checks your gear",
    decides: "Looks at a photo of you and decides which required gear is on, missing, or not in the picture.",
    model: "Gemini 3.8 Flash, vision",
    tone: "bg-harvest text-harvest-foreground",
  },
  {
    icon: Banknote,
    title: "Checks your pay",
    decides: "Reads a pay stub, does the math, and flags anything below California minimum wage or missing overtime.",
    model: "Gemini 3.8 Flash, vision",
    tone: "bg-leaf text-white",
  },
  {
    icon: Stethoscope,
    title: "Triage, not diagnosis",
    decides: "From the symptoms you tap, decides whether to call 911, Poison Control, a doctor, or rinse and rest.",
    model: "Gemini 3.8 Flash",
    tone: "bg-danger text-white",
  },
  {
    icon: ImagePlus,
    title: "Answers about any photo",
    decides: "Send a photo of a rash, a sign or a water station in the chat and it says what it sees and what to do next.",
    model: "Gemini 3.8 Flash, vision",
    tone: "bg-card text-ink ring-1 ring-border",
  },
  {
    icon: MessageCircleQuestion,
    title: "Speaks like a person",
    decides: "Turns every answer into a calm, natural voice, so someone who can't read still gets the whole answer.",
    model: "Gemini 3.8 Flash TTS",
    tone: "bg-card text-ink ring-1 ring-border",
  },
];

const tools = [
  { icon: Camera, title: "Scan a label", body: "Re-entry time, gear and first aid from one photo, with the words it came from." },
  { icon: AudioLines, title: "Voice chat", body: "Talk to Milpa in any language and hear the answer out loud." },
  { icon: Languages, title: "Interpreter", body: "Hand the phone across the table. Each side speaks, Milpa translates out loud." },
  { icon: Shirt, title: "Gear check", body: "A photo of you, checked against the gear the label requires." },
  { icon: Banknote, title: "Pay check", body: "Is the pay stub right? Minimum wage, overtime and missing items, in plain words." },
  { icon: BellRing, title: "Re-entry alarms", body: "A countdown for each block that buzzes when it is safe to go back in." },
  { icon: Sun, title: "Heat check", body: "The hottest hour today where you stand and what your employer owes you." },
  { icon: Stethoscope, title: "Symptom check", body: "Tap what you feel. Milpa says who to call." },
  { icon: HeartPulse, title: "Got sprayed", body: "911 and Poison Control in one tap, a rinse timer and a card for the doctor." },
  { icon: FileText, title: "Read any paper", body: "Notices and forms explained, with what you need to do." },
  { icon: ClipboardPen, title: "Report writer", body: "Say what happened. Get a clear English report for the grower or Cal/OSHA." },
  { icon: UserRoundCheck, title: "Supervisor card", body: "A big English card with the product and re-entry time, to show your boss." },
  { icon: MapPinned, title: "Spray map", body: "Every scan pinned where you stood." },
  { icon: MessageCircleQuestion, title: "Saved chats", body: "Every conversation saved to your account, on any phone." },
  { icon: Smartphone, title: "Works like an app", body: "Add it to your home screen. Saved scans and clocks work with no signal." },
];

const questions = [
  {
    question: "Is it accurate?",
    answer:
      "It reads the label in the photo and says what is printed there, and it says so when it can't. It shows the exact words each answer came from. Translations are by machine and still need review by native speakers. Milpa explains a label. It does not replace the label, your training or Poison Control.",
  },
  {
    question: "Which AI does it use?",
    answer:
      "Google's Gemini 3.8 Flash reads photos, listens to speech and writes the answers, with strict instructions to use only the label and California's rules. Gemini 3.8 Flash TTS reads answers out loud. Weather comes from Open-Meteo.",
  },
  {
    question: "Can I just talk to it?",
    answer:
      "Yes. Tap Talk and ask out loud in any language. Milpa listens, answers out loud, and keeps listening, like a phone call. You can also send it a photo.",
  },
  {
    question: "Why do I need an account?",
    answer:
      "So nothing gets lost. Your scans, chats, clocks and language are saved and come back on any phone you sign in on. It is free.",
  },
  {
    question: "What does it cost?",
    answer: "Nothing, for every worker, forever.",
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

function Hover({ text }: { text: string }) {
  return text.split(" ").map((word, index, all) => (
    <span key={index}>
      <span className="hover-word">{word}</span>
      {index < all.length - 1 ? " " : ""}
    </span>
  ));
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="reveal font-display text-xl italic text-poppy">{children}</p>
  );
}

function Marquee({ items, reverse = false, className }: { items: string[]; reverse?: boolean; className: string }) {
  return (
    <div className={`marquee flex w-max gap-8 whitespace-nowrap ${reverse ? "[animation-direction:reverse]" : ""} ${className}`}>
      {[...items, ...items].map((item, index) => (
        <span key={index} className="flex items-center gap-8">
          {item}
          <span className="size-2 rounded-full bg-poppy" />
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex-1 overflow-x-clip bg-background">
      <ScrollProgress />
      <SiteNav />
      <SectionDots />
      <ScrollReveal />

      <section id="top" className="relative overflow-hidden lg:min-h-svh">
        <div className="zoom-hero relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-32 lg:min-h-svh lg:grid-cols-[1.1fr_0.9fr] lg:pb-16 lg:pt-28">
          <div className="text-center lg:text-left">
            <p
              className="enter inline-flex items-center gap-2 font-display text-xl italic text-poppy"
              style={delay("0.1s")}
            >
              For the people who feed California
            </p>
            <h1 className="mt-4 font-display text-[clamp(3rem,9vw,5.8rem)] font-semibold leading-[0.93] text-ink lg:text-[clamp(3.6rem,5.8vw,5.6rem)]">
              <span className="block">
                <Words text="The label says" start={0.2} />
              </span>
              <span className="block">
                <Words text="12 hours." start={0.42} />
              </span>
              <span className="block italic text-primary">
                <Words text={"Now you can read it."} start={0.6} />
              </span>
            </h1>
            <p
              className="enter mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/70 sm:text-xl lg:mx-0"
              style={delay("1s")}
            >
              Point your phone at a pesticide label. Milpa tells you when it is safe to go back in and what to wear,
              then answers your questions out loud, in your language.
            </p>
            <div
              className="enter mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              style={delay("1.15s")}
            >
              <AccountCta
                primary="Get started free"
                primaryClass="sweep group flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-xl shadow-primary/30 [--sweep-color:var(--poppy)] active:scale-95"
              />
              <Magnetic strength={0.2}>
                <a
                  href="#ai"
                  className="sweep flex h-14 items-center rounded-full bg-ink px-7 text-lg font-semibold text-ink-foreground shadow-xl shadow-ink/20 [--sweep-color:var(--primary)] active:scale-95"
                >
                  See the AI work
                </a>
              </Magnetic>
            </div>
          </div>
          <div className="enter" style={delay("0.5s")}>
            <LabelReader />
          </div>
        </div>
      </section>

      <div className="relative space-y-3 overflow-hidden bg-ink py-6">
        <Marquee items={spoken} className="font-display text-3xl font-semibold text-ink-foreground sm:text-4xl" />
        <Marquee items={crops} reverse className="font-display text-xl italic text-ink-foreground/45 sm:text-2xl" />
      </div>

      <section id="problem" className="relative py-28 lg:py-24">
        <LabelHighlight />
      </section>

      <section id="tour" className="relative bg-paper/60 pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="reveal mt-3 max-w-3xl font-display text-5xl font-semibold leading-[0.98] text-ink sm:text-7xl">
            <Hover text="One photo. Every answer you need." />
          </h2>
        </div>
        <Tour />
      </section>

      <section id="ai" className="relative overflow-hidden bg-ink py-28 text-ink-foreground lg:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <Eyebrow>The AI, in plain words</Eyebrow>
              <h2 className="reveal mt-3 font-display text-5xl font-semibold leading-[0.98] sm:text-7xl">
                <Hover text="Eight jobs. One decision each." />
              </h2>
            </div>
            <p className="reveal text-lg leading-relaxed text-ink-foreground/70" style={delay("0.1s")}>
              Every AI feature in Milpa makes one clear decision and shows its work. It answers only from the label in
              front of you and California&apos;s rules, and it says &ldquo;I don&apos;t know&rdquo; instead of
              guessing.
            </p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto]">
            {brains.map((brain, index) => {
              const Icon = brain.icon;
              const big = Boolean(brain.span);
              return (
                <div
                  key={brain.title}
                  className={`reveal-pop ${brain.span ?? ""}`}
                  style={delay(`${(index % 4) * 0.07}s`)}
                >
                  <Tilt max={big ? 4 : 8} className="h-full">
                    <div
                      className={`lift sheen relative flex h-full flex-col gap-8 overflow-hidden rounded-[1.75rem] p-6 ${brain.tone} ${
                        big ? "min-h-[34rem] justify-start sm:p-8" : "min-h-64 justify-between"
                      }`}
                    >
                      {big && (
                        <div className="pointer-events-none absolute -bottom-12 right-8 w-[50%] rotate-[-6deg] overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/20 transition-transform duration-700 group-hover:rotate-0">
                          <img src={samples[0].image} alt="" className="block w-full" />
                          <div className="label-scan absolute inset-x-0 h-16 -translate-y-full bg-gradient-to-b from-transparent via-harvest/40 to-harvest" />
                        </div>
                      )}
                      <span className="relative flex size-12 items-center justify-center rounded-2xl bg-black/10">
                        <Icon className="size-6" />
                      </span>
                      <div className={`relative ${big ? "max-w-md" : ""}`}>
                        <h3 className={`font-display font-semibold leading-tight ${big ? "text-4xl" : "text-2xl"}`}>
                          {brain.title}
                        </h3>
                        <p className={`mt-2 leading-snug opacity-85 ${big ? "text-lg" : ""}`}>{brain.decides}</p>
                        <p className="mt-4 inline-flex rounded-full bg-black/10 px-3 py-1 text-xs font-semibold">
                          {brain.model}
                        </p>
                      </div>
                    </div>
                  </Tilt>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="ask" className="relative py-28 lg:py-40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Ask Milpa</Eyebrow>
            <h2 className="reveal mt-3 font-display text-5xl font-semibold leading-[0.98] text-ink sm:text-6xl">
              <Hover text="Talk to it like a coworker." />
            </h2>
            <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground" style={delay("0.1s")}>
              Ask in your own words, typed or out loud, in any language. Send a photo. Milpa answers from what the
              label actually says and from California&apos;s farm safety rules, and keeps every chat saved to your
              account.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Voice mode: ask out loud, hear the answer, keep talking",
                "Send a photo of a rash, a sign or a paper",
                "Says \"I don't know\" instead of guessing",
              ].map((item, index) => (
                <li
                  key={item}
                  className="reveal-left flex items-center gap-3 text-lg"
                  style={delay(`${0.15 + index * 0.1}s`)}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-poppy text-poppy-foreground">
                    <Check className="size-4" />
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

      <section id="numbers" className="zoom-band relative overflow-hidden bg-primary text-primary-foreground">
        <ul className="relative mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
          {numbers.map((item, index) => (
            <li
              key={item.note}
              className="reveal border-white/15 px-6 py-16 [&:not(:first-child)]:border-l max-lg:[&:nth-child(3)]:border-l-0 max-lg:[&:nth-child(n+3)]:border-t"
              style={delay(`${index * 0.1}s`)}
            >
              <p className="flex items-baseline gap-1 whitespace-nowrap font-display text-6xl font-semibold text-harvest sm:text-7xl">
                {item.unit === "$" && <span>$</span>}
                <Odometer value={item.value} />
                {item.unit && item.unit !== "$" && <span className="text-3xl sm:text-4xl">{item.unit}</span>}
              </p>
              <p className="mt-4 max-w-[14rem] text-primary-foreground/75">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="heat" className="zoom-rise relative py-28 lg:py-40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <div className="reveal order-2 lg:order-1">
            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Manteca, today</p>
                <Sun className="spin-slow size-8 text-poppy" />
              </div>
              <div className="mt-6 grid grid-cols-3 divide-x rounded-xl border bg-background text-center">
                {[
                  { value: "91", label: heat.now },
                  { value: "96", label: heat.feels },
                  { value: "99", label: "High, 4 PM" },
                ].map((item) => (
                  <div key={item.label} className="px-2 py-5">
                    <p className="font-display text-4xl font-semibold text-ink sm:text-5xl">
                      <Odometer value={item.value} />°
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="heat-flip mt-4 rounded-xl bg-harvest p-5 text-harvest-foreground">
                <p className="font-display text-2xl font-semibold">{heat.levels.high.title}</p>
                <p className="mt-2 leading-snug">{heat.levels.high.body}</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Eyebrow>Heat</Eyebrow>
            <h2 className="reveal mt-3 font-display text-5xl font-semibold leading-[0.98] text-ink sm:text-6xl">
              <Hover text="Know the hottest hour before it hits." />
            </h2>
            <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground" style={delay("0.1s")}>
              Milpa checks the forecast where you stand and tells you what California requires at that temperature:
              shade above 80°F, cool-down breaks at 95°F, and water every hour.
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
                  This photo is too blurry to read safely. Ask your supervisor what the label says.
                </p>
              </div>
            </div>
          </div>
          <div>
            <Eyebrow>Honest by design</Eyebrow>
            <h2 className="reveal mt-3 font-display text-5xl font-semibold leading-[0.98] text-ink sm:text-6xl">
              <Hover text="When it can’t tell, it says so." />
            </h2>
            <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground" style={delay("0.1s")}>
              A wrong re-entry time is worse than none. Milpa coaches you to a sharp photo, shows exactly which words on
              the label each answer came from, rates how sure it is, and stops when a detail is unclear.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="zoom-rise mx-auto max-w-6xl px-6 py-28 lg:py-40">
        <Eyebrow>Everything in it</Eyebrow>
        <h2 className="reveal mt-3 max-w-3xl font-display text-5xl font-semibold leading-[0.98] text-ink sm:text-6xl">
          <Hover text="Fifteen tools. One free app." />
        </h2>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div key={tool.title} className="reveal" style={delay(`${(index % 3) * 0.08}s`)}>
                <Tilt max={8} className="h-full">
                  <div className="card lift sheen spin-once relative flex h-full items-start gap-4 overflow-hidden p-6 hover:border-primary/30">
                    <span
                      className={`spin-target flex size-12 shrink-0 items-center justify-center rounded-2xl ${
                        ["bg-primary text-primary-foreground", "bg-poppy text-poppy-foreground", "bg-ink text-ink-foreground"][index % 3]
                      }`}
                    >
                      <Icon className="size-6" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ink">{tool.title}</h3>
                      <p className="mt-1 leading-relaxed text-muted-foreground">{tool.body}</p>
                    </div>
                  </div>
                </Tilt>
              </div>
            );
          })}
        </div>
      </section>

      <section id="questions" className="mx-auto max-w-3xl px-6 pb-28 lg:pb-40">
        <h2 className="reveal font-display text-5xl font-semibold text-ink sm:text-6xl">
          <Hover text="Questions" />
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
              <p className="rise mt-4 max-w-2xl leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="zoom-band relative overflow-hidden bg-ink text-ink-foreground">
        <div className="relative mx-auto max-w-6xl px-6 pb-36 pt-32 text-center">
          <h2 className="font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.92]">
            <span className="reveal block">Know before</span>
            <span className="reveal block italic text-poppy" style={delay("0.12s")}>
              you walk in.
            </span>
          </h2>
          <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-3" style={delay("0.25s")}>
            <AccountCta
              primary="Make a free account"
              primaryClass="sweep group flex h-14 items-center gap-2 rounded-full bg-primary px-9 text-lg font-semibold text-primary-foreground shadow-xl shadow-primary/30 [--sweep-color:var(--poppy)] active:scale-95"
              secondary={{ label: "I already have one", href: "/sign-in" }}
              secondaryClass="flex h-14 items-center rounded-full border-2 border-white/25 px-8 text-lg font-semibold transition-colors hover:border-white/60 hover:bg-white/10 active:scale-95"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-ink text-sm text-ink-foreground/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <p>Built at SierraHacks 2026 in Manteca, California.</p>
          <a href="tel:18002221222" className="underline-draw font-medium text-ink-foreground">
            Poison Control: 1-800-222-1222
          </a>
        </div>
      </footer>
    </div>
  );
}
