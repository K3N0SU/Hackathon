"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const item = entry.target;
          const settle = (event: Event) => {
            if (event.target !== item) return;
            item.classList.remove("reveal", "shown");
            item.removeEventListener("transitionend", settle);
          };
          item.addEventListener("transitionend", settle);
          item.classList.add("shown");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    root.classList.add("reveal-ready");
    items.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
