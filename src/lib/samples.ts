import type { Language, ScanResult } from "./scan";

export type Sample = {
  id: string;
  title: string;
  detail: string;
  image: string;
  results: Record<Language, ScanResult>;
};

const poison = "1-800-222-1222";

export const samples: Sample[] = [
  {
    id: "valley-guard",
    title: "Almond insecticide label",
    detail: "Valley Guard 2EC",
    image: "/samples/valley-guard.svg",
    results: {
      en: {
        readable: true,
        product: "Valley Guard 2EC insecticide",
        signal: "caution",
        reentry: "Do not enter treated areas for 12 hours after spraying.",
        gear: ["Long-sleeved shirt and long pants", "Chemical-resistant gloves", "Shoes and socks"],
        firstAid: [
          "Skin: take off dirty clothes and wash with soap and water for 15 to 20 minutes.",
          "Eyes: rinse with clean water for 15 to 20 minutes.",
          `Swallowed: call Poison Control at ${poison}. Do not make the person vomit.`,
        ],
        summary:
          "This is an insecticide for almond orchards. It is toxic to bees and fish. Stay out of a sprayed block for 12 hours and wear gloves if you handle it.",
        ask: "",
      },
      es: {
        readable: true,
        product: "Insecticida Valley Guard 2EC",
        signal: "caution",
        reentry: "No entre a las áreas tratadas durante 12 horas después de la aplicación.",
        gear: ["Camisa de manga larga y pantalón largo", "Guantes resistentes a químicos", "Zapatos y calcetines"],
        firstAid: [
          "Piel: quítese la ropa sucia y lávese con agua y jabón durante 15 a 20 minutos.",
          "Ojos: enjuague con agua limpia durante 15 a 20 minutos.",
          `Si se tragó: llame al Control de Envenenamientos al ${poison}. No provoque el vómito.`,
        ],
        summary:
          "Es un insecticida para huertos de almendro. Es tóxico para las abejas y los peces. No entre al bloque rociado durante 12 horas y use guantes si lo maneja.",
        ask: "",
      },
      pa: {
        readable: true,
        product: "ਵੈਲੀ ਗਾਰਡ 2EC ਕੀਟਨਾਸ਼ਕ",
        signal: "caution",
        reentry: "ਛਿੜਕਾਅ ਤੋਂ ਬਾਅਦ 12 ਘੰਟੇ ਤੱਕ ਛਿੜਕੇ ਹੋਏ ਖੇਤਰ ਵਿੱਚ ਨਾ ਜਾਓ।",
        gear: ["ਪੂਰੀ ਬਾਹਾਂ ਵਾਲੀ ਕਮੀਜ਼ ਅਤੇ ਲੰਮੀ ਪੈਂਟ", "ਰਸਾਇਣਾਂ ਤੋਂ ਬਚਾਉਣ ਵਾਲੇ ਦਸਤਾਨੇ", "ਜੁੱਤੀਆਂ ਅਤੇ ਜੁਰਾਬਾਂ"],
        firstAid: [
          "ਚਮੜੀ: ਗੰਦੇ ਕੱਪੜੇ ਉਤਾਰੋ ਅਤੇ 15 ਤੋਂ 20 ਮਿੰਟ ਸਾਬਣ ਤੇ ਪਾਣੀ ਨਾਲ ਧੋਵੋ।",
          "ਅੱਖਾਂ: 15 ਤੋਂ 20 ਮਿੰਟ ਸਾਫ਼ ਪਾਣੀ ਨਾਲ ਧੋਵੋ।",
          `ਨਿਗਲ ਲਿਆ ਹੋਵੇ: ਪੋਇਜ਼ਨ ਕੰਟਰੋਲ ਨੂੰ ${poison} 'ਤੇ ਫ਼ੋਨ ਕਰੋ। ਉਲਟੀ ਨਾ ਕਰਵਾਓ।`,
        ],
        summary:
          "ਇਹ ਬਦਾਮ ਦੇ ਬਾਗਾਂ ਲਈ ਕੀਟਨਾਸ਼ਕ ਹੈ। ਇਹ ਮਧੂ-ਮੱਖੀਆਂ ਅਤੇ ਮੱਛੀਆਂ ਲਈ ਜ਼ਹਿਰੀਲਾ ਹੈ। ਛਿੜਕੇ ਹੋਏ ਬਲਾਕ ਵਿੱਚ 12 ਘੰਟੇ ਨਾ ਜਾਓ ਅਤੇ ਇਸਨੂੰ ਸੰਭਾਲਦੇ ਸਮੇਂ ਦਸਤਾਨੇ ਪਾਓ।",
        ask: "",
      },
    },
  },
  {
    id: "block-14",
    title: "Field sign after spraying",
    detail: "Almond block 14",
    image: "/samples/block-14.svg",
    results: {
      en: {
        readable: true,
        product: "Pesticide warning sign, almond block 14",
        signal: "danger",
        reentry: "Do not enter until Oct 26 at 6:30 AM. The block was sprayed Oct 24 at 6:30 AM.",
        gear: ["Only trained workers may enter early, wearing a respirator and chemical-resistant coveralls"],
        firstAid: [`If you are exposed, call Poison Control at ${poison}.`, "Tell your supervisor right away."],
        summary: "Block 14 was sprayed and is closed for 48 hours. Do not go in until Oct 26 at 6:30 AM.",
        ask: "",
      },
      es: {
        readable: true,
        product: "Letrero de aviso de pesticidas, bloque de almendros 14",
        signal: "danger",
        reentry: "No entre hasta el 26 de octubre a las 6:30 a. m. El bloque se roció el 24 de octubre a las 6:30 a. m.",
        gear: ["Solo los trabajadores capacitados pueden entrar antes, con respirador y overol resistente a químicos"],
        firstAid: [`Si se expone, llame al Control de Envenenamientos al ${poison}.`, "Avise a su supervisor de inmediato."],
        summary: "El bloque 14 se roció y está cerrado por 48 horas. No entre hasta el 26 de octubre a las 6:30 a. m.",
        ask: "",
      },
      pa: {
        readable: true,
        product: "ਕੀਟਨਾਸ਼ਕ ਚੇਤਾਵਨੀ ਸਾਈਨ, ਬਦਾਮ ਬਲਾਕ 14",
        signal: "danger",
        reentry:
          "26 ਅਕਤੂਬਰ ਨੂੰ ਸਵੇਰੇ 6:30 ਵਜੇ ਤੱਕ ਅੰਦਰ ਨਾ ਜਾਓ। ਇਸ ਬਲਾਕ ਵਿੱਚ 24 ਅਕਤੂਬਰ ਨੂੰ ਸਵੇਰੇ 6:30 ਵਜੇ ਛਿੜਕਾਅ ਹੋਇਆ ਸੀ।",
        gear: ["ਸਿਰਫ਼ ਸਿਖਲਾਈ ਪ੍ਰਾਪਤ ਕਾਮੇ ਪਹਿਲਾਂ ਅੰਦਰ ਜਾ ਸਕਦੇ ਹਨ, ਸਾਹ ਵਾਲਾ ਮਾਸਕ ਅਤੇ ਰਸਾਇਣਾਂ ਤੋਂ ਬਚਾਉਣ ਵਾਲਾ ਪੂਰਾ ਸੂਟ ਪਾ ਕੇ"],
        firstAid: [`ਜੇ ਜ਼ਹਿਰ ਲੱਗ ਜਾਵੇ ਤਾਂ ਪੋਇਜ਼ਨ ਕੰਟਰੋਲ ਨੂੰ ${poison} 'ਤੇ ਫ਼ੋਨ ਕਰੋ।`, "ਤੁਰੰਤ ਆਪਣੇ ਸੁਪਰਵਾਈਜ਼ਰ ਨੂੰ ਦੱਸੋ।"],
        summary: "ਬਲਾਕ 14 ਵਿੱਚ ਛਿੜਕਾਅ ਹੋਇਆ ਹੈ ਅਤੇ ਇਹ 48 ਘੰਟੇ ਬੰਦ ਹੈ। 26 ਅਕਤੂਬਰ ਨੂੰ ਸਵੇਰੇ 6:30 ਵਜੇ ਤੱਕ ਅੰਦਰ ਨਾ ਜਾਓ।",
        ask: "",
      },
    },
  },
  {
    id: "rowkill",
    title: "Weed killer label",
    detail: "Rowkill 4L",
    image: "/samples/rowkill.svg",
    results: {
      en: {
        readable: true,
        product: "Rowkill 4L herbicide",
        signal: "warning",
        reentry: "Do not enter treated areas for 24 hours after spraying.",
        gear: [
          "Coveralls over a long-sleeved shirt and long pants",
          "Chemical-resistant gloves",
          "Protective goggles",
          "Chemical-resistant boots",
        ],
        firstAid: [
          "Eyes: hold the eye open and rinse with water for 15 to 20 minutes. Take out contact lenses.",
          "Skin: wash with plenty of soap and water.",
          `Swallowed: call Poison Control at ${poison}.`,
        ],
        summary:
          "This weed killer can seriously hurt your eyes. Stay out of a sprayed field for 24 hours and wear goggles when you mix or handle it.",
        ask: "",
      },
      es: {
        readable: true,
        product: "Herbicida Rowkill 4L",
        signal: "warning",
        reentry: "No entre a las áreas tratadas durante 24 horas después de la aplicación.",
        gear: [
          "Overol sobre camisa de manga larga y pantalón largo",
          "Guantes resistentes a químicos",
          "Gafas de protección",
          "Botas resistentes a químicos",
        ],
        firstAid: [
          "Ojos: mantenga el ojo abierto y enjuague con agua durante 15 a 20 minutos. Quítese los lentes de contacto.",
          "Piel: lávese con abundante agua y jabón.",
          `Si se tragó: llame al Control de Envenenamientos al ${poison}.`,
        ],
        summary:
          "Este herbicida puede dañar gravemente los ojos. No entre al campo rociado durante 24 horas y use gafas de protección cuando lo mezcle o lo maneje.",
        ask: "",
      },
      pa: {
        readable: true,
        product: "ਰੋਅਕਿਲ 4L ਨਦੀਨਨਾਸ਼ਕ",
        signal: "warning",
        reentry: "ਛਿੜਕਾਅ ਤੋਂ ਬਾਅਦ 24 ਘੰਟੇ ਤੱਕ ਛਿੜਕੇ ਹੋਏ ਖੇਤਰ ਵਿੱਚ ਨਾ ਜਾਓ।",
        gear: [
          "ਪੂਰੀ ਬਾਹਾਂ ਵਾਲੀ ਕਮੀਜ਼ ਅਤੇ ਲੰਮੀ ਪੈਂਟ ਉੱਤੇ ਕਵਰਆਲ",
          "ਰਸਾਇਣਾਂ ਤੋਂ ਬਚਾਉਣ ਵਾਲੇ ਦਸਤਾਨੇ",
          "ਅੱਖਾਂ ਦੇ ਚਸ਼ਮੇ",
          "ਰਸਾਇਣਾਂ ਤੋਂ ਬਚਾਉਣ ਵਾਲੇ ਬੂਟ",
        ],
        firstAid: [
          "ਅੱਖਾਂ: ਅੱਖ ਖੁੱਲ੍ਹੀ ਰੱਖ ਕੇ 15 ਤੋਂ 20 ਮਿੰਟ ਪਾਣੀ ਨਾਲ ਧੋਵੋ। ਕਾਂਟੈਕਟ ਲੈਂਜ਼ ਉਤਾਰ ਦਿਓ।",
          "ਚਮੜੀ: ਬਹੁਤ ਸਾਰੇ ਸਾਬਣ ਤੇ ਪਾਣੀ ਨਾਲ ਧੋਵੋ।",
          `ਨਿਗਲ ਲਿਆ ਹੋਵੇ: ਪੋਇਜ਼ਨ ਕੰਟਰੋਲ ਨੂੰ ${poison} 'ਤੇ ਫ਼ੋਨ ਕਰੋ।`,
        ],
        summary:
          "ਇਹ ਨਦੀਨਨਾਸ਼ਕ ਅੱਖਾਂ ਨੂੰ ਗੰਭੀਰ ਨੁਕਸਾਨ ਪਹੁੰਚਾ ਸਕਦਾ ਹੈ। ਛਿੜਕੇ ਖੇਤ ਵਿੱਚ 24 ਘੰਟੇ ਨਾ ਜਾਓ ਅਤੇ ਮਿਲਾਉਂਦੇ ਜਾਂ ਸੰਭਾਲਦੇ ਸਮੇਂ ਚਸ਼ਮੇ ਪਾਓ।",
        ask: "",
      },
    },
  },
];
