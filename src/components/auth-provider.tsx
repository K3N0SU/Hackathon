"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { languages, type Language } from "@/lib/scan";

type Session = { user: User | null; ready: boolean };

const SessionContext = createContext<Session>({ user: null, ready: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>({
    user: null,
    ready: false,
  });

  useEffect(() => {
    return onAuthStateChanged(auth(), (user) =>
      setSession({ user, ready: true }),
    );
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

export function useSavedLanguage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const start = setTimeout(() => {
      try {
        const saved =
          localStorage.getItem("furrow-language") ??
          navigator.language.slice(0, 2);
        const pick = languages.find((item) => item.code === saved);
        if (pick) setLanguage(pick.code);
      } catch {}
    }, 0);
    return () => clearTimeout(start);
  }, []);

  return language;
}
