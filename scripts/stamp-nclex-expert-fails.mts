/**
 * Stamp Day-1 chronic NCLEX expert failures so Day-2 skips them without re-burning tokens.
 * Reads ID prefixes from stdin or argv; does not call OpenAI.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { readExpertRationaleFromMeta } from "../src/lib/engine/rationale/expert-rationale-types";

const prisma = new PrismaClient();
const prefixes = process.argv.slice(2);

async function main() {
  if (!prefixes.length) {
    console.error("Usage: stamp-nclex-expert-fails.mts <idPrefix>...");
    process.exit(1);
  }

  let stamped = 0;
  let skipped = 0;
  for (const prefix of prefixes) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: "nursing", id: { startsWith: prefix } },
      select: { id: true, generationMeta: true },
    });
    for (const row of rows) {
      if (readExpertRationaleFromMeta(row.generationMeta)) {
        skipped++;
        continue;
      }
      const prior =
        typeof row.generationMeta === "object" && row.generationMeta
          ? (row.generationMeta as Record<string, unknown>)
          : {};
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          generationMeta: {
            ...prior,
            rationaleEnrichFailCount: Math.max(
              1,
              typeof prior.rationaleEnrichFailCount === "number"
                ? prior.rationaleEnrichFailCount
                : 0
            ),
            rationaleEnrichFailedAt: new Date().toISOString(),
            rationaleEnrichFailReason: "day1_chronic_fail_stamp",
          },
        },
      });
      stamped++;
    }
  }
  console.log(JSON.stringify({ stamped, skipped, prefixes: prefixes.length }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
