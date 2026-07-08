#!/usr/bin/env node
/**
 * Verify PANCE topic practice sessions match the selected Study Hub topic.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { getHighYieldTopics } from "../src/lib/edtech/seeds/index.ts";
import { resolvePanceTopicPracticeParams } from "../src/lib/exam-prep/pance/topic-practice.ts";
import { gatherTopicBankSessionPool } from "../src/lib/exam-prep/topic-bank-practice.ts";
import {
  filterItemsForPanceTopicPractice,
  matchesPanceTopicPracticeItem,
} from "../src/lib/exam-prep/pance/topic-practice-filter.ts";

const MIN_RELEVANCE_PCT = Number(process.env.PANCE_TOPIC_MIN_RELEVANCE ?? "70");
const MIN_SESSION_SIZE = Number(process.env.PANCE_TOPIC_MIN_SESSION ?? "3");

async function verifyTopic(slug: string) {
  const topic = getHighYieldTopics("pance").find((t) => t.slug === slug);
  if (!topic) {
    console.error(`Unknown PANCE topic slug: ${slug}`);
    return false;
  }

  const params = resolvePanceTopicPracticeParams(topic);
  console.log(`\n=== ${topic.title} (${slug}) ===`);
  console.log(`  subjectId: ${params.subjectId}`);
  console.log(`  blueprintTopics: ${params.blueprintTopics?.join(", ") ?? "(none)"}`);

  const pool = await gatherTopicBankSessionPool({
    fieldId: "pance",
    subjectId: params.subjectId,
    sessionLimit: 10,
    blueprintTopics: params.blueprintTopics,
    panceTopic: params.topicSlug,
  });

  const items = filterItemsForPanceTopicPractice(pool, {
    blueprintTopics: params.blueprintTopics,
    topicSlug: params.topicSlug,
  }).slice(0, 10);

  if (items.length === 0) {
    console.error(`  ✗ No aligned questions returned for session`);
    return false;
  }
  if (items.length < MIN_SESSION_SIZE) {
    console.warn(`  ⚠ Small session (${items.length}/${MIN_SESSION_SIZE} minimum preferred)`);
  }

  let relevant = 0;
  for (const [i, item] of items.entries()) {
    const aligned = matchesPanceTopicPracticeItem(item, {
      blueprintTopics: params.blueprintTopics,
      topicSlug: params.topicSlug,
    });
    if (aligned) relevant++;
    console.log(`  ${i + 1}. [${item.subjectId}] bp=${item.blueprintTopic ?? "—"} aligned=${aligned ? "✓" : "✗"}`);
  }

  const rate = (relevant / items.length) * 100;
  console.log(`\n  Topic alignment: ${relevant}/${items.length} (${rate.toFixed(0)}%)`);
  const ok = rate >= MIN_RELEVANCE_PCT;
  console.log(ok ? "  ✓ PASS" : `  ✗ FAIL (alignment ≥${MIN_RELEVANCE_PCT}%)`);
  return ok;
}

async function main() {
  const slugs = process.argv.slice(2);
  const targets = slugs.length > 0 ? slugs : getHighYieldTopics("pance").map((t) => t.slug);
  let passed = 0;
  let failed = 0;
  for (const slug of targets) {
    if (await verifyTopic(slug)) passed++;
    else failed++;
  }
  console.log(`\n=== Summary ===\n  Passed: ${passed}\n  Failed: ${failed}`);
  const { disconnectScriptPrisma } = await import("./lib/script-db.ts");
  await disconnectScriptPrisma();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (err) => {
  console.error(err);
  const { disconnectScriptPrisma } = await import("./lib/script-db.ts");
  await disconnectScriptPrisma().catch(() => {});
  process.exit(1);
});
