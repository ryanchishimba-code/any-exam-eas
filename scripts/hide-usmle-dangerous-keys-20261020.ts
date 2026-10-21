#!/usr/bin/env node
/**
 * Hide live items with dangerous keys (dry run by default).
 *
 *   npx tsx scripts/hide-usmle-dangerous-keys-20261020.ts
 *   npx tsx scripts/hide-usmle-dangerous-keys-20261020.ts --apply
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { cleanOptionText } from "@/lib/question-format";

const BACKUP_TABLE = "qbi_usmle_dangerous_hide_backup_20261020";

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
    if (j && typeof j === "object" && Array.isArray((j as { options?: unknown }).options)) {
      return ((j as { options: unknown[] }).options ?? []).map((o) => String(o));
    }
  } catch {
    /* ignore */
  }
  return [];
}

function excerpt(text: string, n = 140): string {
  return text.replace(/\s+/g, " ").trim().slice(0, n);
}

function parseNumberFromText(text: string, patterns: RegExp[]): number | null {
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) {
      const v = Number.parseFloat(m[1]);
      if (Number.isFinite(v)) return v;
    }
  }
  return null;
}

function maintenanceMlPerHour(weightKg: number): number {
  if (weightKg <= 0) return 0;
  if (weightKg <= 10) return weightKg * 4;
  if (weightKg <= 20) return 40 + (weightKg - 10) * 2;
  return 60 + (weightKg - 20);
}

function cockcroftGault(
  age: number,
  weightKg: number,
  scr: number,
  female: boolean
): number {
  const base = ((140 - age) * weightKg) / (72 * scr);
  return Math.round(base * (female ? 0.85 : 1));
}

function parseMlHr(answer: string): number | null {
  const m = answer.match(/(\d+(?:\.\d+)?)\s*mL\s*\/\s*h(?:r)?/i);
  return m ? Number.parseFloat(m[1]) : null;
}

function parseCrClAnswer(answer: string): number | null {
  const m = answer.match(/(\d+(?:\.\d+)?)\s*mL\s*\/\s*min/i);
  return m ? Math.round(Number.parseFloat(m[1])) : null;
}

const LIVE_VACCINE =
  /\b(MMR|measles[,\s]+mumps|varicella|yellow fever|live attenuated|rotavirus|FluMist|intranasal influenza)\b/i;
const DEFER_VACCINE_ANSWER =
  /\b(MMR|measles[,\s]+mumps|rubella vaccine|varicella vaccine|administer the measles|live vaccine)\b/i;

const REPERFUSION_OPT =
  /\b(PCI|percutaneous coronary|coronary angiography|cardiac catheterization|cath lab|primary PCI|reperfusion|fibrinolysis|thrombolysis)\b/i;

const ASPIRIN_KEY =
  /^aspirin\b|administer aspirin|aspirin 325|dual antiplatelet|clopidogrel/i;

function isStemiContext(text: string): boolean {
  return /\bSTEMI\b|ST[- ]segment elevation|ST elevation in/i.test(text);
}

function categoryFebrileLiveVaccine(r: Row): Hit | null {
  const stem = stemText(r);
  const blob = `${stem}\n${r.correctAnswer}`;
  const infant9mo =
    /\b9[- ]month|\b8[- ]month|\b10[- ]month/i.test(stem) ||
    (/\b9\s*months?\b/i.test(stem) && /\binfant\b/i.test(stem));
  const acuteFebrile =
    /\b(fever|febrile|acutely ill|high fever|temperature of 10[0-4]|39\.|40\.|103|104)\b/i.test(stem);
  if (!infant9mo || !acuteFebrile) return null;
  if (!DEFER_VACCINE_ANSWER.test(r.correctAnswer) && !LIVE_VACCINE.test(r.correctAnswer)) {
    const opts = parseOptions(r.options);
    if (!opts.some((o) => DEFER_VACCINE_ANSWER.test(o))) return null;
    // keyed wrong option among choices
    if (!DEFER_VACCINE_ANSWER.test(r.correctAnswer)) return null;
  }
  if (!DEFER_VACCINE_ANSWER.test(r.correctAnswer) && !/\bMMR\b/i.test(r.correctAnswer)) {
    return null;
  }
  return {
    id: r.id,
    fieldId: r.fieldId,
    category: "febrile_live_vaccine",
    reason: "Acutely febrile infant keyed to live/MMR vaccination (should defer).",
    stemExcerpt: excerpt(stem),
    options: parseOptions(r.options),
    correctAnswer: r.correctAnswer,
  };
}

