/**
 * Audit pharmacy / NAPLEX bank rows for vignette coherence, drug-specific rationales, and option integrity.
 *
 * Usage:
 *   npm run db:audit-naplex
 *   npm run db:audit-naplex -- --limit 500
 *   npm run db:audit-naplex -- --deep
 *   npm run db:audit-naplex -- --subject pharmacology --json
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import {
  auditNaplexBankItem,
  resolveNaplexStem,
  resolveNaplexVignette,
  summarizeNaplexAudit,
} from "../src/lib/exam-prep/naplex-bank-audit";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { needsNaplexPolish, scoreNaplexBankItem } from "../src/lib/engine/polish/naplex-polish";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();

type AuditRow = {
  ok: boolean;
  issues: ReturnType<typeof auditNaplexBankItem>["issues"];
  itemId: string;
  subjectId: string;
  vignette: string;
  stem: string;
  qualityScore: number;
  needsPolish: boolean;
  qaGateOk: boolean;
};

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let subject: string | undefined;
  let json = false;
  let deep = false;
  let csv: string | undefined;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i], 10);
    else if (args[i] === "--subject" && args[i + 1]) subject = args[++i];
    else if (args[i] === "--json") json = true;
    else if (args[i] === "--deep") deep = true;
    else if (args[i] === "--csv" && args[i + 1]) csv = args[++i];
  }
  return { limit, subject, json, deep, csv };
}

function csvEscape(value: string): string {
  const v = value.replace(/\r?\n/g, " ").trim();
  if (/[",]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function writeAuditCsv(results: AuditRow[], csvPath: string) {
  mkdirSync(path.dirname(csvPath), { recursive: true });
  const header =
    "item_id,subject_id,audit_ok,qa_gate_ok,quality_score,needs_polish,severity,code,message,vignette_preview,stem_preview";
  const lines = [header];

  for (const r of results) {
    const base = [
      csvEscape(r.itemId),
      csvEscape(r.subjectId),
      r.ok ? "true" : "false",
      r.qaGateOk ? "true" : "false",
      r.qualityScore.toFixed(3),
      r.needsPolish ? "true" : "false",
    ];
    if (r.issues.length === 0) {
      lines.push([...base, "", "", "", csvEscape(r.vignette.slice(0, 240)), csvEscape(r.stem.slice(0, 160))].join(","));
      continue;
    }
    for (const issue of r.issues) {
      lines.push(
        [
          ...base,
          issue.severity,
          csvEscape(issue.code),
          csvEscape(issue.message),
          csvEscape(r.vignette.slice(0, 240)),
          csvEscape(r.stem.slice(0, 160)),
        ].join(",")
      );
    }
  }

  writeFileSync(csvPath, lines.join("\n"), "utf8");
}

function breakdownBySubject(results: AuditRow[]) {
  const bySubject: Record<
    string,
    { total: number; pass: number; fail: number; warnOnly: number; byCode: Record<string, number> }
  > = {};

  for (const r of results) {
    const sid = r.subjectId;
    if (!bySubject[sid]) bySubject[sid] = { total: 0, pass: 0, fail: 0, warnOnly: 0, byCode: {} };
    const bucket = bySubject[sid]!;
    bucket.total++;
    const hasError = r.issues.some((i) => i.severity === "error");
    if (r.ok) bucket.pass++;
    else if (hasError) bucket.fail++;
    else bucket.warnOnly++;
    for (const issue of r.issues) {
      bucket.byCode[issue.code] = (bucket.byCode[issue.code] ?? 0) + 1;
    }
  }
  return bySubject;
}

function samplesByCode(results: AuditRow[], maxPerCode = 3) {
  const codeCounts = results.reduce<Record<string, number>>((acc, r) => {
    for (const issue of r.issues) acc[issue.code] = (acc[issue.code] ?? 0) + 1;
    return acc;
  }, {});

  const topCodes = Object.entries(codeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([code]) => code);

  const seen: Record<string, number> = {};
  const samples: Record<
    string,
    Array<{ itemId: string; subjectId: string; vignette: string; stem: string; message: string }>
  > = {};

  for (const r of results) {
    for (const issue of r.issues) {
      if (!topCodes.includes(issue.code)) continue;
      seen[issue.code] = seen[issue.code] ?? 0;
      if (seen[issue.code]! >= maxPerCode) continue;
      seen[issue.code]!++;
      if (!samples[issue.code]) samples[issue.code] = [];
      samples[issue.code]!.push({
        itemId: r.itemId,
        subjectId: r.subjectId,
        vignette: r.vignette.slice(0, 200),
        stem: r.stem.slice(0, 120),
        message: issue.message,
      });
    }
  }
  return { samples, codeCounts: Object.fromEntries(topCodes.map((c) => [c, codeCounts[c]!])) };
}

async function main() {
  const { limit, subject, json, deep, csv } = parseArgs();

  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "pharmacy",
      active: true,
      ...(subject ? { subjectId: subject } : {}),
    },
    orderBy: { id: "asc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  console.log(`Auditing ${rows.length} active pharmacy question(s)…\n`);

  const results: AuditRow[] = rows.map((row) => {
    const item = enrichBankItemFromRow(row);
    const report = auditNaplexBankItem(item);
    const qaGate = auditBankItem(item, "pharmacy");
    const qualityScore = scoreNaplexBankItem(item);
    return {
      ...report,
      itemId: row.id,
      subjectId: row.subjectId,
      vignette: resolveNaplexVignette(item),
      stem: resolveNaplexStem(item),
      qualityScore,
      needsPolish: needsNaplexPolish(item),
      qaGateOk: qaGate.ok,
    };
  });

  const polishNeeded = results.filter((r) => r.needsPolish).length;
  const qaGateFail = results.filter((r) => !r.qaGateOk).length;
  const lowQuality = results.filter((r) => r.qualityScore < 0.62).length;
  const withWarnings = results.filter((r) => r.issues.some((i) => i.severity === "warn")).length;
  const withErrors = results.filter((r) => !r.ok).length;

  if (csv) {
    const csvPath = path.resolve(csv);
    writeAuditCsv(results, csvPath);
    console.log(`Wrote ${results.length} item(s) → ${csvPath}`);

    const flagged = results.filter((r) => !r.ok || !r.qaGateOk || r.needsPolish);
    const flaggedPath = csvPath.replace(/\.csv$/i, "") + "-flagged.csv";
    writeAuditCsv(flagged, flaggedPath);
    console.log(`Wrote ${flagged.length} flagged item(s) → ${flaggedPath}`);
  }

  const summary = summarizeNaplexAudit(results);
  const bySubject = breakdownBySubject(results);
  const { samples, codeCounts: topCodeCounts } = samplesByCode(results);

  const artifact = {
    generatedAt: new Date().toISOString(),
    summary,
    passRate: summary.total ? (summary.pass / summary.total) * 100 : 0,
    polishNeeded,
    qaGateFail,
    lowQuality,
    withWarnings,
    withErrors,
    bySubject,
    topCodeCounts,
    samples,
  };

  const artifactDir = path.join(process.cwd(), "artifacts");
  mkdirSync(artifactDir, { recursive: true });
  const artifactPath = path.join(artifactDir, "naplex-audit-report.json");
  writeFileSync(artifactPath, JSON.stringify(artifact, null, 2), "utf8");

  if (json) {
    console.log(JSON.stringify(artifact, null, 2));
    console.error(`Wrote audit artifact → ${artifactPath}`);
    return;
  }

  const passRate = summary.total ? ((summary.pass / summary.total) * 100).toFixed(1) : "0";
  console.log(`\nWrote audit artifact → ${artifactPath}`);

  console.log(`Total:      ${summary.total}`);
  console.log(`Pass:       ${summary.pass} (${passRate}%) — NAPLEX editorial errors`);
  console.log(`Fail:       ${summary.fail}`);
  console.log(`Warnings:   ${withWarnings} item(s) with warn-level issues`);
  console.log(`Needs polish: ${polishNeeded} (score < 0.62 or weak template)`);
  console.log(`QA gate fail: ${qaGateFail} (would not serve if qaPassed enforced)`);
  console.log(`Low quality:  ${lowQuality} (score < 0.62)`);
  console.log(`\nBy severity:`);
  for (const [sev, count] of Object.entries(summary.bySeverity)) {
    console.log(`  ${sev}: ${count}`);
  }
  console.log(`\nTop issue codes:`);
  for (const [code, count] of Object.entries(summary.byCode).sort((a, b) => b[1] - a[1]).slice(0, 12)) {
    console.log(`  ${code}: ${count}`);
  }

  if (deep) {
    console.log(`\n── By subject (sorted by fail rate) ──`);
    const subjectRows = Object.entries(bySubject)
      .map(([sid, s]) => ({
        sid,
        ...s,
        failRate: s.total ? (s.fail / s.total) * 100 : 0,
      }))
      .sort((a, b) => b.failRate - a.failRate);

    for (const s of subjectRows) {
      const topCodes = Object.entries(s.byCode)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([c, n]) => `${c}:${n}`)
        .join(", ");
      console.log(
        `  ${s.sid}: ${s.pass}/${s.total} pass, ${s.fail} fail, ${s.warnOnly} warn-only | ${topCodes || "—"}`
      );
    }

    console.log(`\n── Sample vignettes by top issue code ──`);
    for (const [code, items] of Object.entries(samples)) {
      console.log(`\n  [${code}] (${topCodeCounts[code]} total)`);
      for (const ex of items) {
        console.log(`    ${ex.itemId.slice(0, 12)}… ${ex.subjectId}`);
        console.log(`      vignette: ${ex.vignette}${ex.vignette.length >= 200 ? "…" : ""}`);
        console.log(`      stem: ${ex.stem}${ex.stem.length >= 120 ? "…" : ""}`);
      }
    }
  }

  const failures = results.filter((r) => !r.ok).slice(0, 15);
  if (failures.length > 0 && !deep) {
    console.log(`\nSample failures (first ${failures.length}):`);
    for (const f of failures) {
      console.log(`\n  [${f.itemId}] ${f.subjectId}`);
      for (const issue of f.issues) {
        console.log(`    ${issue.severity} ${issue.code}: ${issue.message}`);
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
