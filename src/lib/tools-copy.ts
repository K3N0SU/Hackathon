import type { CoreLanguage } from "@/lib/scan";

export type ToolsCopy = {
  food: {
    title: string;
    intro: string;
    allergiesTitle: string;
    allergyNames: string[];
    take: string;
    choose: string;
    checking: string;
    verdict: { safe: string; caution: string; avoid: string };
    allergens: string;
    contains: string;
    may: string;
    noAllergens: string;
    yours: string;
    organic: { yes: string; no: string; unknown: string };
    pesticides: string;
    flags: string;
    notFood: string;
    failed: string;
    again: string;
  };
  gear: {
    title: string;
    intro: string;
    forProduct: string;
    noLabel: string;
    defaultGear: string[];
    take: string;
    hint: string;
    checking: string;
    verdict: { ready: string; missing: string; unsure: string };
    status: { on: string; missing: string; unsure: string };
    noPerson: string;
    failed: string;
    again: string;
  };
  pay: {
    title: string;
    intro: string;
    take: string;
    choose: string;
    reading: string;
    period: string;
    hours: string;
    rate: string;
    gross: string;
    net: string;
    verdict: { ok: string; ask: string; unclear: string };
    status: { ok: string; ask: string; missing: string };
    labor: string;
    notStub: string;
    failed: string;
    again: string;
    privacy: string;
  };
  interpret: {
    title: string;
    intro: string;
    me: string;
    them: string;
    other: string;
    listening: string;
    translating: string;
    tapToStop: string;
    empty: string;
    failed: string;
    blocked: string;
    clear: string;
    replay: string;
    unsupported: string;
  };
};

