import type { CoreLanguage } from "@/lib/scan";

export const savedCopy: Record<
  CoreLanguage,
  {
    tab: string;
    title: string;
    intro: string;
    empty: string;
    failed: string;
    remove: string;
  }
> = {
  en: {
    tab: "Saved",
    title: "Your scans",
    intro: "Every label you scan is saved to your account, on any phone.",
    empty:
      "Nothing saved yet. Scan a label and it will show up here with its photo.",
    failed: "Couldn't load your scans. Check your signal and try again.",
    remove: "Delete",
  },
  es: {
    tab: "Guardado",
    title: "Tus escaneos",
    intro:
      "Cada etiqueta que escaneas se guarda en tu cuenta, en cualquier teléfono.",
    empty:
      "Todavía no hay nada. Escanea una etiqueta y aparecerá aquí con su foto.",
    failed: "No se pudieron cargar tus escaneos. Revisa tu señal.",
    remove: "Borrar",
  },
  pa: {
    tab: "ਸੰਭਾਲੇ",
    title: "ਤੁਹਾਡੇ ਸਕੈਨ",
    intro:
      "ਹਰ ਸਕੈਨ ਕੀਤਾ ਲੇਬਲ ਤੁਹਾਡੇ ਖਾਤੇ ਵਿੱਚ ਸੰਭਾਲਿਆ ਜਾਂਦਾ ਹੈ, ਕਿਸੇ ਵੀ ਫੋਨ ਤੇ।",
    empty: "ਅਜੇ ਕੁਝ ਨਹੀਂ ਸੰਭਾਲਿਆ। ਲੇਬਲ ਸਕੈਨ ਕਰੋ, ਉਹ ਫੋਟੋ ਸਮੇਤ ਇੱਥੇ ਦਿਸੇਗਾ।",
    failed: "ਤੁਹਾਡੇ ਸਕੈਨ ਨਹੀਂ ਖੁੱਲ੍ਹੇ। ਸਿਗਨਲ ਦੇਖ ਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    remove: "ਮਿਟਾਓ",
  },
};
