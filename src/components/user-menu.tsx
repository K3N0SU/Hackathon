"use client";

import { signOut } from "firebase/auth";
import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/components/auth-provider";
import { authCopy } from "@/lib/auth-copy";
import { auth } from "@/lib/firebase";
import type { Language } from "@/lib/scan";

export function UserMenu({
  language = "en",
  compact = false,
}: {
  language?: Language;
  compact?: boolean;
}) {
  const { user, ready } = useSession();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const text = authCopy[language];

  useEffect(() => {
    if (!open) return;
    function close(event: PointerEvent) {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  if (!ready) return <span className="size-9" />;

  if (!user) {
    return (
      <Link
        href="/sign-in"
        aria-label={text.signIn}
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-primary transition-colors hover:bg-secondary active:scale-95"
      >
        <UserRound className={compact ? "size-5" : "size-4"} />
        {!compact && <span className="hidden sm:inline">{text.signIn}</span>}
      </Link>
    );
  }

  const label = user.displayName || user.email || "";

  return (
    <div ref={menu} className="relative">
      <button
        type="button"
        onClick={() => setOpen((shown) => !shown)}
        aria-label={text.account}
        aria-expanded={open}
        className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-harvest font-semibold text-harvest-foreground ring-2 ring-transparent transition hover:ring-harvest/50"
      >
        {user.photoURL ? (
          <span
            className="size-full bg-cover bg-center"
            style={{ backgroundImage: `url("${user.photoURL}")` }}
          />
        ) : (
          label.charAt(0).toUpperCase()
        )}
      </button>
      {open && (
        <div className="pop absolute right-0 top-11 z-50 w-64 rounded-2xl border bg-card p-2 text-foreground shadow-xl">
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground">{text.signedInAs}</p>
            {user.displayName && (
              <p className="truncate font-semibold">{user.displayName}</p>
            )}
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOut(auth());
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary"
          >
            <LogOut className="size-4" />
            {text.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
