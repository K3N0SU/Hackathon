"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const element = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const node = element.current;
    if (!node || to === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const reset = setTimeout(() => setValue(0), 0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const started = performance.now();
        const step = (time: number) => {
          const progress = Math.min(1, (time - started) / 1400);
          setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      clearTimeout(reset);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <span ref={element} className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

export function ScrollWords({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const element = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const node = element.current;
      if (!node) return;
      const box = node.getBoundingClientRect();
      const view = window.innerHeight;
      const progress = (view * 0.85 - box.top) / (box.height + view * 0.35);
      setLit(Math.round(Math.min(1, Math.max(0, progress)) * words.length));
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    const start = setTimeout(update, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(start);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [words.length]);

  return (
    <p ref={element} className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`transition-colors duration-300 ${index < lit ? "text-[#f3efe4]" : "text-white/15"}`}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

export function PointerGlow() {
  useEffect(() => {
    function onMove(event: PointerEvent) {
      const card = (event.target as Element | null)?.closest<HTMLElement>(
        ".spotlight",
      );
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--x", `${event.clientX - box.left}px`);
      card.style.setProperty("--y", `${event.clientY - box.top}px`);
    }
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
