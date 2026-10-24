"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "top", label: "Top" },
  { id: "problem", label: "The problem" },
  { id: "tour", label: "How it works" },
  { id: "ask", label: "Ask Rowen" },
  { id: "numbers", label: "Numbers" },
  { id: "heat", label: "Heat" },
  { id: "honest", label: "When it can't tell" },
  { id: "features", label: "Details" },
  { id: "questions", label: "Questions" },
];

const step = 28;

export function SectionDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(sections.findIndex((section) => section.id === entry.target.id));
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block"
      style={{ height: step * (sections.length - 1) + 12 }}
    >
      <span className="absolute inset-y-1.5 right-[5px] w-0.5 rounded-full bg-primary/15" />
      <span
        className="absolute right-[5px] top-1.5 w-0.5 rounded-full bg-primary transition-[height] duration-700 [transition-timing-function:var(--ease-out-expo)]"
        style={{ height: step * active }}
      />
      {sections.map((section, index) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-label={section.label}
          aria-current={active === index}
          className="group absolute right-0 flex size-3 items-center justify-center"
          style={{ top: step * index }}
        >
          <span
            className={`size-3 rounded-full border-2 transition-all duration-500 [transition-timing-function:var(--ease-spring)] ${
              index === active
                ? "scale-125 border-primary bg-primary"
                : index < active
                  ? "border-primary bg-background"
                  : "border-primary/25 bg-background group-hover:border-primary/60"
            }`}
          />
          <span
            className={`pointer-events-none absolute right-6 whitespace-nowrap rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-all duration-300 ${
              index === active ? "opacity-0" : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
            }`}
          >
            {section.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
