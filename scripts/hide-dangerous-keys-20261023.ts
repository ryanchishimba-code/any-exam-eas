#!/usr/bin/env node
/**
 * Hide live items with dangerous keys from Oct 22, 2026 re-audit (dry run by default).
 *
 *   npx tsx scripts/hide-dangerous-keys-20261023.ts
 *   npx tsx scripts/hide-dangerous-keys-20261023.ts --apply
 *
 * Backup on apply: qbi_dangerous_hide_backup_20261023
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { cleanOptionText } from "@/lib/question-format";

const BACKUP_TABLE = "qbi_dangerous_hide_backup_20261023";

const USMLE_FIELDS = new Set(["usmle-step-1", "usmle-step-2", "usmle-step-3"]);

const prisma = new PrismaClient();

type Row = {
  id: string;
  fieldId: string;
  scenario: string | null;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
};

type Hit = {
  id: string;
  fieldId: string;
  category: string;
  reason: string;
  stemExcerpt: string;
  options: string[];
  correctAnswer: string;
  uncertain?: boolean;
};

function stemText(r: Row): string {
  return `${r.scenario ?? ""}\n${r.question}`.trim();
}

function parseOptions(raw: string): string[] {
  try {
    const j = JSON.parse(raw) as unknown;
    if (Array.isArray(j)) return j.map(String);
    if (j && typeof j === "object") {
      const o = j as { options?: unknown[] };
      return Array.isArray(o.options) ? o.options.map((x) => String(x)) : [];
    }
  } catch {
    /* ignore */
  }
  return [];
}

function keyMatches(answer: string, patterns: RegExp[]): boolean {
  return patterns.some((re) => re.test(answer));
}

function optsHave(opts: string[], patterns: RegExp[]): boolean {
  return opts.some((o) => patterns.some((re) => re.test(o)));
}

function makeHit(r: Row, category: string, reason: string, uncertain = false): Hit {
  return {
    id: r.id,
    fieldId: r.fieldId,
    category,
    reason,
    stemExcerpt: excerpt(stemText(r)),
    options: parseOptions(r.options),
    correctAnswer: r.correctAnswer,
    uncertain,
  };
}

function excerpt(text: string, n = 140): string {
  return text.replace(/\s+/g, " ").trim().slice(0, n);
}

function parseDirectBilirubinMgDl(stem: string): number | null {
  const m =
    stem.match(/\bdirect bilirubin\b[^0-9]{0,25}(\d+(?:\.\d+)?)\s*mg/i) ??
    stem.match(/\bconjugated bilirubin\b[^0-9]{0,25}(\d+(?:\.\d+)?)\s*mg/i);
  return m ? Number.parseFloat(m[1]) : null;
}

function hasCholestasisSigns(stem: string): boolean {
  return /\b(pale stools?|acholic stools?|clay[- ]colou?red stools?|dark urine|cholestasis)\b/i.test(
    stem
  );
}

function isStrokeContext(stem: string): boolean {
  return /\b(stroke|ischemic stroke|CVA|hemipares|hemiplegia|aphasia|NIH Stroke)\b/i.test(stem);
}

function thrombolyticKeyed(answer: string): boolean {
  return keyMatches(answer, [
    /\btPA\b/i,
    /alteplase/i,
    /tenecteplase/i,
    /thrombolyt/i,
    /tissue plasminogen activator/i,
    /fibrinolytic/i,
  ]);
}