function categoryStemiAspirinOverReperfusion(r: Row): Hit | null {
  const stem = stemText(r);
  if (!isStemiContext(stem)) return null;
  const opts = parseOptions(r.options);
  const hasReperfusionOpt = opts.some((o) => REPERFUSION_OPT.test(o));
  if (!hasReperfusionOpt) return null;
  if (!ASPIRIN_KEY.test(r.correctAnswer)) return null;
  if (REPERFUSION_OPT.test(r.correctAnswer)) return null;
  return {
    id: r.id,
    fieldId: r.fieldId,
    category: "stemi_aspirin_over_reperfusion",
    reason: "STEMI context but keyed aspirin/antiplatelet without reperfusion/PCI.",
    stemExcerpt: excerpt(stem),
    options: opts,
    correctAnswer: r.correctAnswer,
  };
}

function categoryStemiNoReperfusionOption(r: Row): Hit | null {
  const stem = stemText(r);
  if (!isStemiContext(stem)) return null;
  const opts = parseOptions(r.options);
  if (opts.length < 3) return null;
  if (opts.some((o) => REPERFUSION_OPT.test(o))) return null;
  return {
    id: r.id,
    fieldId: r.fieldId,
    category: "stemi_no_reperfusion_option",
    reason: "STEMI context but option list lacks PCI/angiography/reperfusion.",
    stemExcerpt: excerpt(stem),
    options: opts,
    correctAnswer: r.correctAnswer,
    uncertain: true,
  };
}

function categoryMaintenance72(r: Row): Hit | null {
  const stem = stemText(r);
  if (!/\bmaintenance\b/i.test(stem) && !/\bfluid\b/i.test(stem)) return null;
  const weight = parseNumberFromText(stem, [
    /\b(\d+(?:\.\d+)?)\s*kg\b/i,
    /\bweight[:\s]+(\d+(?:\.\d+)?)\s*kg/i,
  ]);
  if (weight !== 7) return null;
  const expected = maintenanceMlPerHour(7);
  const keyed = parseMlHr(r.correctAnswer);
  if (keyed !== 70 && keyed !== expected) {
    const opt70 = parseOptions(r.options).find((o) => /70\s*mL\s*\/\s*hr/i.test(o));
    if (!opt70 || r.correctAnswer !== opt70) return null;
  }
  if (r.correctAnswer !== "70 mL/hr" && !/70\s*mL\s*\/\s*hr/i.test(r.correctAnswer)) {
    return null;
  }
  return {
    id: r.id,
    fieldId: r.fieldId,
    category: "maintenance_fluids_7kg_70",
    reason: `7 kg maintenance keyed 70 mL/hr (4-2-1 expects ${expected} mL/hr).`,
    stemExcerpt: excerpt(stem),
    options: parseOptions(r.options),
    correctAnswer: r.correctAnswer,
  };
}

function categoryCockcroftMismatch(r: Row): Hit | null {
  const blob = `${stemText(r)}\n${r.explanation}`;
  if (!/\bCockcroft|creatinine clearance|CrCl\b/i.test(blob)) return null;

  const age = parseNumberFromText(blob, [
    /\b(\d{1,3})[- ]year[- ]old\b/i,
    /\bage[:\s]+(\d{1,3})\b/i,
  ]);
  const weight = parseNumberFromText(blob, [
    /\b(\d+(?:\.\d+)?)\s*kg\b/i,
    /\bweight[:\s]+(\d+(?:\.\d+)?)\s*kg/i,
  ]);
  const scr = parseNumberFromText(blob, [
    /\bSCr[:\s]+(\d+(?:\.\d+)?)/i,
    /\bserum creatinine[:\s]+(\d+(?:\.\d+)?)/i,
    /\bcreatinine(?:\s+of)?[:\s]+(\d+(?:\.\d+)?)\s*mg/i,
  ]);
  const female = /\b(woman|female|she|her)\b/i.test(blob) && !/\b(man|male|he|his)\b/i.test(blob);

  const keyed = parseCrClAnswer(r.correctAnswer);
  if (keyed == null) return null;

  if (age != null && scr != null && scr > 0) {
    if (weight == null && keyed === 90) {
      return {
        id: r.id,
        fieldId: r.fieldId,
        category: "cockcroft_no_weight_key_90",
        reason: "Cockcroft item without weight in stem; keyed 90 mL/min (likely ~62 if weight missing).",
        stemExcerpt: excerpt(stemText(r)),
        options: parseOptions(r.options),
        correctAnswer: r.correctAnswer,
        uncertain: true,
      };
    }
    if (weight != null) {
      const computed = cockcroftGault(age, weight, scr, female);
      const delta = Math.abs(computed - keyed);
      if (delta > 3) {
        return {
          id: r.id,
          fieldId: r.fieldId,
          category: "cockcroft_key_mismatch",
          reason: `Cockcroft-Gault computed ~${computed} mL/min vs keyed ${keyed}.`,
          stemExcerpt: excerpt(stemText(r)),
          options: parseOptions(r.options),
          correctAnswer: r.correctAnswer,
        };
      }
    }
  }
  return null;
}

