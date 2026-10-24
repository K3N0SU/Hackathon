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


function voiceRank(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  if (/natural|neural|online/.test(name)) return 3;
  if (/google|enhanced|premium|siri/.test(name)) return 2;
  return voice.localService ? 0 : 1;
}

export function findVoice(language: Language) {
  const code = speechCode(language).toLowerCase();
  const base = code.split("-")[0];
  const voices = window.speechSynthesis?.getVoices() ?? [];
  const lang = (voice: SpeechSynthesisVoice) => voice.lang.replace("_", "-").toLowerCase();
  const exact = voices.filter((voice) => lang(voice) === code);
  const near = voices.filter((voice) => lang(voice).startsWith(base));
  return (exact.length ? exact : near).sort((a, b) => voiceRank(b) - voiceRank(a))[0];
}

const silence = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
const spoken = new Map<string, string>();

async function naturalAudio(text: string, language: Language) {
  const key = `${language}:${text}`;
  const cached = spoken.get(key);
  if (cached) return cached;
  const response = await fetch("/api/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
  if (!response.ok) throw new Error("speak failed");
  const url = URL.createObjectURL(await response.blob());
  spoken.set(key, url);
  return url;
}

function prime(audio: HTMLAudioElement) {
  audio.onpause = null;
  audio.src = silence;
  audio.play().catch(() => {});
}

function playUrl(audio: HTMLAudioElement, url: string) {
  return new Promise<void>((resolve, reject) => {
    audio.onended = () => resolve();
    audio.onpause = () => resolve();
    audio.onerror = () => reject(new Error("play failed"));
    audio.src = url;
    audio.play().catch(reject);
  });
}

export function useSpeaker(language: Language) {
  const [speaking, setSpeaking] = useState("");
  const [loading, setLoading] = useState(false);
  const [missing, setMissing] = useState(false);
  const player = useRef<HTMLAudioElement | null>(null);
  const turn = useRef(0);

  useEffect(() => {
    const current = turn;
    return () => {
      current.current++;
      player.current?.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function halt() {
    turn.current++;
    player.current?.pause();
    window.speechSynthesis?.cancel();
    setLoading(false);
  }

  function stop() {
    halt();
    setSpeaking("");
  }

  function browserSay(text: string) {
    return new Promise<boolean>((resolve) => {
      const synth = window.speechSynthesis;
      const voice = synth ? findVoice(language) : undefined;
      if (!synth || !voice) return resolve(false);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 0.95;
      utterance.pitch = 1.02;
      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(true);
      synth.cancel();
      synth.speak(utterance);
    });
  }

  async function say(text: string) {
    halt();
    const mine = turn.current;
    const audio = player.current ?? new Audio();
    player.current = audio;
    prime(audio);
    setLoading(true);
    setMissing(false);
    try {
      const url = await naturalAudio(text, language);
      if (mine !== turn.current) return;
      setLoading(false);
      await playUrl(audio, url);
    } catch {
      if (mine !== turn.current) return;
      setLoading(false);
      if (!(await browserSay(text))) setMissing(true);
    }
  }

  function speak(id: string, text: string) {
    if (speaking === id) return stop();
    setSpeaking(id);
    say(text).then(() => setSpeaking((current) => (current === id ? "" : current)));
  }

  return { speaking, loading, missing, speak, say, stop };
}

export type Clip = { audio: string; mediaType: "audio/wav" };

function toWav(samples: Float32Array, rate: number) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const write = (offset: number, value: string) =>
    [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  write(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, samples.length * 2, true);
  samples.forEach((sample, index) => {
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + index * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  });
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

export function canRecord() {
  return typeof MediaRecorder !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}

export type RecordControl = { finish: boolean; cancel: boolean };

export async function recordUtterance(
  control: RecordControl,
  onLevel: (level: number) => void,
): Promise<Clip | null> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
  });
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  analyser.fftSize = 1024;
  context.createMediaStreamSource(stream).connect(analyser);
  const recorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => chunks.push(event.data);
  const stopped = new Promise<void>((resolve) => (recorder.onstop = () => resolve()));
  recorder.start();

  const levels = new Float32Array(analyser.fftSize);
  const started = performance.now();
  let floor = 0.01;
  let loudFor = 0;
  let lastLoud = started;
  await new Promise<void>((resolve) => {
    const timer = setInterval(() => {
      analyser.getFloatTimeDomainData(levels);
      const rms = Math.sqrt(levels.reduce((sum, value) => sum + value * value, 0) / levels.length);
      const now = performance.now();
      if (now - started < 400) floor = Math.max(floor, rms);
      if (rms > Math.max(0.02, floor * 2.2)) {
        loudFor += 50;
        lastLoud = now;
      }
      onLevel(Math.min(1, rms * 8));
      const heard = loudFor >= 200;
      if (
        control.cancel ||
        control.finish ||
        (heard && now - lastLoud > 1300) ||
        (!heard && now - started > 9000) ||
        now - started > 25000
      ) {
        clearInterval(timer);
        resolve();
      }
    }, 50);
  });

  recorder.stop();
  await stopped;
  stream.getTracks().forEach((track) => track.stop());
  onLevel(0);
  if (control.cancel || loudFor < 100) {
    await context.close();
    return null;
  }
  try {
    const decoded = await context.decodeAudioData(
      await new Blob(chunks, { type: recorder.mimeType }).arrayBuffer(),
    );
    const rate = 16000;
    const offline = new OfflineAudioContext(1, Math.ceil(decoded.duration * rate), rate);
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();
    const rendered = await offline.startRendering();
    return { audio: toWav(rendered.getChannelData(0), rate), mediaType: "audio/wav" };
  } finally {
    await context.close();
  }
}
