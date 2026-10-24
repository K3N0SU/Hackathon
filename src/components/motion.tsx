"use client";

import { useEffect, useRef, useState } from "react";

function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const element = useRef<HTMLDivElement>(null);

  function onMove(event: React.PointerEvent) {
    const node = element.current;
    if (!node || event.pointerType !== "mouse" || !motionAllowed()) return;
    const box = node.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2;
    const y = event.clientY - box.top - box.height / 2;
    node.style.transition = "transform 0.15s ease-out";
    node.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }

  function onLeave() {
    const node = element.current;
    if (!node) return;
    node.style.transition = "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";
    node.style.transform = "";
  }

  return (
    <div
      ref={element}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

export function Tilt({
  children,
  max = 10,
  perspective = 900,
  className = "",
  style,
}: {
  children: React.ReactNode;
  max?: number;
  perspective?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const element = useRef<HTMLDivElement>(null);

  function onMove(event: React.PointerEvent) {
    const node = element.current;
    if (!node || event.pointerType !== "mouse" || !motionAllowed()) return;
    const box = node.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    node.classList.add("tilting");
    node.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
    node.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
    node.style.setProperty("--mx", `${(px * 100 + 50).toFixed(1)}%`);
    node.style.setProperty("--my", `${(py * 100 + 50).toFixed(1)}%`);
  }

  function onLeave() {
    const node = element.current;
    if (!node) return;
    node.classList.remove("tilting");
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
  }

  return (
    <div
      ref={element}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt ${className}`}
      style={
        {
          ...style,
          "--perspective": `${perspective}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

const digits = "0123456789".split("");

function Digit({ value, index }: { value: string; index: number }) {
  if (!/\d/.test(value)) {
    return <span className="inline-block">{value}</span>;
  }
  const n = Number(value);
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-top">
      <span className="invisible block leading-none">{value}</span>
      <span
        className="absolute inset-x-0 top-0 flex flex-col items-center transition-transform duration-[1.4s]"
        style={{
          transform: `translateY(-${n}em)`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: `${index * 0.08}s`,
        }}
      >
        {digits.map((digit) => (
          <span key={digit} className="block h-[1em] leading-none">
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Odometer({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const element = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value.replace(/\d/g, "0"));

  useEffect(() => {
    const node = element.current;
    if (!node) return;
    if (!motionAllowed()) {
      const now = setTimeout(() => setShown(value), 0);
      return () => clearTimeout(now);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown(value);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span
      ref={element}
      className={`inline-flex tabular-nums leading-none ${className}`}
      aria-label={value}
    >
      {shown.split("").map((character, index) => (
        <Digit key={index} value={character} index={index} />
      ))}
    </span>
  );
}

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const node = bar.current;
      if (!node) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      node.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
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
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-harvest"
      style={{ transform: "scaleX(0)" }}
    />
  );
}

export function useScrollProgress(
  element: React.RefObject<HTMLElement | null>,
  lead = 0.85,
  tail = 0.35,
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const node = element.current;
      if (!node) return;
      const box = node.getBoundingClientRect();
      const view = window.innerHeight;
      const raw = (view * lead - box.top) / (box.height + view * tail);
      setProgress(Math.min(1, Math.max(0, raw)));
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
  }, [element, lead, tail]);

  return progress;
}