export const toolsCopy: Record<CoreLanguage, ToolsCopy> = {
  en: {
    food: {
      title: "Food check",
      intro: "Take a photo of a food label, a produce sticker or the fruit itself. Milpa checks it for your allergies and tells you what the label says about pesticides.",
      allergiesTitle: "My allergies",
      allergyNames: ["Milk", "Eggs", "Fish", "Shellfish", "Tree nuts", "Peanuts", "Wheat", "Soy", "Sesame"],
      take: "Take a photo of the food",
      choose: "Choose a photo",
      checking: "Reading the label...",
      verdict: { safe: "Looks safe for you", caution: "Check before you eat", avoid: "Do not eat this" },
      allergens: "Allergens",
      contains: "Contains",
      may: "May contain",
      noAllergens: "No major allergens on the label.",
      yours: "Has your allergy",
      organic: { yes: "Certified organic", no: "Not organic", unknown: "Organic not shown" },
      pesticides: "Pesticides",
      flags: "Worth knowing",
      notFood: "That does not look like food or a food label. Try a closer photo.",
      failed: "Could not check the photo. Check your connection and try again.",
      again: "Check another",
    },
    gear: {
      title: "Gear check",
      intro: "Take a photo of yourself before you go in. Milpa checks it against the gear the label asks for.",
      forProduct: "Checking gear for",
      noLabel: "No label scanned yet, so Milpa checks the usual gear.",
      defaultGear: ["Long-sleeved shirt", "Long pants", "Chemical-resistant gloves", "Shoes and socks"],
      take: "Take a photo of me",
      hint: "Stand back so your arms, hands and feet show.",
      checking: "Looking at your gear...",
      verdict: {
        ready: "You look ready",
        missing: "Fix this before you go in",
        unsure: "Milpa could not see everything",
      },
      status: { on: "On", missing: "Missing", unsure: "Can't see" },
      noPerson: "Milpa could not find a person in that photo. Stand back and try again.",
      failed: "Could not check the photo. Check your connection and try again.",
      again: "Check again",
    },
    pay: {
      title: "Pay check",
      intro: "Take a photo of your pay stub. Milpa reads it and checks it against California pay rules.",
      take: "Take a photo of my pay stub",
      choose: "Choose a photo",
      reading: "Reading your pay stub...",
      period: "Pay period",
      hours: "Hours",
      rate: "Rate",
      gross: "Before deductions",
      net: "Take home",
      verdict: {
        ok: "This looks right",
        ask: "Ask about this",
        unclear: "Hard to read",
      },
      status: { ok: "Looks right", ask: "Ask about it", missing: "Not on the stub" },
      labor: "Call the Labor Commissioner",
      notStub: "That does not look like a pay stub. Try a clearer photo.",
      failed: "Could not read the photo. Check your connection and try again.",
      again: "Check another",
      privacy: "The photo is not saved anywhere.",
    },
    interpret: {
      title: "Interpreter",
      intro: "Talk with a supervisor, nurse or clerk. Each of you taps your side and speaks, and Milpa says it out loud in the other language.",
      me: "Me",
      them: "Them",
      other: "They speak",
      listening: "Listening... tap to stop",
      translating: "Translating...",
      tapToStop: "Tap to stop",
      empty: "Tap your side and talk. Hand the phone over when it is their turn.",
      failed: "That did not go through. Try again.",
      blocked: "Milpa needs your microphone. Allow it in your browser settings.",
      clear: "Start over",
      replay: "Say it again",
      unsupported: "This browser cannot record sound. Try Chrome or Safari.",
    },
  },
  es: {
    food: {
      title: "Revisar comida",
      intro: "Tome una foto de la etiqueta, la calcomanía de la fruta o la fruta misma. Milpa revisa sus alergias y le dice lo que dice la etiqueta sobre pesticidas.",
      allergiesTitle: "Mis alergias",
      allergyNames: ["Leche", "Huevo", "Pescado", "Mariscos", "Nueces", "Cacahuate", "Trigo", "Soya", "Ajonjolí"],
      take: "Tomar foto de la comida",
      choose: "Elegir una foto",
      checking: "Leyendo la etiqueta...",
      verdict: { safe: "Se ve segura para usted", caution: "Revise antes de comer", avoid: "No coma esto" },
      allergens: "Alérgenos",
      contains: "Contiene",
      may: "Puede contener",
      noAllergens: "La etiqueta no muestra alérgenos principales.",
      yours: "Tiene su alergia",
      organic: { yes: "Orgánico certificado", no: "No es orgánico", unknown: "No dice si es orgánico" },
      pesticides: "Pesticidas",
      flags: "Bueno saber",
      notFood: "Eso no parece comida ni una etiqueta. Intente con una foto más cerca.",
      failed: "No se pudo revisar la foto. Revise su conexión e intente de nuevo.",
      again: "Revisar otra",
    },
    gear: {
      title: "Revisar equipo",
      intro: "Tómese una foto antes de entrar. Milpa la compara con el equipo que pide la etiqueta.",
      forProduct: "Revisando equipo para",
      noLabel: "Todavía no escaneó una etiqueta, así que Milpa revisa el equipo de siempre.",
      defaultGear: ["Camisa de manga larga", "Pantalón largo", "Guantes resistentes a químicos", "Zapatos y calcetines"],
      take: "Tomarme una foto",
      hint: "Párese lejos para que se vean sus brazos, manos y pies.",
      checking: "Revisando su equipo...",
      verdict: {
        ready: "Se ve listo",
        missing: "Arregle esto antes de entrar",
        unsure: "Milpa no pudo ver todo",
      },
      status: { on: "Puesto", missing: "Falta", unsure: "No se ve" },
      noPerson: "Milpa no encontró a una persona en la foto. Párese más lejos e intente de nuevo.",
      failed: "No se pudo revisar la foto. Revise su conexión e intente de nuevo.",
      again: "Revisar otra vez",
    },
    pay: {
      title: "Revisar mi pago",
      intro: "Tome una foto de su talón de pago. Milpa lo lee y lo compara con las reglas de pago de California.",
      take: "Tomar foto de mi talón de pago",
      choose: "Elegir una foto",
      reading: "Leyendo su talón de pago...",
      period: "Periodo de pago",
      hours: "Horas",
      rate: "Pago por hora",
      gross: "Antes de descuentos",
      net: "Lo que recibe",
      verdict: {
        ok: "Se ve bien",
        ask: "Pregunte sobre esto",
        unclear: "Difícil de leer",
      },
      status: { ok: "Se ve bien", ask: "Pregunte", missing: "No aparece" },
      labor: "Llamar al Comisionado Laboral",
      notStub: "Eso no parece un talón de pago. Intente con una foto más clara.",
      failed: "No se pudo leer la foto. Revise su conexión e intente de nuevo.",
      again: "Revisar otro",
      privacy: "La foto no se guarda en ningún lugar.",
    },
    interpret: {
      title: "Intérprete",
      intro: "Hable con un mayordomo, enfermera o empleado. Cada quien toca su lado y habla, y Milpa lo dice en voz alta en el otro idioma.",
      me: "Yo",
      them: "Ellos",
      other: "Ellos hablan",
      listening: "Escuchando... toque para parar",
      translating: "Traduciendo...",
      tapToStop: "Toque para parar",
      empty: "Toque su lado y hable. Pase el teléfono cuando sea su turno.",
      failed: "No se pudo enviar. Intente de nuevo.",
      blocked: "Milpa necesita su micrófono. Permítalo en la configuración del navegador.",
      clear: "Empezar de nuevo",
      replay: "Decirlo otra vez",
      unsupported: "Este navegador no puede grabar sonido. Pruebe Chrome o Safari.",
    },
  },
  pa: {
    food: {
      title: "ਖਾਣੇ ਦੀ ਜਾਂਚ",
      intro: "ਖਾਣੇ ਦੇ ਲੇਬਲ, ਫਲ ਦੇ ਸਟਿੱਕਰ ਜਾਂ ਫਲ ਦੀ ਫ਼ੋਟੋ ਲਓ। Milpa ਤੁਹਾਡੀਆਂ ਐਲਰਜੀਆਂ ਜਾਂਚਦਾ ਹੈ ਅਤੇ ਦੱਸਦਾ ਹੈ ਕਿ ਲੇਬਲ ਕੀਟਨਾਸ਼ਕਾਂ ਬਾਰੇ ਕੀ ਕਹਿੰਦਾ ਹੈ।",
      allergiesTitle: "ਮੇਰੀਆਂ ਐਲਰਜੀਆਂ",
      allergyNames: ["ਦੁੱਧ", "ਅੰਡੇ", "ਮੱਛੀ", "ਸ਼ੈੱਲਫ਼ਿਸ਼", "ਸੁੱਕੇ ਮੇਵੇ", "ਮੂੰਗਫਲੀ", "ਕਣਕ", "ਸੋਇਆ", "ਤਿਲ"],
      take: "ਖਾਣੇ ਦੀ ਫ਼ੋਟੋ ਲਓ",
      choose: "ਫ਼ੋਟੋ ਚੁਣੋ",
      checking: "ਲੇਬਲ ਪੜ੍ਹ ਰਿਹਾ ਹੈ...",
      verdict: { safe: "ਤੁਹਾਡੇ ਲਈ ਠੀਕ ਲੱਗਦਾ ਹੈ", caution: "ਖਾਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚੋ", avoid: "ਇਹ ਨਾ ਖਾਓ" },
      allergens: "ਐਲਰਜੀ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ",
      contains: "ਇਸ ਵਿੱਚ ਹੈ",
      may: "ਹੋ ਸਕਦਾ ਹੈ",
      noAllergens: "ਲੇਬਲ 'ਤੇ ਕੋਈ ਮੁੱਖ ਐਲਰਜੀ ਵਾਲੀ ਚੀਜ਼ ਨਹੀਂ।",
      yours: "ਤੁਹਾਡੀ ਐਲਰਜੀ ਹੈ",
      organic: { yes: "ਪ੍ਰਮਾਣਿਤ ਆਰਗੈਨਿਕ", no: "ਆਰਗੈਨਿਕ ਨਹੀਂ", unknown: "ਆਰਗੈਨਿਕ ਨਹੀਂ ਦੱਸਿਆ" },
      pesticides: "ਕੀਟਨਾਸ਼ਕ",
      flags: "ਜਾਣਨ ਯੋਗ",
      notFood: "ਇਹ ਖਾਣਾ ਜਾਂ ਖਾਣੇ ਦਾ ਲੇਬਲ ਨਹੀਂ ਲੱਗਦਾ। ਨੇੜੇ ਤੋਂ ਫ਼ੋਟੋ ਲਓ।",
      failed: "ਫ਼ੋਟੋ ਜਾਂਚੀ ਨਹੀਂ ਜਾ ਸਕੀ। ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      again: "ਹੋਰ ਜਾਂਚੋ",
    },
    gear: {
      title: "ਸਾਮਾਨ ਦੀ ਜਾਂਚ",
      intro: "ਅੰਦਰ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੀ ਫ਼ੋਟੋ ਲਓ। Milpa ਇਸਨੂੰ ਲੇਬਲ ਵਿੱਚ ਮੰਗੇ ਸਾਮਾਨ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ।",
      forProduct: "ਇਸ ਲਈ ਸਾਮਾਨ ਜਾਂਚ ਰਿਹਾ ਹੈ",
      noLabel: "ਅਜੇ ਕੋਈ ਲੇਬਲ ਸਕੈਨ ਨਹੀਂ ਕੀਤਾ, ਇਸ ਲਈ Milpa ਆਮ ਸਾਮਾਨ ਜਾਂਚਦਾ ਹੈ।",
      defaultGear: ["ਲੰਬੀਆਂ ਬਾਹਾਂ ਵਾਲੀ ਕਮੀਜ਼", "ਲੰਬੀ ਪੈਂਟ", "ਰਸਾਇਣ-ਰੋਧਕ ਦਸਤਾਨੇ", "ਜੁੱਤੇ ਅਤੇ ਜੁਰਾਬਾਂ"],
      take: "ਮੇਰੀ ਫ਼ੋਟੋ ਲਓ",
      hint: "ਪਿੱਛੇ ਖੜ੍ਹੇ ਹੋਵੋ ਤਾਂ ਜੋ ਬਾਹਾਂ, ਹੱਥ ਅਤੇ ਪੈਰ ਦਿਖਣ।",
      checking: "ਤੁਹਾਡਾ ਸਾਮਾਨ ਦੇਖ ਰਿਹਾ ਹੈ...",
      verdict: {
        ready: "ਤੁਸੀਂ ਤਿਆਰ ਲੱਗਦੇ ਹੋ",
        missing: "ਅੰਦਰ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਇਹ ਠੀਕ ਕਰੋ",
        unsure: "Milpa ਸਭ ਕੁਝ ਨਹੀਂ ਦੇਖ ਸਕਿਆ",
      },
      status: { on: "ਪਹਿਨਿਆ", missing: "ਨਹੀਂ ਹੈ", unsure: "ਨਹੀਂ ਦਿਖਦਾ" },
      noPerson: "Milpa ਨੂੰ ਫ਼ੋਟੋ ਵਿੱਚ ਕੋਈ ਵਿਅਕਤੀ ਨਹੀਂ ਮਿਲਿਆ। ਪਿੱਛੇ ਖੜ੍ਹੇ ਹੋ ਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      failed: "ਫ਼ੋਟੋ ਜਾਂਚੀ ਨਹੀਂ ਜਾ ਸਕੀ। ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      again: "ਦੁਬਾਰਾ ਜਾਂਚੋ",
    },
    pay: {
      title: "ਤਨਖਾਹ ਜਾਂਚ",
      intro: "ਆਪਣੀ ਤਨਖਾਹ ਦੀ ਪਰਚੀ ਦੀ ਫ਼ੋਟੋ ਲਓ। Milpa ਇਸਨੂੰ ਪੜ੍ਹ ਕੇ ਕੈਲੀਫ਼ੋਰਨੀਆ ਦੇ ਤਨਖਾਹ ਨਿਯਮਾਂ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ।",
      take: "ਮੇਰੀ ਤਨਖਾਹ ਪਰਚੀ ਦੀ ਫ਼ੋਟੋ ਲਓ",
      choose: "ਫ਼ੋਟੋ ਚੁਣੋ",
      reading: "ਤੁਹਾਡੀ ਤਨਖਾਹ ਪਰਚੀ ਪੜ੍ਹ ਰਿਹਾ ਹੈ...",
      period: "ਤਨਖਾਹ ਦਾ ਸਮਾਂ",
      hours: "ਘੰਟੇ",
      rate: "ਪ੍ਰਤੀ ਘੰਟਾ",
      gross: "ਕਟੌਤੀ ਤੋਂ ਪਹਿਲਾਂ",
      net: "ਹੱਥ ਵਿੱਚ",
      verdict: {
        ok: "ਇਹ ਠੀਕ ਲੱਗਦਾ ਹੈ",
        ask: "ਇਸ ਬਾਰੇ ਪੁੱਛੋ",
        unclear: "ਪੜ੍ਹਨਾ ਔਖਾ ਹੈ",
      },
      status: { ok: "ਠੀਕ ਹੈ", ask: "ਪੁੱਛੋ", missing: "ਪਰਚੀ 'ਤੇ ਨਹੀਂ" },
      labor: "ਲੇਬਰ ਕਮਿਸ਼ਨਰ ਨੂੰ ਫ਼ੋਨ ਕਰੋ",
      notStub: "ਇਹ ਤਨਖਾਹ ਪਰਚੀ ਨਹੀਂ ਲੱਗਦੀ। ਸਾਫ਼ ਫ਼ੋਟੋ ਨਾਲ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      failed: "ਫ਼ੋਟੋ ਪੜ੍ਹੀ ਨਹੀਂ ਜਾ ਸਕੀ। ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      again: "ਹੋਰ ਜਾਂਚੋ",
      privacy: "ਫ਼ੋਟੋ ਕਿਤੇ ਵੀ ਸੰਭਾਲੀ ਨਹੀਂ ਜਾਂਦੀ।",
    },
    interpret: {
      title: "ਦੁਭਾਸ਼ੀਆ",
      intro: "ਸੁਪਰਵਾਈਜ਼ਰ, ਨਰਸ ਜਾਂ ਕਲਰਕ ਨਾਲ ਗੱਲ ਕਰੋ। ਹਰ ਕੋਈ ਆਪਣਾ ਪਾਸਾ ਛੂਹ ਕੇ ਬੋਲਦਾ ਹੈ, ਅਤੇ Milpa ਦੂਜੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲ ਕੇ ਦੱਸਦਾ ਹੈ।",
      me: "ਮੈਂ",
      them: "ਉਹ",
      other: "ਉਹ ਬੋਲਦੇ ਹਨ",
      listening: "ਸੁਣ ਰਿਹਾ ਹੈ... ਰੋਕਣ ਲਈ ਛੂਹੋ",
      translating: "ਅਨੁਵਾਦ ਕਰ ਰਿਹਾ ਹੈ...",
      tapToStop: "ਰੋਕਣ ਲਈ ਛੂਹੋ",
      empty: "ਆਪਣਾ ਪਾਸਾ ਛੂਹੋ ਅਤੇ ਬੋਲੋ। ਉਹਨਾਂ ਦੀ ਵਾਰੀ ਆਉਣ 'ਤੇ ਫ਼ੋਨ ਦੇ ਦਿਓ।",
      failed: "ਇਹ ਨਹੀਂ ਭੇਜਿਆ ਗਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      blocked: "Milpa ਨੂੰ ਤੁਹਾਡੇ ਮਾਈਕ ਦੀ ਲੋੜ ਹੈ। ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਇਜਾਜ਼ਤ ਦਿਓ।",
      clear: "ਨਵੇਂ ਸਿਰੇ ਤੋਂ",
      replay: "ਦੁਬਾਰਾ ਬੋਲੋ",
      unsupported: "ਇਹ ਬ੍ਰਾਊਜ਼ਰ ਆਵਾਜ਼ ਰਿਕਾਰਡ ਨਹੀਂ ਕਰ ਸਕਦਾ। Chrome ਜਾਂ Safari ਵਰਤੋ।",
    },
  },
};
