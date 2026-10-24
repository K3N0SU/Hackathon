"use client";

import { useRef } from "react";
import { ScrollWords } from "@/components/landing-motion";
import { useScrollProgress } from "@/components/motion";
import { samples } from "@/lib/samples";

const story =
  "Every spray comes with a label. It says how long to stay out of the rows, what to wear, and what to do if it touches your skin. It is printed small, in English, on the back of a drum most workers never see. Rowen puts that label in your pocket, in the language you think in.";

const regions = [
  { top: 83, height: 7, title: "Re-entry: 12 hours" },
  { top: 51, height: 7.5, title: "Gloves, long sleeves" },
  { top: 61.5, height: 21, title: "First aid" },
];

export function LabelHighlight() {
  const block = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(block, 0.8, 0.2);
  const index = Math.min(regions.length - 1, Math.floor(progress * regions.length));
  const region = regions[index];

  return (
    <div
      ref={block}
      className="mx-auto grid max-w-6xl items-start gap-14 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20"
    >
      <div className="lg:py-24">
        <p className="reveal font-display text-xl italic text-primary">
          The problem
        </p>
        <ScrollWords
          text={story}
          className="mt-6 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl"
        />
      </div>
      <div className="reveal lg:sticky lg:top-24">
        <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-[#fbf8ef] shadow-[0_30px_60px_-24px_oklch(0.25_0.04_150/0.5)] ring-1 ring-black/10">
          <img
            src={samples[0].image}
            alt="Valley Guard 2EC label with the key sections highlighted"
            className="block w-full"
          />
          <div
            className="absolute inset-x-[6%] rounded-md border-2 border-harvest bg-harvest/30 mix-blend-multiply transition-all duration-700 [transition-timing-function:var(--ease-spring)]"
            style={{ top: `${region.top}%`, height: `${region.height}%` }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-700 [transition-timing-function:var(--ease-spring)]"
            style={{ top: `calc(${region.top}% - 2.6rem)` }}
          >
            {region.title}
          </div>
        </div>
      </div>
    </div>
  );
}
