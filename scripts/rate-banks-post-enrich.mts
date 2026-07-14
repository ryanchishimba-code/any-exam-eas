import { loadEnvFiles } from "./load-env";
loadEnvFiles();
import { PrismaClient } from "@prisma/client";
import {
  EXPERT_RATIONALE_META_KEY,
  readExpertRationaleFromMeta,
} from "../src/lib/engine/rationale/expert-rationale-types";

const prisma = new PrismaClient();

function hasBoardExpert(meta: unknown): boolean {
  if (!meta || typeof meta !== "object") return false;
  const m = meta as Record<string, unknown>;
  if (m[EXPERT_RATIONALE_META_KEY]) return true;
  if (m.boardExpertRationale || m.expertSections) return true;
  const s = JSON.stringify(m);
  return /expertRationale|distractorRationales|keyTakeaway|stepByStepReasoning/i.test(s);
}

async function stats(fieldId: string) {
  const [active, serve] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId, active: true } }),
    prisma.questionBankItem.count({ where: { fieldId, active: true, qaPassed: true } }),
  ]);

  let lastId: string | undefined;
  let scanned = 0;
  let expert = 0;
  let longExpl = 0;
  const MAX = 3000;
  while (scanned < MAX) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId,
        active: true,
        qaPassed: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: 200,
      select: { id: true, explanation: true, generationMeta: true },
    });
    if (!rows.length) break;
    for (const r of rows) {
      scanned++;
      const meta = r.generationMeta;
      const er = readExpertRationaleFromMeta(meta);
      if (er || hasBoardExpert(meta)) expert++;
      if ((r.explanation?.length ?? 0) >= 150) longExpl++;
      lastId = r.id;
    }
    if (rows.length < 200) break;
  }

  return {
    fieldId,
    active,
    serve,
    sampleScanned: scanned,
    withExpert: expert,
    expertPct: scanned ? Math.round((expert / scanned) * 1000) / 10 : 0,
    longExplanation: longExpl,
    longExplPct: scanned ? Math.round((longExpl / scanned) * 1000) / 10 : 0,
  };
}

async function main() {
  const sinceNclex = new Date("2026-07-14T04:30:00Z");
  const sinceNaplex = new Date("2026-07-14T07:00:00Z");

  const [nclex, naplex, live, nclexExpertRows, naplexEnrichedRows, nclexUpdated, naplexUpdated] =
    await Promise.all([
      stats("nursing"),
      stats("pharmacy"),
      fetch("https://www.anyexameasy.com/api/marketing/bank-counts").then((r) => r.json()),
      prisma.$queryRaw<Array<{ n: bigint }>>`
        SELECT COUNT(*)::bigint AS n FROM "QuestionBankItem"
        WHERE "fieldId" = 'nursing' AND active AND "qaPassed"
          AND "generationMeta"::text LIKE '%expertRationale%'
      `,
      prisma.$queryRaw<Array<{ n: bigint }>>`
        SELECT COUNT(*)::bigint AS n FROM "QuestionBankItem"
        WHERE "fieldId" = 'pharmacy' AND active AND "qaPassed"
          AND "generationMeta"::text LIKE '%rationaleEnrichedAt%'
      `,
      prisma.questionBankItem.count({
        where: { fieldId: "nursing", active: true, updatedAt: { gte: sinceNclex } },
      }),
      prisma.questionBankItem.count({
        where: { fieldId: "pharmacy", active: true, updatedAt: { gte: sinceNaplex } },
      }),
    ]);

  const naplexRecent = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true, updatedAt: { gte: sinceNaplex } },
    select: { explanation: true },
    take: 100,
  });
  const avgExpl = naplexRecent.length
    ? Math.round(
        naplexRecent.reduce((a, r) => a + (r.explanation?.length ?? 0), 0) / naplexRecent.length
      )
    : 0;

  console.log(
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        metaKey: EXPERT_RATIONALE_META_KEY,
        db: { nclex, naplex },
        enrichmentCoverage: {
          nclexWithExpertRationaleKey: Number(nclexExpertRows[0]?.n ?? 0),
          naplexWithRationaleEnrichedAt: Number(naplexEnrichedRows[0]?.n ?? 0),
          nclexUpdatedInRunWindow: nclexUpdated,
          naplexUpdatedInRunWindow: naplexUpdated,
          naplexRecentAvgExplanationChars: avgExpl,
        },
        live: {
          nclex: live.exams?.find((e: { slug: string }) => e.slug === "nclex")?.served,
          naplex: live.exams?.find((e: { slug: string }) => e.slug === "naplex")?.served,
          total: live.totalServed,
        },
      },
      null,
      2
    )
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
