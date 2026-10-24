import { gemini, isImage, plainRules } from "@/lib/gemini";
import { isLanguage, languageNames } from "@/lib/scan";

export const maxDuration = 60;

const system = `You read food packaging, ingredient lists, produce stickers and fruit or vegetable photos for farmworker families in California, and say plainly whether the food is safe for them.

Rules:
- Write every text field in the requested language, but keep product names and numbers exactly as printed. ${plainRules}
- "product" names the food in a few words.
- "allergens" covers the nine major US allergens: milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soy, sesame. Include only the ones that apply. "level" is "contains" if listed as an ingredient or in a Contains statement, "may" for "may contain" or "made in a facility with" warnings. Name the allergen in the requested language.
- "mine" lists which of the person's own allergies, given below, are in this food. Match carefully, including hidden forms (whey and casein are milk, albumin is egg).
- "organic" is "yes" if you see a USDA Organic seal, the word organic on the label, or a 5-digit produce sticker starting with 9. "no" if a 4-digit produce sticker or no organic marking on packaged food. "unknown" if you cannot tell.
- "pesticides" is one or two honest sentences. You cannot see pesticide residue in a photo, so never claim to detect it. Say what the label tells you: certified organic food is grown with strict limits on synthetic pesticides; for fresh produce that is not organic, say to wash it well under running water. If the produce is one that often carries more residue in US testing (strawberries, spinach, kale and other greens, grapes, peaches, pears, nectarines, apples, bell and hot peppers, cherries, blueberries, green beans), say so.
- "flags" are short warnings worth knowing: high added sugar or salt if the nutrition label shows it, an expired date, a recall notice, artificial dyes like Red 40. Leave empty if none.
- "verdict" is "safe" if none of the person's allergies are in it and nothing serious is flagged, "avoid" if one of their allergies is in it, "caution" otherwise.
- "summary" is one or two short sentences a worker can act on.
- If the photo is not food or a food label, set "readable" to false and leave the rest empty.`;

const schema = {
  type: "OBJECT",
  properties: {
    readable: { type: "BOOLEAN" },
    product: { type: "STRING" },
    allergens: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          level: { type: "STRING", enum: ["contains", "may"] },
        },
        required: ["name", "level"],
      },
    },
    mine: { type: "ARRAY", items: { type: "STRING" } },
    organic: { type: "STRING", enum: ["yes", "no", "unknown"] },
    pesticides: { type: "STRING" },
    flags: { type: "ARRAY", items: { type: "STRING" } },
    verdict: { type: "STRING", enum: ["safe", "caution", "avoid"] },
    summary: { type: "STRING" },
  },
  required: ["readable", "product", "allergens", "mine", "organic", "pesticides", "flags", "verdict", "summary"],
};

export async function POST(req: Request) {
  const { image, mediaType, language, allergies } = await req.json();
  if (!isImage(image, mediaType) || !isLanguage(language)) {
    return new Response("image, mediaType and language required", { status: 400 });
  }
  const mine = Array.isArray(allergies)
    ? allergies.filter((item): item is string => typeof item === "string").slice(0, 12)
    : [];
  try {
    const result = await gemini({
      system,
      schema,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: mediaType, data: image } },
            {
              text: `My allergies: ${mine.length ? mine.join(", ") : "none"}. Today is ${new Date().toDateString()}. Check this food. Answer in ${languageNames[language]}.`,
            },
          ],
        },
      ],
    });
    return Response.json(result);
  } catch {
    return new Response("food check failed", { status: 502 });
  }
}
