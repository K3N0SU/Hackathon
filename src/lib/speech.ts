"use client";

import { useEffect, useRef, useState } from "react";
import { speechCode, type Language } from "@/lib/scan";

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function recognitionClass(): (new () => Recognition) | undefined {
  const scope = window as unknown as {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition;
}

export function useDictation(language: Language, onText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const active = useRef<Recognition | null>(null);
  const latest = useRef(onText);

  useEffect(() => {
    latest.current = onText;
  }, [onText]);

  useEffect(() => {
    const check = setTimeout(() => setSupported(Boolean(recognitionClass())), 0);
    return () => {
      clearTimeout(check);
      active.current?.stop();
    };
  }, []);

  function toggle() {
    if (listening) {
      active.current?.stop();
      return;
    }
    const Klass = recognitionClass();
    if (!Klass) return;
    const recognition = new Klass();
    recognition.lang = speechCode(language);
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ");
      latest.current(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    active.current = recognition;
    recognition.start();
    setListening(true);
    navigator.vibrate?.(15);
  }

  return { listening, supported, toggle };
}

export function findVoice(language: Language) {
  const code = speechCode(language).toLowerCase();
  const base = code.split("-")[0];
  const voices = window.speechSynthesis?.getVoices() ?? [];
  return (
    voices.find((voice) => voice.lang.replace("_", "-").toLowerCase() === code) ??
    voices.find((voice) =>
      voice.lang.replace("_", "-").toLowerCase().startsWith(base),
    )
  );
}

export function useSpeaker(language: Language) {
  const [speaking, setSpeaking] = useState("");
  const [missing, setMissing] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function stop() {
    window.speechSynthesis?.cancel();
    setSpeaking("");
  }

  function speak(id: string, text: string) {
    if (speaking === id) return stop();
    const synth = window.speechSynthesis;
    const voice = synth ? findVoice(language) : undefined;
    if (!synth || !voice) {
      setMissing(true);
      return;
    }
    setMissing(false);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.92;
    utterance.onend = () => setSpeaking("");
    utterance.onerror = () => setSpeaking("");
    synth.cancel();
    synth.speak(utterance);
    setSpeaking(id);
  }

  return { speaking, missing, speak, stop };
}
