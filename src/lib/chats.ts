"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteChat, listChats, saveChat } from "@/lib/cloud";
import type { ScanResult } from "@/lib/scan";

export type ChatMessage = {
  id: string;
  role: "user" | "model";
  text: string;
  urgent?: boolean;
  image?: string;
};

export type Chat = {
  id: string;
  title: string;
  label: ScanResult | null;
  updatedAt: number;
  messages: ChatMessage[];
};

const storageKey = "furrow-chats";

function readLocal(): Chat[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (Array.isArray(parsed)) return parsed;
    const old: Chat[] = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index) ?? "";
      if (!key.startsWith("furrow-chat-")) continue;
      const messages: ChatMessage[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (messages.length) {
        old.push({ id: key.slice(12) + "-old", title: titleFor(messages), label: null, updatedAt: index, messages });
      }
    }
    return old;
  } catch {
    return [];
  }
}

function writeLocal(chats: Chat[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(chats.slice(0, 50)));
  } catch {}
}

function newest(chats: Chat[]) {
  return [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function titleFor(messages: ChatMessage[]) {
  const first = messages.find((message) => message.role === "user")?.text.trim() ?? "";
  return first.length > 48 ? `${first.slice(0, 46).trimEnd()}…` : first;
}

export function freshChat(label: ScanResult | null): Chat {
  return {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    label,
    updatedAt: Date.now(),
    messages: [],
  };
}

export function useChats(uid: string | undefined) {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const start = setTimeout(() => setChats(newest(readLocal())), 0);
    return () => clearTimeout(start);
  }, []);

  useEffect(() => {
    if (!uid) return;
    let active = true;
    listChats()
      .then((remote) => {
        if (!active) return;
        setChats((local) => {
          const merged = new Map<string, Chat>();
          for (const chat of [...remote, ...local]) {
            const known = merged.get(chat.id);
            if (!known || chat.updatedAt > known.updatedAt) merged.set(chat.id, chat);
          }
          const next = newest([...merged.values()]);
          writeLocal(next);
          for (const chat of local) {
            if (!remote.some((item) => item.id === chat.id)) saveChat(chat).catch(() => {});
          }
          return next;
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [uid]);

  const store = useCallback((chat: Chat) => {
    if (!chat.messages.length) return;
    const saved = {
      ...chat,
      messages: chat.messages.slice(-60),
      title: chat.title || titleFor(chat.messages),
      updatedAt: Date.now(),
    };
    setChats((current) => {
      const next = newest([saved, ...current.filter((item) => item.id !== chat.id)]);
      writeLocal(next);
      return next;
    });
    saveChat(saved).catch(() => {});
  }, []);

  const remove = useCallback((chatId: string) => {
    setChats((current) => {
      const next = current.filter((item) => item.id !== chatId);
      writeLocal(next);
      return next;
    });
    deleteChat(chatId).catch(() => {});
  }, []);

  return { chats, store, remove };
}
