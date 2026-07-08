#!/usr/bin/env node
/**
 * Audit served NCLEX questions against Study Hub topic blueprint mappings.
 *
 * For each high-yield topic, counts qaPassed items matching registry blueprintTopicSlugs
 * vs subject-only matches — flags topics where practice would be off-topic.
 *
 * Usage:
 *   npm run db:audit-nclex-topics
 *   npm run db:audit-nclex-topics -- --json
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { getHighYieldTopics } from "../src/lib/edtech/seeds/index.ts";
import {
  NCLEX_TOPIC_REGISTRY,
  getNclexTopicMeta,
} from "../src/lib/exam-prep/nclex/topic-registry.ts";
import {
  assertScriptDbConnection,
  disconnectScriptPrisma,
  getScriptPrisma,
} from "./lib/script-db.ts";

const MIN_BLUEPRINT_MATCH = Number(process.env.NCLEX_TOPIC_MIN_MATCH ?? "8");
const jsonOut = process.argv.includes("--json");
const prisma = getScriptPrisma();

type TopicReport = {
  slug: string;
  title: string;
  subjectId: string;
  blueprintTopicSlugs: string[];
  servedBlueprintMatch: number;
  servedSubjectOnly: number;
  aligned: boolean;
};

async function main() {
  await assertScriptDbConnection();

  const topics = getHighYieldTopics("nclex");
  const reports: TopicReport[] = [];

  for (const topic of topics) {
    const meta = getNclexTopicMeta(topic.slug);
    if (meta.clientNeedsDomain === "ngn-strategy") continue;

    const blueprintSlugs = meta.blueprintTopicSlugs ?? [];
    if (blueprintSlugs.length === 0) {
      reports.push({
        slug: topic.slug,
        title: topic.title,
        subjectId: topic.practiceTopicSlug,
        blueprintTopicSlugs: [],
        servedBlueprintMatch: 0,
        servedSubjectOnly: 0,
        aligned: false,
      });
      continue;
    }

    const [servedBlueprintMatch, servedSubjectOnly] = await Promise.all([
      prisma.questionBankItem.count({
        where: {
          fieldId: "nursing",
          active: true,
          qaPassed: true,
          subjectId: topic.practiceTopicSlug,
          blueprintTopic: { in: blueprintSlugs },
        },
      }),
      prisma.questionBankItem.count({
        where: {
          fieldId: "nursing",
          active: true,
          qaPassed: true,
          subjectId: topic.practiceTopicSlug,
          NOT: { blueprintTopic: { in: blueprintSlugs } },
        },
      }),
    ]);

    reports.push({
      slug: topic.slug,
      title: topic.title,
      subjectId: topic.practiceTopicSlug,
      blueprintTopicSlugs: blueprintSlugs,
      servedBlueprintMatch,
      servedSubjectOnly,
      aligned: servedBlueprintMatch >= MIN_BLUEPRINT_MATCH,
    });
  }

  const misaligned = reports.filter((r) => !r.aligned);
  const summary = {
    generatedAt: new Date().toISOString(),
    minBlueprintMatch: MIN_BLUEPRINT_MATCH,
    topicsAudited: reports.length,
    alignedTopics: reports.filter((r) => r.aligned).length,
    misalignedTopics: misaligned.length,
    misaligned: misaligned.map((r) => ({
      slug: r.slug,
      title: r.title,
      servedBlueprintMatch: r.servedBlueprintMatch,
      required: MIN_BLUEPRINT_MATCH,
      blueprintTopicSlugs: r.blueprintTopicSlugs,
    })),
    reports,
  };

  const outPath = path.join(process.cwd(), "artifacts", "nclex-topic-alignment-audit.json");
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(summary, null, 2));

  console.log(`\nNCLEX topic ↔ question alignment audit`);
  console.log(`Topics audited: ${summary.topicsAudited}`);
  console.log(`Aligned (≥${MIN_BLUEPRINT_MATCH} blueprint matches): ${summary.alignedTopics}`);
  console.log(`Misaligned: ${summary.misalignedTopics}`);
  if (misaligned.length > 0) {
    console.log(`\nTopics needing more blueprint-tagged questions:`);
    for (const row of misaligned.slice(0, 15)) {
      console.log(
        `  • ${row.slug}: ${row.servedBlueprintMatch}/${MIN_BLUEPRINT_MATCH} (blueprints: ${row.blueprintTopicSlugs.join(", ")})`
      );
    }
    if (misaligned.length > 15) {
      console.log(`  … and ${misaligned.length - 15} more`);
    }
  }
  console.log(`\nWrote ${outPath}\n`);

  await disconnectScriptPrisma();

  if (jsonOut) {
    console.log(JSON.stringify(summary, null, 2));
  }

  process.exit(misaligned.length > 0 ? 1 : 0);
}

main().catch(async (err) => {
  console.error(err);
  await disconnectScriptPrisma().catch(() => {});
  process.exit(1);
});
