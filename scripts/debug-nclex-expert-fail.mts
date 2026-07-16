/**
 * Metadata-only debug for NCLEX expert enrichment failures (no stem/option text).
 * Usage: npx tsx scripts/debug-nclex-expert-fail.mts [idPrefix]
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { rationaleInputFromBankItem } from "../src/lib/engine/rationale";
import { isNclexServeQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { getOpenAiClient, isOpenAiPurposeAllowed } from "../src/lib/openai-client";

const prisma = new PrismaClient();
const prefix = process.argv[2] ?? "cmqwjutz";

async function main() {
  console.log({
    enrichmentAllowed: isOpenAiPurposeAllowed("enrichment"),
    hasClient: Boolean(getOpenAiClient("enrichment")),
    generationOnly: process.env.OPENAI_GENERATION_ONLY ?? null,
    allowedPurposes: process.env.OPENAI_ALLOWED_PURPOSES ?? null,
  });

  const row = await prisma.questionBankItem.findFirst({
    where: { id: { startsWith: prefix }, fieldId: "nursing" },
  });
  if (!row) {
    console.log("not found");
    return;
  }

  const item = enrichBankItemFromRow(row);
  const input = rationaleInputFromBankItem(item, "nursing");
  let rawParsed: unknown = null;
  try {
    rawParsed = JSON.parse(row.options);
  } catch {
    rawParsed = null;
  }

  const rawKeys =
    rawParsed && typeof rawParsed === "object" && !Array.isArray(rawParsed)
      ? Object.keys(rawParsed as object)
      : Array.isArray(rawParsed)
        ? ["__array__"]
        : typeof rawParsed;

  console.log(
    JSON.stringify(
      {
        idPrefix: row.id.slice(0, 12),
        itemType: row.itemType,
        questionLen: row.question.length,
        explanationLen: row.explanation?.length ?? 0,
        serveQuality: isNclexServeQuality(item, { source: row.source }),
        parsedOptionCount: item.options?.length ?? 0,
        parsedOptionLens: (item.options ?? []).map((o) => o.length),
        correctLen: (item.correctAnswer ?? "").length,
        correctInOptions: (item.options ?? []).some((o) => o === item.correctAnswer),
        inputOptionCount: input.options?.length ?? 0,
        rawKeys,
        choicesLen: Array.isArray((rawParsed as { choices?: unknown })?.choices)
          ? (rawParsed as { choices: unknown[] }).choices.length
          : Array.isArray((rawParsed as { options?: unknown })?.options)
            ? (rawParsed as { options: unknown[] }).options.length
            : null,
      },
      null,
      2
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
