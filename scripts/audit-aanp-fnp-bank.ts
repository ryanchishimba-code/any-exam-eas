#!/usr/bin/env node
/**
 * Audit AANP FNP bank blueprint alignment (domains + age groups) and review status.
 *
 * Usage:
 *   npm run db:audit-aanp-fnp
 *   npm run db:audit-aanp-fnp:json
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  assessAanpFnpBlueprintAlignment,
  computeAanpFnpAgeGroupQuotas,
  computeAanpFnpDomainQuotas,
  mergeAanpFnpAgeGroupQuotaWithCounts,
  mergeAanpFnpDomainQuotaWithCounts,
  AANP_FNP_TARGET_TOTAL,
} from "../src/lib/exam-prep/aanp-fnp";
import { aanpFnpSeedProgressByDomain } from "../src/lib/edtech/seeds/aanp-fnp-seed-registry";

const prisma = new PrismaClient();

function parseArgs() {
  return { json: process.argv.includes("--json") };
}

async function main() {
  const { json } = parseArgs();

  const total = await prisma.questionBankItem.count({
    where: { fieldId: "aanp-fnp", active: true },
  });
  const qaPassed = await prisma.questionBankItem.count({
    where: { fieldId: "aanp-fnp", active: true, qaPassed: true },
  });

  const byDomain = await prisma.questionBankItem.groupBy({
    by: ["blueprintDomain"],
    where: { fieldId: "aanp-fnp", active: true, blueprintDomain: { not: null } },
    _count: { id: true },
  });
  const countsByDomain: Record<string, number> = {};
  for (const row of byDomain) {
    countsByDomain[row.blueprintDomain ?? "unset"] = row._count.id;
  }

  const byAgeGroup = await prisma.questionBankItem.groupBy({
    by: ["patientAgeGroup"],
    where: { fieldId: "aanp-fnp", active: true, patientAgeGroup: { not: null } },
    _count: { id: true },
  });
  const countsByAgeGroup: Record<string, number> = {};
  for (const row of byAgeGroup) {
    countsByAgeGroup[row.patientAgeGroup ?? "unset"] = row._count.id;
  }

  const bySubject = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId: "aanp-fnp", active: true },
    _count: { id: true },
  });

  const domainQuota = mergeAanpFnpDomainQuotaWithCounts(countsByDomain, AANP_FNP_TARGET_TOTAL);
  const ageQuota = mergeAanpFnpAgeGroupQuotaWithCounts(countsByAgeGroup, AANP_FNP_TARGET_TOTAL);
  const alignment = assessAanpFnpBlueprintAlignment(countsByDomain, total || AANP_FNP_TARGET_TOTAL);
  const seedProgress = aanpFnpSeedProgressByDomain();

  const report = {
    total,
    qaPassed,
    target: AANP_FNP_TARGET_TOTAL,
    pctComplete: Math.round((total / AANP_FNP_TARGET_TOTAL) * 100),
    domainQuotas: domainQuota,
    ageGroupQuotas: ageQuota,
    subjectCounts: Object.fromEntries(bySubject.map((r) => [r.subjectId, r._count.id])),
    blueprintAlignment: alignment,
    seedProgress,
    generatedAt: new Date().toISOString(),
  };

  if (json) {
    const outPath = path.join(process.cwd(), "artifacts", "aanp-fnp-audit.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    console.log(`\nWrote ${outPath}`);
    return;
  }

  console.log(`AANP FNP bank: ${total}/${AANP_FNP_TARGET_TOTAL} (${report.pctComplete}%) — ${qaPassed} QA-passed`);
  console.log("\nDomain quotas:");
  for (const q of domainQuota) {
    console.log(
      `  ${q.domain}: ${q.currentCount ?? 0}/${q.targetCount} (deficit ${q.deficit ?? 0})`
    );
  }
  console.log("\nAge group quotas:");
  for (const q of ageQuota) {
    console.log(
      `  ${q.ageGroup}: ${q.currentCount ?? 0}/${q.targetCount} (deficit ${q.deficit ?? 0})`
    );
  }
  console.log(`\nBlueprint aligned: ${alignment.aligned ? "yes" : "no"}`);
  console.log("\nSeed progress by domain:");
  for (const [domain, p] of Object.entries(seedProgress)) {
    console.log(`  ${domain}: ${p.count}/${p.target} (${p.pct}%)`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
