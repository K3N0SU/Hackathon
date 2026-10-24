"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "top", label: "Top" },
  { id: "field", label: "Labels" },
  { id: "languages", label: "Languages" },
  { id: "clock", label: "The clock" },
  { id: "heat", label: "Heat" },
  { id: "exposed", label: "Exposed" },
  { id: "honest", label: "When it can't tell" },
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
      className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 text-white mix-blend-difference lg:flex"
    >
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-label={section.label}
          aria-current={active === section.id}
          className={`h-0.5 bg-current transition-all duration-300 ${
            active === section.id ? "w-8 opacity-100" : "w-4 opacity-40"
          }`}
        />
      ))}
    </nav>
  );
}
