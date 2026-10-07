#!/usr/bin/env node
/**
 * Score emitted NAPLEX sittings with the blueprint classifier and concept keys.
 * Question text stays in memory. stdout is aggregate counts only.
 *
 *   npx tsx scripts/score-naplex-blueprint-mix.ts /tmp/before.jsonl /tmp/after.jsonl
 */
import fs from "node:fs";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { sittingConceptKeys, conceptRepeatCap } from "@/lib/exam-prep/entity-cap";
import {
  classifyNaplexSittingItem,
  naplexDiseaseFloor,
  naplexLawItemCeiling,
  type NaplexDiseaseId,
} from "@/lib/exam-prep/sitting-blueprint";
import { retainStudentEligibleBankItems } from "@/lib/exam-prep/student-eligibility";
import type { BankItem } from "@/lib/question-bank";

const SAMPLE = process.env.PHARM_SAMPLE ?? "/tmp/pharm-sample.json";
const WATCHED = [
  "concept:hipaa-family-disclosure",
  "concept:high-alert:glargine",
  "concept:pair:lamotrigine+oral-contraceptive",
  "concept:drug-info:gabapentin",
] as const;

type Emitted = { limit: number; trial: number; kept: number; relax: number; ms: number; ids: string[] };

function loadSample(path: string): BankItem[] {
  const rows = JSON.parse(fs.readFileSync(path, "utf8")) as Array<Record<string, unknown>>;
  const items = rows.map((row) => {
    const generationMeta = typeof row.gm === "string" && row.gm ? JSON.parse(row.gm) : row.generationMeta ?? null;
    const item = enrichBankItemFromRow({
      id: String(row.id),
      subjectId: String(row.subjectId ?? ""),
      question: String(row.question ?? ""),
      options: typeof row.options === "string" ? row.options : JSON.stringify(row.options ?? []),
      correctAnswer: String(row.correctAnswer ?? ""),
      explanation: typeof row.explanation === "string" ? row.explanation : "",
      solutionSteps: null,
      tags: typeof row.tags === "string" ? row.tags : JSON.stringify(row.tags ?? []),
      itemType: typeof row.itemType === "string" ? row.itemType : "mcq",
      scenario: typeof row.scenario === "string" ? row.scenario : "",
      topicCategory: typeof row.topicCategory === "string" ? row.topicCategory : null,
      blueprintTopic: typeof row.blueprintTopic === "string" ? row.blueprintTopic : null,
      taskCategory: typeof row.taskCategory === "string" ? row.taskCategory : null,
      generationMeta,
      source: typeof row.source === "string" ? row.source : null,
      qaPassed: true,
      active: true,
      fieldId: "pharmacy",
      curationMeta: typeof row.cm === "string" && row.cm ? JSON.parse(row.cm) : row.curationMeta ?? null,
    } as never) as BankItem;
    item.qaPassed = true;
    item.active = true;
    return item;
  });
  return retainStudentEligibleBankItems(items);
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function maxOf(values: number[]): number {
  return values.reduce((best, value) => Math.max(best, value), 0);
}

function matchesWatch(key: string, watch: string): boolean {
  if (key === watch) return true;
  if (watch.includes("celecoxib")) return key.includes("celecoxib") && key.includes("citalopram");
  if (watch.includes("ondansetron")) return key.includes("ondansetron") && key.includes("aprepitant");
  return false;
}

function scoreFile(label: string, path: string, byId: Map<string, BankItem>) {
  const lines = fs
    .readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Emitted);
  const byLimit = new Map<number, Emitted[]>();
  for (const row of lines) {
    const list = byLimit.get(row.limit) ?? [];
    list.push(row);
    byLimit.set(row.limit, list);
  }
  const summaries = [];
  for (const [limit, trials] of [...byLimit.entries()].sort((a, b) => a[0] - b[0])) {
    const cap = conceptRepeatCap(limit);
    const kindNames = ["focus", "pair", "high-alert", "drug-info", "hipaa", "lasa"] as const;
    const subjectMeans = new Map<string, number[]>();
    const areaMeans = new Map<string, number[]>();
    const diseaseMeans = new Map<string, number[]>();
    const law: number[] = [];
    const maxConcept: number[] = [];
    const overCapKeys: number[] = [];
    const sittingsOver: number[] = [];
    const sittingsOverApplied: number[] = [];
    const kindMax = new Map<string, number[]>(kindNames.map((name) => [name, []]));
    const relax = new Map<number, number>();
    const kept: number[] = [];
    const watchedMax = new Map<string, number[]>();
    for (const name of [...WATCHED, "concept:lasa:celecoxib+citalopram", "concept:pair:aprepitant+ondansetron"]) {
      watchedMax.set(name, []);
    }
    for (const trial of trials) {
      const items = trial.ids.map((id) => byId.get(id)).filter((item): item is BankItem => Boolean(item));
      kept.push(items.length);
      relax.set(trial.relax, (relax.get(trial.relax) ?? 0) + 1);
      const subjects = new Map<string, number>();
      const areas = new Map<string, number>();
      const diseases = new Map<string, number>();
      let lawCount = 0;
      const concepts = new Map<string, number>();
      for (const item of items) {
        const subject = item.subjectId || "(none)";
        subjects.set(subject, (subjects.get(subject) ?? 0) + 1);
        const slot = classifyNaplexSittingItem(item);
        areas.set(slot.areaId, (areas.get(slot.areaId) ?? 0) + 1);
        if (slot.disease) diseases.set(slot.disease, (diseases.get(slot.disease) ?? 0) + 1);
        if (slot.lawOnly) lawCount += 1;
        for (const key of sittingConceptKeys(item, "pharmacy")) {
          concepts.set(key, (concepts.get(key) ?? 0) + 1);
        }
      }
      const pushMeans = (source: Map<string, number>, dest: Map<string, number[]>) => {
        const seen = new Set<string>();
        for (const [key, count] of source) {
          const list = dest.get(key) ?? [];
          list.push(count);
          dest.set(key, list);
          seen.add(key);
        }
        for (const [key, list] of dest) {
          if (!seen.has(key)) list.push(0);
        }
      };
      pushMeans(subjects, subjectMeans);
      pushMeans(areas, areaMeans);
      pushMeans(diseases, diseaseMeans);
      law.push(lawCount);
      const applied = trial.relax >= 7 ? Number.POSITIVE_INFINITY : cap + (trial.relax >= 6 ? 1 : 0);
      let sittingMax = 0;
      let over = 0;
      let overApplied = 0;
      const kindCounts = new Map<string, number>();
      for (const [key, count] of concepts) {
        sittingMax = Math.max(sittingMax, count);
        if (count > cap) over += 1;
        if (count > applied) overApplied += 1;
        const kind = kindNames.find((name) => key.startsWith(`concept:${name}`));
        if (kind) kindCounts.set(kind, Math.max(kindCounts.get(kind) ?? 0, count));
      }
      maxConcept.push(sittingMax);
      overCapKeys.push(over);
      sittingsOver.push(over > 0 ? 1 : 0);
      sittingsOverApplied.push(overApplied > 0 ? 1 : 0);
      for (const name of kindNames) kindMax.get(name)!.push(kindCounts.get(name) ?? 0);
      for (const [name, list] of watchedMax) {
        let hit = 0;
        for (const [key, count] of concepts) {
          if (key === name || matchesWatch(key, name)) hit = Math.max(hit, count);
        }
        list.push(hit);
      }
    }
    const avgMap = (source: Map<string, number[]>) =>
      [...source.entries()]
        .map(([key, values]) => ({ key, mean: mean(values), max: maxOf(values) }))
        .sort((left, right) => right.mean - left.mean);
    const diseases = ["cardio", "id", "endocrine", "psych", "pulm", "renal", "onc"] as NaplexDiseaseId[];
    summaries.push({
      label,
      limit,
      N: trials.length,
      success: trials.filter((trial) => trial.kept >= limit).length,
      keptMean: mean(kept),
      relax: Object.fromEntries([...relax.entries()].sort((a, b) => a[0] - b[0])),
      lawCeiling: naplexLawItemCeiling(limit),
      lawMean: mean(law),
      lawMax: maxOf(law),
      conceptCap: cap,
      maxConceptMean: mean(maxConcept),
      maxConceptWorst: maxOf(maxConcept),
      conceptKeysOverStrictCapMean: mean(overCapKeys),
      sittingsOverStrictConceptCap: sittingsOver.reduce((sum, value) => sum + value, 0),
      sittingsOverAppliedConceptCap: sittingsOverApplied.reduce((sum, value) => sum + value, 0),
      conceptKindMax: Object.fromEntries(
        [...kindMax.entries()].map(([name, values]) => [name, { mean: mean(values), max: maxOf(values) }])
      ),
      subjects: avgMap(subjectMeans).slice(0, 12),
      areas: avgMap(areaMeans),
      diseases: diseases.map((id) => ({
        id,
        floor: naplexDiseaseFloor(id, limit),
        mean: mean(diseaseMeans.get(id) ?? []),
        max: maxOf(diseaseMeans.get(id) ?? []),
      })),
      watched: [...watchedMax.entries()].map(([key, values]) => ({
        key,
        mean: mean(values),
        max: maxOf(values),
      })),
    });
  }
  return summaries;
}

