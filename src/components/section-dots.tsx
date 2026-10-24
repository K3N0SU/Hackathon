"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "top", label: "Top" },
  { id: "problem", label: "The problem" },
  { id: "tour", label: "How it works" },
  { id: "ask", label: "Ask Furrow" },
  { id: "numbers", label: "Numbers" },
  { id: "heat", label: "Heat" },
  { id: "honest", label: "When it can't tell" },
  { id: "features", label: "Details" },
  { id: "questions", label: "Questions" },
];

export function SectionDots() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
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
      className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2.5 xl:flex"
    >
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-label={section.label}
          aria-current={active === section.id}
          className={`group relative h-2 rounded-full transition-all duration-500 [transition-timing-function:var(--ease-spring)] ${
            active === section.id
              ? "w-8 bg-primary"
              : "w-2 bg-primary/25 hover:w-4 hover:bg-primary/60"
          }`}
        >
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {section.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
