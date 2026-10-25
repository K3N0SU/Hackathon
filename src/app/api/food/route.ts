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
- If the person typed a food name instead of sending a photo, judge from what that food usually contains. Use "may" for allergens that depend on the brand or recipe, set "organic" to "unknown" unless they said organic, and have the summary say to check the package label if there is one.
- "barcode" is the digits under the barcode if you can clearly read all of them, otherwise an empty string. Never guess digits.
- "about" is two or three plain sentences about the item: what it is, the brand if you can see it, and what it is usually eaten with or used for. If catalog data from the barcode is given, trust it for the name, brand and ingredients.
- "facts" are two to four short, useful notes about this item, like how much sugar or salt is in a serving, how to store it, how long it keeps, or how to tell if fresh produce is ripe. No marketing.
- "ingredients" lists every ingredient in order, exactly as printed on the label (translate into the requested language, keep brand names). If catalog data has ingredients, use those. For a typed name or fresh produce with no list, give the usual ingredients and keep it short.
- "nutrition" lists the Nutrition Facts per serving as printed: serving size, calories, total fat, saturated fat, trans fat, cholesterol, sodium, total carbohydrate, dietary fiber, total sugars, added sugars, protein, and any vitamins or minerals shown. "name" is the nutrient in the requested language, "amount" is the amount with its unit and percent daily value if shown, like "8 g (10%)". If no panel is visible, give typical values for one serving and say "about" in the amount.
- If the photo or name is not food or a food label, set "readable" to false and leave the rest empty.`;

type Catalog = { name: string; brand: string; quantity: string; nutriscore: string; ingredients: string };

async function lookup(code: string): Promise<Catalog | null> {
  if (!/^\d{8,14}$/.test(code)) return null;
  try {
    const data = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,brands,quantity,nutriscore_grade,ingredients_text`,
      { headers: { "User-Agent": "Milpa/1.0 (milpa-california.vercel.app)" }, signal: AbortSignal.timeout(6000) },
    ).then((response) => response.json());
    const product = data?.product;
    if (data?.status !== 1 || !product?.product_name) return null;
    return {
      name: product.product_name,
      brand: product.brands ?? "",
      quantity: product.quantity ?? "",
      nutriscore: typeof product.nutriscore_grade === "string" && /^[a-e]$/.test(product.nutriscore_grade) ? product.nutriscore_grade.toUpperCase() : "",
      ingredients: (product.ingredients_text ?? "").slice(0, 1200),
    };
  } catch {
    return null;
  }
}

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
    barcode: { type: "STRING" },
    about: { type: "STRING" },
    facts: { type: "ARRAY", items: { type: "STRING" } },
    ingredients: { type: "ARRAY", items: { type: "STRING" } },
    nutrition: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { name: { type: "STRING" }, amount: { type: "STRING" } },
        required: ["name", "amount"],
      },
    },
  },
  required: ["readable", "product", "allergens", "mine", "organic", "pesticides", "flags", "verdict", "summary", "barcode", "about", "facts", "ingredients", "nutrition"],
};

export async function POST(req: Request) {
  const { image, mediaType, name, language, allergies, barcode } = await req.json();
  const typed = typeof name === "string" ? name.trim().slice(0, 120) : "";
  const photo = isImage(image, mediaType);
  if ((!photo && !typed) || !isLanguage(language)) {
    return new Response("image or name, and language required", { status: 400 });
  }
  const mine = Array.isArray(allergies)
    ? allergies.filter((item): item is string => typeof item === "string").slice(0, 12)
    : [];
  const scanned = typeof barcode === "string" ? barcode.replace(/\D/g, "") : "";
  let catalog = scanned ? await lookup(scanned) : null;
  try {
    const result = await gemini<{ barcode?: string }>({
      system,
      schema,
      contents: [
        {
          role: "user",
          parts: [
            ...(photo ? [{ inlineData: { mimeType: mediaType, data: image } }] : []),
            {
              text: `My allergies: ${mine.length ? mine.join(", ") : "none"}. Today is ${new Date().toDateString()}. ${photo ? "Check this food." : `I have no label, only the name. The food is: ${typed}`}${scanned ? ` The phone read barcode ${scanned}.` : ""}${catalog ? ` Catalog data for that barcode: ${JSON.stringify(catalog)}` : ""} Answer in ${languageNames[language]}.`,
            },
          ],
        },
      ],
    });
    const code = scanned || (result.barcode ?? "").replace(/\D/g, "");
    if (!catalog && code) catalog = await lookup(code);
    return Response.json({ ...result, barcode: code, catalog });
  } catch {
    return new Response("food check failed", { status: 502 });
  }
}
