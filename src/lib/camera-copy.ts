import type { CoreLanguage } from "@/lib/scan";

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
      "Rowen can't open the camera here. Allow camera access in your browser settings, or use your phone's camera app.",
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
      "Rowen no puede abrir la cámara aquí. Permite el acceso a la cámara en tu navegador o usa la app de cámara del teléfono.",
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
      "Rowen ਇੱਥੇ ਕੈਮਰਾ ਨਹੀਂ ਖੋਲ੍ਹ ਸਕਦਾ। ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਕੈਮਰੇ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ, ਜਾਂ ਫੋਨ ਦੀ ਕੈਮਰਾ ਐਪ ਵਰਤੋ।",
    openApp: "ਕੈਮਰਾ ਐਪ ਵਰਤੋ",
  },
};
