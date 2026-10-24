export type Language = "en" | "es" | "pa";

export type Signal = "caution" | "warning" | "danger" | "unknown";

export type ScanResult = {
  readable: boolean;
  product: string;
  signal: Signal;
  reentryHours: number;
  reentry: string;
  gear: string[];
  firstAid: string[];
  summary: string;
  ask: string;
};

export const languages: { code: Language; name: string; speech: string }[] = [
  { code: "en", name: "English", speech: "en-US" },
  { code: "es", name: "Español", speech: "es-MX" },
  { code: "pa", name: "ਪੰਜਾਬੀ", speech: "pa-IN" },
];

export const languageNames: Record<Language, string> = {
  en: "English",
  es: "Spanish",
  pa: "Punjabi (Gurmukhi script)",
};

type Copy = {
  headline: string;
  tagline: string;
  scan: string;
  samples: string;
  reading: string;
  reentry: string;
  gear: string;
  firstAid: string;
  summary: string;
  listen: string;
  stop: string;
  another: string;
  ask: string;
  unreadable: string;
  failed: string;
  offline: string;
  noVoice: string;
  disclaimer: string;
  sprayedAt: string;
  startClock: string;
  clocksHeading: string;
  safeAt: string;
  safeNow: string;
  hoursUnit: string;
  minutesUnit: string;
  leftWord: string;
  clearClock: string;
  callPoison: string;
  signal: Record<Signal, string>;
};