function poolCensus(items: readonly BankItem[]) {
  const concepts = new Map<string, number>();
  const subjects = new Map<string, number>();
  for (const item of items) {
    subjects.set(item.subjectId || "(none)", (subjects.get(item.subjectId || "(none)") ?? 0) + 1);
    for (const key of sittingConceptKeys(item, "pharmacy")) {
      concepts.set(key, (concepts.get(key) ?? 0) + 1);
    }
  }
  const watchedHits = [...WATCHED, "celecoxib+citalopram", "ondansetron+aprepitant"].map((name) => ({
    name,
    items: [...concepts.entries()]
      .filter(([key]) => key === name || matchesWatch(key, name) || (name.includes("+") && key.includes(name.split("+")[0]!) && key.includes(name.split("+")[1]!)))
      .reduce((sum, [, count]) => sum + count, 0),
  }));
  const repeated = [...concepts.entries()]
    .filter(([, count]) => count >= 3)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 15)
    .map(([key, count]) => ({ key, count }));
  return {
    eligible: items.length,
    subjects: [...subjects.entries()].sort((a, b) => b[1] - a[1]),
    conceptKeysAtLeast3: repeated,
    watchedHits,
  };
}

function main() {
  const [beforePath, afterPath] = process.argv.slice(2);
  if (!beforePath || !afterPath) {
    console.error("usage: score-naplex-blueprint-mix.ts <before.jsonl> <after.jsonl>");
    process.exit(1);
  }
  const items = loadSample(SAMPLE);
  const byId = new Map(items.map((item) => [item.id, item]));
  const report = {
    pool: poolCensus(items),
    before: scoreFile("before", beforePath, byId),
    after: scoreFile("after", afterPath, byId),
  };
  fs.writeSync(1, `${JSON.stringify(report, null, 2)}\n`);
}

main();