function categoryHsCrpLdl(r: Row): Hit | null {
  const stem = stemText(r);
  const blob = `${stem}\n${r.correctAnswer}`;
  const ldl160 = /\bLDL[^0-9]{0,20}160\b/i.test(blob) || /\bLDL[^0-9]{0,20}of 160\b/i.test(blob);
  const onStatin = /\b(statin|atorvastatin|rosuvastatin|simvastatin|pravastatin)\b/i.test(blob);
  if (!ldl160 || !onStatin) return null;
  if (!/\b(high-sensitivity C-reactive protein|hs-CRP|hs CRP)\b/i.test(r.correctAnswer)) {
    return null;
  }
  return {
    id: r.id,
    fieldId: r.fieldId,
    category: "hs_crp_ldl_statin",
    reason: "hs-CRP keyed as best next step for LDL 160 on statin (not initial risk test).",
    stemExcerpt: excerpt(stem),
    options: parseOptions(r.options),
    correctAnswer: r.correctAnswer,
  };
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

function audit(rows: Row[]) {
  const hits: Hit[] = [];
  const seen = new Set<string>();

  function add(hit: Hit | null) {
    if (!hit || seen.has(hit.id)) return;
    seen.add(hit.id);
    hits.push(hit);
  }

  for (const r of rows) {
    add(categoryFebrileLiveVaccine(r));
    add(categoryStemiAspirinOverReperfusion(r));
    add(categoryStemiNoReperfusionOption(r));
    add(categoryMaintenance72(r));
    add(categoryCockcroftMismatch(r));
    add(categoryHsCrpLdl(r));
  }

  // Explicit recheck id (LDL 160 lifestyle — not hs-CRP; note if still live)
  const recheckId = "cmr8j9r9t02kd1yloj44dqg23";
  const recheck = rows.find((r) => r.id === recheckId);
  if (recheck && !seen.has(recheckId)) {
    hits.push({
      id: recheckId,
      fieldId: recheck.fieldId,
      category: "clinical_recheck_ldl160",
      reason:
        "On clinical-recheck queue: LDL 160 may warrant statin discussion (ACC/AHA enhancer); not auto-hide.",
      stemExcerpt: excerpt(stemText(recheck)),
      options: parseOptions(recheck.options),
      correctAnswer: recheck.correctAnswer,
      uncertain: true,
    });
    seen.add(recheckId);
  }

  const hideSet = new Set(
    hits.filter((h) => h.category !== "clinical_recheck_ldl160").map((h) => h.id)
  );

  const nearCopies: { fingerprint: string; category: string; ids: string[] }[] = [];
  const byFp = new Map<string, { category: string; ids: string[] }>();
  for (const h of hits) {
    if (h.category === "clinical_recheck_ldl160") continue;
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
  console.log("\nper-category counts:");
  for (const [cat, list] of Object.entries(byCategory).sort((a, b) => a[0].localeCompare(b[0]))) {
    const hideN = list.filter((h) => hideSet.has(h.id)).length;
    console.log(`  ${cat}: ${list.length} matched (${hideN} hide)`);
    for (const h of list) {
      const tag = hideSet.has(h.id) ? "HIDE" : h.uncertain ? "NOTE" : "HIDE?";
      const actualTag = hideSet.has(h.id) ? "HIDE" : "NOTE";
      console.log(
        `    ${h.id} [${h.fieldId}] ${actualTag} key=${JSON.stringify(h.correctAnswer.slice(0, 60))} | ${h.reason}`
      );
      console.log(`      stem: ${h.stemExcerpt}…`);
      console.log(`      options: ${h.options.map((o) => cleanOptionText(o).slice(0, 50)).join(" | ")}`);
    }
  }

  if (nearCopies.length) {
    console.log("\nnear-copy template families (>=2 ids):");
    for (const nc of nearCopies) {
      console.log(`  ${nc.category}: ${nc.ids.join(", ")}`);
    }
  }

  console.log(`\nbackup table (apply): ${BACKUP_TABLE}`);
  console.log("apply command: npx tsx scripts/hide-usmle-dangerous-keys-20261020.ts --apply");

  console.log("\nper-board live qaPassed before -> after:");
  for (const field of Object.keys(beforeBoard).sort()) {
    const b = beforeBoard[field] ?? 0;
    const a = afterBoard[field] ?? 0;
    if (b !== a) console.log(`  ${field}: ${b} -> ${a}`);
  }
  const unchanged = Object.keys(beforeBoard).filter((f) => beforeBoard[f] === afterBoard[f]);
  if (unchanged.length) console.log(`  unchanged boards: ${unchanged.length}`);

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
