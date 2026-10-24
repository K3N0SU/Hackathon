"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/components/auth-provider";
import { Magnetic } from "@/components/motion";

export function AccountCta({
  primary,
  primaryClass,
  secondary,
  secondaryClass,
}: {
  primary: string;
  primaryClass: string;
  secondary?: { label: string; href: string };
  secondaryClass?: string;
}) {
  const { user, ready } = useSession();
  const signedIn = ready && Boolean(user);

  return (
    <>
      <Magnetic>
        <Link href={signedIn ? "/scan" : "/sign-up"} className={primaryClass}>
          {signedIn ? "Open Furrow" : primary}
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </Magnetic>
      {secondary && !signedIn && (
        <Magnetic strength={0.2}>
          <Link href={secondary.href} className={secondaryClass}>
            {secondary.label}
          </Link>
        </Magnetic>
      )}
    </>
  );
}
