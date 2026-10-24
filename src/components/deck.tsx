"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Mark } from "@/components/mark";
import { samples } from "@/lib/samples";

const punjabi = samples[0].results.pa;

function Slide({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col justify-center px-[7%]">
      {eyebrow && (
        <p className="text-[1em] font-medium text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-[0.4em] max-w-[18em] font-heading text-[3em] font-semibold leading-[1.1] tracking-tight">
        {title}
      </h1>
      <div className="mt-[1.2em]">{children}</div>
    </div>
  );
}

const slides: ReactNode[] = [
  <div key="title" className="flex h-full flex-col justify-center px-[7%]">
    <Mark className="size-[4.5em] text-primary" />
    <h1 className="mt-[0.5em] font-heading text-[6em] font-semibold leading-none text-primary">
      Furrow
    </h1>
    <p className="mt-[0.6em] max-w-[20em] font-heading text-[1.9em] leading-snug">
      Point your phone at a pesticide label. Hear what it means in your own
      language.
    </p>
    <p className="mt-[2em] text-[1em] text-muted-foreground">
      SierraHacks 2026, Manteca
    </p>
  </div>,

  <Slide
    key="problem"
    eyebrow="The problem"
    title="The safety plan is printed on the label, in English."
  >
    <p className="max-w-[26em] text-[1.45em] leading-relaxed">
      Before anyone walks into an orchard, the details sit on a product label
      and a posted sign: how long to stay out, what to wear, what to do if
      something goes wrong. It is small print and legal wording. San Joaquin
      County grows almonds, walnuts, cherries and grapes, and many of the people
      working those rows read Spanish or Punjabi first.
    </p>
  </Slide>,

  <Slide
    key="how"
    eyebrow="What Furrow does"
    title="One photo in. One clear answer out."
  >
    <div className="flex items-center gap-[2.5em]">
      <img
        src={samples[0].image}
        alt=""
        className="h-[17em] rounded-lg border bg-white object-cover object-top"
      />
      <p className="max-w-[22em] text-[1.4em] leading-relaxed">
        Gemini reads the photo and returns a fixed set of facts: the signal
        word, how many hours to stay out, the gear, first aid, and a short
        summary. Furrow writes them in English, Spanish or Punjabi and can read
        them aloud.
      </p>
    </div>
  </Slide>,

  <Slide
    key="result"
    eyebrow="The answer"
    title="Plain words, in the worker's language."
  >
    <div lang="pa" className="flex gap-[2em]">
      <div className="w-[26em] rounded-xl bg-primary p-[1.2em] text-primary-foreground">
        <p className="text-[0.9em] opacity-80">{punjabi.product}</p>
        <p className="mt-[0.4em] font-heading text-[1.5em] font-semibold leading-snug">
          {punjabi.reentry}
        </p>
      </div>
      <ul className="max-w-[24em] list-disc space-y-[0.4em] pl-[1.2em] text-[1.25em] marker:text-primary">
        {punjabi.gear.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </Slide>,

  <Slide
    key="clock"
    eyebrow="Beyond the scan"
    title="Reading it once is not enough. Furrow keeps the clock."
  >
    <p className="max-w-[26em] text-[1.45em] leading-relaxed">
      Tell Furrow when the block was sprayed and it keeps a countdown on the
      phone. It stays red until the re-entry interval is over, then turns green.
      It lives in the phone&apos;s own storage. No account, no sign-up, nothing
      to remember.
    </p>
  </Slide>,

  <Slide
    key="honest"
    eyebrow="Safety first"
    title="When it cannot tell, it says so."
  >
    <p className="max-w-[26em] text-[1.45em] leading-relaxed">
      A blurry photo or an ambiguous label never gets a guess. Furrow marks the
      warning level unknown and tells the worker to ask a supervisor. The sample
      labels also keep saved answers, so a dropped connection in the middle of a
      field does not leave anyone with a blank screen.
    </p>
  </Slide>,

  <Slide key="stack" eyebrow="Under the hood" title="Built on free tools.">
    <dl className="grid max-w-[34em] grid-cols-[9em_1fr] gap-x-[1.5em] gap-y-[0.7em] text-[1.2em]">
      <dt className="font-semibold">Google Gemini API</dt>
      <dd>Free tier. Vision plus a response schema for structured output.</dd>
      <dt className="font-semibold">Next.js 16</dt>
      <dd>App Router, a server route that holds the API key.</dd>
      <dt className="font-semibold">Vercel</dt>
      <dd>Hosting, deployed from GitHub.</dd>
      <dt className="font-semibold">Web Speech API</dt>
      <dd>Read-aloud in the phone&apos;s own voices.</dd>
      <dt className="font-semibold">Browser storage</dt>
      <dd>Field clocks and language, kept on the device.</dd>
    </dl>
  </Slide>,

  <Slide
    key="next"
    eyebrow="What comes next"
    title="Before anyone relies on it, the translations need the people who use them."
  >
    <p className="max-w-[28em] text-[1.45em] leading-relaxed">
      Next we would sit down with crew leaders and farmworkers, and have native
      Punjabi and Spanish speakers check every phrase. After that, an installed
      version that works with no signal at all, and more languages as the
      community asks for them.
    </p>
    <p className="mt-[1.5em] font-heading text-[1.9em] text-primary">
      Know before you walk in.
    </p>
  </Slide>,
];

export function Deck() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const start = setTimeout(() => {
      const fromHash = Number(window.location.hash.slice(1)) - 1;
      if (fromHash > 0 && fromHash < slides.length) setIndex(fromHash);
    }, 0);
    function onKey(event: KeyboardEvent) {
      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        setIndex((current) => Math.min(current + 1, slides.length - 1));
      }
      if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        setIndex((current) => Math.max(current - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(start);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", `#${index + 1}`);
  }, [index]);

  return (
    <div className="deck fixed inset-0 bg-background text-foreground">
      <div className="screen h-full text-[length:min(1.6vw,2.8vh)]">
        {slides[index]}
      </div>
      <div className="print-all hidden">
        {slides.map((slide, position) => (
          <div key={position} className="page text-[16px]">
            {slide}
          </div>
        ))}
      </div>
      <button
        aria-label="Previous slide"
        onClick={() => setIndex((current) => Math.max(current - 1, 0))}
        className="screen-only fixed inset-y-0 left-0 w-1/5 cursor-w-resize"
      />
      <button
        aria-label="Next slide"
        onClick={() =>
          setIndex((current) => Math.min(current + 1, slides.length - 1))
        }
        className="screen-only fixed inset-y-0 right-0 w-1/5 cursor-e-resize"
      />
      <p className="screen-only fixed bottom-4 right-6 text-sm text-muted-foreground">
        {index + 1} of {slides.length}
      </p>
    </div>
  );
}
