import type { CoreLanguage, ScanResult } from "./scan";

export type LastScan = {
  product: string;
  signal: string;
  result?: ScanResult;
  at?: number;
};

export const lastScanKey = "furrow-last-scan";

type ExposureCopy = {
  tab: string;
  title: string;
  emergency: string;
  call911: string;
  steps: string[];
  rinseStart: string;
  rinseKeep: string;
  rinseDone: string;
  rinseAgain: string;
  productLabel: string;
  productHint: string;
  timeLabel: string;
  showCard: string;
  close: string;
  interpreter: string;
};

export const exposureCopy: Record<CoreLanguage, ExposureCopy> = {
  en: {
    tab: "Exposed",
    title: "Got pesticide on you?",
    emergency:
      "If someone has trouble breathing, passes out or has a seizure, call 911 now.",
    call911: "Call 911",
    steps: [
      "Get away from the sprayed area and into fresh air.",
      "Take off clothes and shoes that got wet with spray.",
      "Rinse skin with lots of clean water and soap for 15 minutes. For eyes, rinse with clean water for 15 minutes.",
      "Call Poison Control. It is free and private, and they have interpreters.",
      "Tell your supervisor which product it was. Your employer must get you to medical care.",
    ],
    rinseStart: "Start the 15-minute rinse",
    rinseKeep: "Keep rinsing",
    rinseDone: "15 minutes done",
    rinseAgain: "Start again",
    productLabel: "Product name, if you know it",
    productHint: "Filled in from your last scan",
    timeLabel: "When did it happen?",
    showCard: "Show the doctor a card in English",
    close: "Close",
    interpreter: "",
  },
  es: {
    tab: "Expuesto",
    title: "¿Le cayó pesticida?",
    emergency:
      "Si alguien tiene problemas para respirar, se desmaya o tiene convulsiones, llame al 911 ahora.",
    call911: "Llamar al 911",
    steps: [
      "Aléjese del área rociada y vaya al aire fresco.",
      "Quítese la ropa y los zapatos que se mojaron con el rocío.",
      "Lávese la piel con mucha agua limpia y jabón por 15 minutos. Para los ojos, enjuáguelos con agua limpia por 15 minutos.",
      "Llame a Control de Envenenamientos. Es gratis y privado, y tienen intérpretes.",
      "Dígale a su supervisor qué producto era. Su empleador debe llevarlo a atención médica.",
    ],
    rinseStart: "Iniciar enjuague de 15 minutos",
    rinseKeep: "Siga enjuagando",
    rinseDone: "15 minutos listos",
    rinseAgain: "Empezar de nuevo",
    productLabel: "Nombre del producto, si lo sabe",
    productHint: "Tomado de su último escaneo",
    timeLabel: "¿Cuándo pasó?",
    showCard: "Mostrar al doctor una tarjeta en inglés",
    close: "Cerrar",
    interpreter: "I speak Spanish. Please get me an interpreter.",
  },
  pa: {
    tab: "ਮਦਦ",
    title: "ਕੀ ਤੁਹਾਡੇ ਉੱਤੇ ਕੀਟਨਾਸ਼ਕ ਪਿਆ ਹੈ?",
    emergency:
      "ਜੇ ਕਿਸੇ ਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਦਿੱਕਤ ਹੈ, ਬੇਹੋਸ਼ ਹੋ ਜਾਵੇ ਜਾਂ ਦੌਰਾ ਪਵੇ, ਤਾਂ ਹੁਣੇ 911 'ਤੇ ਕਾਲ ਕਰੋ।",
    call911: "911 'ਤੇ ਕਾਲ ਕਰੋ",
    steps: [
      "ਛਿੜਕਾਅ ਵਾਲੀ ਥਾਂ ਤੋਂ ਦੂਰ ਤਾਜ਼ੀ ਹਵਾ ਵਿੱਚ ਜਾਓ।",
      "ਛਿੜਕਾਅ ਨਾਲ ਗਿੱਲੇ ਹੋਏ ਕੱਪੜੇ ਅਤੇ ਜੁੱਤੀਆਂ ਉਤਾਰ ਦਿਓ।",
      "ਚਮੜੀ ਨੂੰ ਬਹੁਤ ਸਾਰੇ ਸਾਫ਼ ਪਾਣੀ ਅਤੇ ਸਾਬਣ ਨਾਲ 15 ਮਿੰਟ ਧੋਵੋ। ਅੱਖਾਂ ਨੂੰ ਸਾਫ਼ ਪਾਣੀ ਨਾਲ 15 ਮਿੰਟ ਧੋਵੋ।",
      "ਪੋਇਜ਼ਨ ਕੰਟਰੋਲ ਨੂੰ ਕਾਲ ਕਰੋ। ਇਹ ਮੁਫ਼ਤ ਅਤੇ ਨਿੱਜੀ ਹੈ, ਅਤੇ ਉਨ੍ਹਾਂ ਕੋਲ ਦੁਭਾਸ਼ੀਏ ਹਨ।",
      "ਆਪਣੇ ਸੁਪਰਵਾਈਜ਼ਰ ਨੂੰ ਦੱਸੋ ਕਿ ਕਿਹੜਾ ਪ੍ਰੋਡਕਟ ਸੀ। ਤੁਹਾਡੇ ਮਾਲਕ ਨੂੰ ਤੁਹਾਨੂੰ ਡਾਕਟਰੀ ਇਲਾਜ ਤੱਕ ਪਹੁੰਚਾਉਣਾ ਪੈਂਦਾ ਹੈ।",
    ],
    rinseStart: "15 ਮਿੰਟ ਧੋਣਾ ਸ਼ੁਰੂ ਕਰੋ",
    rinseKeep: "ਧੋਂਦੇ ਰਹੋ",
    rinseDone: "15 ਮਿੰਟ ਪੂਰੇ",
    rinseAgain: "ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰੋ",
    productLabel: "ਪ੍ਰੋਡਕਟ ਦਾ ਨਾਮ, ਜੇ ਪਤਾ ਹੋਵੇ",
    productHint: "ਤੁਹਾਡੇ ਪਿਛਲੇ ਸਕੈਨ ਤੋਂ ਭਰਿਆ ਗਿਆ",
    timeLabel: "ਇਹ ਕਦੋਂ ਹੋਇਆ?",
    showCard: "ਡਾਕਟਰ ਨੂੰ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਕਾਰਡ ਵਿਖਾਓ",
    close: "ਬੰਦ ਕਰੋ",
    interpreter: "I speak Punjabi. Please get me an interpreter.",
  },
};