/** Stem documents an absolute/relative exclusion — not negated ("no contraindications"). */
function documentedStrokeThrombolysisContraindication(stem: string): string | null {
  if (/\bno contraindications?\b/i.test(stem)) return null;
  if (/\bcontraindicated\b|\bnot eligible for thrombolysis\b/i.test(stem)) return "explicit";
  const inr = stem.match(/\bINR\b[^0-9]{0,25}(\d+\.?\d*)/i);
  if (
    inr &&
    Number.parseFloat(inr[1]) > 1.7 &&
    /\bwarfarin|anticoagul|DOAC|apixaban|rivaroxaban|dabigatran|edoxaban\b/i.test(stem)
  ) {
    return `inr_${inr[1]}`;
  }
  if (/\bhemorrhagic stroke\b/i.test(stem)) return "hemorrhagic_stroke";
  if (
    /\bintracranial hemorrhage\b/i.test(stem) &&
    !/\bno (acute )?intracranial hemorrhage|without intracranial hemorrhage/i.test(stem)
  ) {
    return "intracranial_hemorrhage";
  }
  if (
    /\b(recent|within the (past|last))[^.]{0,40}\b(3|14|21|30)\s*(days?|weeks?)\b[^.]{0,50}\b(surgery|stroke)\b/i.test(
      stem
    )
  ) {
    return "recent_surgery_or_stroke";
  }
  const plt = stem.match(/\bplatelet count\b[^0-9]{0,25}(\d[\d,]*)/i);
  if (plt && Number.parseInt(plt[1].replace(/,/g, ""), 10) < 100_000) return "thrombocytopenia";
  if (/\bactive (gi )?bleed|gastrointestinal hemorrhage\b/i.test(stem)) return "active_bleed";
  return null;
}

function peakFlowPercent(stem: string): number | null {
  const m =
    stem.match(/\bPEF\b[^0-9]{0,35}(\d{1,3})\s*%/i) ??
    stem.match(/\bpeak (?:expiratory )?flow\b[^0-9]{0,40}(\d{1,3})\s*%/i);
  return m ? Number.parseInt(m[1], 10) : null;
}

