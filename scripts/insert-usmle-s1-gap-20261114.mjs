/**
 * Build the hidden Step 1 gap-batch rows.
 * Prints JSON to stdout. Does not connect to the database.
 *
 *   node scripts/insert-usmle-s1-gap-20261114.mjs > /tmp/usmle-s1-gap-rows.json
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { GAP_ITEMS, GAP_BATCH_ID, GAP_SOURCE, FIELD_ID, finalizeExplanation } from "./data/usmle-step1-gap-20261114/index.mjs";

const citations = JSON.parse(
  readFileSync("reports/usmle-s1-gap-20261114-citations.json", "utf8")
);
const bySlug = new Map(citations.rows.map((row) => [row.slug, row]));

function contentHash(subjectId, scenario, question) {
  return createHash("sha256")
    .update(
      `${FIELD_ID}|${subjectId}|${scenario.trim().toLowerCase()}|${question.trim().toLowerCase()}`
    )
    .digest("hex");
}

function rationaleAfter(explanation, option) {
  const marker = `**${option}**`;
  const at = explanation.indexOf(marker);
  if (at < 0) return "";
  const rest = explanation.slice(at + marker.length).replace(/^\s+/, "");
  const next = rest.search(/\n\*\*/);
  return (next >= 0 ? rest.slice(0, next) : rest).trim();
}

const rows = GAP_ITEMS.map((item) => {
  const cite = bySlug.get(item.slug);
  if (!cite?.ok || !cite.url) {
    throw new Error(`missing verified citation for ${item.slug}`);
  }
  const explanation = finalizeExplanation(item);
  const distractorRationale = {};
  for (const option of item.options) {
    if (option === item.correctAnswer) continue;
    distractorRationale[option] = rationaleAfter(explanation, option);
  }
  const id = `usmles1gap20261114${item.slug.replace(/-/g, "")}`;
  return {
    id,
    fieldId: FIELD_ID,
    subjectId: item.subjectId,
    difficulty: item.difficulty,
    band: item.band,
    topicCategory: item.topicCategory,
    blueprintDomain: item.domain,
    blueprintTopic: item.blueprintTopic,
    itemType: "vignette",
    stepLevel: "step1",
    scenario: item.scenario,
    question: item.question,
    options: JSON.stringify({
      options: item.options,
      distractorRationale,
      clinicalReasoning: rationaleAfter(explanation, item.correctAnswer) || explanation.split("\n\n")[0],
      keyTakeaways: [
        `${item.blueprintTopic}: ${item.correctAnswer}`,
      ],
    }),
    correctAnswer: item.correctAnswer,
    explanation,
    tags: JSON.stringify([
      "usmle-step1-gap-20261114",
      item.domain,
      item.blueprintTopic,
      item.band,
    ]),
    references: [
      {
        url: cite.url,
        label: cite.label || `StatPearls. ${cite.chapterTitle}.`,
      },
    ],
    source: GAP_SOURCE,
    contentHash: contentHash(item.subjectId, item.scenario, item.question),
    citationStatus: cite.verifiedVia,
    batchId: GAP_BATCH_ID,
  };
});

process.stdout.write(JSON.stringify(rows));
