"use client";

import {
  Bookmark,
  HeartPulse,
  ScanLine,
  Sun,
  TimerReset,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  ClockScreen,
  ExposedScreen,
  HeatScreen,
  LabelsScreen,
  PhoneFrame,
  SavedScreen,
} from "@/components/phone-screens";

type Step = {
  icon: LucideIcon;
  tag: string;
  title: string;
  body: string;
  accent: string;
  Screen: () => React.ReactNode;
};

const steps: Step[] = [
  {
    icon: ScanLine,
    tag: "Labels",
    title: "Point the camera. Get the answer.",
    body: "Furrow opens the camera right inside the app. Frame the label, tap once, and in about five seconds you see the warning level, how long to stay out, what to wear and what to do if it touches your skin. Tap Listen and it reads it out loud.",
    accent: "text-primary",
    Screen: LabelsScreen,
  },
  {
    icon: TimerReset,
    tag: "Clock",
    title: "A scan tells you once. The clock keeps telling you.",
    body: "Tell Furrow when the block was sprayed and it counts down the re-entry time. Red means stay out. Green means the time is up. It is still counting when you open your phone at lunch.",
    accent: "text-danger",
    Screen: ClockScreen,
  },
  {
    icon: Sun,
    tag: "Heat",
    title: "Know the hottest hour before it hits.",
    body: "Furrow checks the forecast where you stand and explains what California requires at that temperature: shade above 80°F, cool-down breaks at 95°F, water every hour, and the signs that mean call 911.",
    accent: "text-amber-700",
    Screen: HeatScreen,
  },
  {
    icon: HeartPulse,
    tag: "Exposed",
    title: "When it goes wrong, every minute counts.",
    body: "Big buttons for 911 and Poison Control, five clear steps, a 15-minute rinse timer that buzzes when you are done, and a card in English for the doctor with the product already filled in.",
    accent: "text-danger",
    Screen: ExposedScreen,
  },
  {
    icon: Bookmark,
    tag: "Saved",
    title: "Everything you scan stays with you.",
    body: "Sign in with email or Google and every scan, photo, clock and language choice is saved to your account. Lose your phone or borrow one, sign in, and it is all there.",
    accent: "text-emerald-700",
    Screen: SavedScreen,
  },
];

export function Tour() {
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.step));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    blocks.current.forEach((block) => block && observer.observe(block));
    return () => observer.disconnect();
  }, []);

  const Current = steps[active].Screen;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_auto] lg:gap-24">
      <div>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const on = active === index;
          return (
            <div
              key={step.tag}
              data-step={index}
              ref={(node) => {
                blocks.current[index] = node;
              }}
              className="flex flex-col justify-center py-14 lg:min-h-svh lg:py-16"
            >
              <div
                className={`transition-all duration-700 lg:origin-left ${on ? "opacity-100" : "lg:scale-[0.97] lg:opacity-30"}`}
              >
                <p
                  className={`flex items-center gap-3 text-sm font-semibold ${step.accent}`}
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/5 ring-1 ring-primary/15">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-display text-lg italic">
                    {String(index + 1).padStart(2, "0")} {step.tag}
                  </span>
                </p>
                <h3 className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.02] sm:text-5xl">
                  {step.title}
                </h3>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
              <div className="reveal mt-12 flex justify-center lg:hidden">
                <PhoneFrame>
                  <step.Screen />
                </PhoneFrame>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative hidden lg:block">
        <div className="sticky top-0 flex h-svh items-center">
          <div className="relative">
            <div className="absolute -inset-16 rounded-full bg-[radial-gradient(circle,oklch(0.82_0.15_80/0.35),transparent_65%)] blur-2xl" />
            <PhoneFrame>
              <div key={active} className="absolute inset-0">
                <Current />
              </div>
            </PhoneFrame>
            <div className="absolute -right-14 top-1/2 flex -translate-y-1/2 flex-col gap-3">
              {steps.map((step, index) => (
                <span
                  key={step.tag}
                  className={`w-1.5 rounded-full transition-all duration-500 ${
                    active === index ? "h-10 bg-primary" : "h-1.5 bg-primary/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
