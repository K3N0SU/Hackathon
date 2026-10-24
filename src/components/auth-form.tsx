"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
} from "firebase/auth";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth-card";
import { useSavedLanguage, useSession } from "@/components/auth-provider";
import { Input } from "@/components/ui/input";
import { authCopy, authError, type AuthError } from "@/lib/auth-copy";
import { auth } from "@/lib/firebase";

type Mode = "sign-in" | "sign-up";

const field = "h-12 rounded-xl px-4 text-base md:text-base";

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const language = useSavedLanguage();
  const { user, ready } = useSession();
  const text = authCopy[language];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (ready && user && !busy) {
      router.replace(user.emailVerified ? "/scan" : "/verify");
    }
  }, [ready, user, busy, router]);

  async function attempt(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    setNotice("");
    try {
      await action();
    } catch (problem) {
      setError(authError(problem));
      setBusy(false);
    }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    attempt(async () => {
      if (mode === "sign-up") {
        const created = await createUserWithEmailAndPassword(
          auth(),
          email.trim(),
          password,
        );
        if (name.trim()) {
          await updateProfile(created.user, { displayName: name.trim() });
        }
        await sendEmailVerification(created.user, {
          url: `${window.location.origin}/scan`,
        });
        router.replace("/verify");
        return;
      }
      const signed = await signInWithEmailAndPassword(
        auth(),
        email.trim(),
        password,
      );
      router.replace(signed.user.emailVerified ? "/scan" : "/verify");
    });
  }

  function google() {
    attempt(async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth(), provider);
        router.replace("/scan");
      } catch (problem) {
        const code =
          typeof problem === "object" && problem && "code" in problem
            ? problem.code
            : "";
        if (code === "auth/popup-blocked") {
          await signInWithRedirect(auth(), provider);
          return;
        }
        throw problem;
      }
    });
  }

  function forgot() {
    if (!email.trim()) {
      setError(null);
      setNotice(text.resetNeedsEmail);
      return;
    }
    attempt(async () => {
      await sendPasswordResetEmail(auth(), email.trim());
      setNotice(text.resetSent);
      setBusy(false);
    });
  }

  const signUp = mode === "sign-up";

  return (
    <AuthCard lang={language}>
      <h1 className="font-display text-4xl font-semibold leading-[1.02] sm:text-5xl text-primary">
        {signUp ? text.signUpTitle : text.signInTitle}
      </h1>
      <p className="mt-3 text-muted-foreground">{text.intro}</p>

      <button
        type="button"
        onClick={google}
        disabled={busy}
        className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border bg-background text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-60"
      >
        <GoogleMark />
        {text.google}
      </button>

      <div className="my-6 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {text.or}
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {signUp && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              {text.name}
            </span>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className={field}
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{text.email}</span>
          <Input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            className={field}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-sm font-medium">
            {text.password}
            {!signUp && (
              <button
                type="button"
                onClick={forgot}
                className="font-normal text-primary underline-offset-4 hover:underline"
              >
                {text.forgot}
              </button>
            )}
          </span>
          <span className="relative block">
            <Input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={signUp ? "new-password" : "current-password"}
              className={`${field} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={text.password}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="rise rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {text.errors[error]}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="rise rounded-xl bg-secondary px-4 py-3 text-sm"
          >
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
        >
          {busy && <LoaderCircle className="size-5 animate-spin" />}
          {busy ? text.working : signUp ? text.signUp : text.signIn}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {signUp ? text.haveAccount : text.noAccount}{" "}
        <Link
          href={signUp ? "/sign-in" : "/sign-up"}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          {signUp ? text.signInLink : text.createOne}
        </Link>
      </p>
    </AuthCard>
  );
}
