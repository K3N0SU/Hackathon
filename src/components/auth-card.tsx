import Link from "next/link";
import { HeroScene } from "@/components/hero-scene";
import { Mark } from "@/components/mark";

export function AuthCard({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-1 flex-col items-center overflow-hidden bg-[#08130e] px-4 py-10">
      <HeroScene still />
      <Link
        href="/"
        className="enter relative z-10 flex items-center gap-2.5 font-heading text-2xl font-semibold text-primary-foreground"
      >
        <Mark className="size-8 text-primary-foreground [--background:#08130e]" />
        Furrow
      </Link>
      <main
        lang={lang}
        className="pop relative z-10 mt-8 w-full max-w-md rounded-3xl bg-card p-7 shadow-2xl shadow-black/40 sm:p-9"
      >
        {children}
      </main>
    </div>
  );
}
