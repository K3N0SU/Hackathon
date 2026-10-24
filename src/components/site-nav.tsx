"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mark } from "@/components/mark";
import { Magnetic } from "@/components/motion";
import { UserMenu } from "@/components/user-menu";

const links = [
  { href: "#tour", label: "How it works" },
  { href: "#ask", label: "Ask" },
  { href: "#heat", label: "Heat" },
  { href: "#questions", label: "Questions" },
];

export function SiteNav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => setSolid(window.scrollY > 40), 0);
    function onScroll() {
      setSolid(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(start);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        solid
          ? "border-b border-border/70 bg-background/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link
          href="/"
          className="wiggle-hover flex items-center gap-2.5 font-display text-2xl font-semibold text-primary"
        >
          <Mark className="wiggle-target size-8 text-primary" />
          Rowen
        </Link>
        <nav className="flex items-center gap-2 text-sm md:gap-7">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="underline-draw hidden font-medium text-foreground/70 transition-colors hover:text-foreground md:inline"
            >
              {link.label}
            </a>
          ))}
          <UserMenu />
          <Magnetic>
            <Link
              href="/scan"
              className="sweep inline-flex h-10 items-center whitespace-nowrap rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform [--sweep-color:var(--harvest)] hover:text-harvest-foreground active:scale-95 sm:px-5"
            >
              Open Rowen
            </Link>
          </Magnetic>
        </nav>
      </div>
    </header>
  );
}
