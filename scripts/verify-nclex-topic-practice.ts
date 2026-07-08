#!/usr/bin/env node
/**
 * Verify NCLEX topic practice sessions match the selected Study Hub topic.
 *
 * Usage:
 *   npx tsx scripts/verify-nclex-topic-practice.ts              # all non-NGN topics
 *   npx tsx scripts/verify-nclex-topic-practice.ts pediatrics electrolytes
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { getHighYieldTopics } from "../src/lib/edtech/seeds/index.ts";
import { resolveNclexTopicPracticeParams } from "../src/lib/exam-prep/nclex/topic-practice.ts";
import { gatherTopicBankSessionPool } from "../src/lib/exam-prep/topic-bank-practice.ts";
import {
  filterItemsForNclexTopicPractice,
  matchesNclexTopicPracticeItem,
} from "../src/lib/exam-prep/nclex/topic-practice-filter.ts";
import { getNclexStudyPreset } from "../src/lib/exam-prep/nclex/study-presets.ts";
import { getNclexTopicMeta } from "../src/lib/exam-prep/nclex/topic-registry.ts";

const MIN_RELEVANCE_PCT = Number(process.env.NCLEX_TOPIC_MIN_RELEVANCE ?? "70");
const MIN_SESSION_SIZE = Number(process.env.NCLEX_TOPIC_MIN_SESSION ?? "3");

async function verifyTopic(slug: string) {
  const topics = getHighYieldTopics("nclex");
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) {
    console.error(`Unknown NCLEX topic slug: ${slug}`);
    return false;
  }

  const meta = getNclexTopicMeta(slug);
  if (meta.clientNeedsDomain === "ngn-strategy") {
    console.log(`\n=== ${topic.title} (${slug}) === [NGN — skipped]`);
    return true;
  }

  const params = resolveNclexTopicPracticeParams(topic);
  const preset = params.nclexPreset ? getNclexStudyPreset(params.nclexPreset as never) : undefined;

  console.log(`\n=== ${topic.title} (${slug}) ===`);
  console.log(`  subjectId: ${params.subjectId}`);
  console.log(`  blueprintTopics: ${params.blueprintTopics?.join(", ") ?? "(none)"}`);
  console.log(`  nclexPreset: ${params.nclexPreset ?? "(none)"}`);

  const pool = await gatherTopicBankSessionPool({
    fieldId: "nursing",
    subjectId: params.subjectId,
    sessionLimit: 10,
    blueprintTopics: params.blueprintTopics,
  });

  const items = filterItemsForNclexTopicPractice(
    pool,
    {
      blueprintTopics: params.blueprintTopics,
      nclexPreset: preset,
    },
    { strict: true }
  ).slice(0, 10);

  if (items.length === 0) {
    console.error(`  ✗ No aligned questions returned for session`);
    return false;
  }

  if (items.length < MIN_SESSION_SIZE) {
    console.warn(`  ⚠ Small session (${items.length}/${MIN_SESSION_SIZE} minimum preferred)`);
  }

  console.log(`  Session size: ${items.length} questions\n`);

  let relevant = 0;
  for (const [i, item] of items.entries()) {
    const aligned = matchesNclexTopicPracticeItem(item, {
      blueprintTopics: params.blueprintTopics,
      nclexPreset: preset,
    });
    if (aligned) relevant++;

    const stem = (item.question ?? "").slice(0, 90);
    const vignette = (item.vignette ?? item.scenario ?? "").slice(0, 100);
    console.log(`  ${i + 1}. [${item.subjectId}] bp=${item.blueprintTopic ?? "—"}`);
    console.log(`     aligned=${aligned ? "✓" : "✗"}`);
    if (vignette) console.log(`     vignette: ${vignette}${vignette.length >= 100 ? "…" : ""}`);
    console.log(`     stem: ${stem}${stem.length >= 90 ? "…" : ""}`);
  }

  const rate = (relevant / items.length) * 100;
  console.log(`\n  Topic alignment: ${relevant}/${items.length} (${rate.toFixed(0)}%)`);
  const ok = rate >= MIN_RELEVANCE_PCT;
  console.log(
    ok
      ? "  ✓ PASS"
      : `  ✗ FAIL (expected ≥${MIN_RELEVANCE_PCT}% alignment)`
  );
  return ok;
}

async function main() {
  const slugs = process.argv.slice(2);
  const allSlugs = getHighYieldTopics("nclex")
    .filter((t) => getNclexTopicMeta(t.slug).clientNeedsDomain !== "ngn-strategy")
    .map((t) => t.slug);
  const targets = slugs.length > 0 ? slugs : allSlugs;

  let allOk = true;
  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const slug of targets) {
    const ok = await verifyTopic(slug);
    if (ok === true && getNclexTopicMeta(slug).clientNeedsDomain === "ngn-strategy") {
      skipped++;
    } else if (ok) {
      passed++;
    } else {
      failed++;
      allOk = false;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Skipped (NGN): ${skipped}`);

  const { disconnectScriptPrisma } = await import("./lib/script-db.ts");
  await disconnectScriptPrisma();

  process.exit(allOk ? 0 : 1);
}

main().catch(async (err) => {
  console.error(err);
  const { disconnectScriptPrisma } = await import("./lib/script-db.ts");
  await disconnectScriptPrisma().catch(() => {});
  process.exit(1);
});