function templateFingerprint(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/\d+/g, "#")
    .replace(/[^a-z# ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

// --- Oct 22 re-audit categories ---

function categoryFnpBipolarSsriOnLamotrigine(r: Row): Hit | null {
  if (r.fieldId !== "aanp-fnp") return null;
  const stem = stemText(r);
  if (!/\bbipolar\b/i.test(stem)) return null;
  const teen = /\b1[0-7][- ]year|\badolescent\b/i.test(stem);
  const onLamotrigine = /\blamotrigine\b/i.test(stem);
  if (!teen && !onLamotrigine) return null;
  if (
    !keyMatches(r.correctAnswer, [
      /\bSSRI\b/i,
      /sertraline|fluoxetine|escitalopram|citalopram|paroxetine|fluvoxamine/i,
      /add an SSRI|start an SSRI|initiate an SSRI/i,
    ])
  ) {
    return null;
  }
  if (/\bmajor depressive|MDD\b/i.test(stem) && !/\bbipolar\b/i.test(stem)) return null;
  return makeHit(
    r,
    "fnp_bipolar_teen_ssri_on_lamotrigine",
    "Bipolar (teen/stable on lamotrigine) keyed SSRI antidepressant monotherapy."
  );
}

function categoryUsmleStrokeThrombolysisDespiteContra(r: Row): Hit | null {
  if (!USMLE_FIELDS.has(r.fieldId)) return null;
  const stem = stemText(r);
  if (!isStrokeContext(stem)) return null;
  if (!thrombolyticKeyed(r.correctAnswer)) return null;
  const contra = documentedStrokeThrombolysisContraindication(stem);
  if (!contra) {
    if (/\bwarfarin\b/i.test(stem) && !/\bINR\b/i.test(stem)) {
      return makeHit(
        r,
        "usmle_stroke_thrombolysis_warfarin_no_inr",
        "On warfarin without INR in stem but keyed IV thrombolysis (needs manual INR check).",
        true
      );
    }
    return null;
  }
  return makeHit(
    r,
    "usmle_stroke_thrombolysis_despite_contraindication",
    `Ischemic stroke keyed IV thrombolysis despite documented contraindication (${contra}).`
  );
}

function categoryFnpBilirubinNomogramCholestasis(r: Row): Hit | null {
  if (r.fieldId !== "aanp-fnp") return null;
  const stem = stemText(r);
  if (!/\b(jaundice|hyperbilirubinemia|newborn|infant|neonate)\b/i.test(stem)) return null;
  const direct = parseDirectBilirubinMgDl(stem);
  const cholestasis = hasCholestasisSigns(stem) || (direct != null && direct >= 1.5);
  if (!cholestasis) return null;
  if (
    !keyMatches(r.correctAnswer, [
      /bilirubin nomogram/i,
      /plot on nomogram/i,
      /phototherapy/i,
      /exchange transfusion/i,
    ])
  ) {
    return null;
  }
  if (direct != null && direct >= 1.5 && !hasCholestasisSigns(stem)) {
    return makeHit(
      r,
      "fnp_bilirubin_nomogram_conjugated_hyperbilirubinemia",
      `Conjugated/direct bilirubin ${direct} mg/dL keyed nomogram/phototherapy path (evaluate cholestasis).`
    );
  }
  return makeHit(
    r,
    "fnp_bilirubin_nomogram_cholestasis_signs",
    "Cholestasis pattern keyed bilirubin nomogram/phototherapy instead of conjugated hyperbilirubinemia workup."
  );
}

function categoryPanceObtundedOverdoseCharcoal(r: Row): Hit | null {
  if (r.fieldId !== "pance") return null;
  const stem = stemText(r);
  if (!/\b(overdose|ingestion|suicidal)\b/i.test(stem)) return null;
  if (
    !/\b(drowsy|lethargic|somnolent|obtunded|unresponsive|altered mental|GCS|decreased level)\b/i.test(
      stem
    )
  ) {
    return null;
  }
  if (!keyMatches(r.correctAnswer, [/activated charcoal|charcoal/i])) return null;
  const opts = parseOptions(r.options);
  if (
    !optsHave(opts, [
      /supportive|observation|monitor|airway|intubat|naloxone/i,
      /intravenous fluids|IV fluids|gastric lavage|psychiatric evaluation|benzodiazepine/i,
    ])
  ) {
    return null;
  }
  return makeHit(
    r,
    "pance_obtunded_overdose_charcoal",
    "Drowsy/obtunded overdose keyed activated charcoal over airway/supportive care."
  );
}

function categoryPanceAcuteAsthmaLaba(r: Row): Hit | null {
  if (r.fieldId !== "pance") return null;
  const stem = stemText(r);
  if (!/\basthma\b/i.test(stem)) return null;
  const pef = peakFlowPercent(stem);
  const acuteEd =
    /\b(emergency department|ED\b|acute exacerbation|acute attack|status asthmaticus)\b/i.test(stem);
  const moderateExacerbation = pef != null && pef > 0 && pef <= 70;
  if (!acuteEd && !moderateExacerbation) return null;
  if (pef === 70 && !acuteEd && /\broutine follow-up\b/i.test(stem)) {
    return makeHit(
      r,
      "pance_acute_asthma_laba",
      "PEF ~70% on routine visit keyed add LABA (borderline vs step-up therapy; not classic ED attack).",
      true
    );
  }
  if (
    !keyMatches(r.correctAnswer, [
      /\bLABA\b/i,
      /long[- ]acting beta/i,
      /salmeterol|formoterol/i,
      /add a long[- ]acting beta/i,
    ])
  ) {
    return null;
  }
  const opts = parseOptions(r.options);
  if (!optsHave(opts, [/oral corticosteroid|prednisone|systemic steroid|methylprednisolone/i])) {
    if (acuteEd) {
      return makeHit(
        r,
        "pance_acute_asthma_laba",
        "Acute asthma exacerbation keyed LABA without systemic steroid option in list.",
        true
      );
    }
    return null;
  }
  const reason = moderateExacerbation
    ? `Acute/moderate asthma (PEF ~${pef}%) keyed add LABA over systemic corticosteroids.`
    : "Acute asthma attack keyed LABA over systemic corticosteroids.";
  return makeHit(r, "pance_acute_asthma_laba", reason);
}

function categoryNaplexDoxycyclineTimingContradiction(r: Row): Hit | null {
  if (r.fieldId !== "pharmacy") return null;
  const stem = stemText(r);
  const blob = `${stem}\n${r.explanation}\n${r.correctAnswer}`;
  if (!/\bdoxycycline\b/i.test(r.correctAnswer)) return null;
  if (!/\b(malaria|prophylaxis|travel)\b/i.test(blob)) return null;

  const expSays12Days =
    /\b1\s*[-–]\s*2\s*days?\b[^.]{0,40}\bbefore\s*(travel|departure)/i.test(r.explanation) ||
    /\bone to two days\b[^.]{0,40}\bbefore\s*(travel|departure)/i.test(r.explanation);

  const keySaysWeek =
    /\b(one|1)\s*week\b[^.]{0,40}\bbefore/i.test(r.correctAnswer) ||
    /\b7\s*days?\s*before/i.test(r.correctAnswer);

  if (keySaysWeek && expSays12Days) {
    return makeHit(
      r,
      "naplex_doxycycline_prophylaxis_timing_contradiction",
      "Keyed doxycycline start ~1 week before travel but rationale states start 1–2 days before."
    );
  }

  if (expSays12Days && !/\b1\s*[-–]\s*2\s*days?\b|\btwo days\b/i.test(r.correctAnswer)) {
    return makeHit(
      r,
      "naplex_doxycycline_prophylaxis_timing_contradiction",
      "Doxycycline malaria prophylaxis key omits 1–2 days pre-travel start stated in rationale.",
      true
    );
  }

  return null;
}

function audit(rows: Row[]) {
  const hits: Hit[] = [];
  const seen = new Set<string>();

  function add(hit: Hit | null) {
    if (!hit || seen.has(hit.id)) return;
    seen.add(hit.id);
    hits.push(hit);
  }

  for (const r of rows) {
    add(categoryFnpBipolarSsriOnLamotrigine(r));
    add(categoryUsmleStrokeThrombolysisDespiteContra(r));
    add(categoryFnpBilirubinNomogramCholestasis(r));
    add(categoryPanceObtundedOverdoseCharcoal(r));
    add(categoryPanceAcuteAsthmaLaba(r));
    add(categoryNaplexDoxycyclineTimingContradiction(r));
  }

  const hideSet = new Set(hits.filter((h) => !h.uncertain).map((h) => h.id));

  const nearCopies: { fingerprint: string; category: string; ids: string[] }[] = [];
  const byFp = new Map<string, { category: string; ids: string[] }>();
  for (const h of hits) {
    if (h.uncertain) continue;
    const fp = `${h.category}|${templateFingerprint(h.stemExcerpt)}`;
    const cur = byFp.get(fp) ?? { category: h.category, ids: [] };
    cur.ids.push(h.id);
    byFp.set(fp, cur);
  }
  for (const [fp, v] of byFp) {
    if (v.ids.length >= 2) nearCopies.push({ fingerprint: fp, category: v.category, ids: v.ids });
  }

  return { hits, hideSet, nearCopies };
}

async function boardCounts(qaPassedOnly: boolean): Promise<Record<string, number>> {
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT "fieldId", COUNT(*)::bigint AS n
    FROM "QuestionBankItem"
    WHERE active = true ${qaPassedOnly ? 'AND "qaPassed" = true' : ""}
    GROUP BY "fieldId"
  `)) as { fieldId: string; n: bigint }[];
  const out: Record<string, number> = {};
  for (const r of rows) out[r.fieldId] = Number(r.n);
  return out;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT id, "fieldId", scenario, question, options, "correctAnswer", explanation
    FROM "QuestionBankItem"
    WHERE active = true AND "qaPassed" = true
  `)) as Row[];

  const beforeTotal = rows.length;
  const beforeBoard = await boardCounts(true);
  const { hits, hideSet, nearCopies } = audit(rows);

  const byCategory: Record<string, Hit[]> = {};
  for (const h of hits) {
    (byCategory[h.category] ??= []).push(h);
  }

  const afterTotal = beforeTotal - hideSet.size;
  const afterBoard = { ...beforeBoard };
  for (const id of hideSet) {
    const h = hits.find((x) => x.id === id)!;
    afterBoard[h.fieldId] = (afterBoard[h.fieldId] ?? 0) - 1;
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`live qaPassed scanned: ${beforeTotal}`);
  console.log(`would hide (qaPassed=false): ${hideSet.size}`);
  console.log(`after total: ${afterTotal}`);

  const printHit = (h: Hit, tag: string) => {
    console.log(
      `    ${h.id} [${h.fieldId}] ${tag} key=${JSON.stringify(h.correctAnswer.slice(0, 60))} | ${h.reason}`
    );
    console.log(`      stem: ${h.stemExcerpt}…`);
    console.log(
      `      options: ${h.options.map((o) => cleanOptionText(o).slice(0, 50)).join(" | ")}`
    );
  };

  console.log("\nper-category counts (would hide):");
  for (const [cat, list] of Object.entries(byCategory).sort((a, b) => a[0].localeCompare(b[0]))) {
    const hideList = list.filter((h) => hideSet.has(h.id));
    if (hideList.length === 0 && !list.some((h) => h.uncertain)) continue;
    console.log(`  ${cat}: ${hideList.length} hide (${list.length} matched)`);
    console.log(`    ids: ${hideList.map((h) => h.id).join(", ") || "(none)"}`);
    for (const h of hideList.slice(0, 8)) printHit(h, "HIDE");
    if (hideList.length > 8) console.log(`    … +${hideList.length - 8} more`);
  }

  const reviewHits = hits.filter((h) => h.uncertain);
  if (reviewHits.length) {
    console.log("\nuncertain (not in hide set):");
    const reviewByCat: Record<string, Hit[]> = {};
    for (const h of reviewHits) (reviewByCat[h.category] ??= []).push(h);
    for (const [cat, list] of Object.entries(reviewByCat).sort((a, b) => a[0].localeCompare(b[0]))) {
      console.log(`  ${cat}: ${list.length}`);
      console.log(`    ids: ${list.map((h) => h.id).join(", ")}`);
      for (const h of list.slice(0, 5)) printHit(h, "UNCERTAIN");
    }
  }

  if (nearCopies.length) {
    console.log("\nnear-copy template families (>=2 ids, would hide):");
    for (const nc of nearCopies) {
      console.log(`  ${nc.category}: ${nc.ids.join(", ")}`);
    }
  }

  console.log(`\nbackup table (apply): ${BACKUP_TABLE}`);
  console.log("apply command: npx tsx scripts/hide-dangerous-keys-20261023.ts --apply");

  console.log("\nper-board live qaPassed before -> after (boards with changes):");
  for (const field of Object.keys(beforeBoard).sort()) {
    const b = beforeBoard[field] ?? 0;
    const a = afterBoard[field] ?? 0;
    if (b !== a) console.log(`  ${field}: ${b} -> ${a}`);
  }

  if (!apply) {
    console.log("\nNo writes.");
    return;
  }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "${BACKUP_TABLE}" AS
    SELECT q.*, now() AS backed_up_at
    FROM "QuestionBankItem" q
    WHERE false
  `);

  for (const id of hideSet) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "${BACKUP_TABLE}"
      SELECT q.*, now() AS backed_up_at
      FROM "QuestionBankItem" q
      WHERE q.id = $1
        AND NOT EXISTS (SELECT 1 FROM "${BACKUP_TABLE}" b WHERE b.id = q.id)
      `,
      id
    );
    await prisma.questionBankItem.update({
      where: { id },
      data: { qaPassed: false },
    });
  }

  console.log(`\nApplied hide to ${hideSet.size} rows. Backup: ${BACKUP_TABLE}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