export const copy: Record<Language, Copy> = {
  en: {
    headline: "Know before you enter the field.",
    tagline:
      "Take a photo of a pesticide label or a field sign. Furrow tells you, in your language, when it is safe to go back in and how to protect yourself.",
    scan: "Photograph a label or sign",
    samples: "Or try an example",
    reading: "Reading the label",
    reentry: "When you can go back in",
    gear: "What to wear",
    firstAid: "If you are exposed",
    summary: "In short",
    listen: "Listen",
    stop: "Stop",
    another: "Scan another",
    ask: "Not sure about this part. Ask your supervisor.",
    unreadable: "We could not read this photo. Move closer, hold the phone steady and try again.",
    failed: "Something went wrong. Check your connection and try again.",
    offline: "No connection. Showing a saved example result.",
    noVoice: "This phone has no voice for this language.",
    disclaimer: "This is a reading aid. Always follow the label and your supervisor.",
    sprayedAt: "When was it sprayed?",
    startClock: "Start the clock",
    clocksHeading: "Fields on the clock",
    safeAt: "Safe to enter at",
    safeNow: "Safe to enter",
    hoursUnit: "h",
    minutesUnit: "min",
    leftWord: "left",
    clearClock: "Remove",
    callPoison: "Call Poison Control",
    signal: { caution: "Caution", warning: "Warning", danger: "Danger", unknown: "Not shown" },
  },
  es: {
    headline: "Sepa antes de entrar al campo.",
    tagline:
      "Tome una foto de una etiqueta de pesticida o de un letrero del campo. Furrow le dice, en su idioma, cuándo es seguro volver a entrar y cómo protegerse.",
    scan: "Fotografiar etiqueta o letrero",
    samples: "O pruebe un ejemplo",
    reading: "Leyendo la etiqueta",
    reentry: "Cuándo puede volver a entrar",
    gear: "Qué debe usar",
    firstAid: "Si se expone",
    summary: "En resumen",
    listen: "Escuchar",
    stop: "Detener",
    another: "Escanear otro",
    ask: "No estoy seguro de esta parte. Pregunte a su supervisor.",
    unreadable: "No pudimos leer esta foto. Acérquese, sostenga el teléfono firme e intente de nuevo.",
    failed: "Algo salió mal. Revise su conexión e intente de nuevo.",
    offline: "Sin conexión. Mostrando un resultado de ejemplo guardado.",
    noVoice: "Este teléfono no tiene voz para este idioma.",
    disclaimer: "Esto es una ayuda de lectura. Siga siempre la etiqueta y a su supervisor.",
    sprayedAt: "¿Cuándo se roció?",
    startClock: "Iniciar el reloj",
    clocksHeading: "Campos en el reloj",
    safeAt: "Seguro para entrar a las",
    safeNow: "Seguro para entrar",
    hoursUnit: "h",
    minutesUnit: "min",
    leftWord: "faltan",
    clearClock: "Quitar",
    callPoison: "Llamar a Control de Envenenamientos",
    signal: { caution: "Cuidado", warning: "Aviso", danger: "Peligro", unknown: "No indicado" },
  },
  pa: {
    headline: "ਖੇਤ ਵਿੱਚ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਣੋ।",
    tagline:
      "ਕੀਟਨਾਸ਼ਕ ਲੇਬਲ ਜਾਂ ਖੇਤ ਦੇ ਸਾਈਨ ਦੀ ਫੋਟੋ ਖਿੱਚੋ। Furrow ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਦੱਸੇਗਾ ਕਿ ਵਾਪਸ ਅੰਦਰ ਜਾਣਾ ਕਦੋਂ ਸੁਰੱਖਿਅਤ ਹੈ ਅਤੇ ਆਪਣਾ ਬਚਾਅ ਕਿਵੇਂ ਕਰਨਾ ਹੈ।",
    scan: "ਲੇਬਲ ਜਾਂ ਸਾਈਨ ਦੀ ਫੋਟੋ ਖਿੱਚੋ",
    samples: "ਜਾਂ ਇੱਕ ਨਮੂਨਾ ਅਜ਼ਮਾਓ",
    reading: "ਲੇਬਲ ਪੜ੍ਹ ਰਿਹਾ ਹੈ",
    reentry: "ਵਾਪਸ ਅੰਦਰ ਕਦੋਂ ਜਾਣਾ ਹੈ",
    gear: "ਕੀ ਪਹਿਨਣਾ ਹੈ",
    firstAid: "ਜੇ ਜ਼ਹਿਰ ਲੱਗ ਜਾਵੇ",
    summary: "ਸੰਖੇਪ ਵਿੱਚ",
    listen: "ਸੁਣੋ",
    stop: "ਰੋਕੋ",
    another: "ਹੋਰ ਸਕੈਨ ਕਰੋ",
    ask: "ਇਸ ਹਿੱਸੇ ਬਾਰੇ ਪੱਕਾ ਨਹੀਂ ਹਾਂ। ਆਪਣੇ ਸੁਪਰਵਾਈਜ਼ਰ ਤੋਂ ਪੁੱਛੋ।",
    unreadable: "ਇਹ ਫੋਟੋ ਪੜ੍ਹੀ ਨਹੀਂ ਗਈ। ਨੇੜੇ ਜਾਓ, ਫ਼ੋਨ ਸਥਿਰ ਰੱਖੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    failed: "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ। ਆਪਣਾ ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    offline: "ਕਨੈਕਸ਼ਨ ਨਹੀਂ ਹੈ। ਸੰਭਾਲਿਆ ਹੋਇਆ ਨਮੂਨਾ ਨਤੀਜਾ ਦਿਖਾ ਰਿਹਾ ਹੈ।",
    noVoice: "ਇਸ ਫ਼ੋਨ ਵਿੱਚ ਇਸ ਭਾਸ਼ਾ ਦੀ ਆਵਾਜ਼ ਨਹੀਂ ਹੈ।",
    disclaimer: "ਇਹ ਪੜ੍ਹਨ ਵਿੱਚ ਮਦਦ ਹੈ। ਹਮੇਸ਼ਾ ਲੇਬਲ ਅਤੇ ਆਪਣੇ ਸੁਪਰਵਾਈਜ਼ਰ ਦੀ ਗੱਲ ਮੰਨੋ।",
    sprayedAt: "ਛਿੜਕਾਅ ਕਦੋਂ ਹੋਇਆ?",
    startClock: "ਘੜੀ ਚਲਾਓ",
    clocksHeading: "ਘੜੀ 'ਤੇ ਖੇਤ",
    safeAt: "ਅੰਦਰ ਜਾਣਾ ਸੁਰੱਖਿਅਤ ਹੋਵੇਗਾ",
    safeNow: "ਅੰਦਰ ਜਾਣਾ ਸੁਰੱਖਿਅਤ ਹੈ",
    hoursUnit: "ਘੰਟੇ",
    minutesUnit: "ਮਿੰਟ",
    leftWord: "ਬਾਕੀ",
    clearClock: "ਹਟਾਓ",
    callPoison: "ਪੋਇਜ਼ਨ ਕੰਟਰੋਲ ਨੂੰ ਕਾਲ ਕਰੋ",
    signal: { caution: "ਸਾਵਧਾਨ", warning: "ਚੇਤਾਵਨੀ", danger: "ਖ਼ਤਰਾ", unknown: "ਦਿਖਾਇਆ ਨਹੀਂ" },
  },
};
