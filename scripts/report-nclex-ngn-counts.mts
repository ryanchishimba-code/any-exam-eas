import { loadEnvFiles } from "./load-env";
loadEnvFiles();
import { PrismaClient } from "@prisma/client";
import { NCLEX_NGN_SERVE_TARGETS } from "../src/lib/exam-prep/nclex/types";

const prisma = new PrismaClient();

async function main() {
  const out: Record<string, unknown> = {};
  for (const [t, target] of Object.entries(NCLEX_NGN_SERVE_TARGETS)) {
    const have = await prisma.questionBankItem.count({
      where: { fieldId: "nursing", active: true, qaPassed: true, itemType: t },
    });
    out[t] = { have, target, gap: Math.max(0, target - have) };
  }
  const caseMeta = await prisma.$queryRaw<Array<{ n: number }>>`
    SELECT COUNT(*)::int AS n FROM "QuestionBankItem"
    WHERE "fieldId" = 'nursing' AND active AND "qaPassed"
      AND (
        "generationMeta"::text LIKE '%caseGroupId%'
        OR "itemType" IN ('case_study', 'unfolding_case')
      )
  `;
  out.caseStudyIncludingMeta = caseMeta[0]?.n ?? 0;
  out.serve = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });
  const expert = await prisma.$queryRaw<Array<{ n: number }>>`
    SELECT COUNT(*)::int AS n FROM "QuestionBankItem"
    WHERE "fieldId" = 'nursing' AND active AND "qaPassed"
      AND "generationMeta"::text LIKE '%expertRationale%'
  `;
  out.expert = expert[0]?.n ?? 0;
  console.log(JSON.stringify(out, null, 2));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
