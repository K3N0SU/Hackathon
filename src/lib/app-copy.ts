import type { CoreLanguage } from "@/lib/scan";

type ToolCopy = { title: string; body: string };

export type AppCopy = {
  tabs: { scan: string; ask: string; tools: string; saved: string };
  language: string;
  chooseLanguage: string;
  back: string;
  toolsTitle: string;
  toolsIntro: string;
  tools: {
    heat: ToolCopy;
    symptoms: ToolCopy;
    exposed: ToolCopy;
    paper: ToolCopy;
    report: ToolCopy;
    brief: ToolCopy;
    map: ToolCopy;
    install: ToolCopy;
  };
  ask: {
    title: string;
    about: string;
    general: string;
    placeholder: string;
    send: string;
    listening: string;
    thinking: string;
    failed: string;
    starters: string[];
    clear: string;
    listen: string;
    call911: string;
  };
  result: {
    askAbout: string;
    supervisor: string;
    share: string;
    shared: string;
    copied: string;
    shareFailed: string;
    howRead: string;
    confidence: { high: string; medium: string; low: string };
    confidenceNote: { high: string; medium: string; low: string };
    fields: Record<string, string>;
    others: string;
  };
  supervisorCard: {
    close: string;
    intro: string;
  };
  coach: {
    dark: string;
    bright: string;
    blurry: string;
    useAnyway: string;
  };
  symptoms: {
    title: string;
    intro: string;
    list: string[];
    note: string;
    check: string;
    checking: string;
    failed: string;
    again: string;
    callPoison: string;
  };
  paper: {
    title: string;
    intro: string;
    take: string;
    choose: string;
    reading: string;
    failed: string;
    unreadable: string;
    actions: string;
    dates: string;
    another: string;
  };
  report: {
    title: string;
    intro: string;
    placeholder: string;
    when: string;
    write: string;
    writing: string;
    failed: string;
    english: string;
    yourLanguage: string;
    missing: string;
    copy: string;
    copied: string;
    share: string;
    edit: string;
  };
  brief: {
    title: string;
    intro: string;
    make: string;
    making: string;
    failed: string;
    listen: string;
    again: string;
  };
  map: {
    title: string;
    intro: string;
    empty: string;
    loading: string;
    failed: string;
    noPlace: string;
  };
  alarms: {
    allow: string;
    on: string;
    safeTitle: string;
    safeBody: string;
    waterTitle: string;
    waterBody: string;
    waterOn: string;
    waterOff: string;
  };
  install: {
    title: string;
    body: string;
    button: string;
    ios: string;
    done: string;
  };
};

