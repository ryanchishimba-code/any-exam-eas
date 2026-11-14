/**
 * Compare new Step 1 stems with every existing usmle-step-1 stem.
 * Prints near-matches only. Does not write the database.
 */
import { PrismaClient } from "@prisma/client";
import { GAP_ITEMS } from "./data/usmle-step1-gap-20261114/index.mjs";

const STOP = new Set(
  "with from that this have been were they their about after before into over under than then when where which while whose there these those patient year old man woman presents because during after".split(
    " "
  )
);

function tokens(text) {
  return [
    ...new Set(
      String(text || "")
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 4 && !STOP.has(w))
    ),
  ];
}

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const union = A.size + B.size - inter;
  return union ? inter / union : 0;
}

const prisma = new PrismaClient();
const rows = await prisma.questionBankItem.findMany({
  where: { fieldId: "usmle-step-1" },
  select: { id: true, question: true, scenario: true, blueprintDomain: true, active: true },
});
const bank = rows.map((r) => ({
  id: r.id,
  domain: r.blueprintDomain,
  active: r.active,
  tokens: tokens(`${r.scenario || ""} ${r.question || ""}`),
  preview: `${(r.scenario || "").slice(0, 140)} | ${r.question || ""}`.replace(/\s+/g, " "),
}));

const flagged = [];
for (const item of GAP_ITEMS) {
  const mine = tokens(`${item.scenario} ${item.question}`);
  let best = { score: 0 };
  for (const row of bank) {
    const score = jaccard(mine, row.tokens);
    if (score > best.score) best = { score, ...row };
  }
  if (best.score >= 0.28) {
    flagged.push({
      slug: item.slug,
      score: Number(best.score.toFixed(3)),
      existing: best.id,
      domain: best.domain,
      active: best.active,
      preview: best.preview.slice(0, 220),
    });
  }
}
flagged.sort((a, b) => b.score - a.score);
console.log(`compared ${GAP_ITEMS.length} new stems with ${bank.length} existing step-1 stems`);
console.log(`flagged >= 0.28: ${flagged.length}`);
for (const f of flagged) console.log(JSON.stringify(f));
await prisma.$disconnect();
