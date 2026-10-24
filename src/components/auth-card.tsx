import Link from "next/link";
import { FieldLines } from "@/components/field-lines";
import { Mark } from "@/components/mark";

export function AuthCard({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-1 bg-background lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-ink p-12 text-ink-foreground lg:flex lg:flex-col lg:justify-between">
        <FieldLines className="text-harvest/30" />
        <Link
          href="/"
          className="wiggle-hover relative flex items-center gap-2.5 font-display text-2xl font-semibold"
        >
          <Mark className="wiggle-target size-8 text-ink-foreground [--background:var(--ink)]" />
          Rowen
        </Link>
        <p className="enter relative max-w-md font-display text-5xl font-semibold leading-[1.02]">
          Your scans, clocks and language,{" "}
          <span className="italic text-harvest">on any phone.</span>
        </p>
      </aside>
      <div className="flex flex-1 flex-col items-center px-4 py-10 sm:justify-center">
        <Link
          href="/"
          className="enter flex items-center gap-2.5 font-display text-2xl font-semibold text-primary lg:hidden"
        >
          <Mark className="size-8 text-primary" />
          Rowen
        </Link>
        <main
          lang={lang}
          className="card pop mt-8 w-full max-w-md p-7 sm:p-9 lg:mt-0"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
