import type { CoreLanguage } from "@/lib/scan";

type ToolCopy = { title: string; body: string };

export type AppCopy = {
  tabs: { home: string; scan: string; ask: string; tools: string; saved: string };
  home: {
    morning: string;
    afternoon: string;
    evening: string;
    tagline: string;
    scan: string;
    scanBody: string;
    talk: string;
    talkBody: string;
    clocks: string;
    noClocks: string;
    heat: string;
    feels: string;
    high: string;
    levels: { normal: string; shade: string; high: string };
    risk: string;
    closedOne: string;
    closedMany: string;
    allClear: string;
    advice: { normal: string; shade: string; high: string };
    safeNow: string;
    recent: string;
    noRecent: string;
    last: string;
    askAbout: string;
    seeAll: string;
    aiTools: string;
  };
  language: string;
  fieldMode: string;
  chooseLanguage: string;
  back: string;
  toolsTitle: string;
  toolGroups: { pesticides: string; health: string; work: string };
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
    gear: ToolCopy;
    pay: ToolCopy;
    interpret: ToolCopy;
    food: ToolCopy;
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
    chats: string;
    noChats: string;
    remove: string;
    retry: string;
    talk: string;
    talkHint: string;
    voiceListening: string;
    voiceThinking: string;
    voiceSpeaking: string;
    voiceTap: string;
    voiceBlocked: string;
    voiceFailed: string;
    close: string;
    attach: string;
    removePhoto: string;
    photoAsk: string;
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
    tabs: { home: "Today", scan: "Scan", ask: "Ask", tools: "Tools", saved: "Saved" },
    home: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
      tagline: "Know before you walk in.",
      scan: "Scan a label",
      scanBody: "Point, tap, know in seconds",
      talk: "Talk to Milpa",
      talkBody: "Ask out loud, in any language",
      clocks: "Re-entry clocks",
      noClocks: "No clocks running. Scan a label to start one.",
      heat: "Heat right now",
      feels: "Feels like",
      high: "High today",
      levels: { normal: "Normal day", shade: "Shade required", high: "High heat rules" },
      risk: "Today in the field",
      closedOne: "1 treated block is still closed.",
      closedMany: "{n} treated blocks are still closed.",
      allClear: "No treated blocks are closed right now.",
      advice: {
        normal: "Normal heat. Drink water every hour.",
        shade: "Over 80°F: shade must be up near your crew.",
        high: "High heat: a 10-minute cool-down break every 2 hours, and someone must watch the crew.",
      },
      safeNow: "Safe now",
      recent: "Recent chats",
      noRecent: "Your chats with Milpa show up here.",
      last: "Last label you scanned",
      askAbout: "Ask about it",
      seeAll: "See all",
      aiTools: "Tools",
    },
    language: "Language",
    fieldMode: "Field mode: bigger text and stronger contrast for bright sun",
    chooseLanguage: "Choose your language",
    back: "Back",
    toolsTitle: "Tools",
    toolGroups: { pesticides: "Pesticides", health: "Heat and health", work: "Work and pay" },
    toolsIntro: "Pesticide, heat and pay tools for farmworkers in the field. Tap one.",
    tools: {
      heat: { title: "Field heat check", body: "Today's hottest hour in the field and your shade and water rights" },
      symptoms: { title: "Sick after spraying?", body: "Pesticide or heat symptoms, and who to call" },
      exposed: { title: "Pesticide got on me", body: "911, a 15-minute rinse timer and a card for the doctor" },
      paper: { title: "Read a work paper", body: "Spray notices, pay stubs and forms from the grower" },
      report: { title: "Report spray drift", body: "Say what happened, get a report in English for the county" },
      brief: { title: "Today's field plan", body: "Which blocks are closed and the heat, read out loud" },
      map: { title: "Spray map", body: "Every pesticide label you scanned, pinned on a map" },
      install: { title: "Use it in the field", body: "Add Milpa to your phone so it works with no signal" },
      gear: { title: "Spray gear check", body: "A photo of you, checked against the pesticide label's gear" },
      pay: { title: "Farm pay check", body: "Check your pay stub against California farmwork pay law" },
      interpret: { title: "Crew interpreter", body: "Talk with your crew boss, nurse or clerk in your language" },
      food: { title: "Food pesticide check", body: "Pesticides and allergens on the food you buy" },
    },
    ask: {
      title: "Ask Milpa",
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
      chats: "Your chats",
      noChats: "Your chats show up here. They are saved to your account.",
      remove: "Delete chat",
      retry: "Try again",
      talk: "Talk",
      talkHint: "Speak in any language. Milpa listens, then answers out loud.",
      voiceListening: "Listening",
      voiceThinking: "Thinking",
      voiceSpeaking: "Tap to interrupt",
      voiceTap: "Tap to talk",
      voiceBlocked: "Milpa needs your microphone. Allow it in your browser settings, then try again.",
      voiceFailed: "That did not go through. Tap to try again.",
      close: "Close",
      attach: "Add a photo",
      removePhoto: "Remove photo",
      photoAsk: "What can you tell me from this photo?",
    },
    result: {
      askAbout: "Ask about this label",
      supervisor: "Show my supervisor",
      share: "Share with crew",
      shared: "Link ready to share",
      copied: "Link copied",
      shareFailed: "Could not make a link. Try again.",
      howRead: "How Milpa read this",
      confidence: { high: "Clear read", medium: "Check this", low: "Not sure" },
      confidenceNote: {
        high: "The label was sharp and every answer below was printed on it.",
        medium: "Some words were small or partly hidden. Check the label or ask.",
        low: "Milpa is not sure about part of this. Ask your supervisor.",
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
      intro: "Tap everything you feel right now. Milpa tells you who to call.",
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
      intro: "Take a photo of any paper from work. Milpa explains it in your language.",
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
      intro: "Say what happened in your own words. Milpa writes a clear report in English you can give to the grower or the county.",
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
      intro: "Milpa looks at your clocks and today's heat and tells you the plan out loud.",
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
      title: "Add Milpa to your phone",
      body: "It opens like an app, and your saved scans, clocks and the exposure steps work with no signal.",
      button: "Add to home screen",
      ios: "On iPhone: tap Share, then Add to Home Screen.",
      done: "Milpa is on your home screen.",
    },
  },
  es: {
    tabs: { home: "Hoy", scan: "Escanear", ask: "Preguntar", tools: "Herramientas", saved: "Guardado" },
    home: {
      morning: "Buenos días",
      afternoon: "Buenas tardes",
      evening: "Buenas noches",
      tagline: "Sepa antes de entrar.",
      scan: "Escanear etiqueta",
      scanBody: "Apunte, toque y sepa en segundos",
      talk: "Hablar con Milpa",
      talkBody: "Pregunte en voz alta, en cualquier idioma",
      clocks: "Relojes de reingreso",
      noClocks: "No hay relojes. Escanee una etiqueta para empezar uno.",
      heat: "Calor ahora",
      feels: "Se siente como",
      high: "Máxima de hoy",
      levels: { normal: "Día normal", shade: "Sombra obligatoria", high: "Reglas de calor alto" },
      risk: "Hoy en el campo",
      closedOne: "1 bloque fumigado sigue cerrado.",
      closedMany: "{n} bloques fumigados siguen cerrados.",
      allClear: "No hay bloques fumigados cerrados ahora.",
      advice: {
        normal: "Calor normal. Tome agua cada hora.",
        shade: "Más de 80°F: debe haber sombra cerca de su cuadrilla.",
        high: "Calor alto: un descanso de 10 minutos cada 2 horas, y alguien debe vigilar a la cuadrilla.",
      },
      safeNow: "Ya puede entrar",
      recent: "Conversaciones recientes",
      noRecent: "Aquí aparecen sus conversaciones con Milpa.",
      last: "Última etiqueta escaneada",
      askAbout: "Preguntar sobre ella",
      seeAll: "Ver todo",
      aiTools: "Herramientas",
    },
    language: "Idioma",
    fieldMode: "Modo campo: letra más grande y más contraste para el sol",
    chooseLanguage: "Elija su idioma",
    back: "Atrás",
    toolsTitle: "Herramientas",
    toolGroups: { pesticides: "Pesticidas", health: "Calor y salud", work: "Trabajo y pago" },
    toolsIntro: "Herramientas de pesticidas, calor y pago para trabajadores del campo. Toque una.",
    tools: {
      heat: { title: "Calor en el campo", body: "La hora más caliente de hoy y su derecho a sombra y agua" },
      symptoms: { title: "¿Mal después de fumigar?", body: "Síntomas de pesticida o calor, y a quién llamar" },
      exposed: { title: "Me cayó pesticida", body: "911, enjuague de 15 minutos y tarjeta para el médico" },
      paper: { title: "Leer un papel del trabajo", body: "Avisos de fumigación, talones de pago y formas del ranchero" },
      report: { title: "Reportar fumigación", body: "Diga lo que pasó y reciba un reporte en inglés para el condado" },
      brief: { title: "Plan del campo hoy", body: "Qué bloques están cerrados y el calor, en voz alta" },
      map: { title: "Mapa de fumigación", body: "Cada etiqueta de pesticida que escaneó, en un mapa" },
      install: { title: "Úsela en el campo", body: "Ponga Milpa en su teléfono para usarla sin señal" },
      gear: { title: "Revisar equipo de fumigación", body: "Una foto suya, comparada con el equipo que pide la etiqueta" },
      pay: { title: "Revisar pago del campo", body: "Compare su talón con la ley de pago agrícola de California" },
      interpret: { title: "Intérprete de cuadrilla", body: "Hable con su mayordomo, enfermera o empleado en su idioma" },
      food: { title: "Pesticidas en la comida", body: "Pesticidas y alérgenos en la comida que compra" },
    },
    ask: {
      title: "Pregúntele a Milpa",
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
      chats: "Sus conversaciones",
      noChats: "Aquí aparecen sus conversaciones. Se guardan en su cuenta.",
      remove: "Borrar conversación",
      retry: "Intentar de nuevo",
      talk: "Hablar",
      talkHint: "Hable en cualquier idioma. Milpa escucha y le responde en voz alta.",
      voiceListening: "Escuchando",
      voiceThinking: "Pensando",
      voiceSpeaking: "Toque para interrumpir",
      voiceTap: "Toque para hablar",
      voiceBlocked: "Milpa necesita su micrófono. Permítalo en la configuración del navegador e intente de nuevo.",
      voiceFailed: "No se pudo enviar. Toque para intentar de nuevo.",
      close: "Cerrar",
      attach: "Agregar foto",
      removePhoto: "Quitar foto",
      photoAsk: "¿Qué me puede decir de esta foto?",
    },
    result: {
      askAbout: "Preguntar sobre esta etiqueta",
      supervisor: "Mostrar a mi supervisor",
      share: "Compartir con mi cuadrilla",
      shared: "Enlace listo para compartir",
      copied: "Enlace copiado",
      shareFailed: "No se pudo crear el enlace. Intente de nuevo.",
      howRead: "Cómo lo leyó Milpa",
      confidence: { high: "Lectura clara", medium: "Revise esto", low: "No es seguro" },
      confidenceNote: {
        high: "La etiqueta se veía clara y cada respuesta estaba impresa en ella.",
        medium: "Algunas palabras eran pequeñas o estaban tapadas. Revise la etiqueta o pregunte.",
        low: "Milpa no está seguro de una parte. Pregunte a su supervisor.",
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
      intro: "Toque todo lo que siente ahora. Milpa le dice a quién llamar.",
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
      intro: "Tome una foto de cualquier papel del trabajo. Milpa se lo explica en su idioma.",
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
      intro: "Diga lo que pasó con sus palabras. Milpa escribe un reporte claro en inglés para el ranchero o el condado.",
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
      intro: "Milpa revisa sus relojes y el calor de hoy y le dice el plan en voz alta.",
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
      title: "Ponga Milpa en su teléfono",
      body: "Se abre como una app, y sus escaneos, relojes y los pasos de exposición funcionan sin señal.",
      button: "Agregar a la pantalla",
      ios: "En iPhone: toque Compartir y luego Agregar a inicio.",
      done: "Milpa está en su pantalla de inicio.",
    },
  },
  pa: {
    tabs: { home: "ਅੱਜ", scan: "ਸਕੈਨ", ask: "ਪੁੱਛੋ", tools: "ਟੂਲ", saved: "ਸੰਭਾਲੇ" },
    home: {
      morning: "ਸ਼ੁਭ ਸਵੇਰ",
      afternoon: "ਸ਼ੁਭ ਦੁਪਹਿਰ",
      evening: "ਸ਼ੁਭ ਸ਼ਾਮ",
      tagline: "ਅੰਦਰ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਣੋ।",
      scan: "ਲੇਬਲ ਸਕੈਨ ਕਰੋ",
      scanBody: "ਕੈਮਰਾ ਕਰੋ, ਛੂਹੋ, ਸਕਿੰਟਾਂ ਵਿੱਚ ਜਾਣੋ",
      talk: "Milpa ਨਾਲ ਗੱਲ ਕਰੋ",
      talkBody: "ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲ ਕੇ ਪੁੱਛੋ",
      clocks: "ਵਾਪਸੀ ਘੜੀਆਂ",
      noClocks: "ਕੋਈ ਘੜੀ ਨਹੀਂ ਚੱਲ ਰਹੀ। ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਲੇਬਲ ਸਕੈਨ ਕਰੋ।",
      heat: "ਹੁਣ ਦੀ ਗਰਮੀ",
      feels: "ਮਹਿਸੂਸ ਹੁੰਦੀ",
      high: "ਅੱਜ ਸਭ ਤੋਂ ਵੱਧ",
      levels: { normal: "ਆਮ ਦਿਨ", shade: "ਛਾਂ ਲਾਜ਼ਮੀ", high: "ਤੇਜ਼ ਗਰਮੀ ਦੇ ਨਿਯਮ" },
      risk: "ਅੱਜ ਖੇਤ ਵਿੱਚ",
      closedOne: "1 ਛਿੜਕਾਅ ਵਾਲਾ ਬਲਾਕ ਅਜੇ ਬੰਦ ਹੈ।",
      closedMany: "{n} ਛਿੜਕਾਅ ਵਾਲੇ ਬਲਾਕ ਅਜੇ ਬੰਦ ਹਨ।",
      allClear: "ਇਸ ਵੇਲੇ ਕੋਈ ਛਿੜਕਾਅ ਵਾਲਾ ਬਲਾਕ ਬੰਦ ਨਹੀਂ।",
      advice: {
        normal: "ਆਮ ਗਰਮੀ। ਹਰ ਘੰਟੇ ਪਾਣੀ ਪੀਓ।",
        shade: "80°F ਤੋਂ ਵੱਧ: ਤੁਹਾਡੇ ਅਮਲੇ ਨੇੜੇ ਛਾਂ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
        high: "ਤੇਜ਼ ਗਰਮੀ: ਹਰ 2 ਘੰਟੇ 10 ਮਿੰਟ ਦਾ ਆਰਾਮ, ਅਤੇ ਕੋਈ ਅਮਲੇ ਦੀ ਨਿਗਰਾਨੀ ਕਰੇ।",
      },
      safeNow: "ਹੁਣ ਸੁਰੱਖਿਅਤ",
      recent: "ਹਾਲੀਆ ਗੱਲਬਾਤਾਂ",
      noRecent: "Milpa ਨਾਲ ਤੁਹਾਡੀਆਂ ਗੱਲਬਾਤਾਂ ਇੱਥੇ ਦਿਖਣਗੀਆਂ।",
      last: "ਆਖਰੀ ਸਕੈਨ ਕੀਤਾ ਲੇਬਲ",
      askAbout: "ਇਸ ਬਾਰੇ ਪੁੱਛੋ",
      seeAll: "ਸਭ ਦੇਖੋ",
      aiTools: "ਟੂਲ",
    },
    language: "ਭਾਸ਼ਾ",
    fieldMode: "ਖੇਤ ਮੋਡ: ਤੇਜ਼ ਧੁੱਪ ਲਈ ਵੱਡੇ ਅੱਖਰ ਅਤੇ ਗੂੜ੍ਹਾ ਰੰਗ",
    chooseLanguage: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    back: "ਪਿੱਛੇ",
    toolsTitle: "ਟੂਲ",
    toolGroups: { pesticides: "ਕੀਟਨਾਸ਼ਕ", health: "ਗਰਮੀ ਅਤੇ ਸਿਹਤ", work: "ਕੰਮ ਅਤੇ ਤਨਖਾਹ" },
    toolsIntro: "ਖੇਤ ਮਜ਼ਦੂਰਾਂ ਲਈ ਕੀਟਨਾਸ਼ਕ, ਗਰਮੀ ਅਤੇ ਤਨਖਾਹ ਦੇ ਟੂਲ। ਇੱਕ ਨੂੰ ਛੂਹੋ।",
    tools: {
      heat: { title: "ਖੇਤ ਵਿੱਚ ਗਰਮੀ", body: "ਅੱਜ ਦਾ ਸਭ ਤੋਂ ਗਰਮ ਘੰਟਾ ਅਤੇ ਛਾਂ ਤੇ ਪਾਣੀ ਦੇ ਤੁਹਾਡੇ ਹੱਕ" },
      symptoms: { title: "ਛਿੜਕਾਅ ਤੋਂ ਬਾਅਦ ਬਿਮਾਰ?", body: "ਕੀਟਨਾਸ਼ਕ ਜਾਂ ਗਰਮੀ ਦੇ ਲੱਛਣ, ਅਤੇ ਕਿਸਨੂੰ ਫ਼ੋਨ ਕਰਨਾ ਹੈ" },
      exposed: { title: "ਮੇਰੇ ਉੱਤੇ ਕੀਟਨਾਸ਼ਕ ਪਿਆ", body: "911, 15 ਮਿੰਟ ਧੋਣ ਦਾ ਟਾਈਮਰ ਅਤੇ ਡਾਕਟਰ ਲਈ ਕਾਰਡ" },
      paper: { title: "ਕੰਮ ਦਾ ਕਾਗਜ਼ ਪੜ੍ਹੋ", body: "ਛਿੜਕਾਅ ਨੋਟਿਸ, ਤਨਖਾਹ ਪਰਚੀਆਂ ਅਤੇ ਫਾਰਮ" },
      report: { title: "ਛਿੜਕਾਅ ਦੀ ਸ਼ਿਕਾਇਤ", body: "ਜੋ ਹੋਇਆ ਦੱਸੋ, ਕਾਉਂਟੀ ਲਈ ਅੰਗਰੇਜ਼ੀ ਰਿਪੋਰਟ ਲਓ" },
      brief: { title: "ਅੱਜ ਦੀ ਖੇਤ ਯੋਜਨਾ", body: "ਕਿਹੜੇ ਬਲਾਕ ਬੰਦ ਹਨ ਅਤੇ ਗਰਮੀ, ਬੋਲ ਕੇ" },
      map: { title: "ਛਿੜਕਾਅ ਨਕਸ਼ਾ", body: "ਤੁਹਾਡੇ ਸਕੈਨ ਕੀਤੇ ਹਰ ਕੀਟਨਾਸ਼ਕ ਲੇਬਲ ਨਕਸ਼ੇ ਉੱਤੇ" },
      install: { title: "ਖੇਤ ਵਿੱਚ ਵਰਤੋ", body: "Milpa ਫ਼ੋਨ ਵਿੱਚ ਪਾਓ ਤਾਂ ਜੋ ਬਿਨਾਂ ਸਿਗਨਲ ਚੱਲੇ" },
      gear: { title: "ਛਿੜਕਾਅ ਸਾਮਾਨ ਜਾਂਚ", body: "ਤੁਹਾਡੀ ਫ਼ੋਟੋ, ਲੇਬਲ ਦੇ ਮੰਗੇ ਸਾਮਾਨ ਨਾਲ ਮਿਲਾਈ" },
      pay: { title: "ਖੇਤ ਤਨਖਾਹ ਜਾਂਚ", body: "ਆਪਣੀ ਪਰਚੀ ਨੂੰ ਕੈਲੀਫੋਰਨੀਆ ਦੇ ਖੇਤੀ ਤਨਖਾਹ ਕਾਨੂੰਨ ਨਾਲ ਮਿਲਾਓ" },
      interpret: { title: "ਅਮਲੇ ਲਈ ਦੁਭਾਸ਼ੀਆ", body: "ਮੁਖੀ, ਨਰਸ ਜਾਂ ਕਲਰਕ ਨਾਲ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਗੱਲ ਕਰੋ" },
      food: { title: "ਖਾਣੇ ਵਿੱਚ ਕੀਟਨਾਸ਼ਕ", body: "ਖਰੀਦੇ ਖਾਣੇ ਵਿੱਚ ਕੀਟਨਾਸ਼ਕ ਅਤੇ ਐਲਰਜੀ" },
    },
    ask: {
      title: "Milpa ਤੋਂ ਪੁੱਛੋ",
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
      chats: "ਤੁਹਾਡੀਆਂ ਗੱਲਬਾਤਾਂ",
      noChats: "ਤੁਹਾਡੀਆਂ ਗੱਲਬਾਤਾਂ ਇੱਥੇ ਦਿਖਣਗੀਆਂ। ਇਹ ਤੁਹਾਡੇ ਖਾਤੇ ਵਿੱਚ ਸੰਭਾਲੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।",
      remove: "ਗੱਲਬਾਤ ਮਿਟਾਓ",
      retry: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
      talk: "ਬੋਲੋ",
      talkHint: "ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲੋ। Milpa ਸੁਣਦਾ ਹੈ ਅਤੇ ਬੋਲ ਕੇ ਜਵਾਬ ਦਿੰਦਾ ਹੈ।",
      voiceListening: "ਸੁਣ ਰਿਹਾ ਹੈ",
      voiceThinking: "ਸੋਚ ਰਿਹਾ ਹੈ",
      voiceSpeaking: "ਰੋਕਣ ਲਈ ਛੂਹੋ",
      voiceTap: "ਬੋਲਣ ਲਈ ਛੂਹੋ",
      voiceBlocked: "Milpa ਨੂੰ ਤੁਹਾਡੇ ਮਾਈਕ ਦੀ ਲੋੜ ਹੈ। ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਇਜਾਜ਼ਤ ਦਿਓ, ਫਿਰ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      voiceFailed: "ਇਹ ਨਹੀਂ ਭੇਜਿਆ ਗਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਲਈ ਛੂਹੋ।",
      close: "ਬੰਦ ਕਰੋ",
      attach: "ਫ਼ੋਟੋ ਜੋੜੋ",
      removePhoto: "ਫ਼ੋਟੋ ਹਟਾਓ",
      photoAsk: "ਇਸ ਫ਼ੋਟੋ ਤੋਂ ਤੁਸੀਂ ਮੈਨੂੰ ਕੀ ਦੱਸ ਸਕਦੇ ਹੋ?",
    },
    result: {
      askAbout: "ਇਸ ਲੇਬਲ ਬਾਰੇ ਪੁੱਛੋ",
      supervisor: "ਸੁਪਰਵਾਈਜ਼ਰ ਨੂੰ ਦਿਖਾਓ",
      share: "ਸਾਥੀਆਂ ਨਾਲ ਸਾਂਝਾ ਕਰੋ",
      shared: "ਲਿੰਕ ਤਿਆਰ ਹੈ",
      copied: "ਲਿੰਕ ਕਾਪੀ ਹੋ ਗਿਆ",
      shareFailed: "ਲਿੰਕ ਨਹੀਂ ਬਣਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      howRead: "Milpa ਨੇ ਇਹ ਕਿਵੇਂ ਪੜ੍ਹਿਆ",
      confidence: { high: "ਸਾਫ਼ ਪੜ੍ਹਿਆ", medium: "ਇਸਨੂੰ ਜਾਂਚੋ", low: "ਪੱਕਾ ਨਹੀਂ" },
      confidenceNote: {
        high: "ਲੇਬਲ ਸਾਫ਼ ਸੀ ਅਤੇ ਹੇਠਾਂ ਹਰ ਜਵਾਬ ਉਸ ਉੱਤੇ ਛਪਿਆ ਸੀ।",
        medium: "ਕੁਝ ਸ਼ਬਦ ਛੋਟੇ ਜਾਂ ਲੁਕੇ ਹੋਏ ਸਨ। ਲੇਬਲ ਜਾਂਚੋ ਜਾਂ ਪੁੱਛੋ।",
        low: "Milpa ਨੂੰ ਇੱਕ ਹਿੱਸੇ ਬਾਰੇ ਪੱਕਾ ਨਹੀਂ। ਸੁਪਰਵਾਈਜ਼ਰ ਤੋਂ ਪੁੱਛੋ।",
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
      intro: "ਜੋ ਕੁਝ ਹੁਣ ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ ਸਭ ਨੂੰ ਛੂਹੋ। Milpa ਦੱਸੇਗਾ ਕਿਸਨੂੰ ਫ਼ੋਨ ਕਰਨਾ ਹੈ।",
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
      intro: "ਕੰਮ ਦੇ ਕਿਸੇ ਵੀ ਕਾਗਜ਼ ਦੀ ਫੋਟੋ ਖਿੱਚੋ। Milpa ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਵੇਗਾ।",
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
      intro: "ਜੋ ਹੋਇਆ ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਦੱਸੋ। Milpa ਮਾਲਕ ਜਾਂ ਕਾਉਂਟੀ ਲਈ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਸਾਫ਼ ਰਿਪੋਰਟ ਲਿਖੇਗਾ।",
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
      intro: "Milpa ਤੁਹਾਡੀਆਂ ਘੜੀਆਂ ਅਤੇ ਅੱਜ ਦੀ ਗਰਮੀ ਦੇਖ ਕੇ ਯੋਜਨਾ ਬੋਲ ਕੇ ਦੱਸਦਾ ਹੈ।",
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
      title: "Milpa ਨੂੰ ਫ਼ੋਨ ਵਿੱਚ ਪਾਓ",
      body: "ਇਹ ਐਪ ਵਾਂਗ ਖੁੱਲ੍ਹਦਾ ਹੈ, ਅਤੇ ਤੁਹਾਡੇ ਸਕੈਨ, ਘੜੀਆਂ ਅਤੇ ਬਚਾਅ ਦੇ ਕਦਮ ਬਿਨਾਂ ਸਿਗਨਲ ਚੱਲਦੇ ਹਨ।",
      button: "ਹੋਮ ਸਕਰੀਨ 'ਤੇ ਪਾਓ",
      ios: "iPhone 'ਤੇ: Share ਛੂਹੋ, ਫਿਰ Add to Home Screen।",
      done: "Milpa ਤੁਹਾਡੀ ਹੋਮ ਸਕਰੀਨ 'ਤੇ ਹੈ।",
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
