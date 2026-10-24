"use client";

import { sendEmailVerification, signOut } from "firebase/auth";
import { LoaderCircle, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth-card";
import { useSavedLanguage, useSession } from "@/components/auth-provider";
import { authCopy, authError } from "@/lib/auth-copy";
import { auth } from "@/lib/firebase";

export function VerifyEmail() {
  const router = useRouter();
  const language = useSavedLanguage();
  const { user, ready } = useSession();
  const text = authCopy[language];
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/sign-in");
      return;
    }
    if (user.emailVerified) {
      router.replace("/scan");
      return;
    }
    const poll = setInterval(async () => {
      try {
        await user.reload();
        if (auth().currentUser?.emailVerified) {
          await user.getIdToken(true);
          router.replace("/scan");
        }
      } catch {}
    }, 4000);
    return () => clearInterval(poll);
  }, [ready, user, router]);

  async function resend() {
    if (!user) return;
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/scan`,
      });
      setMessage(text.resent);
    } catch (problem) {
      setMessage(text.errors[authError(problem)]);
    }
  }

  async function check() {
    if (!user) return;
    setChecking(true);
    try {
      await user.reload();
      if (auth().currentUser?.emailVerified) {
        await user.getIdToken(true);
        router.replace("/scan");
        return;
      }
      setMessage(text.notYet);
    } catch (problem) {
      setMessage(text.errors[authError(problem)]);
    }
    setChecking(false);
  }

  async function other() {
    await signOut(auth());
    router.replace("/sign-up");
  }

  return (
    <AuthCard lang={language}>
      <span className="relative flex size-16 items-center justify-center rounded-full bg-harvest text-harvest-foreground">
        <span className="pulse-ring absolute inset-0 rounded-full bg-harvest/50" />
        <MailCheck className="relative size-8" />
      </span>
      <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.02] sm:text-5xl text-primary">
        {text.verifyTitle}
      </h1>
      <p className="mt-4 text-lg">
        {text.verifyBody}{" "}
        <span className="font-semibold break-all">{user?.email}</span>
      </p>
      <p className="mt-2 text-muted-foreground">{text.verifyNext}</p>

      {message && (
        <p
          role="status"
          className="rise mt-5 rounded-xl bg-secondary px-4 py-3 text-sm"
        >
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={check}
        disabled={checking}
        className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
      >
        {checking && <LoaderCircle className="size-5 animate-spin" />}
        {text.verified}
      </button>
      <button
        type="button"
        onClick={resend}
        className="mt-3 flex h-12 w-full items-center justify-center rounded-xl border text-base font-semibold transition-colors hover:bg-secondary"
      >
        {text.resend}
      </button>
      <p className="mt-6 text-center text-sm">
        <button
          type="button"
          onClick={other}
          className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {text.useOther}
        </button>
      </p>
    </AuthCard>
  );
}