export const appCopy: Record<CoreLanguage, AppCopy> = {
  en: {
    tabs: { scan: "Scan", ask: "Ask", tools: "Tools", saved: "Saved" },
    language: "Language",
    chooseLanguage: "Choose your language",
    back: "Back",
    toolsTitle: "Tools",
    toolsIntro: "Everything Furrow can do. Tap one.",
    tools: {
      heat: { title: "Heat check", body: "Today's hottest hour and your rights" },
      symptoms: { title: "I feel sick", body: "Find out who to call" },
      exposed: { title: "Got sprayed", body: "911, rinse timer, doctor card" },
      paper: { title: "Read a paper", body: "Notices, pay stubs, forms" },
      report: { title: "Report a problem", body: "Say it, get an English report" },
      brief: { title: "Today's plan", body: "Your blocks and heat, out loud" },
      map: { title: "Spray map", body: "Where you scanned labels" },
      install: { title: "Add to phone", body: "Open Furrow like an app" },
    },
    ask: {
      title: "Ask Furrow",
      about: "About",
      general: "Ask about pesticides, heat or your rights at work.",
      placeholder: "Type or tap the mic",
      send: "Send",
      listening: "Listening...",
      thinking: "Thinking...",
      failed: "Could not get an answer. Check your connection and try again.",
      starters: [
        "When can I go back in?",
        "What do I need to wear?",
        "What if it gets on my skin?",
        "Can my boss make me go in early?",
      ],
      clear: "New chat",
      listen: "Listen",
      call911: "Call 911",
    },
    result: {
      askAbout: "Ask about this label",
      supervisor: "Show my supervisor",
      share: "Share with crew",
      shared: "Link ready to share",
      copied: "Link copied",
      shareFailed: "Could not make a link. Try again.",
      howRead: "How Furrow read this",
      confidence: { high: "Clear read", medium: "Check this", low: "Not sure" },
      confidenceNote: {
        high: "The label was sharp and every answer below was printed on it.",
        medium: "Some words were small or partly hidden. Check the label or ask.",
        low: "Furrow is not sure about part of this. Ask your supervisor.",
      },
      fields: {
        product: "Product",
        signal: "Signal word",
        reentry: "Re-entry",
        gear: "What to wear",
        firstAid: "First aid",
      },
      others: "Also in this photo",
    },
    supervisorCard: {
      close: "Close",
      intro: "Show this screen to your supervisor.",
    },
    coach: {
      dark: "Too dark. Move to the light or turn on more light.",
      bright: "Too bright. Turn so the sun is not on the label.",
      blurry: "A little blurry. Hold the phone still and get closer.",
      useAnyway: "Use it anyway",
    },
    symptoms: {
      title: "How do you feel?",
      intro: "Tap everything you feel right now. Furrow tells you who to call.",
      list: [
        "Headache",
        "Dizzy",
        "Feel like throwing up",
        "Throwing up",
        "Burning eyes",
        "Rash or burning skin",
        "Sweating a lot",
        "Muscle twitching",
        "Very tired",
        "Cramps",
        "Hard to breathe",
        "Chest pain",
        "Confused",
        "Passed out",
      ],
      note: "Anything else? Say it in your words.",
      check: "Tell me what to do",
      checking: "Checking...",
      failed: "Could not check. If you feel very sick, call 911.",
      again: "Start over",
      callPoison: "Poison Control",
    },
    paper: {
      title: "Read a paper",
      intro: "Take a photo of any paper from work. Furrow explains it in your language.",
      take: "Take a photo",
      choose: "Choose a photo",
      reading: "Reading the paper...",
      failed: "Could not read it. Check your connection and try again.",
      unreadable: "We could not read this. Get closer, hold still and try again.",
      actions: "What you need to do",
      dates: "Dates and amounts",
      another: "Read another paper",
    },
    report: {
      title: "Report a problem",
      intro: "Say what happened in your own words. Furrow writes a clear report in English you can give to the grower or the county.",
      placeholder: "For example: They sprayed the next field while we were picking and the wind blew it on us.",
      when: "When did it happen?",
      write: "Write my report",
      writing: "Writing...",
      failed: "Could not write the report. Try again.",
      english: "Report in English",
      yourLanguage: "What it says",
      missing: "Add these to make it stronger",
      copy: "Copy",
      copied: "Copied",
      share: "Send",
      edit: "Change my story",
    },
    brief: {
      title: "Today's plan",
      intro: "Furrow looks at your clocks and today's heat and tells you the plan out loud.",
      make: "Tell me today's plan",
      making: "Making your plan...",
      failed: "Could not make the plan. Check your connection.",
      listen: "Listen",
      again: "Update",
    },
    map: {
      title: "Spray map",
      intro: "Every label you scan is pinned where you were standing.",
      empty: "No pinned scans yet. Scan a label with location on.",
      loading: "Loading your scans...",
      failed: "Could not load your scans.",
      noPlace: "These scans have no location.",
    },
    alarms: {
      allow: "Buzz me when it is safe",
      on: "Alarm is on",
      safeTitle: "Safe to go back in",
      safeBody: "The re-entry time is over for",
      waterTitle: "Drink water",
      waterBody: "It is hot. Drink about one quart every hour.",
      waterOn: "Remind me to drink every hour",
      waterOff: "Water reminders on",
    },
    install: {
      title: "Add Furrow to your phone",
      body: "It opens like an app, and your saved scans, clocks and the exposure steps work with no signal.",
      button: "Add to home screen",
      ios: "On iPhone: tap Share, then Add to Home Screen.",
      done: "Furrow is on your home screen.",
    },
  },
  es: {
    tabs: { scan: "Escanear", ask: "Preguntar", tools: "Herramientas", saved: "Guardado" },
    language: "Idioma",
    chooseLanguage: "Elija su idioma",
    back: "Atrás",
    toolsTitle: "Herramientas",
    toolsIntro: "Todo lo que Furrow puede hacer. Toque una.",
    tools: {
      heat: { title: "Calor de hoy", body: "La hora más caliente y sus derechos" },
      symptoms: { title: "Me siento mal", body: "Sepa a quién llamar" },
      exposed: { title: "Me cayó pesticida", body: "911, enjuague, tarjeta para el médico" },
      paper: { title: "Leer un papel", body: "Avisos, talones de pago, formas" },
      report: { title: "Reportar un problema", body: "Dígalo y reciba un reporte en inglés" },
      brief: { title: "Plan de hoy", body: "Sus campos y el calor, en voz alta" },
      map: { title: "Mapa de rociado", body: "Dónde escaneó etiquetas" },
      install: { title: "Poner en el teléfono", body: "Abra Furrow como una app" },
    },
    ask: {
      title: "Pregúntele a Furrow",
      about: "Sobre",
      general: "Pregunte sobre pesticidas, el calor o sus derechos en el trabajo.",
      placeholder: "Escriba o toque el micrófono",
      send: "Enviar",
      listening: "Escuchando...",
      thinking: "Pensando...",
      failed: "No se pudo responder. Revise su conexión e intente de nuevo.",
      starters: [
        "¿Cuándo puedo volver a entrar?",
        "¿Qué tengo que usar?",
        "¿Y si me cae en la piel?",
        "¿Mi jefe me puede mandar antes?",
      ],
      clear: "Nueva conversación",
      listen: "Escuchar",
      call911: "Llamar al 911",
    },
    result: {
      askAbout: "Preguntar sobre esta etiqueta",
      supervisor: "Mostrar a mi supervisor",
      share: "Compartir con mi cuadrilla",
      shared: "Enlace listo para compartir",
      copied: "Enlace copiado",
      shareFailed: "No se pudo crear el enlace. Intente de nuevo.",
      howRead: "Cómo lo leyó Furrow",
      confidence: { high: "Lectura clara", medium: "Revise esto", low: "No es seguro" },
      confidenceNote: {
        high: "La etiqueta se veía clara y cada respuesta estaba impresa en ella.",
        medium: "Algunas palabras eran pequeñas o estaban tapadas. Revise la etiqueta o pregunte.",
        low: "Furrow no está seguro de una parte. Pregunte a su supervisor.",
      },
      fields: {
        product: "Producto",
        signal: "Palabra de aviso",
        reentry: "Reingreso",
        gear: "Qué usar",
        firstAid: "Primeros auxilios",
      },
      others: "También en esta foto",
    },
    supervisorCard: {
      close: "Cerrar",
      intro: "Muestre esta pantalla a su supervisor.",
    },
    coach: {
      dark: "Muy oscura. Busque más luz.",
      bright: "Mucha luz. Voltéese para que el sol no pegue en la etiqueta.",
      blurry: "Un poco borrosa. No mueva el teléfono y acérquese.",
      useAnyway: "Usarla así",
    },
    symptoms: {
      title: "¿Cómo se siente?",
      intro: "Toque todo lo que siente ahora. Furrow le dice a quién llamar.",
      list: [
        "Dolor de cabeza",
        "Mareo",
        "Ganas de vomitar",
        "Vómito",
        "Ardor en los ojos",
        "Ronchas o ardor en la piel",
        "Sudor fuerte",
        "Temblor en los músculos",
        "Mucho cansancio",
        "Calambres",
        "Me cuesta respirar",
        "Dolor de pecho",
        "Confusión",
        "Me desmayé",
      ],
      note: "¿Algo más? Dígalo con sus palabras.",
      check: "Dígame qué hacer",
      checking: "Revisando...",
      failed: "No se pudo revisar. Si se siente muy mal, llame al 911.",
      again: "Empezar de nuevo",
      callPoison: "Control de Envenenamientos",
    },
    paper: {
      title: "Leer un papel",
      intro: "Tome una foto de cualquier papel del trabajo. Furrow se lo explica en su idioma.",
      take: "Tomar foto",
      choose: "Elegir foto",
      reading: "Leyendo el papel...",
      failed: "No se pudo leer. Revise su conexión e intente de nuevo.",
      unreadable: "No pudimos leerlo. Acérquese, no se mueva e intente de nuevo.",
      actions: "Lo que tiene que hacer",
      dates: "Fechas y cantidades",
      another: "Leer otro papel",
    },
    report: {
      title: "Reportar un problema",
      intro: "Diga lo que pasó con sus palabras. Furrow escribe un reporte claro en inglés para el ranchero o el condado.",
      placeholder: "Por ejemplo: Rociaron el campo de al lado mientras piscábamos y el viento nos lo echó encima.",
      when: "¿Cuándo pasó?",
      write: "Escribir mi reporte",
      writing: "Escribiendo...",
      failed: "No se pudo escribir el reporte. Intente de nuevo.",
      english: "Reporte en inglés",
      yourLanguage: "Lo que dice",
      missing: "Agregue esto para que sea más fuerte",
      copy: "Copiar",
      copied: "Copiado",
      share: "Enviar",
      edit: "Cambiar lo que dije",
    },
    brief: {
      title: "Plan de hoy",
      intro: "Furrow revisa sus relojes y el calor de hoy y le dice el plan en voz alta.",
      make: "Dígame el plan de hoy",
      making: "Preparando su plan...",
      failed: "No se pudo hacer el plan. Revise su conexión.",
      listen: "Escuchar",
      again: "Actualizar",
    },
    map: {
      title: "Mapa de rociado",
      intro: "Cada etiqueta que escanea queda marcada donde estaba parado.",
      empty: "Todavía no hay escaneos marcados. Escanee con la ubicación prendida.",
      loading: "Cargando sus escaneos...",
      failed: "No se pudieron cargar sus escaneos.",
      noPlace: "Estos escaneos no tienen ubicación.",
    },
    alarms: {
      allow: "Avísame cuando sea seguro",
      on: "Alarma prendida",
      safeTitle: "Ya es seguro entrar",
      safeBody: "Terminó el tiempo de reingreso de",
      waterTitle: "Tome agua",
      waterBody: "Hace calor. Tome como un cuarto de galón cada hora.",
      waterOn: "Recuérdame tomar agua cada hora",
      waterOff: "Recordatorios de agua prendidos",
    },
    install: {
      title: "Ponga Furrow en su teléfono",
      body: "Se abre como una app, y sus escaneos, relojes y los pasos de exposición funcionan sin señal.",
      button: "Agregar a la pantalla",
      ios: "En iPhone: toque Compartir y luego Agregar a inicio.",
      done: "Furrow está en su pantalla de inicio.",
    },
  },
  pa: {
    tabs: { scan: "ਸਕੈਨ", ask: "ਪੁੱਛੋ", tools: "ਟੂਲ", saved: "ਸੰਭਾਲੇ" },
    language: "ਭਾਸ਼ਾ",
    chooseLanguage: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    back: "ਪਿੱਛੇ",
    toolsTitle: "ਟੂਲ",
    toolsIntro: "Furrow ਜੋ ਕੁਝ ਕਰ ਸਕਦਾ ਹੈ। ਇੱਕ ਨੂੰ ਛੂਹੋ।",
    tools: {
      heat: { title: "ਗਰਮੀ ਦੀ ਜਾਂਚ", body: "ਅੱਜ ਦਾ ਸਭ ਤੋਂ ਗਰਮ ਘੰਟਾ ਅਤੇ ਤੁਹਾਡੇ ਹੱਕ" },
      symptoms: { title: "ਮੈਂ ਬਿਮਾਰ ਹਾਂ", body: "ਪਤਾ ਕਰੋ ਕਿਸਨੂੰ ਫ਼ੋਨ ਕਰਨਾ ਹੈ" },
      exposed: { title: "ਦਵਾਈ ਪੈ ਗਈ", body: "911, ਧੋਣ ਦਾ ਟਾਈਮਰ, ਡਾਕਟਰ ਕਾਰਡ" },
      paper: { title: "ਕਾਗਜ਼ ਪੜ੍ਹੋ", body: "ਨੋਟਿਸ, ਤਨਖਾਹ ਦੀ ਪਰਚੀ, ਫਾਰਮ" },
      report: { title: "ਸਮੱਸਿਆ ਦੱਸੋ", body: "ਬੋਲੋ, ਅੰਗਰੇਜ਼ੀ ਰਿਪੋਰਟ ਲਓ" },
      brief: { title: "ਅੱਜ ਦੀ ਯੋਜਨਾ", body: "ਤੁਹਾਡੇ ਖੇਤ ਅਤੇ ਗਰਮੀ, ਬੋਲ ਕੇ" },
      map: { title: "ਛਿੜਕਾਅ ਨਕਸ਼ਾ", body: "ਜਿੱਥੇ ਤੁਸੀਂ ਲੇਬਲ ਸਕੈਨ ਕੀਤੇ" },
      install: { title: "ਫ਼ੋਨ ਵਿੱਚ ਪਾਓ", body: "Furrow ਨੂੰ ਐਪ ਵਾਂਗ ਖੋਲ੍ਹੋ" },
    },
    ask: {
      title: "Furrow ਤੋਂ ਪੁੱਛੋ",
      about: "ਬਾਰੇ",
      general: "ਕੀਟਨਾਸ਼ਕ, ਗਰਮੀ ਜਾਂ ਕੰਮ 'ਤੇ ਆਪਣੇ ਹੱਕਾਂ ਬਾਰੇ ਪੁੱਛੋ।",
      placeholder: "ਲਿਖੋ ਜਾਂ ਮਾਈਕ ਛੂਹੋ",
      send: "ਭੇਜੋ",
      listening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
      thinking: "ਸੋਚ ਰਿਹਾ ਹੈ...",
      failed: "ਜਵਾਬ ਨਹੀਂ ਮਿਲਿਆ। ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      starters: [
        "ਮੈਂ ਵਾਪਸ ਕਦੋਂ ਜਾ ਸਕਦਾ ਹਾਂ?",
        "ਮੈਨੂੰ ਕੀ ਪਹਿਨਣਾ ਚਾਹੀਦਾ ਹੈ?",
        "ਜੇ ਚਮੜੀ 'ਤੇ ਲੱਗ ਜਾਵੇ ਤਾਂ?",
        "ਕੀ ਮਾਲਕ ਮੈਨੂੰ ਪਹਿਲਾਂ ਭੇਜ ਸਕਦਾ ਹੈ?",
      ],
      clear: "ਨਵੀਂ ਗੱਲਬਾਤ",
      listen: "ਸੁਣੋ",
      call911: "911 ਨੂੰ ਕਾਲ ਕਰੋ",
    },
    result: {
      askAbout: "ਇਸ ਲੇਬਲ ਬਾਰੇ ਪੁੱਛੋ",
      supervisor: "ਸੁਪਰਵਾਈਜ਼ਰ ਨੂੰ ਦਿਖਾਓ",
      share: "ਸਾਥੀਆਂ ਨਾਲ ਸਾਂਝਾ ਕਰੋ",
      shared: "ਲਿੰਕ ਤਿਆਰ ਹੈ",
      copied: "ਲਿੰਕ ਕਾਪੀ ਹੋ ਗਿਆ",
      shareFailed: "ਲਿੰਕ ਨਹੀਂ ਬਣਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      howRead: "Furrow ਨੇ ਇਹ ਕਿਵੇਂ ਪੜ੍ਹਿਆ",
      confidence: { high: "ਸਾਫ਼ ਪੜ੍ਹਿਆ", medium: "ਇਸਨੂੰ ਜਾਂਚੋ", low: "ਪੱਕਾ ਨਹੀਂ" },
      confidenceNote: {
        high: "ਲੇਬਲ ਸਾਫ਼ ਸੀ ਅਤੇ ਹੇਠਾਂ ਹਰ ਜਵਾਬ ਉਸ ਉੱਤੇ ਛਪਿਆ ਸੀ।",
        medium: "ਕੁਝ ਸ਼ਬਦ ਛੋਟੇ ਜਾਂ ਲੁਕੇ ਹੋਏ ਸਨ। ਲੇਬਲ ਜਾਂਚੋ ਜਾਂ ਪੁੱਛੋ।",
        low: "Furrow ਨੂੰ ਇੱਕ ਹਿੱਸੇ ਬਾਰੇ ਪੱਕਾ ਨਹੀਂ। ਸੁਪਰਵਾਈਜ਼ਰ ਤੋਂ ਪੁੱਛੋ।",
      },
      fields: {
        product: "ਉਤਪਾਦ",
        signal: "ਚੇਤਾਵਨੀ ਸ਼ਬਦ",
        reentry: "ਵਾਪਸ ਜਾਣਾ",
        gear: "ਕੀ ਪਹਿਨਣਾ ਹੈ",
        firstAid: "ਮੁੱਢਲੀ ਸਹਾਇਤਾ",
      },
      others: "ਇਸ ਫੋਟੋ ਵਿੱਚ ਹੋਰ ਵੀ",
    },
    supervisorCard: {
      close: "ਬੰਦ ਕਰੋ",
      intro: "ਇਹ ਸਕਰੀਨ ਆਪਣੇ ਸੁਪਰਵਾਈਜ਼ਰ ਨੂੰ ਦਿਖਾਓ।",
    },
    coach: {
      dark: "ਬਹੁਤ ਹਨੇਰਾ ਹੈ। ਰੌਸ਼ਨੀ ਵਿੱਚ ਜਾਓ।",
      bright: "ਬਹੁਤ ਚਮਕ ਹੈ। ਮੁੜੋ ਤਾਂ ਕਿ ਧੁੱਪ ਲੇਬਲ 'ਤੇ ਨਾ ਪਵੇ।",
      blurry: "ਥੋੜ੍ਹਾ ਧੁੰਦਲਾ ਹੈ। ਫ਼ੋਨ ਸਥਿਰ ਰੱਖੋ ਅਤੇ ਨੇੜੇ ਜਾਓ।",
      useAnyway: "ਫਿਰ ਵੀ ਵਰਤੋ",
    },
    symptoms: {
      title: "ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦੇ ਹੋ?",
      intro: "ਜੋ ਕੁਝ ਹੁਣ ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ ਸਭ ਨੂੰ ਛੂਹੋ। Furrow ਦੱਸੇਗਾ ਕਿਸਨੂੰ ਫ਼ੋਨ ਕਰਨਾ ਹੈ।",
      list: [
        "ਸਿਰ ਦਰਦ",
        "ਚੱਕਰ",
        "ਉਲਟੀ ਵਰਗਾ ਲੱਗਣਾ",
        "ਉਲਟੀ",
        "ਅੱਖਾਂ ਵਿੱਚ ਜਲਣ",
        "ਧੱਫੜ ਜਾਂ ਚਮੜੀ ਵਿੱਚ ਜਲਣ",
        "ਬਹੁਤ ਪਸੀਨਾ",
        "ਮਾਸਪੇਸ਼ੀਆਂ ਫੜਕਣਾ",
        "ਬਹੁਤ ਥਕਾਵਟ",
        "ਕੜੱਲ",
        "ਸਾਹ ਲੈਣ ਵਿੱਚ ਔਖ",
        "ਛਾਤੀ ਵਿੱਚ ਦਰਦ",
        "ਉਲਝਣ",
        "ਬੇਹੋਸ਼ ਹੋ ਗਿਆ",
      ],
      note: "ਹੋਰ ਕੁਝ? ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਦੱਸੋ।",
      check: "ਦੱਸੋ ਕੀ ਕਰਾਂ",
      checking: "ਜਾਂਚ ਰਿਹਾ ਹੈ...",
      failed: "ਜਾਂਚ ਨਹੀਂ ਹੋਈ। ਜੇ ਬਹੁਤ ਬਿਮਾਰ ਹੋ, 911 ਨੂੰ ਕਾਲ ਕਰੋ।",
      again: "ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰੋ",
      callPoison: "ਪੋਇਜ਼ਨ ਕੰਟਰੋਲ",
    },
    paper: {
      title: "ਕਾਗਜ਼ ਪੜ੍ਹੋ",
      intro: "ਕੰਮ ਦੇ ਕਿਸੇ ਵੀ ਕਾਗਜ਼ ਦੀ ਫੋਟੋ ਖਿੱਚੋ। Furrow ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਵੇਗਾ।",
      take: "ਫੋਟੋ ਖਿੱਚੋ",
      choose: "ਫੋਟੋ ਚੁਣੋ",
      reading: "ਕਾਗਜ਼ ਪੜ੍ਹ ਰਿਹਾ ਹੈ...",
      failed: "ਪੜ੍ਹਿਆ ਨਹੀਂ ਗਿਆ। ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      unreadable: "ਇਹ ਪੜ੍ਹਿਆ ਨਹੀਂ ਗਿਆ। ਨੇੜੇ ਜਾਓ, ਸਥਿਰ ਰਹੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      actions: "ਤੁਹਾਨੂੰ ਕੀ ਕਰਨਾ ਹੈ",
      dates: "ਤਾਰੀਖਾਂ ਅਤੇ ਰਕਮਾਂ",
      another: "ਹੋਰ ਕਾਗਜ਼ ਪੜ੍ਹੋ",
    },
    report: {
      title: "ਸਮੱਸਿਆ ਦੱਸੋ",
      intro: "ਜੋ ਹੋਇਆ ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਦੱਸੋ। Furrow ਮਾਲਕ ਜਾਂ ਕਾਉਂਟੀ ਲਈ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਸਾਫ਼ ਰਿਪੋਰਟ ਲਿਖੇਗਾ।",
      placeholder: "ਜਿਵੇਂ: ਅਸੀਂ ਤੋੜ ਰਹੇ ਸੀ ਤਾਂ ਨਾਲ ਦੇ ਖੇਤ ਵਿੱਚ ਛਿੜਕਾਅ ਹੋਇਆ ਅਤੇ ਹਵਾ ਸਾਡੇ ਉੱਤੇ ਲੈ ਆਈ।",
      when: "ਇਹ ਕਦੋਂ ਹੋਇਆ?",
      write: "ਮੇਰੀ ਰਿਪੋਰਟ ਲਿਖੋ",
      writing: "ਲਿਖ ਰਿਹਾ ਹੈ...",
      failed: "ਰਿਪੋਰਟ ਨਹੀਂ ਲਿਖੀ ਗਈ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      english: "ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਰਿਪੋਰਟ",
      yourLanguage: "ਇਸ ਵਿੱਚ ਕੀ ਲਿਖਿਆ ਹੈ",
      missing: "ਇਸਨੂੰ ਮਜ਼ਬੂਤ ਬਣਾਉਣ ਲਈ ਇਹ ਜੋੜੋ",
      copy: "ਕਾਪੀ ਕਰੋ",
      copied: "ਕਾਪੀ ਹੋ ਗਿਆ",
      share: "ਭੇਜੋ",
      edit: "ਆਪਣੀ ਗੱਲ ਬਦਲੋ",
    },
    brief: {
      title: "ਅੱਜ ਦੀ ਯੋਜਨਾ",
      intro: "Furrow ਤੁਹਾਡੀਆਂ ਘੜੀਆਂ ਅਤੇ ਅੱਜ ਦੀ ਗਰਮੀ ਦੇਖ ਕੇ ਯੋਜਨਾ ਬੋਲ ਕੇ ਦੱਸਦਾ ਹੈ।",
      make: "ਅੱਜ ਦੀ ਯੋਜਨਾ ਦੱਸੋ",
      making: "ਯੋਜਨਾ ਬਣਾ ਰਿਹਾ ਹੈ...",
      failed: "ਯੋਜਨਾ ਨਹੀਂ ਬਣੀ। ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ।",
      listen: "ਸੁਣੋ",
      again: "ਨਵਾਂ ਕਰੋ",
    },
    map: {
      title: "ਛਿੜਕਾਅ ਨਕਸ਼ਾ",
      intro: "ਹਰ ਸਕੈਨ ਕੀਤਾ ਲੇਬਲ ਉੱਥੇ ਨਿਸ਼ਾਨ ਲੱਗਦਾ ਹੈ ਜਿੱਥੇ ਤੁਸੀਂ ਖੜ੍ਹੇ ਸੀ।",
      empty: "ਅਜੇ ਕੋਈ ਨਿਸ਼ਾਨ ਨਹੀਂ। ਲੋਕੇਸ਼ਨ ਚਾਲੂ ਕਰਕੇ ਲੇਬਲ ਸਕੈਨ ਕਰੋ।",
      loading: "ਤੁਹਾਡੇ ਸਕੈਨ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...",
      failed: "ਤੁਹਾਡੇ ਸਕੈਨ ਲੋਡ ਨਹੀਂ ਹੋਏ।",
      noPlace: "ਇਨ੍ਹਾਂ ਸਕੈਨਾਂ ਦੀ ਲੋਕੇਸ਼ਨ ਨਹੀਂ ਹੈ।",
    },
    alarms: {
      allow: "ਸੁਰੱਖਿਅਤ ਹੋਣ 'ਤੇ ਦੱਸੋ",
      on: "ਅਲਾਰਮ ਚਾਲੂ ਹੈ",
      safeTitle: "ਵਾਪਸ ਜਾਣਾ ਸੁਰੱਖਿਅਤ ਹੈ",
      safeBody: "ਵਾਪਸ ਜਾਣ ਦਾ ਸਮਾਂ ਪੂਰਾ ਹੋ ਗਿਆ:",
      waterTitle: "ਪਾਣੀ ਪੀਓ",
      waterBody: "ਗਰਮੀ ਹੈ। ਹਰ ਘੰਟੇ ਲਗਭਗ ਇੱਕ ਕੁਆਰਟ ਪਾਣੀ ਪੀਓ।",
      waterOn: "ਹਰ ਘੰਟੇ ਪਾਣੀ ਯਾਦ ਕਰਾਓ",
      waterOff: "ਪਾਣੀ ਦੀ ਯਾਦ ਚਾਲੂ ਹੈ",
    },
    install: {
      title: "Furrow ਨੂੰ ਫ਼ੋਨ ਵਿੱਚ ਪਾਓ",
      body: "ਇਹ ਐਪ ਵਾਂਗ ਖੁੱਲ੍ਹਦਾ ਹੈ, ਅਤੇ ਤੁਹਾਡੇ ਸਕੈਨ, ਘੜੀਆਂ ਅਤੇ ਬਚਾਅ ਦੇ ਕਦਮ ਬਿਨਾਂ ਸਿਗਨਲ ਚੱਲਦੇ ਹਨ।",
      button: "ਹੋਮ ਸਕਰੀਨ 'ਤੇ ਪਾਓ",
      ios: "iPhone 'ਤੇ: Share ਛੂਹੋ, ਫਿਰ Add to Home Screen।",
      done: "Furrow ਤੁਹਾਡੀ ਹੋਮ ਸਕਰੀਨ 'ਤੇ ਹੈ।",
    },
  },
};

export const scannerCopy: Record<
  CoreLanguage,
  { reading: string[]; saved: string; choose: string }
> = {
  en: {
    reading: ["Reading the label", "Finding the re-entry time", "Putting it in plain words"],
    saved: "Saved to your history",
    choose: "Choose a photo instead",
  },
  es: {
    reading: [
      "Leyendo la etiqueta",
      "Buscando el tiempo de reingreso",
      "Escribiéndolo en palabras sencillas",
    ],
    saved: "Guardado en tu historial",
    choose: "Elegir una foto guardada",
  },
  pa: {
    reading: ["ਲੇਬਲ ਪੜ੍ਹ ਰਹੇ ਹਾਂ", "ਵਾਪਸ ਜਾਣ ਦਾ ਸਮਾਂ ਲੱਭ ਰਹੇ ਹਾਂ", "ਸੌਖੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਲਿਖ ਰਹੇ ਹਾਂ"],
    saved: "ਤੁਹਾਡੇ ਇਤਿਹਾਸ ਵਿੱਚ ਸੰਭਾਲਿਆ ਗਿਆ",
    choose: "ਗੈਲਰੀ ਵਿੱਚੋਂ ਫੋਟੋ ਚੁਣੋ",
  },
};
