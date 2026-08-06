#!/usr/bin/env node
/**
 * Retag high-weight NAPLEX subjects onto NABP outline area domains so tough
 * ratings see Domain 3 (~40%) and medication safety reflected in byDomain counts.
 *
 * Also quarantines known vignette/blueprint-mismatch rejects from tough reviews.
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/retag-naplex-nabp-outline-domains.ts --dry-run
 *   bash scripts/run-with-node.sh npx tsx scripts/retag-naplex-nabp-outline-domains.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

const AREA1 = "naplex-area1-foundations";
const AREA2 = "naplex-area2-therapeutics"; // NABP Domain 2: Medication Use Process
const AREA3 = "naplex-area3-treatment-planning";
const AREA4 = "naplex-area4-safety"; // Professional Practice

const DOMAIN3_SUBJECTS = [
  "cardiovascular-rx",
  "infectious-disease-rx",
  "endocrine-rx",
  "cns-rx",
  "otc-self-care",
] as const;

/** Med-use process (adherence, devices, counseling) — Domain 2, not professional practice. */
const DOMAIN2_SUBJECTS = ["patient-counseling"] as const;

/** Keep law/ops in Domain 4 Professional Practice only. */
const SAFETY_SUBJECTS = ["pharmacy-law"] as const;

const FOUNDATIONS_SUBJECTS = [
  "pharmacokinetics",
  "pharmaceutics",
  "compounding-calculations",
] as const;

/** Legacy blueprintDomain strings → current NABP outline ids. */
const LEGACY_DOMAIN_MAP: Record<string, string> = {
  "naplex-2026-drug-information": AREA2,
  "naplex-2026-medication-dispensing": AREA2,
  "naplex-2026-pharmacist-tasks": AREA2,
  "naplex-2026-pharmacotherapy": AREA3,
  "naplex-2026-patient-centered-care": AREA3,
};

/** Critical-flagged mismatch / unsafe-calc / non-pharmacy items from tough samples. */
const QUARANTINE_IDS = [
  "cmr4f64l9003m1yg6a2f20bqb",
  "cmra65okw003m1ymcssqasxre",
  "cmr4jj1gk003q1ygk5hz5mt9i",
  "cmqvmu471000l1yuzph6qie3n",
  "cmrogtpch003h1yt04c11xc2z",
  "cmrogtpf9003i1yt0hciw8yde",
  "cmr4c4qe8003m1ycj40f03m64",
  "cmr4dny8g003m1ywg36uhgsn9",
  "cmr0mldud000n1y34jviiy80y",
  "cmr0oczpd001i1ysg54hrkw3y",
  "cmroe912k00101yc0x0bs9slr",
  "cmqvkc1gv000z1ym34a3k9t27",
  "cmr7zcflx001e1y1wyr8ce7cr",
  "cmra7glkh00091y3evqmmvlf8",
  "cmr7wzean000d1y9hm1u6v1g4",
  "cmr7yy09c000o1yu8cbtyn0cs",
  "cmr7yy0cg000p1yu8mqymb7o0",
  "cmqvo900g00101ysd8jx4d6vg",
  "cmr80d7t6001k1yfc6ncy86t4",
  "cmr7sbt1w000d1y2vqdjzqg5h",
  "cmr4kk5qh00051ywzlt6dmodt",
  "cmr4kk5td00061ywzklcodq4i",
  "cmr4b23ar00051yschlc1g1u3",
] as const;

async function retagSubject(
  subjectIds: readonly string[],
  blueprintDomain: string
): Promise<number> {
  // Never overwrite a correctly tagged Domain 2/3 item when sweeping subjects into D4.
  const protectDomains =
    blueprintDomain === AREA4
      ? [AREA1, AREA2, AREA3]
      : blueprintDomain === AREA2
        ? [AREA1, AREA3]
        : blueprintDomain === AREA3
          ? [AREA1, AREA2]
          : [AREA2, AREA3];

  const where = {
    fieldId: "pharmacy" as const,
    active: true,
    subjectId: { in: [...subjectIds] },
    OR: [
      { blueprintDomain: null },
      { NOT: { blueprintDomain: { in: [blueprintDomain, ...protectDomains] } } },
    ],
  };

  if (dryRun) {
    return prisma.questionBankItem.count({ where });
  }
  const result = await prisma.questionBankItem.updateMany({
    where,
    data: { blueprintDomain, updatedAt: new Date() },
  });
  return result.count;
}

async function retagLegacyDomains(): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for (const [from, to] of Object.entries(LEGACY_DOMAIN_MAP)) {
    if (dryRun) {
      out[from] = await prisma.questionBankItem.count({
        where: { fieldId: "pharmacy", active: true, qaPassed: true, blueprintDomain: from },
      });
      continue;
    }
    const result = await prisma.questionBankItem.updateMany({
      where: { fieldId: "pharmacy", active: true, blueprintDomain: from },
      data: { blueprintDomain: to, updatedAt: new Date() },
    });
    out[from] = result.count;
  }
  return out;
}

async function main() {
  console.log(`\nNAPLEX NABP outline domain retag${dryRun ? " [dry-run]" : ""}\n`);

  const legacy = await retagLegacyDomains();
  const d2 = await retagSubject(DOMAIN2_SUBJECTS, AREA2);
  const d3 = await retagSubject(DOMAIN3_SUBJECTS, AREA3);
  const safety = await retagSubject(SAFETY_SUBJECTS, AREA4);
  const foundations = await retagSubject(FOUNDATIONS_SUBJECTS, AREA1);

  let quarantined = 0;
  if (!dryRun) {
    const q = await prisma.questionBankItem.updateMany({
      where: { id: { in: [...QUARANTINE_IDS] }, fieldId: "pharmacy", active: true },
      data: {
        active: false,
        qaPassed: false,
        reviewStatus: "naplex_tough_mismatch_quarantine",
        updatedAt: new Date(),
      },
    });
    quarantined = q.count;
  } else {
    quarantined = await prisma.questionBankItem.count({
      where: { id: { in: [...QUARANTINE_IDS] }, fieldId: "pharmacy", active: true },
    });
  }

  const domains = await prisma.questionBankItem.groupBy({
    by: ["blueprintDomain"],
    where: { fieldId: "pharmacy", active: true, qaPassed: true },
    _count: { _all: true },
  });
  const byDomain = Object.fromEntries(
    domains
      .filter((g) => g.blueprintDomain)
      .sort((a, b) => b._count._all - a._count._all)
      .map((g) => [g.blueprintDomain!, g._count._all])
  );

  const summary = {
    dryRun,
    completedAt: new Date().toISOString(),
    retagged: {
      legacy,
      area2: d2,
      area3: d3,
      area4: safety,
      area1: foundations,
    },
    quarantined,
    byDomain,
  };

  mkdirSync(path.join(process.cwd(), "artifacts"), { recursive: true });
  const out = path.join(process.cwd(), "artifacts/naplex-nabp-outline-retag.json");
  writeFileSync(out, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  console.log(`\nWrote ${out}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
