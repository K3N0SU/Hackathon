"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mark } from "@/components/mark";
import { UserMenu } from "@/components/user-menu";

const links = [
  { href: "#field", label: "Labels" },
  { href: "#heat", label: "Heat" },
  { href: "#exposed", label: "Exposed" },
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
      className={`fixed inset-x-0 top-0 z-40 text-primary-foreground transition-colors duration-300 ${
        solid ? "bg-[#0b1710] shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading text-2xl font-semibold"
        >
          <Mark className="size-8 text-primary-foreground [--background:#0b1710]" />
          Furrow
        </Link>
        <nav className="flex items-center gap-3 text-sm md:gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden opacity-80 transition-opacity hover:opacity-100 md:inline"
            >
              {link.label}
            </a>
          ))}
          <UserMenu dark />
          <Link
            href="/scan"
            className="rounded-full bg-harvest px-5 py-2 font-semibold text-harvest-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Open Furrow
          </Link>
        </nav>
      </div>
    </header>
  );
}
