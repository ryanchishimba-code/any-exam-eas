import { getOpenAiClient } from "@/lib/openai-client";
import type { DrugEntry } from "./catalog";

const openai = getOpenAiClient("enrichment");

export async function generateDrugMnemonic(drug: DrugEntry): Promise<string> {
  if (drug.mnemonic) return drug.mnemonic;

  const fallback = buildFallbackMnemonic(drug);

  if (!openai) return fallback;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content:
            "You create short, memorable medical mnemonics for pharmacy/nursing students. One or two sentences max. Clean, professional. Focus on generic → brand, class, and key side effects.",
        },
        {
          role: "user",
          content: `Generic: ${drug.generic}\nBrand: ${drug.brand}\nClass: ${drug.therapeuticClass}\nIndications: ${drug.indications}\nSide effects: ${drug.sideEffects}\n\nWrite a mnemonic to remember this drug.`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim();
    return text && text.length > 10 ? text : fallback;
  } catch {
    return fallback;
  }
}

function buildFallbackMnemonic(drug: DrugEntry): string {
  const genericFirst = drug.generic.slice(0, 3).toUpperCase();
  const brandFirst = drug.brand.split(/[,/]/)[0]?.trim() ?? drug.brand;
  return `${genericFirst} → ${brandFirst}: ${drug.indications.split(",")[0]?.trim() ?? drug.indications} (${drug.therapeuticClass}).`;
}
