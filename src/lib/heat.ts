import type { Language } from "./scan";

export type HeatLevel = "normal" | "shade" | "high";

export type Heat = {
  now: number;
  feels: number;
  high: number;
  highHour: number;
  level: HeatLevel;
};

export const manteca = { latitude: 37.7974, longitude: -121.2161 };

export function heatLevel(temperature: number): HeatLevel {
  if (temperature >= 95) return "high";
  if (temperature >= 80) return "shade";
  return "normal";
}

export async function fetchHeat(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,apparent_temperature",
    hourly: "temperature_2m",
    temperature_unit: "fahrenheit",
    timezone: "auto",
    forecast_days: "1",
  });
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`,
  );
  if (!response.ok) throw new Error("weather failed");
  const data = await response.json();
  const hourly: number[] = data.hourly.temperature_2m;
  const high = Math.max(...hourly);
  const highIndex = hourly.indexOf(high);
  const heat: Heat = {
    now: Math.round(data.current.temperature_2m),
    feels: Math.round(data.current.apparent_temperature),
    high: Math.round(high),
    highHour: Number(String(data.hourly.time[highIndex]).slice(11, 13)),
    level: heatLevel(Math.max(high, data.current.temperature_2m)),
  };
  return heat;
}

type HeatCopy = {
  tab: string;
  title: string;
  intro: string;
  check: string;
  checking: string;
  again: string;
  failed: string;
  nearManteca: string;
  now: string;
  feels: string;
  high: string;
  levels: Record<HeatLevel, { title: string; body: string }>;
  water: string;
  signsTitle: string;
  signs: string[];
  call911: string;
  rules: string;
};

export const heatCopy: Record<Language, HeatCopy> = {
  en: {
    tab: "Heat",
    title: "Heat today",
    intro:
      "See how hot it will get where you are working, and what California requires your employer to give you.",
    check: "Check the heat here",
    checking: "Checking the weather...",
    again: "Check again",
    failed: "Could not get the weather. Check your connection and try again.",
    nearManteca: "Location is off, so this is the weather in Manteca.",
    now: "Now",
    feels: "Feels like",
    high: "Hottest today",
    levels: {
      normal: {
        title: "Normal heat",
        body: "Drink water often, even before you feel thirsty. Your employer must give you fresh, free drinking water close to where you work.",
      },
      shade: {
        title: "Shade must be ready",
        body: "When it is over 80°F, California requires shade close to where you work, with room for everyone on break. You can rest in the shade any time you need to cool down.",
      },
      high: {
        title: "High heat",
        body: "At 95°F and above, someone must watch the crew for signs of heat illness, and farmworkers get a 10-minute cool-down rest every two hours. Shade must be ready.",
      },
    },
    water: "Drink about one quart of water every hour. That is four cups.",
    signsTitle: "Get help right away if someone has",
    signs: [
      "Confusion or slurred speech",
      "Hot, dry skin, or very heavy sweating",
      "Fainting or a seizure",
      "A pounding headache, nausea or vomiting",
    ],
    call911: "Call 911",
    rules: "Based on California heat rules for outdoor work.",
  },
  es: {
    tab: "Calor",
    title: "El calor de hoy",
    intro:
      "Vea qué tan caliente se pondrá donde trabaja, y lo que la ley de California exige que su empleador le dé.",
    check: "Revisar el calor aquí",
    checking: "Revisando el clima...",
    again: "Revisar de nuevo",
    failed:
      "No pudimos obtener el clima. Revise su conexión e intente de nuevo.",
    nearManteca:
      "La ubicación está apagada, así que este es el clima en Manteca.",
    now: "Ahora",
    feels: "Se siente como",
    high: "Lo más caliente hoy",
    levels: {
      normal: {
        title: "Calor normal",
        body: "Tome agua seguido, aunque no tenga sed. Su empleador debe darle agua fresca y gratis cerca de donde trabaja.",
      },
      shade: {
        title: "Debe haber sombra",
        body: "Cuando pasa de 80°F, California exige sombra cerca de donde trabaja, con espacio para todos en el descanso. Puede descansar en la sombra cuando lo necesite para refrescarse.",
      },
      high: {
        title: "Calor alto",
        body: "A 95°F o más, alguien debe vigilar al equipo por señales de enfermedad por calor, y los trabajadores del campo reciben un descanso de 10 minutos cada dos horas. Debe haber sombra.",
      },
    },
    water:
      "Tome más o menos un cuarto de galón de agua cada hora. Son cuatro vasos.",
    signsTitle: "Pida ayuda de inmediato si alguien tiene",
    signs: [
      "Confusión o habla arrastrada",
      "Piel caliente y seca, o sudor muy fuerte",
      "Desmayo o convulsiones",
      "Dolor de cabeza fuerte, náuseas o vómito",
    ],
    call911: "Llamar al 911",
    rules:
      "Basado en las reglas de calor de California para trabajo al aire libre.",
  },
  pa: {
    tab: "ਗਰਮੀ",
    title: "ਅੱਜ ਦੀ ਗਰਮੀ",
    intro:
      "ਵੇਖੋ ਕਿ ਜਿੱਥੇ ਤੁਸੀਂ ਕੰਮ ਕਰ ਰਹੇ ਹੋ ਉੱਥੇ ਕਿੰਨੀ ਗਰਮੀ ਹੋਵੇਗੀ, ਅਤੇ ਕੈਲੀਫੋਰਨੀਆ ਦੇ ਕਾਨੂੰਨ ਮੁਤਾਬਕ ਤੁਹਾਡੇ ਮਾਲਕ ਨੂੰ ਤੁਹਾਨੂੰ ਕੀ ਦੇਣਾ ਪੈਂਦਾ ਹੈ।",
    check: "ਇੱਥੇ ਦੀ ਗਰਮੀ ਵੇਖੋ",
    checking: "ਮੌਸਮ ਵੇਖ ਰਹੇ ਹਾਂ...",
    again: "ਦੁਬਾਰਾ ਵੇਖੋ",
    failed: "ਮੌਸਮ ਨਹੀਂ ਮਿਲਿਆ। ਆਪਣਾ ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    nearManteca: "ਲੋਕੇਸ਼ਨ ਬੰਦ ਹੈ, ਇਸ ਲਈ ਇਹ ਮੰਟੀਕਾ ਦਾ ਮੌਸਮ ਹੈ।",
    now: "ਹੁਣ",
    feels: "ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ",
    high: "ਅੱਜ ਸਭ ਤੋਂ ਵੱਧ",
    levels: {
      normal: {
        title: "ਆਮ ਗਰਮੀ",
        body: "ਪਿਆਸ ਲੱਗਣ ਤੋਂ ਪਹਿਲਾਂ ਵੀ ਪਾਣੀ ਪੀਂਦੇ ਰਹੋ। ਤੁਹਾਡੇ ਮਾਲਕ ਨੂੰ ਕੰਮ ਦੀ ਥਾਂ ਦੇ ਨੇੜੇ ਤਾਜ਼ਾ, ਮੁਫ਼ਤ ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਦੇਣਾ ਪੈਂਦਾ ਹੈ।",
      },
      shade: {
        title: "ਛਾਂ ਤਿਆਰ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ",
        body: "80°F ਤੋਂ ਵੱਧ ਹੋਣ 'ਤੇ ਕੈਲੀਫੋਰਨੀਆ ਵਿੱਚ ਕੰਮ ਦੀ ਥਾਂ ਦੇ ਨੇੜੇ ਛਾਂ ਹੋਣੀ ਲਾਜ਼ਮੀ ਹੈ, ਜਿਸ ਵਿੱਚ ਆਰਾਮ ਵੇਲੇ ਸਾਰਿਆਂ ਲਈ ਥਾਂ ਹੋਵੇ। ਠੰਢਾ ਹੋਣ ਲਈ ਤੁਸੀਂ ਜਦੋਂ ਚਾਹੋ ਛਾਂ ਵਿੱਚ ਆਰਾਮ ਕਰ ਸਕਦੇ ਹੋ।",
      },
      high: {
        title: "ਬਹੁਤ ਜ਼ਿਆਦਾ ਗਰਮੀ",
        body: "95°F ਜਾਂ ਵੱਧ 'ਤੇ ਕਿਸੇ ਨੂੰ ਟੀਮ ਵਿੱਚ ਗਰਮੀ ਦੀ ਬਿਮਾਰੀ ਦੇ ਲੱਛਣਾਂ ਉੱਤੇ ਨਜ਼ਰ ਰੱਖਣੀ ਪੈਂਦੀ ਹੈ, ਅਤੇ ਖੇਤ ਮਜ਼ਦੂਰਾਂ ਨੂੰ ਹਰ ਦੋ ਘੰਟਿਆਂ ਬਾਅਦ 10 ਮਿੰਟ ਦਾ ਆਰਾਮ ਮਿਲਦਾ ਹੈ। ਛਾਂ ਤਿਆਰ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
      },
    },
    water: "ਹਰ ਘੰਟੇ ਲਗਭਗ ਇੱਕ ਕੁਆਰਟ ਪਾਣੀ ਪੀਓ। ਇਹ ਚਾਰ ਕੱਪ ਹਨ।",
    signsTitle: "ਜੇ ਕਿਸੇ ਨੂੰ ਇਹ ਹੋਵੇ ਤਾਂ ਤੁਰੰਤ ਮਦਦ ਲਓ",
    signs: [
      "ਉਲਝਣ ਜਾਂ ਬੋਲਣ ਵਿੱਚ ਦਿੱਕਤ",
      "ਗਰਮ, ਸੁੱਕੀ ਚਮੜੀ, ਜਾਂ ਬਹੁਤ ਜ਼ਿਆਦਾ ਪਸੀਨਾ",
      "ਬੇਹੋਸ਼ ਹੋਣਾ ਜਾਂ ਦੌਰਾ ਪੈਣਾ",
      "ਤੇਜ਼ ਸਿਰ ਦਰਦ, ਜੀ ਕੱਚਾ ਹੋਣਾ ਜਾਂ ਉਲਟੀ",
    ],
    call911: "911 'ਤੇ ਕਾਲ ਕਰੋ",
    rules: "ਬਾਹਰ ਕੰਮ ਲਈ ਕੈਲੀਫੋਰਨੀਆ ਦੇ ਗਰਮੀ ਦੇ ਨਿਯਮਾਂ ਉੱਤੇ ਅਧਾਰਤ।",
  },
};
