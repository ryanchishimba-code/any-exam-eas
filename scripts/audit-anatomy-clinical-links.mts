#!/usr/bin/env node
/**
 * Audit Anatomy Explorer disease ↔ drug ↔ structure integrity (catalog-only).
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-anatomy-clinical-links.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { getAllAnatomyStructures } from "../src/lib/anatomy";
import { isValidAnatomyStructureId } from "../src/lib/anatomy/structure-ids";
import { REVIEW_MODULE_ANATOMY } from "../src/lib/anatomy/review-module-anatomy";
import {
  ANATOMY_DISEASE_LINKS,
  buildSupplementalDiseaseLinks,
  CURATED_DISEASE_LINKS,
  getCorePathologyCoverage,
  getUncoveredCorePathologies,
  resolveDiseaseLink,
} from "../src/lib/anatomy/clinical-links";
import { getDrugById } from "../src/lib/drugs300/catalog";
import { enrichDrug } from "../src/lib/drugs300/enrichment";
import { TOPIC_STRUCTURE_IDS_FOR_AUDIT } from "../src/lib/exam-prep/anatomy-study-meta";
import { ANATOMY_PROCEDURES } from "../src/lib/anatomy/procedures";

type Issue = { code: string; detail: string; severity: "error" | "warn" };

function collectStructureIssues(ids: string[], context: string, issues: Issue[]) {
  for (const id of ids) {
    if (!isValidAnatomyStructureId(id)) {
      issues.push({
        code: "invalid_structure_id",
        detail: `${context}: "${id}"`,
        severity: "error",
      });
    }
  }
}

function main() {
  const issues: Issue[] = [];
  const curated = CURATED_DISEASE_LINKS;
  const supplemental = buildSupplementalDiseaseLinks(curated);
  const all = [...ANATOMY_DISEASE_LINKS, ...supplemental];

  // Disease structure + drug orphans
  const orphanDrugs: Array<{ diseaseId: string; drugId: string }> = [];
  for (const link of all) {
    collectStructureIssues(link.structureIds, `disease:${link.id}`, issues);
    for (const drugId of [...link.firstLineDrugIds, ...(link.adjunctDrugIds ?? [])]) {
      if (!getDrugById(drugId)) {
        orphanDrugs.push({ diseaseId: link.id, drugId });
        issues.push({
          code: "orphan_drug_id",
          detail: `${link.id} → ${drugId}`,
          severity: "error",
        });
      }
    }
    if (!link.generated && link.highYield) {
      const resolved = resolveDiseaseLink(link);
      if (!resolved.guidelines?.length) {
        issues.push({
          code: "missing_guidelines",
          detail: link.id,
          severity: "error",
        });
      }
      if (
        resolved.firstLineDrugs.length === 0 &&
        resolved.adjunctDrugs.length === 0 &&
        !(resolved.treatmentGoals?.length)
      ) {
        issues.push({
          code: "empty_therapy_and_goals",
          detail: link.id,
          severity: "warn",
        });
      }
    }
  }

  // Exam-prep topic maps
  for (const [topic, ids] of Object.entries(TOPIC_STRUCTURE_IDS_FOR_AUDIT)) {
    collectStructureIssues(ids, `topic:${topic}`, issues);
  }

  // Review modules
  for (const [slug, link] of Object.entries(REVIEW_MODULE_ANATOMY)) {
    collectStructureIssues(link.structureIds, `review:${slug}`, issues);
    for (const diseaseId of link.diseaseIds ?? []) {
      if (!all.some((d) => d.id === diseaseId)) {
        issues.push({
          code: "unknown_review_disease",
          detail: `${slug} → ${diseaseId}`,
          severity: "error",
        });
      }
    }
  }

  // Procedures
  for (const proc of ANATOMY_PROCEDURES) {
    collectStructureIssues(proc.structureIds, `procedure:${proc.id}`, issues);
  }

  // Priority clinical findings
  const stroke = curated.find((d) => d.id === "ischemic-stroke-brain");
  if (!stroke?.structureIds.includes("brain")) {
    issues.push({
      code: "stroke_missing_brain",
      detail: "ischemic-stroke-brain structureIds must include brain",
      severity: "error",
    });
  }
  if (!getAllAnatomyStructures().some((s) => s.id === "brain")) {
    issues.push({
      code: "missing_brain_structure",
      detail: "catalog lacks brain",
      severity: "error",
    });
  }

  const graves = resolveDiseaseLink(curated.find((d) => d.id === "hyperthyroidism-graves")!);
  if (graves.firstLineDrugIds.includes("propranolol")) {
    issues.push({
      code: "graves_beta_blocker_first_line",
      detail: "propranolol must not be disease-modifying first-line for Graves",
      severity: "error",
    });
  }

  const t2dm = resolveDiseaseLink(curated.find((d) => d.id === "type-2-diabetes")!);
  const t2dmIds = [...t2dm.firstLineDrugIds, ...t2dm.adjunctDrugIds];
  if (!t2dmIds.includes("semaglutide") || !t2dmIds.includes("empagliflozin")) {
    issues.push({
      code: "t2dm_missing_outcome_agents",
      detail: "type-2-diabetes should include GLP-1 RA and SGLT2i from catalog",
      severity: "warn",
    });
  }

  // High-yield curated clinical depth (dx / treatment / why+MOA)
  const highYieldCurated = curated.filter((d) => d.highYield && !d.generated);
  const missingBestDiagnosis: string[] = [];
  const missingTreatmentRationale: string[] = [];
  const missingDrugRationale: Array<{ diseaseId: string; drugId: string }> = [];
  const missingSharedMoa: string[] = [];

  for (const link of highYieldCurated) {
    if (!link.bestDiagnosis?.trim()) missingBestDiagnosis.push(link.id);
    if (!link.treatmentRationale?.trim()) missingTreatmentRationale.push(link.id);
    for (const drugId of [...link.firstLineDrugIds, ...(link.adjunctDrugIds ?? [])]) {
      const why = link.drugRationales?.[drugId]?.whyUsed?.trim();
      if (!why) missingDrugRationale.push({ diseaseId: link.id, drugId });
      const drug = getDrugById(drugId);
      if (!drug) continue;
      const moa = link.drugRationales?.[drugId]?.briefMoa ?? enrichDrug(drug).mechanism;
      if (!moa?.trim()) missingSharedMoa.push(drugId);
    }
  }

  for (const id of missingBestDiagnosis) {
    issues.push({ code: "missing_best_diagnosis", detail: id, severity: "warn" });
  }
  for (const id of missingTreatmentRationale) {
    issues.push({ code: "missing_treatment_rationale", detail: id, severity: "warn" });
  }
  for (const row of missingDrugRationale) {
    issues.push({
      code: "missing_drug_rationale",
      detail: `${row.diseaseId} → ${row.drugId}`,
      severity: "warn",
    });
  }

  const coverage = getCorePathologyCoverage();
  const uncovered = getUncoveredCorePathologies();
  const weakGenerated = supplemental.filter(
    (d) => (d.adjunctDrugIds?.length ?? 0) === 0 || d.firstLineDrugIds.length > 0
  );

  const report = {
    checkedAt: new Date().toISOString(),
    structures: getAllAnatomyStructures().length,
    curatedCount: curated.length,
    generatedCount: supplemental.length,
    highYieldWithGuidelines: ANATOMY_DISEASE_LINKS.filter(
      (d) => d.highYield && !d.generated && (d.guidelines?.length ?? 0) > 0
    ).length,
    clinicalDepth: {
      highYieldCurated: highYieldCurated.length,
      withBestDiagnosis: highYieldCurated.length - missingBestDiagnosis.length,
      withTreatmentRationale: highYieldCurated.length - missingTreatmentRationale.length,
      missingBestDiagnosis,
      missingTreatmentRationale,
      missingDrugRationale,
      missingSharedMoa: [...new Set(missingSharedMoa)].sort(),
    },
    orphanDrugs,
    corePathologyCoverage: coverage.length,
    uncoveredCorePathologies: uncovered,
    weakGenerated: weakGenerated.map((d) => d.id),
    issues,
    errorCount: issues.filter((i) => i.severity === "error").length,
    warnCount: issues.filter((i) => i.severity === "warn").length,
  };

  const outDir = path.join(process.cwd(), "tmp");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "anatomy-clinical-audit.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log(`Anatomy clinical audit → ${outPath}`);
  console.log(
    JSON.stringify(
      {
        curatedCount: report.curatedCount,
        generatedCount: report.generatedCount,
        clinicalDepth: report.clinicalDepth,
        errorCount: report.errorCount,
        warnCount: report.warnCount,
        uncovered: uncovered.length,
      },
      null,
      2
    )
  );

  if (report.errorCount > 0) {
    console.error(
      "Errors:\n",
      issues
        .filter((i) => i.severity === "error")
        .slice(0, 40)
        .map((i) => `  [${i.code}] ${i.detail}`)
        .join("\n")
    );
    process.exit(1);
  }
}

main();
