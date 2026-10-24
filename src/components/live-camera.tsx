"use client";

import { Check, ImageIcon, RefreshCw, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Language } from "@/lib/scan";

const cameraCopy: Record<
  Language,
  {
    hint: string;
    capture: string;
    retake: string;
    use: string;
    flip: string;
    gallery: string;
    close: string;
    blocked: string;
    openApp: string;
  }
> = {
  en: {
    hint: "Fit the whole label inside the frame",
    capture: "Take photo",
    retake: "Retake",
    use: "Read this label",
    flip: "Switch camera",
    gallery: "Choose a photo",
    close: "Close camera",
    blocked:
      "Furrow can't open the camera here. Allow camera access in your browser settings, or use your phone's camera app.",
    openApp: "Use the camera app",
  },
  es: {
    hint: "Pon toda la etiqueta dentro del cuadro",
    capture: "Tomar foto",
    retake: "Tomar otra",
    use: "Leer esta etiqueta",
    flip: "Cambiar cámara",
    gallery: "Elegir una foto",
    close: "Cerrar cámara",
    blocked:
      "Furrow no puede abrir la cámara aquí. Permite el acceso a la cámara en tu navegador o usa la app de cámara del teléfono.",
    openApp: "Usar la app de cámara",
  },
  pa: {
    hint: "ਪੂਰਾ ਲੇਬਲ ਫਰੇਮ ਦੇ ਅੰਦਰ ਰੱਖੋ",
    capture: "ਫੋਟੋ ਖਿੱਚੋ",
    retake: "ਦੁਬਾਰਾ ਖਿੱਚੋ",
    use: "ਇਹ ਲੇਬਲ ਪੜ੍ਹੋ",
    flip: "ਕੈਮਰਾ ਬਦਲੋ",
    gallery: "ਫੋਟੋ ਚੁਣੋ",
    close: "ਕੈਮਰਾ ਬੰਦ ਕਰੋ",
    blocked:
      "Furrow ਇੱਥੇ ਕੈਮਰਾ ਨਹੀਂ ਖੋਲ੍ਹ ਸਕਦਾ। ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਕੈਮਰੇ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ, ਜਾਂ ਫੋਨ ਦੀ ਕੈਮਰਾ ਐਪ ਵਰਤੋ।",
    openApp: "ਕੈਮਰਾ ਐਪ ਵਰਤੋ",
  },
};

export function LiveCamera({
  language,
  onCapture,
  onFile,
  onClose,
}: {
  language: Language;
  onCapture: (dataUrl: string) => void;
  onFile: (file: File) => void;
  onClose: () => void;
}) {
  const text = cameraCopy[language];
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const appRef = useRef<HTMLInputElement>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [state, setState] = useState<"starting" | "live" | "blocked">(
    "starting",
  );
  const [shot, setShot] = useState("");
  const [flash, setFlash] = useState(false);

  const stop = useCallback(() => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setState("blocked");
        return;
      }
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1440 },
          },
          audio: false,
        });
        if (cancelled) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        stream.current = media;
        if (video.current) {
          video.current.srcObject = media;
          await video.current.play().catch(() => {});
        }
        setState("live");
      } catch {
        if (!cancelled) setState("blocked");
      }
    }
    start();
    return () => {
      cancelled = true;
      stop();
    };
  }, [facing, stop]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function capture() {
    const element = video.current;
    if (!element || !element.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = element.videoWidth;
    canvas.height = element.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(element, 0, 0);
    setShot(canvas.toDataURL("image/jpeg", 0.9));
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
    navigator.vibrate?.(15);
  }

  function picked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    stop();
    onFile(file);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={text.capture}
      className="pop fixed inset-0 z-[60] flex flex-col bg-black text-white"
    >
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={video}
          playsInline
          muted
          className={`absolute inset-0 size-full object-cover ${shot ? "invisible" : ""}`}
        />
        {shot && (
          <img
            src={shot}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        )}
        {state === "live" && !shot && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
            <div className="relative aspect-[3/4] w-full max-w-sm">
              {[
                "left-0 top-0 border-l-4 border-t-4 rounded-tl-2xl",
                "right-0 top-0 border-r-4 border-t-4 rounded-tr-2xl",
                "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl",
                "bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl",
              ].map((corner) => (
                <span
                  key={corner}
                  className={`absolute size-10 border-harvest ${corner}`}
                />
              ))}
              <div className="scan-line absolute inset-x-0 h-24 opacity-60" />
            </div>
          </div>
        )}
        {state === "starting" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="size-12 animate-spin rounded-full border-4 border-white/20 border-t-harvest" />
          </div>
        )}
        {state === "blocked" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
            <p className="max-w-sm text-lg leading-relaxed">{text.blocked}</p>
            <button
              onClick={() => appRef.current?.click()}
              className="rounded-full bg-harvest px-7 py-3.5 text-base font-semibold text-harvest-foreground"
            >
              {text.openApp}
            </button>
          </div>
        )}
        {flash && <div className="absolute inset-0 bg-white" />}

        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <button
            onClick={() => {
              stop();
              onClose();
            }}
            aria-label={text.close}
            className="flex size-11 items-center justify-center rounded-full bg-black/40 backdrop-blur"
          >
            <X className="size-6" />
          </button>
          {state === "live" && !shot && (
            <p className="rounded-full bg-black/40 px-4 py-2 text-sm backdrop-blur">
              {text.hint}
            </p>
          )}
          <span className="size-11" />
        </div>
      </div>

      <div className="flex items-center justify-around bg-black px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        {shot ? (
          <>
            <button
              onClick={() => setShot("")}
              className="flex h-14 items-center gap-2 rounded-full border border-white/30 px-6 text-base font-semibold"
            >
              <RotateCcw className="size-5" />
              {text.retake}
            </button>
            <button
              onClick={() => {
                stop();
                onCapture(shot);
              }}
              className="flex h-14 items-center gap-2 rounded-full bg-harvest px-7 text-base font-semibold text-harvest-foreground"
            >
              <Check className="size-5" />
              {text.use}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => galleryRef.current?.click()}
              aria-label={text.gallery}
              className="flex size-14 items-center justify-center rounded-full bg-white/10"
            >
              <ImageIcon className="size-6" />
            </button>
            <button
              onClick={capture}
              disabled={state !== "live"}
              aria-label={text.capture}
              className="flex size-20 items-center justify-center rounded-full border-4 border-white transition-transform active:scale-90 disabled:opacity-40"
            >
              <span className="size-16 rounded-full bg-white" />
            </button>
            <button
              onClick={() =>
                setFacing((side) =>
                  side === "environment" ? "user" : "environment",
                )
              }
              aria-label={text.flip}
              className="flex size-14 items-center justify-center rounded-full bg-white/10"
            >
              <RefreshCw className="size-6" />
            </button>
          </>
        )}
      </div>
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={picked}
      />
      <input
        ref={appRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={picked}
      />
    </div>
  );
}
