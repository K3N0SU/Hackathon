import type { CoreLanguage } from "@/lib/scan";

export type CameraMode = "food" | "me" | "stub" | "paper";

export const cameraCopy: Record<
  CoreLanguage,
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
    light: string;
    modes: Record<CameraMode, { hint: string; use: string }>;
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
      "Milpa can't open the camera here. Allow camera access in your browser settings, or use your phone's camera app.",
    openApp: "Use the camera app",
    light: "Flashlight",
    modes: {
      food: { hint: "Fit the food label or the food inside the frame", use: "Check this food" },
      me: { hint: "Stand back so your arms, hands and feet show", use: "Check my gear" },
      stub: { hint: "Fit the whole pay stub inside the frame", use: "Check this pay stub" },
      paper: { hint: "Fit the whole paper inside the frame", use: "Read this paper" },
    },
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
      "Milpa no puede abrir la cámara aquí. Permite el acceso a la cámara en tu navegador o usa la app de cámara del teléfono.",
    openApp: "Usar la app de cámara",
    light: "Linterna",
    modes: {
      food: { hint: "Ponga la etiqueta o la comida dentro del cuadro", use: "Revisar esta comida" },
      me: { hint: "Aléjese para que se vean sus brazos, manos y pies", use: "Revisar mi equipo" },
      stub: { hint: "Ponga todo el talón de pago dentro del cuadro", use: "Revisar este talón" },
      paper: { hint: "Ponga todo el papel dentro del cuadro", use: "Leer este papel" },
    },
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
      "Milpa ਇੱਥੇ ਕੈਮਰਾ ਨਹੀਂ ਖੋਲ੍ਹ ਸਕਦਾ। ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਕੈਮਰੇ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ, ਜਾਂ ਫੋਨ ਦੀ ਕੈਮਰਾ ਐਪ ਵਰਤੋ।",
    openApp: "ਕੈਮਰਾ ਐਪ ਵਰਤੋ",
    light: "ਟਾਰਚ",
    modes: {
      food: { hint: "ਖਾਣੇ ਦਾ ਲੇਬਲ ਜਾਂ ਖਾਣਾ ਫਰੇਮ ਵਿੱਚ ਰੱਖੋ", use: "ਇਹ ਖਾਣਾ ਜਾਂਚੋ" },
      me: { hint: "ਪਿੱਛੇ ਖੜ੍ਹੋ ਤਾਂ ਜੋ ਬਾਹਾਂ, ਹੱਥ ਅਤੇ ਪੈਰ ਦਿਸਣ", use: "ਮੇਰਾ ਸਾਮਾਨ ਜਾਂਚੋ" },
      stub: { hint: "ਪੂਰੀ ਤਨਖਾਹ ਪਰਚੀ ਫਰੇਮ ਵਿੱਚ ਰੱਖੋ", use: "ਇਹ ਪਰਚੀ ਜਾਂਚੋ" },
      paper: { hint: "ਪੂਰਾ ਕਾਗਜ਼ ਫਰੇਮ ਵਿੱਚ ਰੱਖੋ", use: "ਇਹ ਕਾਗਜ਼ ਪੜ੍ਹੋ" },
    },
  },
};
